#!/usr/bin/env node
/* EXSA encoding integrity tool — tools/scan-encoding.mjs
   Detects and repairs text corruption caused by Windows-1252 / UTF-8 mishaps
   (the classic "file re-read through cp1252" accident).

   Run:
     node tools/scan-encoding.mjs                    → scan dist/, report only (exit 1 if dirty)
     node tools/scan-encoding.mjs <roots...>         → scan extra roots, e.g. site qa
     node tools/scan-encoding.mjs --fix              → repair mojibake (deterministic reversal)
     node tools/scan-encoding.mjs --fix --replace=U+2014 → also replace U+FFFD with a chosen char
                                                           (literal chars work too: --replace=—)

   Detects two corruption classes:
   1. U+FFFD replacement characters — the original data is already lost, so the
      tool reports file:line and needs an explicit --replace char from you.
   2. Mojibake — UTF-8 bytes re-read as cp1252 (an em dash re-read shows
      as U+00E2U+20ACU+201D; a star U+2605 re-reads as U+00E2U+02DCU+2026).
      These are reversed byte-safely via a cp1252 table with strict UTF-8
      validation, so only unambiguous repairs are applied.

   Safety: reads bytes, preserves BOM state per file, only writes files that
   actually changed, skips binary files and node_modules/.git. */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ---------- args ---------- */
const args = process.argv.slice(2);
const fix = args.includes('--fix');
const replaceArg = args.find((a) => a.startsWith('--replace='));
let replaceChar = null;
if (replaceArg) {
  const v = replaceArg.slice('--replace='.length);
  replaceChar = /^U\+[0-9a-fA-F]{1,6}$/.test(v) ? String.fromCodePoint(parseInt(v.slice(2), 16)) : v;
  if ([...replaceChar].length !== 1) {
    console.error('✗ --replace must be a single character (e.g. --replace=U+2014 or --replace=—)');
    process.exit(2);
  }
}
const scanRoots = args.filter((a) => !a.startsWith('--'));
const roots = scanRoots.length ? scanRoots : ['dist'];

const EXT = /\.(css|js|mjs|html|json|md|svg|php|txt|xml|htaccess|conf)$/;
const SKIP = /node_modules|\.git/;

/* ---------- cp1252 byte table (Windows-1252 → Unicode) ---------- */
const CP1252 = new Map();
{
  // 0x80–0x9F: cp1252 specials; the undefined bytes map to C1 controls
  // (U+0081, U+008D, U+008F, U+0090, U+009D) so sequences can round-trip.
  const specials = [
    '\u20AC', '\u0081', '\u201A', '\u0192', '\u201E', '\u2026', '\u2020', '\u2021',
    '\u02C6', '\u2030', '\u0160', '\u2039', '\u0152', '\u008D', '\u017D', '\u008F',
    '\u0090', '\u2018', '\u2019', '\u201C', '\u201D', '\u2022', '\u2013', '\u2014',
    '\u02DC', '\u2122', '\u0161', '\u203A', '\u0153', '\u009D', '\u017E', '\u0178',
  ];
  for (let b = 0x80; b <= 0x9F; b++) CP1252.set(specials[b - 0x80], b);
  for (let b = 0xA0; b <= 0xFF; b++) CP1252.set(String.fromCharCode(b), b);
}

/* strict UTF-8 sequence validation (rejects overlongs, surrogates, F4 overflow) */
const validUtf8 = (bytes) => {
  const b = bytes[0];
  if (bytes.length === 2) return b >= 0xC2 && b <= 0xDF && bytes[1] >= 0x80 && bytes[1] <= 0xBF;
  if (bytes.length === 3) {
    const ok1 = b === 0xE0 ? bytes[1] >= 0xA0 && bytes[1] <= 0xBF
      : b >= 0xE1 && b <= 0xEC ? bytes[1] >= 0x80 && bytes[1] <= 0xBF
      : b === 0xED ? bytes[1] >= 0x80 && bytes[1] <= 0x9F
      : b >= 0xEE && b <= 0xEF ? bytes[1] >= 0x80 && bytes[1] <= 0xBF : false;
    return ok1 && bytes[2] >= 0x80 && bytes[2] <= 0xBF;
  }
  if (bytes.length === 4) {
    const ok1 = b === 0xF0 ? bytes[1] >= 0x90 && bytes[1] <= 0xBF
      : b >= 0xF1 && b <= 0xF3 ? bytes[1] >= 0x80 && bytes[1] <= 0xBF
      : b === 0xF4 ? bytes[1] >= 0x80 && bytes[1] <= 0x8F : false;
    return ok1 && bytes[2] >= 0x80 && bytes[2] <= 0xBF && bytes[3] >= 0x80 && bytes[3] <= 0xBF;
  }
  return false;
};

/* Reverse mojibake: consecutive cp1252 chars whose byte values form one valid
   UTF-8 code point are decoded back. Anything ambiguous is left untouched. */
function repairMojibake(s) {
  const out = [];
  const changes = [];
  let i = 0;
  while (i < s.length) {
    const b0 = CP1252.get(s[i]);
    let len = 0;
    if (b0 !== undefined && b0 >= 0xC2 && b0 <= 0xDF) len = 2;
    else if (b0 !== undefined && b0 >= 0xE0 && b0 <= 0xEF) len = 3;
    else if (b0 !== undefined && b0 >= 0xF0 && b0 <= 0xF4) len = 4;
    if (!len) { out.push(s[i]); i++; continue; }

    const bytes = [b0];
    let j = i + 1;
    while (j < s.length && bytes.length < len) {
      const bj = CP1252.get(s[j]);
      if (bj === undefined || bj < 0x80 || bj > 0xBF) break;
      bytes.push(bj);
      j++;
    }
    if (bytes.length === len && validUtf8(bytes)) {
      const from = s.slice(i, j);
      const decoded = Buffer.from(bytes).toString('utf8');
      if (decoded && !decoded.includes('\uFFFD') && [...decoded].length === 1) {
        out.push(decoded);
        changes.push({ from, to: decoded });
        i = j;
        continue;
      }
    }
    out.push(s[i]);
    i++;
  }
  return { text: out.join(''), changes };
}

/* ---------- collect files ---------- */
const files = [];
for (const rel of roots) {
  const abs = join(root, rel);
  const walk = (dir) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, ent.name);
      if (SKIP.test(p)) continue;
      if (ent.isDirectory()) walk(p);
      else if (EXT.test(ent.name)) files.push(p);
    }
  };
  walk(abs);
}

/* ---------- scan ---------- */
const hex = (ch) => [...ch].map((c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join('');
let scanned = 0;
let dirtyFiles = 0;
let fixedCount = 0;
let unfixable = 0;

for (const file of files) {
  scanned++;
  const buf = readFileSync(file);
  const bom = buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
  let text = buf.toString('utf8');
  if (bom) text = text.slice(1);

  const { text: cleaned, changes } = repairMojibake(text);
  const mojibake = changes.length;
  const fffdCount = (cleaned.match(/\uFFFD/g) || []).length;

  if (!mojibake && !fffdCount) continue;
  dirtyFiles++;

  const rel = file.slice(root.length + 1);
  if (fffdCount) {
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const n = (line.match(/\uFFFD/g) || []).length;
      if (n) console.log(`  ${rel}:${idx + 1}  ${n}× U+FFFD — "${line.trim().slice(0, 80)}"`);
    });
  }
  if (mojibake) {
    const sample = changes.slice(0, 4).map(({ from, to }) => `${hex(from)}→${hex(to)}`).join(' ');
    console.log(`  ${rel}  ${mojibake}× mojibake${changes.length > 4 ? ' …' : ''}  ${sample}`);
  }

  if (fix) {
    let out = cleaned;
    if (fffdCount) {
      if (replaceChar) {
        out = out.split('\uFFFD').join(replaceChar);
        fixedCount += fffdCount;
      } else {
        unfixable++;
        console.log(`    ↑ rerun with --fix --replace=<char> to repair U+FFFD`);
      }
    }
    fixedCount += mojibake;
    if (out !== text) {
      writeFileSync(file, (bom ? '\uFEFF' : '') + out, 'utf8');
      console.log(`  ✓ ${rel} repaired (${mojibake + (replaceChar ? fffdCount : 0)} chars)`);
    }
  }
}

/* ---------- summary ---------- */
if (!dirtyFiles) {
  console.log(`EXSA encoding scan: OK — ${scanned} files clean`);
  process.exit(0);
}
if (!fix) {
  console.log(`\n✗ ${dirtyFiles} file(s) with corruption. Run with --fix to repair mojibake${''} (U+FFFD needs --replace).`);
  process.exit(1);
}
console.log(`\n${unfixable ? '✗' : '✓'} repaired ${fixedCount} char(s) across ${dirtyFiles} file(s)${unfixable ? ` — ${unfixable} file(s) still have U+FFFD (needs --replace)` : ''}`);
process.exit(unfixable ? 1 : 0);

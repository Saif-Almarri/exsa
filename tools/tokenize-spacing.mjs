#!/usr/bin/env node
/* Phase 8.5 migration — tools/tokenize-spacing.mjs
   Rewrites literal px/rem margin/padding/gap declarations in distributed CSS to
   `calc(N * var(--space-factor, 1))` so the density profiles (data-profile)
   genuinely scale every component. At the default --space-factor: 1 the computed
   values are pixel-identical — zero visual change.

   Exempt: values already using var()/calc()/clamp(), custom-property definitions,
   em/%/vh/vw units, position offsets (inset-*), and the fluid scale itself. */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['dist/exsa.css'];
(function walk(d) {
  for (const e of readdirSync(join(root, d), { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    e.isDirectory() ? walk(p) : p.endsWith('.css') && files.push(p);
  }
})('dist/components');
(function walk(d) {
  for (const e of readdirSync(join(root, d), { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    e.isDirectory() ? walk(p) : p.endsWith('.css') && files.push(p);
  }
})('dist/layouts');
(function walk(d) {
  for (const e of readdirSync(join(root, d), { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    e.isDirectory() ? walk(p) : p.endsWith('.css') && files.push(p);
  }
})('dist/templates');

const SKIP = new Set(['dist/exsa.fluid.css', 'dist/style.css', 'dist/exsa.bundle.css']);
/* (?<![a-z-]) — never match inside --custom-property names or scroll-margin-top */
const propRe = /(?<![a-z-])(margin(?:-[a-z]+)*|padding(?:-[a-z]+)*|(?:row-|column-|grid-)?gap)\s*:\s*([^;{}]+)/g;
const numRe = /(-?\d+(?:\.\d+)?)(px|rem)\b/g;

let total = 0;
const counts = {};
for (const f of files) {
  if (SKIP.has(f)) continue;
  const src = readFileSync(join(root, f), 'utf8');
  const lines = src.split(/\r?\n/);
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const clean = lines[i].replace(/\/\*.*?\*\//g, '');
    lines[i] = lines[i].replace(propRe, (m, prop, value) => {
      const v = value.trim();
      if (/var\(|calc\(|clamp\(/.test(v)) return m;
      if (prop.startsWith('--')) return m;
      const n = (v.match(numRe) || []).length;
      if (!n) return m;
      const nv = v.replace(numRe, 'calc($1$2 * var(--space-factor, 1))');
      total += n;
      counts[f] = (counts[f] || 0) + n;
      return `${prop}: ${nv}`;
    });
    if (lines[i] !== src.split(/\r?\n/)[i]) changed = true;
  }
  if (changed) {
    writeFileSync(join(root, f), lines.join('\n'));
    console.log(`tokenized ${f} (${counts[f]} values)`);
  }
}
console.log(`done — ${total} spacing values now scale with --space-factor`);

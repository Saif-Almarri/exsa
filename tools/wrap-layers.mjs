#!/usr/bin/env node
/* One-off migration: convert blockless layer statements to full block wrapping.
   Blockless statements in later sheets invert cascade order against block
   statements in earlier sheets (Chromium behavior) — so every distributed
   file must use the block form: @layer exsa.X { ... }
   Idempotent. Usage: node tools/wrap-layers.mjs */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  ['components', 'exsa.components'],
  ['layouts', 'exsa.layouts'],
  ['themes', 'exsa.themes'],
];
const files = [];
for (const [dir, layer] of targets) {
  for (const f of readdirSync(join(root, dir))) {
    if (f.endsWith('.css')) files.push([join(dir, f), layer]);
  }
}
files.push(['exsa.fluid.css', 'exsa.fluid']);

let converted = 0, skipped = 0;
for (const [rel, layer] of files) {
  const file = join(root, rel);
  let src = readFileSync(file, 'utf8');
  // strip BOM/whitespace
  const trimmed = src.replace(/^\uFEFF/, '').trimStart();
  // already block-wrapped?
  if (new RegExp(`^@layer\\s+${layer}\\s*\\{`).test(trimmed)) { skipped++; continue; }
  // replace blockless statement with block opening
  const m = trimmed.match(new RegExp(`^@layer\\s+${layer};`));
  if (!m) { console.log(rel, '→ SKIP: unexpected head:', trimmed.slice(0, 60).replace(/\n/g, ' ')); continue; }
  const body = trimmed.slice(m[0].length);
  writeFileSync(file, `@layer ${layer} {\n${body}\n}\n`);
  converted++;
  console.log(rel, `→ @layer ${layer} { … }`);
}
console.log(`\n${converted} converted, ${skipped} already wrapped, ${files.length} total`);

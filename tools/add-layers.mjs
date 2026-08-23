#!/usr/bin/env node
/* One-off migration: prepend a blockless @layer statement to every
   component / layout / theme file and exsa.fluid.css.
   Idempotent — files already opening with an @layer statement are skipped.
   Usage: node tools/add-layers.mjs */
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

let wrapped = 0, skipped = 0;
for (const [rel, layer] of files) {
  const file = join(root, rel);
  const src = readFileSync(file, 'utf8');
  if (/^\s*@layer\s+exsa\./.test(src)) { skipped++; console.log(rel, '→ already layered, skip'); continue; }
  const statement = `@layer ${layer};\n`;
  writeFileSync(file, statement + src);
  wrapped++;
  console.log(rel, `→ @layer ${layer}`);
}
console.log(`\n${wrapped} wrapped, ${skipped} skipped, ${files.length} total`);

#!/usr/bin/env node
/* One-off cleanup: remove stray U+FEFF (BOM/zero-width no-break space)
   characters from every CSS file. Usage: node tools/strip-bom.mjs */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['exsa.css', 'style.css', 'exsa.fluid.css'];
for (const dir of ['components', 'themes', 'layouts']) {
  for (const f of readdirSync(join(root, dir))) {
    if (f.endsWith('.css')) files.push(`${dir}/${f}`);
  }
}
let total = 0;
for (const rel of files) {
  const file = join(root, rel);
  const src = readFileSync(file, 'utf8');
  const count = (src.match(/\uFEFF/g) || []).length;
  if (!count) continue;
  writeFileSync(file, src.replace(/\uFEFF/g, ''));
  total += count;
  console.log(rel, `→ removed ${count} U+FEFF`);
}
console.log(`\nremoved ${total} U+FEFF characters from ${files.length} files`);

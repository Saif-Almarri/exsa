#!/usr/bin/env node
/* EXSA Phase 6 migration — tools/switch-site-to-bundle.mjs
   Dogfooding: replace per-component <link> lists and per-behavior <script> lists
   in site/*.php with the prebuilt bundles (dist/exsa.bundle.css + dist/exsa.js).

   - `../dist/exsa.css` link   → `../dist/exsa.bundle.css` (core + all components + breeze)
   - component css links       → removed (covered by the bundle)
   - behavior js tags          → collapsed to one `../dist/exsa.js` tag (kept at the
                                 position of the first js tag)
   - theme link, layout css, site css, inline <script> blocks → untouched
   Run once: node tools/switch-site-to-bundle.mjs */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  ...readdirSync(join(root, 'site')).filter((f) => f.endsWith('.php')).map((f) => `site/${f}`),
  'site/includes/head.php'
];

const BUNDLE_JS = '<script src="../dist/exsa.js?v=1"></script>';

for (const rel of files) {
  const file = join(root, rel);
  let src = readFileSync(file, 'utf8');

  src = src.replace(/<link rel="stylesheet" href="\.\.\/dist\/exsa\.css(\?v=\d+)?"\s*>/g,
    '<link rel="stylesheet" href="../dist/exsa.bundle.css?v=1">');

  let jsTagPlaced = false;
  const lines = src.split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    if (/<link rel="stylesheet" href="\.\.\/dist\/components\/[^"]*"\s*>/.test(line.trim())) continue;
    if (/<script src="\.\.\/dist\/js\/[^"]+\.js(\?v=\d+)?"\s*><\/script>/.test(line.trim())) {
      if (!jsTagPlaced) {
        out.push(BUNDLE_JS);
        jsTagPlaced = true;
      }
      continue;
    }
    out.push(line);
  }
  writeFileSync(file, out.join('\n'));
  console.log(`  switched ${rel}${jsTagPlaced ? '' : ' (no js tags)'}`);
}
console.log('done');

#!/usr/bin/env node
/* One-off migration for the Phase 4 restructure:
   rewrite site pages' asset paths from root-relative to ../dist/...
   plus generator/source/theme-builder logic fixes.
   Usage: node tools/rewrite-site-paths.mjs   (idempotent) */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
for (const f of readdirSync(join(root, 'site'))) if (f.endsWith('.php')) files.push(join('site', f));
for (const f of readdirSync(join(root, 'site', 'includes'))) if (f.endsWith('.php')) files.push(join('site', 'includes', f));

const rules = [
  [/href="style\.css\?v=\d+"/g, 'href="../dist/exsa.css?v=1"'],
  [/href="themes\/breeze\.css\?v=\d+"/g, 'href="../dist/themes/breeze.css?v=3"'],
  [/href="components\//g, 'href="../dist/components/'],
  [/href="layouts\//g, 'href="../dist/layouts/'],
  [/src="components\//g, 'src="../dist/components/'],
  [/src="js\//g, 'src="../dist/js/'],
  [/url\('components\/icons\//g, "url('../dist/components/icons/"],
  [/href="tokens\.json"/g, 'href="../tokens.json"'],
  [/href="LICENSE"/g, 'href="../LICENSE"'],
  [/__DIR__ \. '\/exsa\.css'/g, "__DIR__ . '/../dist/exsa.css'"],
  [/__DIR__ \. '\/themes\/custom\.css'/g, "__DIR__ . '/../dist/themes/custom.css'"],
  // generator.php logic
  [/fetch\('manifest\.json\?v=15'\)/g, "fetch('../manifest.json?v=15')"],
  [/c\.css\.replace\('components\/', ''\)/g, "c.css.replace('dist/components/', '')"],
  [/const resp = await fetch\(path\);/g, "const resp = await fetch('../' + path);"],
  [/fetchCSS\('components\/icons\/' \+ icon\)/g, "fetchCSS('dist/components/icons/' + icon)"],
  [/await fetch\(b\.source \+ '\?v=1'\)/g, "await fetch('../' + b.source + '?v=1')"],
  [/const key = 'components\/icons\/' \+ name;/g, "const key = 'dist/components/icons/' + name;"],
  // CDN + local path samples in docs
  [/exsa@main\/style\.css/g, 'exsa@main/dist/exsa.css'],
  [/exsa@main\/components\//g, 'exsa@main/dist/components/'],
  [/exsa@main\/themes\//g, 'exsa@main/dist/themes/'],
  [/exsa@main\/layouts\//g, 'exsa@main/dist/layouts/'],
  [/exsa@main\/templates\//g, 'exsa@main/dist/templates/'],
  [/exsa@main\/exsa\.css/g, 'exsa@main/dist/exsa.css'],
  [/exsa@main\/js\//g, 'exsa@main/dist/js/'],
  [/"exsa\/style\.css"/g, '"exsa/dist/exsa.css"'],
  [/exsa\/exsa\.css/g, 'exsa/dist/exsa.css'],
];

for (const rel of files) {
  const file = join(root, rel);
  let src = readFileSync(file, 'utf8');
  for (const [re, rep] of rules) src = src.replace(re, rep);
  writeFileSync(file, src);
  console.log('rewrote', rel);
}
console.log(`\n${files.length} files processed`);

#!/usr/bin/env node
/* Phase 7 migration — one cache-bust version constant for the whole site.
   Adds site/includes/version.php and rewrites every ?v=NN to ?v=<?= $EXSA_VER ?>. */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const versionFile = 'site/includes/version.php';
if (!existsSync(versionFile)) {
  writeFileSync(
    versionFile,
    "<?php\n/* Single cache-bust version for all site assets — bump it once, every page refreshes. */\n$EXSA_VER = 31;\n"
  );
  console.log('created ' + versionFile);
}

const pages = readdirSync('site').filter((f) => f.endsWith('.php'));
for (const name of pages) {
  const f = 'site/' + name;
  let src = readFileSync(f, 'utf8');
  let inserted = false;
  if (!src.includes("includes/version.php")) {
    src = src.replace(/\?>\s*\n(?=<!DOCTYPE html>)/, '?>\n<?php include \'includes/version.php\'; ?>\n');
    inserted = src.includes("includes/version.php");
  }
  const before = (src.match(/\?v=\d+/g) || []).length;
  src = src.replace(/\?v=\d+/g, '?v=<?= $EXSA_VER ?>');
  writeFileSync(f, src);
  console.log(`${name}: include ${inserted ? 'added' : 'already there'}, ${before} cache busters rewired`);
}

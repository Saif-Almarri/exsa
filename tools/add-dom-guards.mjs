#!/usr/bin/env node
/* EXSA Phase 6 migration — tools/add-dom-guards.mjs
   Wraps every behavior file in dist/js/ (except exsa-core.js) in a DOM-ready
   guarded IIFE, so behaviors work from <head>, defer, or end-of-body.

   For behaviors that depend on EXSA (drawer, lightbox, modal, video-gallery)
   a runtime guard is injected: without exsa-core.js they skip with a console
   warning instead of throwing.

   Idempotent: files already containing __exsaInit are skipped.
   Run once: node tools/add-dom-guards.mjs */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const jsDir = join(root, 'dist/js');

const SKIP = new Set(['exsa-core.js']);
const EXSA_DEPENDENT = new Set(['drawer.js', 'lightbox.js', 'modal.js', 'video-gallery.js']);
const GUARD = `/* DOM-ready guard — works from <head>, defer, or end of <body>. */`;

let changed = 0;
for (const name of readdirSync(jsDir)) {
  if (!name.endsWith('.js') || SKIP.has(name)) continue;
  const file = join(jsDir, name);
  let src = readFileSync(file, 'utf8');
  if (src.includes('__exsaInit')) continue; // already guarded

  const needsCore = EXSA_DEPENDENT.has(name);
  const coreGuard = needsCore
    ? `\n  if(!window.EXSA){console.warn('[EXSA] '+location.pathname.split('/').pop()+' needs js/exsa-core.js loaded first — skipping.');return;}\n`
    : '\n';

  const wrapped = `${GUARD}
(function(){
function __exsaInit(){${coreGuard}
${src.trimEnd()}
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();
`;
  writeFileSync(file, wrapped);
  changed++;
  console.log(`  guarded ${name}${needsCore ? ' (+ exsa-core runtime guard)' : ''}`);
}
console.log(`done — ${changed} file(s) guarded`);

#!/usr/bin/env node
/* EXSA framework validator — tools/validate.mjs
   Run:  node tools/validate.mjs [--layers] [--no-legacy] [--check-tokens] [--token-audit] [--baseline]

   Rules (exit 1 on failure):
   1. every file referenced by manifest.json exists
   2. every token in tokens.json is defined in some framework CSS file
   3. no `!important` in components/, layouts/, themes/
   4. --layers    : every component/layout/theme file is wrapped in its @layer
   5. --no-legacy : no page references the deleted components.js
   6. manifest token catalog ↔ CSS: every catalog entry (core, z-index, component,
      layout) is defined in its CSS file (fallback-only entries must be referenced)
   7. no drift the other way: every token defined in dist/exsa.css is cataloged
   8. every fallback-less var(--x) in distributed CSS resolves to a definition in
      dist/exsa.css, dist/exsa.fluid.css, or the same file (catches theme key drift)
   9. every components[].js is null or an existing file
  10. --check-tokens : tokens.json must equal the tools/build-tokens.mjs output
  11. --check-bundles : dist/exsa.js + dist/exsa.bundle.css must be generated output
  12. every manifest structure contract cross-checks its CSS file
  13. --check-debug : dist/exsa.debug.css + dist/exsa.debug.js must be generated output
  14. no `.calc(` corruption signature (dot-form tokenizer bug) in any CSS file
  15. site pages reference only defined EXSA tokens (or file-local custom props)
  16. every layout structure contract cross-checks its CSS (when-class + parts)
  17. every theme defines both forced-mode color-scheme rules
      (theme self-containment contract — themes stay standalone)

   --token-audit prints a spacing-discipline report (hardcoded margin/padding/gap
   that should reference tokens) and exits with the normal rule result.
   --baseline prints size/token stats and exits 0 (no rules run). */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/* ---------- collect CSS files ---------- */
const cssRoots = ['dist/components', 'dist/themes', 'dist/layouts', 'dist/templates'];
const cssFiles = ['dist/exsa.css', 'dist/style.css', 'dist/exsa.fluid.css', 'dist/exsa.debug.css'];
const walkDir = (rel) => {
  for (const ent of readdirSync(join(root, rel), { withFileTypes: true })) {
    const p = `${rel}/${ent.name}`;
    if (ent.isDirectory()) walkDir(p);
    else if (ent.name.endsWith('.css')) cssFiles.push(p);
  }
};
for (const dir of cssRoots) walkDir(dir);
const cssFiles2 = cssFiles.filter((f) => existsSync(join(root, f)));
if (cssFiles2.length !== cssFiles.length) {
  for (const f of cssFiles.filter((f) => !cssFiles2.includes(f))) fail(`missing CSS file: ${f}`);
}
const allCss = cssFiles2.map((f) => readFileSync(join(root, f), 'utf8')).join('\n');

/* ---------- rule 1: manifest references ---------- */
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
const refs = new Set();
(function walk(v) {
  if (typeof v === 'string') {
    const clean = v.split('?')[0];
    if (/^(dist\/)?(components|themes|layouts|templates|js)\/[A-Za-z0-9._/-]+\.(css|js|svg|html)$/.test(clean) ||
        /^(dist\/)?(style\.css|exsa\.fluid\.css|exsa\.css|exsa\.bundle\.css)(\?v=\d+)?$/.test(clean)) refs.add(clean);
  } else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
})(manifest);
for (const f of refs) {
  if (!existsSync(join(root, f))) fail(`manifest references missing file: ${f}`);
}

/* ---------- rule 2: tokens.json tokens are defined ---------- */
const tokensJson = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
const tokenNames = new Set();
(function walk(v) {
  if (typeof v === 'string') {
    const m = v.match(/--[a-z0-9-]+/);
    if (m && v.trim().startsWith('--')) tokenNames.add(v.trim());
  } else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
})(tokensJson.tokens);
for (const t of tokenNames) {
  if (!allCss.includes(t + ':')) fail(`token ${t} (tokens.json) is not defined in any CSS file`);
}

/* ---------- rule 6: manifest token catalog ↔ CSS definitions ---------- */
const coreSrc = readFileSync(join(root, 'dist/exsa.css'), 'utf8');
const coreDefs = new Set([...coreSrc.matchAll(/--[a-z0-9-]+\s*:/g)].map((m) => m[0].replace(/\s*:$/, '')));
const catalogVars = new Set();
if (manifest.tokens) {
  const cat = manifest.tokens;
  for (const [group, entries] of Object.entries(cat.core || {})) {
    for (const e of entries) {
      catalogVars.add(e.css);
      if (e.fallback !== undefined) continue; // API custom properties (set inline by users)
      if (!coreDefs.has(e.css)) fail(`manifest tokens.core.${group}.${e.css} is not defined in dist/exsa.css`);
    }
  }
  for (const [id, comp] of Object.entries(cat.components || {})) {
    const src = readFileSync(join(root, comp.file), 'utf8');
    for (const e of comp.tokens) {
      catalogVars.add(e.css);
      if (e.fallback !== undefined) {
        if (!src.includes('var(' + e.css)) fail(`manifest tokens.components.${id}.${e.css} is marked fallback-only but is never referenced in ${comp.file}`);
      } else if (!src.includes(e.css + ':')) {
        fail(`manifest tokens.components.${id}.${e.css} is not defined in ${comp.file}`);
      }
    }
  }
  for (const [id, lay] of Object.entries(cat.layouts || {})) {
    const src = readFileSync(join(root, lay.file), 'utf8');
    for (const e of lay.tokens) {
      catalogVars.add(e.css);
      if (e.fallback !== undefined) continue;
      if (!src.includes(e.css + ':')) fail(`manifest tokens.layouts.${id}.${e.css} is not defined in ${lay.file}`);
    }
  }
}

/* ---------- rule 7: no undocumented core tokens (reverse drift) ---------- */
for (const t of coreDefs) {
  if (!catalogVars.has(t)) fail(`token ${t} is defined in dist/exsa.css but missing from the manifest.json tokens catalog`);
}

/* ---------- rule 8: every fallback-less var(--x) must resolve ---------- */
const globalDefs = new Set([...coreDefs]);
const fluidSrc = readFileSync(join(root, 'dist/exsa.fluid.css'), 'utf8');
for (const m of fluidSrc.matchAll(/--[a-z0-9-]+\s*:/g)) globalDefs.add(m[0].replace(/\s*:$/, ''));
for (const f of cssFiles2.filter((f) => f.startsWith('dist/') && f !== 'dist/exsa.css' && f !== 'dist/exsa.fluid.css')) {
  const src = readFileSync(join(root, f), 'utf8');
  const localDefs = new Set([...src.matchAll(/--[a-z0-9-]+\s*:/g)].map((m) => m[0].replace(/\s*:$/, '')));
  for (const m of src.matchAll(/var\(\s*(--[a-z0-9-]+)\s*\)/g)) {
    if (!globalDefs.has(m[1]) && !localDefs.has(m[1])) {
      fail(`${f}: var(${m[1]}) has no fallback and is not defined in dist/exsa.css, dist/exsa.fluid.css, or this file`);
    }
  }
}

/* ---------- rule 9: components[].js is null or an existing file ---------- */
for (const c of manifest.components || []) {
  if (c.js === null) continue;
  if (typeof c.js !== 'string' || !existsSync(join(root, c.js))) {
    fail(`manifest component "${c.id}": js must be null or an existing file (got ${JSON.stringify(c.js)})`);
  }
}

/* ---------- rule 3: no !important in components/layouts/themes ---------- */
for (const f of cssFiles2.filter((f) => cssRoots.some((r) => f.startsWith(r + '/')))) {
  const content = readFileSync(join(root, f), 'utf8');
  const n = (content.match(/!important/g) || []).length;
  if (n) fail(`${f}: ${n} \`!important\` (framework ships none outside the reset layer)`);
  if (content.includes('\uFEFF')) fail(`${f}: contains a stray U+FEFF (BOM) character`);
}

/* ---------- rule 4 (--layers): @layer block wrapping ----------
   Must be BLOCK form (@layer exsa.X { … }): mixing blockless statements
   in distributed files with the block statements in the core inverts
   the cascade order (verified Chromium behavior, see CHANGELOG). */
if (process.argv.includes('--layers')) {
  const layerScoped = cssFiles2.filter((f) => cssRoots.some((r) => f.startsWith(r + '/')) || f === 'exsa.fluid.css');
  for (const f of layerScoped) {
    const content = readFileSync(join(root, f), 'utf8').replace(/^\uFEFF/, '').trimStart();
    if (!/^@layer\s+exsa\.(components|layouts|themes|fluid)\s*\{/.test(content)) {
      fail(`${f}: not wrapped in block form @layer exsa.{components|layouts|themes|fluid} { … }`);
    }
    if (!content.trimEnd().endsWith('}')) {
      fail(`${f}: layer block not closed at end of file`);
    }
  }
}

/* ---------- rule 5 (--no-legacy): no components.js references ---------- */
if (process.argv.includes('--no-legacy')) {
  const scanDirs = ['site', 'site/includes'];
  for (const dir of scanDirs) {
    for (const f of readdirSync(join(root, dir))) {
      if (!/\.(php|html)$/.test(f)) continue;
      const content = readFileSync(join(root, dir, f), 'utf8');
      if (content.includes('components.js')) fail(`${dir}/${f}: still references deleted components.js`);
    }
  }
}

/* ---------- rule 10 (--check-tokens): tokens.json must be generated output ---------- */
if (process.argv.includes('--check-tokens')) {
  const { buildTokens } = await import('./build-tokens.mjs');
  const generated = JSON.stringify(buildTokens(), null, 2) + '\n';
  const committed = readFileSync(join(root, 'tokens.json'), 'utf8');
  if (generated !== committed) fail('tokens.json is out of date — run: node tools/build-tokens.mjs');
}

/* ---------- rule 11 (--check-bundles): prebuilt bundles must be generated output ---------- */
if (process.argv.includes('--check-bundles')) {
  const { bundleOutputs } = await import('./build-bundle.mjs');
  const { js, css } = bundleOutputs();
  const cur = (f) => (existsSync(join(root, f)) ? readFileSync(join(root, f), 'utf8') : null);
  if (cur('dist/exsa.js') !== js) fail('dist/exsa.js is out of date — run: node tools/build-bundle.mjs');
  if (cur('dist/exsa.bundle.css') !== css) fail('dist/exsa.bundle.css is out of date — run: node tools/build-bundle.mjs');
}

/* ---------- --token-audit: spacing-token discipline report ----------
   Finds margin/padding/gap declarations in distributed CSS that hardcode a value
   instead of referencing a token (or calc() over one). Actionable = px/rem literals
   (should be calc(N * var(--space-factor, 1))); informational = em/%/vh/vw geometry
   that intentionally scales with font or viewport. Token defaults are listed
   separately. Informational — never fails. */
if (process.argv.includes('--token-audit')) {
  const scope = cssFiles2.filter((f) => f.startsWith('dist/') && f !== 'dist/style.css');
  const actionable = [];
  const informational = [];
  const tokenDefaults = [];
  const declRe = /([a-z-]*?(?:margin|padding|gap)(?:-[a-z]+)*)\s*:\s*([^;{}]+)/g;
  const isNeutral = (v) => v.split(/\s+/).every((t) => /^(0|0px|0rem|0em|auto|none|unset|initial|inherit|normal)$/.test(t));
  for (const f of scope) {
    const lines = readFileSync(join(root, f), 'utf8').split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\/\*.*?\*\//g, '');
      for (const m of line.matchAll(declRe)) {
        const prop = m[1];
        const value = m[2].trim();
        if (/var\(|calc\(|clamp\(/.test(value)) continue;
        if (isNeutral(value)) continue;
        const entry = { file: f, line: i + 1, prop, value };
        if (prop.startsWith('--')) tokenDefaults.push(entry);
        else if (/\d+(\.\d+)?\s*(px|rem)\b/.test(value)) actionable.push(entry);
        else informational.push(entry);
      }
    }
  }
  console.log('\n═══ token audit: actionable spacing (px/rem — should scale with --space-factor) ═══');
  if (!actionable.length) console.log('  none — every px/rem spacing declaration scales with density profiles');
  for (const e of actionable) console.log(`  ${e.file}:${e.line}  ${e.prop}: ${e.value}`);
  console.log(`  ── ${actionable.length} actionable`);
  console.log('\n═══ token audit: informational (em/%/vh/vw geometry — intentionally literal) ═══');
  for (const e of informational.slice(0, 40)) console.log(`  ${e.file}:${e.line}  ${e.prop}: ${e.value}`);
  if (informational.length > 40) console.log(`  … +${informational.length - 40} more`);
  console.log(`  ── ${informational.length} informational`);
  console.log('\n═══ token audit: token defaults with hardcoded values ═══');
  if (!tokenDefaults.length) console.log('  none');
  for (const e of tokenDefaults) console.log(`  ${e.file}:${e.line}  ${e.prop}: ${e.value}`);
  console.log(`  ── ${tokenDefaults.length} hardcoded token default(s)\n`);
}

/* ---------- --baseline: stats only ---------- */
if (process.argv.includes('--baseline')) {
  const kb = (n) => (n / 1024).toFixed(1) + ' KB';
  const sizes = cssFiles2.map((f) => ({ f, n: statSync(join(root, f)).size }))
    .sort((a, b) => b.n - a.n);
  const tokensInCore = new Set([...readFileSync(join(root, 'dist/exsa.css'), 'utf8').matchAll(/--[a-z0-9-]+\s*:/g)].map((m) => m[0].replace(/\s*:$/, '')));
  console.log('BASELINE ' + new Date().toISOString().slice(0, 10));
  console.log(`core dist/exsa.css: ${kb(statSync(join(root, 'dist/exsa.css')).size)} (${cssFiles2.length} CSS files total, ${kb(sizes.reduce((s, x) => s + x.n, 0))} combined)`);
  console.log(`components: ${cssFiles2.filter((f) => f.startsWith('dist/components/')).length}, themes: ${cssFiles2.filter((f) => f.startsWith('dist/themes/')).length}, layouts: ${cssFiles2.filter((f) => f.startsWith('dist/layouts/')).length}`);
  console.log(`tokens in tokens.json: ${tokenNames.size}, custom props defined in dist/exsa.css: ${tokensInCore.size}`);
  console.log('largest files:', sizes.slice(0, 5).map((s) => `${s.f} ${kb(s.n)}`).join(', '));
  process.exit(0);
}

/* ---------- rule 12: manifest structure contracts ---------- */
const stripMod = (s) => s.replace(/--[a-z0-9-]+$/i, '');
const stripComb = (s) => s.replace(/^[~+>]\s*/, ''); // sibling/child prefixes (rootless components like drawer)
for (const c of manifest.components) {
  const s = c.structure;
  if (!s) continue;
  const cssPath = c.css;
  if (!existsSync(join(root, cssPath))) { fail(`component ${c.id}: structure declared but CSS missing (${cssPath})`); continue; }
  const css = readFileSync(join(root, cssPath), 'utf8');
  const rootName = s.root.replace('.', '');
  if (!css.includes(s.root + '{') && !css.includes(s.root + ' ') && !css.includes(s.root + ',')) {
    fail(`component ${c.id}: structure root ${s.root} not defined in ${cssPath}`);
  }
  const listed = new Set([...(s.required || []), ...(s.optional || [])].map((p) => stripComb(stripMod(p))));
  for (const part of [...s.required || [], ...s.optional || []]) {
    const base = stripComb(stripMod(part));
    if (!css.includes(base + '{') && !css.includes(base + ' ') && !css.includes(base + ',') && !css.includes(base + ':')) {
      fail(`component ${c.id}: structure part ${part} not defined in ${cssPath}`);
    }
  }
  for (const m of css.matchAll(new RegExp('\\.' + rootName + '__[a-z0-9-]+', 'g'))) {
    const part = stripMod(m[0]);
    if (!listed.has(part)) fail(`component ${c.id}: CSS defines ${m[0]} but it is not in manifest structure`);
  }
}

/* ---------- rule 13: --check-debug : debug css/js are generated output ---------- */
if (process.argv.includes('--check-debug')) {
  const { generateDebugCss, generateDebugJs } = await import('./build-debug.mjs');
  const expected = generateDebugCss();
  const actual = readFileSync(join(root, 'dist/exsa.debug.css'), 'utf8');
  if (expected !== actual) fail('dist/exsa.debug.css is stale — run tools/build-debug.mjs (npm run build)');
  const expectedJs = generateDebugJs();
  const actualJs = readFileSync(join(root, 'dist/exsa.debug.js'), 'utf8');
  if (expectedJs !== actualJs) fail('dist/exsa.debug.js is stale — run tools/build-debug.mjs (npm run build)');
}

/* ---------- rule 14: tokenizer corruption signature `.calc(` ----------
   The dot-form tokenizer bug rewrote `.1rem`-style values into `.calc(...)`
   (10× too big). Valid CSS can never contain the literal `.calc(`. */
for (const f of cssFiles2) {
  const content = readFileSync(join(root, f), 'utf8');
  if (content.includes('.calc(')) {
    fail(`${f}: contains \`.calc(\` — corrupted spacing value (dot-form tokenizer bug)`);
  }
}

/* ---------- rule 15: site pages reference only defined tokens ----------
   Catches doc drift like the old `--color-error` (a token that never existed).
   Known = tokens.json + manifest catalog + everything defined in dist CSS.
   References to custom props defined locally in the same file are allowed. */
const knownTokens = new Set(tokenNames);
for (const t of catalogVars) knownTokens.add(t);
for (const m of allCss.matchAll(/--[a-z0-9-]+\s*:/g)) knownTokens.add(m[0].replace(/\s*:$/, ''));
const siteFiles = [];
(function walkSite(rel) {
  for (const ent of readdirSync(join(root, rel), { withFileTypes: true })) {
    const p = `${rel}/${ent.name}`;
    if (ent.isDirectory()) walkSite(p);
    else if (/\.(php|html)$/.test(ent.name)) siteFiles.push(p);
  }
})('site');
const siteTokenIgnore = new Set(['--exsa-version', '--token', '--g-radius']); // intentional placeholders in docs prose + site-local glass radius (site/glass.css)
for (const f of siteFiles) {
  const content = readFileSync(join(root, f), 'utf8');
  const localDefs = new Set([...content.matchAll(/--[a-z0-9-]+(?=\s*:)/g)].map((m) => m[0]));
  const refs = new Set();
  // strong signal: an actual var(--x) reference (any shape)
  for (const m of content.matchAll(/var\(\s*(--[a-z0-9-]+)\s*\)/g)) refs.add(m[1]);
  // weaker signal: bare --x mentions — only multi-part names, since BEM
  // modifiers (avatar--xs, --online, --s1) are single-part and legitimate prose
  for (const m of content.matchAll(/(?<![\w-])--[a-z0-9-]+/g)) {
    const t = m[0];
    if (!/[a-z0-9]/i.test(t)) continue;                    // ---- separators
    if (t.endsWith('-')) continue;                         // --font-size- placeholders
    if (!/^--[a-z]+(-[a-z0-9]+)+$/.test(t)) continue;      // BEM modifier suffixes
    refs.add(t);
  }
  for (const t of refs) {
    if (t.length < 4 || siteTokenIgnore.has(t)) continue;
    if (!knownTokens.has(t) && !localDefs.has(t)) {
      fail(`${f}: references ${t}, which is not a defined EXSA token (or file-local custom property)`);
    }
  }
}

/* ---------- rule 16: layout structure cross-check ----------
   Every conditional contract's `when` body class must exist in the layout
   file, and every required part must be defined in some dist CSS file.
   Structural selectors (`> header:not([class])`, pseudo-parts) are skipped. */
for (const lay of manifest.layouts || []) {
  const arr = lay.structure;
  if (!arr || !arr.length) continue;
  const src = readFileSync(join(root, lay.file), 'utf8');
  for (const cond of arr) {
    const whenClass = cond.when.replace(/^body\./, '');
    if (!src.includes(whenClass)) fail(`layout ${lay.id}: structure.when "${cond.when}" not found in ${lay.file}`);
    for (const part of cond.required || []) {
      if (part.startsWith('>') || part.includes(':')) continue; // structural selectors — skip static check
      if (!allCss.includes(part)) fail(`layout ${lay.id}: required part ${part} not defined in any dist CSS file`);
    }
  }
}

/* ---------- rule 17: theme self-containment contract ----------
   Every theme file is standalone: it must define both forced-mode
   color-scheme rules. They also live in dist/exsa.css — a harmless
   duplicate that keeps a theme fully usable when the core isn't linked
   (e.g. a Generator bundle with Foundation off). Enforced, not accidental. */
for (const f of cssFiles2.filter((f) => f.startsWith('dist/themes/') && f.endsWith('.css'))) {
  const content = readFileSync(join(root, f), 'utf8');
  for (const mode of ['dark', 'light']) {
    const re = new RegExp(':root\\[data-theme-mode="' + mode + '"\\]\\s*\\{\\s*color-scheme:\\s*' + mode + ';?');
    if (!re.test(content)) {
      fail(`${f}: missing standalone forced-mode rule :root[data-theme-mode="${mode}"] { color-scheme: ${mode}; }`);
    }
  }
}

/* ---------- report ---------- */
if (errors.length) {
  console.error(`EXSA validator: ${errors.length} error(s), ${warnings.length} warning(s)`);
  for (const e of errors) console.error('  ✗ ' + e);
  for (const w of warnings) console.error('  ⚠ ' + w);
  process.exit(1);
}
console.log(`EXSA validator: OK — ${refs.size} manifest refs, ${tokenNames.size} tokens, ${cssFiles2.length} CSS files, ${siteFiles.length} site pages token-checked`);
if (warnings.length) for (const w of warnings) console.log('  ⚠ ' + w);

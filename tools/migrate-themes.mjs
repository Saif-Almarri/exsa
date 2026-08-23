#!/usr/bin/env node
/* One-off migration: convert theme files from the 4-block dark-mode
   pattern to single light-dark() definitions + color-scheme flips.
   Usage: node tools/migrate-themes.mjs   (idempotent — already-migrated files are skipped) */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'themes');
const tokenRe = /--([a-z0-9-]+)\s*:\s*([^;]+);/g;

const collect = (text) => {
  const m = {};
  const leftovers = text.replace(tokenRe, (_, name, val) => { m[name] = val.trim(); return ''; })
    .replace(/\s+/g, '').trim();
  return { m, leftovers };
};

for (const f of readdirSync(dir).filter((f) => f.endsWith('.css'))) {
  const file = join(dir, f);
  const src = readFileSync(file, 'utf8');
  if (src.includes('light-dark(')) { console.log(f, '→ already migrated, skip'); continue; }

  const headerMatch = src.match(/^(\/\*[\s\S]*?\*\/)/);
  const header = headerMatch ? headerMatch[1] : '/* EXSA theme */';
  const body = header ? src.slice(header.length) : src;

  const rootMatch = body.match(/:root\s*\{([\s\S]*?)\}/);
  const mediaMatch = body.match(/@media\s*\(prefers-color-scheme:\s*(dark|light)\)\s*\{\s*:root\s*\{([\s\S]*?)\}\s*\}/);
  if (!rootMatch) { console.log(f, '→ SKIP: no :root block found'); continue; }

  const rootT = collect(rootMatch[1]);
  const mediaT = mediaMatch ? collect(mediaMatch[2]) : null;

  let light, dark;
  if (!mediaMatch) { light = rootT.m; dark = rootT.m; }
  else if (mediaMatch[1] === 'dark') { light = rootT.m; dark = mediaT.m; }
  else { dark = rootT.m; light = mediaT.m; }

  const forced = {};
  for (const m of body.matchAll(/:root\[data-theme-mode="(dark|light)"\]\s*\{([\s\S]*?)\}/g)) {
    forced[m[1]] = collect(m[2]).m;
  }
  const drifts = [];
  if (forced.dark) for (const [k, v] of Object.entries(forced.dark)) if (dark[k] !== undefined && dark[k] !== v) drifts.push(`forced-dark --${k}: ${v} → ${dark[k]}`);
  if (forced.light) for (const [k, v] of Object.entries(forced.light)) if (light[k] !== undefined && light[k] !== v) drifts.push(`forced-light --${k}: ${v} → ${light[k]}`);

  const dropped = [rootT.leftovers, mediaT ? mediaT.leftovers : ''].filter(Boolean);

  const order = [...Object.keys(light), ...Object.keys(dark).filter((k) => !(k in light))];
  const lines = [];
  for (const k of order) {
    const l = light[k], d = dark[k];
    if (l === undefined) lines.push(`  --${k}: ${d};`);
    else if (d === undefined) lines.push(`  --${k}: ${l};`);
    else if (l === d) lines.push(`  --${k}: ${l};`);
    else lines.push(`  --${k}: light-dark(${l}, ${d});`);
  }

  const out = `${header}\n\n:root {\n  color-scheme: light dark;\n${lines.join('\n')}\n}\n\n/* Forced dark — <html data-theme-mode="dark">, ignores OS preference */\n:root[data-theme-mode="dark"] { color-scheme: dark; }\n\n/* Forced light — <html data-theme-mode="light">, ignores OS preference */\n:root[data-theme-mode="light"] { color-scheme: light; }\n`;
  writeFileSync(file, out);
  console.log(f, `→ ${lines.length} tokens` +
    (drifts.length ? ` — ${drifts.length} drift(s) normalized: ${drifts.join('; ')}` : '') +
    (dropped.length ? ` — WARNING non-token content dropped: ${dropped.join(' | ').slice(0, 100)}` : ''));
}

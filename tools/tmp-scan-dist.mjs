import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const files = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    e.isDirectory() ? walk(p) : (p.endsWith('.css') || p.endsWith('.html') || p.endsWith('.js')) && files.push(p);
  }
})('dist');
let total = 0;
for (const f of files) {
  const t = readFileSync(f, 'utf8');
  /* corrupted lead bytes: cp1252-mapped UTF-8 lead chars (â Ã ä etc.) followed by typical corruption */
  const m = t.match(/[\u00E2\u00C3\u00C2\u00EF\u00F0][\u0080-\u00FF]/g);
  if (m) { console.log(f, '->', m.length, 'runs, e.g.', JSON.stringify(m.slice(0, 4).join(''))); total += m.length; }
}
console.log('total suspicious runs:', total);

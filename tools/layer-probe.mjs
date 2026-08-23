#!/usr/bin/env node
/* tools/layer-probe.mjs — Phase 8 release gate
   Loads site/qa/layer-probe.html in a real Chromium (Brave), runs the in-page
   cascade/composability probes, and pixel-diffs screenshots against baselines.

   Usage:
     node tools/layer-probe.mjs --baseline   # (re)write tools/baselines/layer-probe/
     node tools/layer-probe.mjs              # compare against baselines, exit 1 on drift
*/
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const baselineDir = join(root, 'tools', 'baselines', 'layer-probe');
const isBaseline = process.argv.includes('--baseline');
const URL_BASE = process.env.EXSA_PROBE_URL || 'http://localhost/exsa/site/qa/layer-probe.html';
const BROWSER = process.env.EXSA_PROBE_BROWSER ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const SHOTS = [
  { name: 'full-page', selector: 'body' },
  { name: 'sec-tokens', selector: '#sec-tokens' },
  { name: 'sec-cascade', selector: '#sec-cascade' },
  { name: 'sec-components', selector: '#sec-components' },
  { name: 'sec-density', selector: '#sec-density' },
  { name: 'probe-table', selector: '#probe-results' },
];
const DIFF_TOLERANCE = 0.02; // 2% of pixels may differ (font rasterization)

function diffPng(aBuf, bBuf) {
  const a = PNG.sync.read(aBuf);
  const b = PNG.sync.read(bBuf);
  if (a.width !== b.width || a.height !== b.height) return 1;
  const { width, height } = a;
  let changed = 0;
  const total = width * height;
  for (let i = 0; i < total; i++) {
    const o = i * 4;
    const d = Math.abs(a.data[o] - b.data[o]) + Math.abs(a.data[o + 1] - b.data[o + 1]) +
      Math.abs(a.data[o + 2] - b.data[o + 2]) + Math.abs(a.data[o + 3] - b.data[o + 3]);
    if (d > 48) changed++;
  }
  return changed / total;
}

const browser = await chromium.launch({ executablePath: BROWSER, headless: true });

const openPage = async (width) => {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  return { context, page };
};
const loadProbes = async (page) => {
  // unique query defeats same-URL same-document navigation caching
  await page.goto(URL_BASE + '?run=' + Date.now(), { waitUntil: 'load' });
  await page.waitForFunction('window.__EXSA_PROBES_DONE === true', { timeout: 30000 });
  return page.evaluate(() => window.__EXSA_PROBES);
};
const overflowReport = (page) => page.evaluate(() => {
  const de = document.documentElement;
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1)) {
      if (offenders.length < 5) {
        offenders.push(el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || '').trim().replace(/\s+/g, '.'));
      }
    }
  }
  return { scrollW: de.scrollWidth, clientW: de.clientWidth, offenders };
});
const checkShot = async (locator, baseName, label, fails) => {
  const buf = await locator.screenshot();
  const file = join(baselineDir, baseName + '.png');
  if (isBaseline) {
    writeFileSync(file, buf);
    console.log('baseline saved: ' + baseName);
  } else if (!existsSync(file)) {
    console.log('MISSING baseline for ' + baseName + ' (run --baseline first)');
    fails.push({ id: label, pass: false, expect: 'baseline exists', actual: 'missing' });
  } else {
    const ratio = diffPng(buf, readFileSync(file));
    const ok = ratio <= DIFF_TOLERANCE;
    console.log((ok ? 'PASS' : 'FAIL') + '  ' + label + ' — diff ' + (ratio * 100).toFixed(2) + '% (limit ' + (DIFF_TOLERANCE * 100) + '%)');
    if (!ok) fails.push({ id: label, pass: false, expect: '<=' + DIFF_TOLERANCE, actual: ratio.toFixed(4) });
  }
};

const main = await openPage(1280);
const page = main.page;
const probes = await loadProbes(page);

// Focus probe (keyboard-only :focus-visible)
// Click a non-focusable spot to reset the sequential-focus starting point, then Tab.
await page.mouse.click(5, 5);
await page.keyboard.press('Tab');
const focusState = await page.evaluate(() => {
  const el = document.activeElement;
  const cs = getComputedStyle(el);
  return { id: el.id || el.className, outline: cs.outlineWidth + ' ' + cs.outlineStyle };
});
probes.push({
  id: 'focus :focus-visible outline (Tab)',
  pass: focusState.id === 'skip-link' && focusState.outline === '2px solid',
  expect: 'skip-link 2px solid',
  actual: focusState.id + ' ' + focusState.outline,
});

const fails = probes.filter(p => !p.pass);

/* ---------- horizontal-overflow sweep (all viewports) ---------- */
const o1280 = await overflowReport(page);
if (o1280.scrollW > o1280.clientW + 1 || o1280.offenders.length) {
  console.log('FAIL  layout sweep @1280px — ' + JSON.stringify(o1280));
  fails.push({ id: 'layout @1280px', pass: false, expect: 'no horizontal overflow', actual: JSON.stringify(o1280) });
} else {
  console.log('PASS  layout sweep @1280px — scrollWidth ' + o1280.scrollW + ' of ' + o1280.clientW);
}

console.log('=== Layer probes (' + probes.length + ' checks) ===');
for (const p of probes) console.log((p.pass ? 'PASS' : 'FAIL') + '  ' + p.id + (p.pass ? '' : '\n      expected: ' + p.expect + '\n      actual:   ' + p.actual));

mkdirSync(baselineDir, { recursive: true });
for (const s of SHOTS) {
  await checkShot(page.locator(s.selector).first(), s.name, 'screenshot ' + s.name, fails);
}

/* ---------- multi-viewport layout sweep (768 / 390) ---------- */
for (const w of [768, 390]) {
  const vp = await openPage(w);
  await loadProbes(vp.page);
  const o = await overflowReport(vp.page);
  const ok = o.scrollW <= o.clientW + 1 && !o.offenders.length;
  console.log((ok ? 'PASS' : 'FAIL') + '  layout sweep @' + w + 'px — scrollWidth ' + o.scrollW + ' of ' + o.clientW +
    (o.offenders.length ? ' · offenders: ' + o.offenders.join(', ') : ''));
  if (!ok) fails.push({ id: 'layout @' + w + 'px', pass: false, expect: 'no horizontal overflow', actual: JSON.stringify(o) });
  for (const s of SHOTS) {
    await checkShot(vp.page.locator(s.selector).first(), s.name + '-' + w, 'screenshot ' + s.name + ' @' + w + 'px', fails);
  }
  await vp.context.close();
}

if (isBaseline) {
  writeFileSync(join(baselineDir, 'probes.json'), JSON.stringify(probes, null, 2));
  console.log('baseline probes saved (' + probes.length + ').');
} else {
  const prev = JSON.parse(readFileSync(join(baselineDir, 'probes.json'), 'utf8'));
  for (const old of prev) {
    const now = probes.find(p => p.id === old.id);
    if (now && old.pass && !now.pass) console.log('REGRESSION: probe ' + now.id + ' was passing in baseline');
  }
}

await main.context.close();
await browser.close();
if (fails.length) {
  console.log('\nRESULT: ' + fails.length + ' failure(s)');
  process.exit(1);
}
console.log('\nRESULT: all green');

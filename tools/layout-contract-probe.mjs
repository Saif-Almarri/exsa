#!/usr/bin/env node
/* tools/layout-contract-probe.mjs — layout markup-contract gate
   Loads site/qa/layout-probe.html, which iframes 8 fixture pages (4 good,
   4 bad) each with <html data-debug>. Asserts:
     • GOOD fixtures have no debug outline on <body>
     • BAD fixtures are flagged by dist/exsa.debug.css (dashed outline + label)
   Exit 1 on any failure. */
import { chromium } from 'playwright-core';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BROWSER = process.env.EXSA_PROBE_BROWSER ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const URL_BASE = process.env.EXSA_PROBE_URL || 'http://localhost/exsa/site/qa/layout-probe.html';

const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

await page.goto(URL_BASE + '?run=' + Date.now(), { waitUntil: 'load' });
await page.waitForFunction('window.__LAYOUT_PROBES_DONE === true', { timeout: 30000 });
const probes = await page.evaluate(() => window.__LAYOUT_PROBES);

const fails = probes.filter((p) => !p.pass);
console.log('=== Layout contract probes (' + probes.length + ' checks) ===');
for (const p of probes) {
  console.log((p.pass ? 'PASS' : 'FAIL') + '  ' + p.id + (p.pass ? '' : '\n      expected: ' + p.expect + '\n      actual:   ' + p.actual));
}
await browser.close();
if (fails.length) {
  console.log('\nRESULT: ' + fails.length + ' failure(s)');
  process.exit(1);
}
console.log('\nRESULT: all layout contracts green');

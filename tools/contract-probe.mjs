#!/usr/bin/env node
/* tools/contract-probe.mjs — markup-contract gate
   Loads site/qa/contract-probe.html with <html data-debug> and asserts:
     • every GOOD reference snippet renders its required parts with non-zero size
     • every BAD (broken) snippet is flagged by dist/exsa.debug.css
   Exit 1 on any failure. */
import { chromium } from 'playwright-core';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BROWSER = process.env.EXSA_PROBE_BROWSER ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const URL_BASE = process.env.EXSA_PROBE_URL || 'http://localhost/exsa/site/qa/contract-probe.html';

const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

await page.goto(URL_BASE + '?run=' + Date.now(), { waitUntil: 'load' });
await page.waitForFunction('window.__CONTRACT_PROBES_DONE === true', { timeout: 30000 });
const probes = await page.evaluate(() => window.__CONTRACT_PROBES);

const fails = probes.filter((p) => !p.pass);
console.log('=== Contract probes (' + probes.length + ' checks) ===');
for (const p of probes) {
  console.log((p.pass ? 'PASS' : 'FAIL') + '  ' + p.id + (p.pass ? '' : '\n      expected: ' + p.expect + '\n      actual:   ' + p.actual));
}
await browser.close();
if (fails.length) {
  console.log('\nRESULT: ' + fails.length + ' failure(s)');
  process.exit(1);
}
console.log('\nRESULT: all contracts green');

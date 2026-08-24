#!/usr/bin/env node
/* tools/spell-probe.mjs — class-name spellchecker gate
   Loads site/qa/spell-probe.html (with <html data-debug> + exsa.debug.js):
     • BAD elements with misspelled EXSA classes must carry an amber
       data-dbg-suggest label with the expected suggestion
     • GOOD elements (correct, data-dbg-allow'd, or foreign BEM) stay clean
   Exit 1 on any failure. */
import { chromium } from 'playwright-core';

const BROWSER = process.env.EXSA_PROBE_BROWSER ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const URL_BASE = process.env.EXSA_PROBE_URL || 'http://localhost/exsa/site/qa/spell-probe.html';

const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

await page.goto(URL_BASE + '?run=' + Date.now(), { waitUntil: 'load' });
await page.waitForFunction('window.__SPELL_PROBES_DONE === true', { timeout: 30000 });
const probes = await page.evaluate(() => window.__SPELL_PROBES);

const fails = probes.filter((p) => !p.pass);
console.log('=== Spell probes (' + probes.length + ' checks) ===');
for (const p of probes) {
  console.log((p.pass ? 'PASS' : 'FAIL') + '  ' + p.id + (p.pass ? '' : '\n      expected: ' + p.expect + '\n      actual:   ' + p.actual));
}
await browser.close();
if (fails.length) {
  console.log('\nRESULT: ' + fails.length + ' failure(s)');
  process.exit(1);
}
console.log('\nRESULT: all spell checks green');

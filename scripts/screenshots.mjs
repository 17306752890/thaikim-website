// Screenshots + QA. Usage: BASE=http://127.0.0.1:4321 node scripts/screenshots.mjs v1/th/index v2/th/index ...
// Default: home of every version in th (desktop 1440 + mobile 390) + chooser. Requires Playwright (PW=/path/to/playwright/index.mjs to override).
import fs from 'node:fs';
const { chromium } = await import(process.env.PW || 'playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const args = process.argv.slice(2);
const targets = args.length ? args : ['v1', 'v2', 'v3', 'v4', 'v5'].map((v) => `${v}/th/index`);
const sizes = [['desktop', 1440, 900], ['mobile', 390, 844]];
const browser = await chromium.launch();
const report = [];
for (const tgt of targets) for (const [name, w, hgt] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: hgt }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('requestfailed', (r) => errors.push('FAILED ' + r.url()));
  page.on('response', (r) => r.status() >= 400 && errors.push(r.status() + ' ' + r.url()));
  await page.goto(`${BASE}/${tgt}.html`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 100)); } window.scrollTo({ top: 0, behavior: 'instant' }); });
  await page.waitForTimeout(1500);
  const qa = await page.evaluate(() => {
    const vis = [...document.images].filter((i) => i.offsetParent !== null);
    return {
      images: vis.length,
      broken: vis.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      notLoaded: vis.filter((i) => !i.complete).length,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1 ? document.documentElement.scrollWidth : false,
      products: document.querySelectorAll('.tk-card').length,
      thaiFontsLoaded: [...document.fonts].filter((f) => f.status === 'loaded' && /Thai|Sarabun|Prompt|Kanit|Trirong|Anuphan|Chakra|Mitr|Bai Jam/i.test(f.family)).map((f) => f.family).filter((v, i, a) => a.indexOf(v) === i),
    };
  });
  const dir = `screenshots/${tgt.split('/')[0]}`; fs.mkdirSync(dir, { recursive: true });
  const file = `${dir}/${tgt.split('/').slice(1).join('-') || 'chooser'}-${name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  report.push({ page: tgt, size: name, file, ...qa, errors });
  await ctx.close();
}
await browser.close();
fs.mkdirSync('screenshots', { recursive: true });
fs.writeFileSync('screenshots/qa-report.json', JSON.stringify(report, null, 2));
for (const r of report) console.log(r.page, r.size, 'imgs', r.images, 'broken', r.broken.length, 'overflowX', r.overflowX, 'cards', r.products, 'thai', r.thaiFontsLoaded.join('/'), 'errors', r.errors.length, r.errors.slice(0, 2).join(' | '));

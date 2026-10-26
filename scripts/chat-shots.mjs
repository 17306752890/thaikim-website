// Screenshots + QA for the chat demo: (a) auto-opened greeting, (b) contact form validation, (c) recommendations.
// Usage: PW=/path/to/playwright/index.mjs node scripts/chat-shots.mjs   (server on http://127.0.0.1:4321 serving dist/)
const { chromium } = await import(process.env.PW || 'playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:4321/';
const OUT = new URL('../screenshots/chat/', import.meta.url).pathname;
const MSG = { th: 'อยากได้ลูกไม้สำหรับชุดเดรส สีครีม', en: 'Looking for lace for dresses, cream colour', zh: '想找做连衣裙的蕾丝，米白色' };
const b = await chromium.launch(); const report = [];
for (const [dev, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  for (const v of [1, 2, 3, 4, 5]) {
    const L = 'th';
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: dev === 'mobile', hasTouch: dev === 'mobile' });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    p.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !/fonts\.(googleapis|gstatic)\.com/.test(u)) errs.push('external request ' + u); });
    await p.goto(`${BASE}v${v}/${L}/index.html`, { waitUntil: 'networkidle' });
    await p.waitForSelector('.tkc-panel:not([hidden])', { timeout: 5000 });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    const shot = (s) => p.screenshot({ path: `${OUT}v${v}-${dev}-${s}.png` });
    await shot('a-greeting');
    await p.fill('#tkc-in', MSG[L]); await p.keyboard.press('Enter');
    await p.waitForSelector('.tkc-modal:not([hidden])');
    await p.fill('#tkc-phone', '0812'); await p.click('.tkc-go'); await p.waitForTimeout(250); await p.evaluate(() => { document.querySelector('.tkc-form').scrollTop = 0; });
    await shot('b-form-validation');
    const errText = await p.textContent('#tkc-e-phone');
    await p.fill('#tkc-phone', '081 234 5678'); await p.fill('#tkc-name', 'คุณมิน');
    await p.click('.tkc-chips .tkc-chip'); await p.fill('#tkc-intro', 'ร้านตัดชุดเดรส ย่านประตูน้ำ');
    await p.click('.tkc-go');
    await p.waitForSelector('.tkc-recs .tkc-card'); await p.waitForTimeout(1200);
    await p.evaluate(() => { const lg = document.querySelector('.tkc-log'); const r = [...document.querySelectorAll('.tkc-recs')].pop().parentElement; lg.scrollTop = r.offsetTop - 8; });
    await p.waitForTimeout(300); await shot('c-recommendations');
    const st = await p.evaluate(() => {
      const rec = JSON.parse(localStorage.getItem('tk-chat-v1'));
      const pan = document.querySelector('.tkc-panel').getBoundingClientRect();
      const bar = document.querySelector('.bar'); const bb = bar && bar.getBoundingClientRect();
      return { ovX: document.documentElement.scrollWidth - innerWidth, panelOverflow: pan.right > innerWidth + 1 || pan.left < -1, logOvX: (() => { const l = document.querySelector('.tkc-log'); return l.scrollWidth - l.clientWidth; })(),
        cards: document.querySelectorAll('.tkc-recs .tkc-card').length, contact: rec && rec.contact && rec.contact.phoneE164, msgs: rec && rec.messages.length, recIds: rec && rec.recommendedProductIds.length,
        barCovered: bb ? pan.bottom > bb.top + 1 : null, brokenImg: [...document.querySelectorAll('.tkc img')].filter((i) => i.complete && !i.naturalWidth).length };
    });
    // reload → history restored, panel minimise/restore works
    await p.reload({ waitUntil: 'networkidle' }); await p.waitForSelector('.tkc-log .tkc-m');
    const restored = await p.$$eval('.tkc-log .tkc-m', (n) => n.length);
    await p.click('.tkc-min'); const minimized = await p.isHidden('.tkc-panel'); await p.click('.tkc-launch'); const reopened = await p.isVisible('.tkc-panel');
    const r = { v, dev, errText, ...st, restored, minimized, reopened, errs };
    report.push(r); console.log(JSON.stringify(r));
    await ctx.close();
  }
}
await b.close();
const fs = await import('node:fs'); fs.writeFileSync(OUT + 'chat-qa.json', JSON.stringify(report, null, 1));

// V3 — Thai heritage / silk editorial: warm silk tones, Thai numerals, pha-sin border motifs, Trirong serif
import { C, CATS, CONTACT, esc, h, img, navItems, langLinks, brandMark, lineIcon, contactDl, priceNote, updatedLine } from '../kit.mjs';
const THN = ['๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘'];
const num = (L, i) => (L === 'th' ? THN[i] : String(i + 1).padStart(2, '0'));
const band = '<div class="band" aria-hidden="true"></div>';
export const v = {
  id: 'v3', theme: '#7a1f3d',
  name: { zh: 'V3 泰式丝绸 · 人文杂志风', th: 'V3 ผ้าไหมไทย · สไตล์นิตยสาร' },
  desc: { zh: '暖色丝绸配色、泰文衬线字体、泰式数字与筒裙花边纹样，杂志式排版', th: 'โทนผ้าไหมอบอุ่น ฟอนต์ไทยมีเชิง เลขไทย ลวดลายเชิงผ้าซิ่น จัดหน้าแบบนิตยสาร' },
  fonts: 'family=Trirong:ital,wght@0,400;0,600;0,700;1,400&family=Sarabun:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;1,500',
  header: (L, page) => `<header class="hd" data-header>${band}<div class="wrap mast">
    <div class="lang">${langLinks(L, page)}</div>
    <a class="logo" href="index.html">${brandMark(40)}<span class="lt">Thai Kim Textile</span><span class="ls">${{ th: 'ผ้าแบรนด์ FIVE POINT · กรุงเทพมหานคร', en: 'FIVE POINT FABRICS · BANGKOK', zh: 'FIVE POINT 品牌面料 · 曼谷' }[L]}</span></a>
    <a class="btn btn-line" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon()}<span>LINE</span></a>
    <button class="burger" data-burger aria-label="menu"><span></span><span></span></button></div>
    <nav class="nav"><div class="wrap">${navItems(L, page)}</div></nav></header>`,
  footer: (L) => `<footer class="ft">${band}<div class="wrap ft-in"><div><p class="ft-logo">Thai Kim Textile</p><p>${esc(C[L].lockup)}</p><p class="muted">${h(C[L].legal)} · ${esc(C[L].footerGroup)}</p></div>${contactDl(L)}</div></footer>`,
  pageHead: (L, title, sub) => `<section class="ph"><div class="wrap"><p class="kick">✦ Thai Kim Textile ✦</p><h1>${h(title)}</h1><p class="lead">${h(sub)}</p></div></section>`,
  home: (L) => {
    const T = C[L];
    const t1 = { th: 'เสน่ห์ของผ้า', en: 'The grace of cloth,', zh: '面料之美，' }[L];
    const t2 = { th: 'ที่เปลี่ยนใหม่ทุกสัปดาห์', en: 'renewed every week', zh: '每周常新' }[L];
    return `<main id="main">
<section class="hero"><div class="wrap hero-in">
  <div class="hero-txt"><p class="kick">${{ th: 'ฉบับประจำสัปดาห์', en: 'This week’s edition', zh: '本周刊' }[L]} · <b data-tk="updated"></b></p>
    <h1>${esc(t1)}<br><em>${esc(t2)}</em></h1>
    <p class="drop">${esc(T.about)}</p>
    <div class="cta"><a class="btn btn-main" href="catalog.html?tag=new">${esc(T.nav.new)}</a><a class="btn btn-ghost" href="stock.html">${esc(T.stockTitle)}</a></div></div>
  <figure class="arch"><img src="${img('cat/jacquard.webp')}" alt="" width="600" height="800"><figcaption>${esc(T.cats.jacquard)} · Five Point</figcaption></figure>
  <figure class="arch arch-sm"><img src="${img('cat/lace.webp')}" alt="" width="600" height="800" loading="lazy"></figure>
</div></section>
${band}
<section class="sec"><div class="wrap">
  <div class="sh"><p class="kick">${{ th: 'บทที่ ๑', en: 'Chapter I', zh: '第一章' }[L]}</p><h2>${esc(T.newTitle)}</h2><p class="lead">${esc(T.newSub)}</p></div>
  <div class="mag" data-tk="new" data-limit="5"></div>${priceNote(L)}
</div></section>
<section class="sec sec-cats"><div class="wrap two">
  <div class="sh"><p class="kick">${{ th: 'บทที่ ๒', en: 'Chapter II', zh: '第二章' }[L]}</p><h2>${esc(T.catTitle)}</h2><p class="lead">${esc(T.catalogSub)}</p><a class="btn btn-ghost" href="catalog.html">${esc(T.browse)}</a></div>
  <ol class="index">${CATS.map(([k, f], i) => `<li><a href="catalog.html?cat=${k}"><span class="n">${num(L, i)}</span><span class="t">${esc(T.cats[k])}</span><img src="${img(`cat/${f}.webp`)}" alt="" loading="lazy" width="120" height="160"></a></li>`).join('')}</ol>
</div></section>
<section class="market"><div class="wrap market-in">
  <div class="stamp">${{ th: 'ตลาด<br>ผ้าสต็อก', en: 'Stock<br>market', zh: '库存<br>特价' }[L]}</div>
  <div><p class="kick">${esc(T.stockKicker)}</p><h2>${esc(T.stockTitle)}</h2><p>${esc(T.stockSub)}</p><a class="btn btn-gold" href="stock.html">${esc(T.seeStock)} →</a></div>
  <div class="mk-grid" data-tk="stock" data-limit="3" data-compact></div>
</div></section>
<section class="sec"><div class="wrap two">
  <div><p class="kick">${{ th: 'บทที่ ๓', en: 'Chapter III', zh: '第三章' }[L]}</p><h2>${esc(T.company)} <em>&amp;</em> ${esc(T.brand)}</h2><p class="lead">${esc(T.about)}</p>
    <ul class="who">${T.who.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>
  <ol class="steps">${T.steps.map(([a, b], i) => `<li><span>${num(L, i)}</span><div><h3>${esc(a)}</h3><p>${esc(b)}</p></div></li>`).join('')}</ol>
</div></section>
<section class="sec sec-contact"><div class="wrap two"><div><p class="kick">${{ th: 'เชิญแวะชม', en: 'Visit us', zh: '欢迎来访' }[L]}</p><h2>${esc(T.contactTitle)}</h2><p class="lead">${esc(T.contactSub)}</p><a class="btn btn-line btn-lg" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon(20)} ${esc(T.lineLong)}</a></div>${contactDl(L)}</div></section>
</main>`;
  },
};

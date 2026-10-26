// V1 — Refined premium B2B (navy & gold), evolution of v0.1
import { C, CATS, CONTACT, esc, h, img, navItems, langLinks, brandMark, lineIcon, contactDl, priceNote, updatedLine } from '../kit.mjs';
export const v = {
  id: 'v1', theme: '#1b2d60',
  name: { zh: 'V1 藏青金 · 高端 B2B', th: 'V1 น้ำเงิน-ทอง · B2B พรีเมียม' },
  desc: { zh: '在 v0.1 基础上精修：藏青+金色，色卡扇形首屏，新品紧跟首屏', th: 'ต่อยอดจาก v0.1 โทนน้ำเงินทอง หน้าแรกแบบพัดการ์ดผ้า สินค้าใหม่อยู่ใต้ฮีโร่ทันที' },
  fonts: 'family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=Noto+Serif+Thai:wght@500;600&family=Inter:wght@400;500;600',
  header: (L, page) => `<header class="hd" data-header><div class="wrap hd-in">
    <a class="brand" href="index.html">${brandMark(34)}<span><b>Thai Kim Textile</b><i>FIVE POINT</i></span></a>
    <nav class="nav">${navItems(L, page)}<div class="lang lang-m">${langLinks(L, page)}</div></nav>
    <div class="lang">${langLinks(L, page)}</div>
    <a class="btn btn-line" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon()}<span>${esc(C[L].line)}</span></a>
    <button class="burger" data-burger aria-label="menu"><span></span><span></span></button></div></header>`,
  footer: (L) => `<footer class="ft"><div class="weave"></div><div class="wrap ft-in"><div><div class="brand brand-ft">${brandMark(40)}<span><b>Thai Kim Textile</b><i>FIVE POINT</i></span></div><p>${esc(C[L].lockup)}</p><p class="muted">${h(C[L].legal)} · ${esc(C[L].footerGroup)}</p></div>${contactDl(L)}</div><div class="wrap ft-b">© 2026 Thai Kim Textile Co., Ltd. ${esc(C[L].rights)} · Five Point® [${C[L].tbc}]</div></footer>`,
  pageHead: (L, title, sub) => `<section class="ph"><div class="wrap"><p class="kick">Thai Kim Textile · Five Point</p><h1>${h(title)}</h1><p class="lead">${h(sub)}</p></div></section>`,
  home: (L) => {
    const T = C[L];
    const title = { th: ['ผ้าใหม่ทุกสัปดาห์', 'จาก Five Point', 'ถึงกรุงเทพฯ'], en: ['Fresh fabric', 'every week, from', 'Five Point to Bangkok'], zh: ['每周上新', 'Five Point 面料', '直达曼谷'] }[L];
    return `<main id="main">
<section class="hero"><div class="weave-bg"></div><div class="wrap hero-in">
  <div><p class="kick reveal">${esc(T.lockup)}</p>
  <h1 class="hero-t">${title.map((x, i) => `<span class="ln" style="--i:${i}"><span>${esc(x)}</span></span>`).join('')}</h1>
  <p class="lead reveal">${esc(T.about)}</p>
  <div class="cta reveal"><a class="btn btn-main" href="catalog.html?tag=new">${esc(T.nav.new)} →</a><a class="btn btn-ghost" href="stock.html">${esc(T.stockTitle)}</a></div></div>
  <div class="fan">${['lace', 'jacquard', 'satin'].map((k, i) => `<figure class="sw s${i}"><img src="${img(`cat/${k}.webp`)}" alt="${esc(T.cats[k])}" width="600" height="800"${i ? ' loading="lazy"' : ''}><figcaption>${esc(T.cats[k])}</figcaption></figure>`).join('')}</div>
</div></section>
<section class="sec sec-new"><div class="wrap">
  <div class="sh"><div><p class="kick">NEW THIS WEEK · <span data-tk="count-new"></span></p><h2>${esc(T.newTitle)}</h2><p class="lead">${esc(T.newSub)}</p></div><div class="sh-r">${updatedLine(L)}<a class="btn btn-ghost" href="catalog.html">${esc(T.browse)}</a></div></div>
  <div class="rail" data-tk="new" data-limit="8"></div>${priceNote(L)}
</div></section>
<section class="sec"><div class="wrap"><div class="sh"><div><p class="kick">COLLECTIONS</p><h2>${esc(T.catTitle)}</h2></div></div>
  <div class="tiles">${CATS.map(([k, f], i) => `<a class="tile reveal" href="catalog.html?cat=${k}"><img src="${img(`cat/${f}.webp`)}" alt="" loading="lazy" width="600" height="800"><span><b>${esc(T.cats[k])}</b><small>0${i + 1}</small></span></a>`).join('')}</div></div></section>
<section class="stockband"><div class="wrap sb-in"><div><p class="kick">${esc(T.stockKicker)}</p><h2>${esc(T.stockTitle)}</h2><p>${esc(T.stockSub)}</p><a class="btn btn-gold" href="stock.html">${esc(T.seeStock)} →</a></div><div class="sb-grid" data-tk="stock" data-limit="3" data-compact></div></div></section>
<section class="sec sec-steps"><div class="wrap"><ol class="steps">${T.steps.map(([a, b], i) => `<li class="reveal"><span>0${i + 1}</span><h3>${esc(a)}</h3><p>${esc(b)}</p></li>`).join('')}</ol></div></section>
<section class="sec sec-about"><div class="wrap two"><div><p class="kick">ABOUT</p><h2>${esc(T.company)} × ${esc(T.brand)}</h2><p class="lead">${esc(T.about)}</p></div><div class="stats">${T.stats.map(([n, l]) => `<div><b>${n}</b><span>${h(l)}</span></div>`).join('')}</div></div></section>
<section class="sec sec-contact"><div class="wrap two"><div><p class="kick">CONTACT</p><h2>${esc(T.contactTitle)}</h2><p class="lead">${esc(T.contactSub)}</p><a class="btn btn-line btn-lg" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon(20)} ${esc(T.lineLong)}</a></div>${contactDl(L)}</div></section>
</main>`;
  },
};

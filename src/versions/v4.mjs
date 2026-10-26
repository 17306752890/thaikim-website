// V4 — bold fashion lookbook: black/white + hot pink, Kanit display, full-bleed imagery, marquee & motion
import { C, CATS, CONTACT, esc, h, img, navItems, langLinks, brandMark, lineIcon, contactDl, priceNote } from '../kit.mjs';
const marquee = (L) => {
  const T = C[L]; const words = CATS.map(([k]) => T.cats[k]);
  const row = words.map((w) => `<span>${esc(w)}</span><i>✳</i>`).join('');
  return `<div class="mq" aria-hidden="true"><div class="mq-in">${row}${row}</div></div>`;
};
export const v = {
  id: 'v4', theme: '#0b0b0b',
  name: { zh: 'V4 时装大片 · Lookbook 风', th: 'V4 แฟชั่นลุคบุ๊ก · โมเดิร์นจัดเต็ม' },
  desc: { zh: '黑白配荧光粉、超大字体与满屏大图、跑马灯与滚动动效，像时装品牌官网', th: 'ขาวดำตัดชมพูนีออน ตัวอักษรใหญ่ ภาพเต็มจอ แถบวิ่งและแอนิเมชัน แบบเว็บแบรนด์แฟชั่น' },
  fonts: 'family=Kanit:ital,wght@0,300;0,400;0,600;0,800;1,800&family=Noto+Sans+SC:wght@400;700;900',
  header: (L, page) => `<header class="hd" data-header><div class="hd-in">
    <a class="logo" href="index.html">${brandMark(30)}<span><b>THAI KIM</b> TEXTILE</span></a>
    <nav class="nav">${navItems(L, page)}</nav>
    <div class="hd-r"><div class="lang">${langLinks(L, page)}</div><a class="btn btn-line" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon()}<span>LINE</span></a>
    <button class="burger" data-burger aria-label="menu"><span></span><span></span></button></div></div></header>`,
  footer: (L) => `<footer class="ft"><div class="ft-big">THAI KIM<br><span>TEXTILE</span></div><div class="ft-in"><div><p>${esc(C[L].lockup)}</p><p class="muted">${h(C[L].legal)} · ${esc(C[L].footerGroup)}</p></div>${contactDl(L)}</div></footer>`,
  pageHead: (L, title, sub) => `<section class="ph"><h1>${h(title)}</h1><p class="lead">${h(sub)}</p></section>${marquee(L)}`,
  home: (L) => {
    const T = C[L];
    const big = { th: ['ผ้าใหม่', 'ทุกสัปดาห์'], en: ['NEW CLOTH', 'EVERY WEEK'], zh: ['每周', '新面料'] }[L];
    return `<main id="main">
<section class="hero">
  <div class="hero-txt"><p class="tag">DROP · <span data-tk="updated"></span> · <span data-tk="count-new"></span> NEW</p>
    <h1><span>${esc(big[0])}</span><span class="pk">${esc(big[1])}</span></h1>
    <p class="lead">${esc(T.lockup)}</p>
    <div class="cta"><a class="btn btn-pk" href="catalog.html?tag=new">${esc(T.nav.new)} ↗</a><a class="btn btn-wt" href="stock.html">${esc(T.stockTitle)}</a></div></div>
  <figure class="hero-img"><img src="${img('brand/lookbook.webp')}" alt="Five Point lookbook" width="1024" height="1536"><figcaption>FIVE POINT · LOOKBOOK</figcaption></figure>
</section>
${marquee(L)}
<section class="drop"><div class="sh"><h2>${esc(T.newTitle)}</h2><p class="lead">${esc(T.newSub)}</p><a class="lnk" href="catalog.html">${esc(T.browse)} →</a></div>
  <div class="snap" data-tk="new" data-limit="8"></div><div class="pn">${priceNote(L)}</div></section>
<section class="mosaic">${CATS.map(([k, f], i) => `<a class="tile t${i} reveal" href="catalog.html?cat=${k}"><img src="${img(`cat/${f}.webp`)}" alt="" loading="lazy" width="600" height="800"><span>${esc(T.cats[k])}</span></a>`).join('')}</section>
<section class="sale"><div class="sale-in"><div class="sale-h"><p class="tag">${esc(T.stockKicker)} · <span data-tk="count-clear"></span></p><h2>${esc(T.stockTitle)}</h2><p>${esc(T.stockSub)}</p><a class="btn btn-bk" href="stock.html">${esc(T.seeStock)} ↗</a></div>
  <div class="sale-grid" data-tk="stock" data-limit="4" data-compact></div></div></section>
<section class="how"><div class="how-in">${T.steps.map(([a, b], i) => `<div class="st reveal"><b>0${i + 1}</b><h3>${esc(a)}</h3><p>${esc(b)}</p></div>`).join('')}</div></section>
<section class="cta-big"><h2>${{ th: 'มีรูปผ้าในใจ?<br>ส่งมาทาง LINE', en: 'Got a fabric in mind?<br>Send it on LINE', zh: '心里有想要的面料？<br>LINE 发图给我们' }[L]}</h2><a class="btn btn-line btn-xl" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon(24)} @thaikimtextile</a><p class="muted">${esc(T.address)}</p></section>
</main>`;
  },
};

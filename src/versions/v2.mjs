// V2 — Catalogue-first B2B shop (structure borrowed from the inventory platform: search → filters → grid, curated "new" & "stock" placements)
import { C, CATS, CONTACT, esc, h, img, navItems, langLinks, brandMark, lineIcon, contactDl, priceNote, updatedLine } from '../kit.mjs';
const Q = { th: 'ค้นหารหัสผ้า เช่น FP59143 หรือ ลูกไม้, ลินิน…', en: 'Search a code e.g. FP59143, or lace, linen…', zh: '搜索编号如 FP59143，或 蕾丝、亚麻…' };
export const v = {
  id: 'v2', theme: '#0f5c5a', catalogLayout: 'side',
  name: { zh: 'V2 目录优先 · 库存平台式', th: 'V2 แคตตาล็อกก่อน · แบบแพลตฟอร์มสต็อก' },
  desc: { zh: '参照库存平台结构：大搜索框 + 左侧筛选 + 商品网格，首页直接选布，库存特价醒目', th: 'ช่องค้นหาใหญ่ ตัวกรองด้านซ้าย กริดสินค้า เลือกผ้าได้ตั้งแต่หน้าแรก ช่องผ้าสต็อกเด่นชัด' },
  fonts: 'family=Anuphan:wght@400;500;600;700&family=Inter:wght@400;500;600;700',
  header: (L, page) => `<div class="util"><div class="wrap util-in"><span>${esc(C[L].lockup)}</span><span class="util-r"><a href="tel:${CONTACT.phoneIntl}">☎ ${CONTACT.phone}</a> <mark class="tbc">${C[L].tbc}</mark><span class="lang">${langLinks(L, page)}</span></span></div></div>
  <header class="hd" data-header><div class="wrap hd-in">
    <a class="brand" href="index.html">${brandMark(36)}<span><b>Thai Kim Textile</b><i>by Five Point</i></span></a>
    <form class="search" action="catalog.html"><input name="q" type="search" placeholder="${esc(Q[L])}" aria-label="search"><button aria-label="search">⌕</button></form>
    <a class="btn btn-line" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon()}<span>${esc(C[L].line)}</span></a>
    <button class="burger" data-burger aria-label="menu"><span></span><span></span></button></div>
    <nav class="catnav"><div class="wrap catnav-in">${navItems(L, page, ['index', 'new', 'catalog', 'stock', 'contact'])}<span class="sep"></span>${CATS.map(([k]) => `<a href="catalog.html?cat=${k}" class="cn">${esc(C[L].cats[k])}</a>`).join('')}</div></nav></header>`,
  footer: (L) => `<footer class="ft"><div class="wrap ft-in"><div class="brand">${brandMark(32)}<span><b>Thai Kim Textile</b><i>by Five Point</i></span></div><p>${h(C[L].legal)} · ${esc(C[L].footerGroup)}</p>${contactDl(L)}</div><div class="wrap ft-b">© 2026 Thai Kim Textile · Five Point</div></footer>`,
  pageHead: (L, title, sub) => `<section class="ph"><div class="wrap"><nav class="crumb"><a href="index.html">${esc(C[L].nav.index)}</a> / ${esc(title)}</nav><h1>${h(title)}</h1><p>${h(sub)}</p></div></section>`,
  home: (L) => {
    const T = C[L];
    return `<main id="main">
<section class="wrap top">
  <div class="cats">${CATS.map(([k, f]) => `<a href="catalog.html?cat=${k}"><img src="${img(`cat/${f}.webp`)}" alt="" loading="lazy" width="120" height="120"><span>${esc(T.cats[k])}</span></a>`).join('')}</div>
  <div class="promo">
    <div class="box box-new"><div class="box-h"><div><span class="pill pill-new">NEW</span><h2>${esc(T.newTitle)}</h2><p>${esc(T.newSub)}</p></div>${updatedLine(L)}</div><div class="rail" data-tk="new" data-limit="4" data-compact></div></div>
    <aside class="side">
      <a class="box box-stock" href="stock.html"><span class="pill pill-clear">SALE</span><h2>${esc(T.stockTitle)}</h2><p>${esc(T.stockSub)}</p><b class="big"><span data-tk="count-clear"></span> ${{ th: 'รายการ', en: 'items', zh: '款' }[L]} →</b></a>
      <div class="box box-price"><h3>฿ ${{ th: 'นโยบายราคา', en: 'Pricing', zh: '价格说明' }[L]}</h3><p>${h(T.priceNote)}</p><a class="btn btn-line" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon()} ${esc(T.quote)}</a></div>
      <div class="box box-steps"><ol>${T.steps.map(([a]) => `<li>${esc(a)}</li>`).join('')}</ol></div>
    </aside>
  </div>
</section>
<section class="wrap block"><div class="block-h"><h2>${esc(T.catalogTitle)} · <span data-tk="count-all"></span></h2><p>${esc(T.catalogSub)}</p></div><div data-tk="catalog" data-layout="side"></div></section>
<section class="wrap block stockrow"><div class="block-h"><h2><span class="pill pill-clear">SALE</span> ${esc(T.stockTitle)}</h2><a href="stock.html">${esc(T.seeStock)} →</a></div><div data-tk="stock" data-limit="4" data-compact></div></section>
<section class="wrap block trust"><div><h3>${esc(T.company)} × ${esc(T.brand)}</h3><p>${esc(T.about)}</p></div><div class="stats">${T.stats.map(([n, l]) => `<div><b>${n}</b><span>${h(l)}</span></div>`).join('')}</div></section>
</main>`;
  },
};

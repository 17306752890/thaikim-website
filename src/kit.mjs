import { C, LANGS, CONTACT, CATS } from './common.mjs';
export { C, LANGS, CONTACT, CATS };
export const PAGES = ['index', 'catalog', 'stock', 'contact'];
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TBC = /\[([^\]]*(?:รอยืนยัน|to confirm|待确认)[^\]]*)\]/g;
export const h = (s) => esc(s).replace(TBC, '<mark class="tbc">$1</mark>');
export const tbc = (L) => `<mark class="tbc">${esc(C[L].tbc)}</mark>`;
export const SH = '../../shared/';
export const img = (p) => `${SH}img/${p}`;
export const lineIcon = (s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.6 1.1-.5 6-3.5 8.2-6.1C21.6 14.3 22 12.7 22 11c0-4.4-4.5-8-10-8Z"/></svg>`;
export const navHref = (p) => (p === 'new' ? 'catalog.html?tag=new' : `${p}.html`);
export const navItems = (L, page, keys = ['index', 'new', 'catalog', 'stock', 'contact']) =>
  keys.map((k) => `<a href="${navHref(k)}"${k === page ? ' aria-current="page"' : ''} class="nav-${k}">${esc(C[L].nav[k])}</a>`).join('');
export const langLinks = (L, page) => LANGS.map((l) => `<a href="../${l}/${page}.html" data-setlang="${l}" lang="${C[l].htmlLang}"${l === L ? ' aria-current="true"' : ''}>${C[l].short}</a>`).join('');
export const draftBar = (L) => `<div class="draftbar" role="note">${h(C[L].draft)}</div>`;
export const brandMark = (s = 34) => `<img src="${img('brand/fp-mark.png')}" alt="Five Point" width="${s}" height="${Math.round(s * 1.04)}">`;

export function head(v, L, page) {
  const T = C[L];
  const title = page === 'index' ? `${T.company} · ${T.brand} | ${T.nav.index}` : `${T.nav[page]} | ${T.company} · ${T.brand}`;
  return `<!doctype html>
<html lang="${T.htmlLang}" data-lang="${L}" data-shared="${SH}" data-version="${v.id}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(T.metaDesc)}">
<meta name="robots" content="noindex, nofollow"><!-- DRAFT: remove before launch -->
<meta name="theme-color" content="${v.theme}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${C[l].htmlLang}" href="../${l}/${page}.html">`).join('')}
<link rel="icon" href="${img('brand/favicon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${v.fonts}${L === 'zh' ? '&family=Noto+Sans+SC:wght@400;500;700' : ''}&display=swap">
<link rel="stylesheet" href="${SH}css/tk.css">
<link rel="stylesheet" href="${SH}css/tk-chat.css">
<link rel="stylesheet" href="../style.css">
<script defer src="${SH}js/tk.js"></script>
<script defer src="${SH}js/tk-chat.js"></script>
</head>`;
}

export const contactDl = (L) => {
  const T = C[L];
  return `<dl class="cdl">
  <div><dt>📍</dt><dd>${esc(T.address)}<br><small>${esc(T.transit)}</small></dd></div>
  <div><dt>LINE</dt><dd><a href="${CONTACT.lineUrl}" target="_blank" rel="noopener">@${CONTACT.line}</a></dd></div>
  <div><dt>${esc(T.phoneL)}</dt><dd><a href="tel:${CONTACT.phoneIntl}">${CONTACT.phone}</a> ${tbc(L)}</dd></div>
  <div><dt>${esc(T.emailL)}</dt><dd>${tbc(L)}</dd></div>
  <div><dt>${esc(T.hoursL)}</dt><dd>${tbc(L)}</dd></div>
  <div><dt>${esc(T.socialL)}</dt><dd><a href="${CONTACT.facebook}" target="_blank" rel="noopener">Facebook</a> · <a href="${CONTACT.instagram}" target="_blank" rel="noopener">Instagram</a></dd></div>
</dl>`;
};

export const intentForm = (L) => {
  const F = C[L].form;
  return `<form class="tk-form" data-tk-intent novalidate>
  <div class="row2"><label>${esc(F.name)}<input name="name" autocomplete="name"></label><label>${esc(F.company)}<input name="company" autocomplete="organization"></label></div>
  <label>${esc(F.phone)}<input name="phone" autocomplete="tel"></label>
  <label>${esc(F.type)}<select name="type">${F.types.map((x) => `<option>${esc(x)}</option>`).join('')}</select></label>
  <label>${esc(F.need)}<textarea name="need" rows="4" placeholder="${esc(F.needPh)}"></textarea></label>
  <button class="btn btn-main" type="submit">${esc(F.submit)}</button>
  <div class="tk-out" data-intent-out hidden></div>
</form>`;
};

export const stockRules = (L) => `<ul class="stock-rules">${C[L].stockRules.map((r) => `<li>${h(r)}</li>`).join('')}</ul><p class="stock-demo">${h(C[L].stockDemo)}</p>`;
export const priceNote = (L) => `<p class="price-note">${h(C[L].priceNote)} · <a href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${esc(C[L].quote)} →</a></p>`;
export const updatedLine = (L) => `<span class="updated">${esc(C[L].updated)}: <b data-tk="updated"></b></span>`;

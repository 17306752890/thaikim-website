// Builds all 5 site versions + a root chooser into dist/. Zero dependencies. Usage: node scripts/build.mjs
// Everything uses RELATIVE paths, so dist/ works at https://<user>.github.io/<repo>/ or any sub-path.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, LANGS, PAGES, esc, h, head, draftBar, stockRules, priceNote, updatedLine, intentForm, contactDl, CONTACT, lineIcon } from '../src/kit.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'dist');
const IDS = ['v1', 'v2', 'v3', 'v4', 'v5'];
const versions = [];
for (const id of IDS) {
  const f = path.join(root, `src/versions/${id}.mjs`);
  if (fs.existsSync(f)) versions.push((await import(f)).v);
}

function inner(v, L, page) {
  const T = C[L];
  const wrap = (title, sub, body) => `<main id="main">${v.pageHead(L, title, sub)}<section class="page"><div class="wrap">${body}</div></section></main>`;
  if (page === 'catalog') return wrap(T.catalogTitle, T.catalogSub, `
    <div class="sh"><div><h2>${esc(T.newTitle)}</h2><p class="lead">${esc(T.newSub)}</p></div>${updatedLine(L)}</div>
    <div class="rail" data-tk="new" data-limit="4" data-compact></div>
    <div data-tk="catalog" data-layout="${v.catalogLayout || 'side'}"></div>${priceNote(L)}`);
  if (page === 'stock') return wrap(T.stockTitle, T.stockSub, `${stockRules(L)}<div data-tk="stock"></div>${priceNote(L)}`);
  if (page === 'contact') return wrap(T.contactTitle, T.contactSub, `<div class="contact-grid"><div>${intentForm(L)}</div><div>${contactDl(L)}<a class="btn btn-line btn-lg" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon(20)} ${esc(T.lineLong)}</a></div></div>`);
}

fs.mkdirSync(OUT, { recursive: true }); for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true }); // keep dir so a running dev server survives
fs.cpSync(path.join(root, 'site'), OUT, { recursive: true });
let n = 0;
for (const v of versions) {
  const vdir = path.join(OUT, v.id);
  fs.mkdirSync(vdir, { recursive: true });
  fs.copyFileSync(path.join(root, `src/css/${v.id}.css`), path.join(vdir, 'style.css'));
  for (const L of LANGS) {
    fs.mkdirSync(path.join(vdir, L), { recursive: true });
    for (const page of PAGES) {
      const body = page === 'index' ? v.home(L) : (v.inner ? v.inner(L, page) : null) || inner(v, L, page);
      const html = `${head(v, L, page)}
<body class="${v.id} p-${page}">
<a class="skip" href="#main">Skip</a>
${draftBar(L)}
${v.header(L, page)}
${body}
${v.footer(L)}
${v.extra ? v.extra(L, page) : ''}
</body></html>`;
      fs.writeFileSync(path.join(vdir, L, `${page}.html`), html);
      n++;
    }
  }
  // version root -> Thai by default (or remembered language)
  fs.writeFileSync(path.join(vdir, 'index.html'), `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=th/index.html"><script>try{var l=localStorage.getItem('tk-lang');if(l&&/^(th|en|zh)$/.test(l))location.replace(l+'/index.html')}catch(e){}</script><a href="th/index.html">Thai Kim Textile</a>`);
}

// ---------- root chooser (Chinese + Thai) ----------
const cards = versions.map((v, i) => `
  <div class="card">
    <div class="thumb"><img src="shared/img/thumbs/${v.id}.webp" alt="${esc(v.name.zh)}" loading="${i < 2 ? 'eager' : 'lazy'}" width="720" height="450" onerror="this.style.display='none'"></div>
    <div class="meta"><span class="no">0${i + 1}</span><h2><a class="main" href="${v.id}/th/index.html">${esc(v.name.zh)}</a></h2><h3 lang="th">${esc(v.name.th)}</h3>
    <p>${esc(v.desc.zh)}</p><p lang="th" class="th">${esc(v.desc.th)}</p>
    <span class="langs"><a href="${v.id}/th/index.html">ไทย</a> · <a href="${v.id}/en/index.html">EN</a> · <a href="${v.id}/zh/index.html">中文</a></span></div>
  </div>`).join('');
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Thai Kim Textile · Five Point — 官网方案选择 / เลือกแบบเว็บไซต์</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="shared/img/brand/favicon.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600&family=Noto+Sans+SC:wght@400;600;700&display=swap">
<style>
*{box-sizing:border-box}body{margin:0;font-family:"Noto Sans SC","IBM Plex Sans Thai",system-ui,sans-serif;background:#f4f1ea;color:#16181d}
header{max-width:1200px;margin:auto;padding:40px 20px 10px;display:flex;gap:16px;align-items:center}header img{width:46px}
h1{margin:0;font-size:clamp(1.5rem,3vw,2.2rem)}.sub{color:#5d6272;margin:6px 0 0}.th{font-family:"IBM Plex Sans Thai",sans-serif}
.note{max-width:1200px;margin:10px auto 0;padding:0 20px;color:#7a5200;font-size:.9rem}
.grid{max-width:1200px;margin:auto;padding:24px 20px 60px;display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:22px}
.card{position:relative;display:flex;flex-direction:column;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:18px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .3s,box-shadow .3s}
.card:hover{transform:translateY(-4px);box-shadow:0 20px 40px -26px rgba(0,0,0,.4)}
.thumb{aspect-ratio:16/10;background:#e9e4d8;overflow:hidden}.thumb img{width:100%;height:100%;object-fit:cover;object-position:top}
.meta{padding:16px 18px 18px}.no{font-weight:700;color:#c99343}.meta h2{margin:2px 0;font-size:1.15rem}.meta h3{margin:0 0 8px;font:600 .95rem "IBM Plex Sans Thai",sans-serif;color:#5d6272}
.meta p{margin:4px 0;font-size:.9rem;color:#3d414c}.langs{display:block;margin-top:10px;font-size:.85rem}.langs a{color:#1b2d60;font-weight:600;position:relative;z-index:2}.main{color:inherit;text-decoration:none}.main::after{content:"";position:absolute;inset:0;z-index:1}
footer{text-align:center;color:#8f8c84;font-size:.8rem;padding:0 20px 40px}
</style></head><body>
<header><img src="shared/img/brand/fp-mark.png" alt="Five Point"><div><h1>Thai Kim Textile · Five Point 官网方案（5 版）</h1><p class="sub">请选择一个版本查看 · <span class="th">เลือกแบบเว็บไซต์ที่ต้องการดู (5 แบบ)</span></p></div></header>
<p class="note">草稿，仅供内部评审；黄色 [待确认 / รอยืนยัน] 为待确认信息，价格均为占位。 · <span class="th">ร่างสำหรับรีวิวภายใน ราคาเป็นตัวอย่าง</span></p>
<div class="grid">${cards}</div>
<footer>五个版本共用同一份产品数据 shared/data/products.json · <span class="th">ทุกแบบใช้ข้อมูลสินค้าชุดเดียวกัน</span></footer>
</body></html>`);
fs.writeFileSync(path.join(OUT, '404.html'), '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>404</title><p style="font-family:sans-serif;padding:40px">404 · <a href="./">Thai Kim Textile</a></p>');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`built ${versions.length} versions, ${n} pages -> dist/`);

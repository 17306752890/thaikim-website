// V5 — minimal, mobile-first, LINE-first for Thai SMEs & garment shops: app-like single column, sticky LINE bar
import { C, CONTACT, esc, h, img, navItems, langLinks, brandMark, lineIcon, contactDl, priceNote } from '../kit.mjs';
const ic = {
  new: '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.9H22l-6 4.4 2.3 7L12 16l-6.3 4.3 2.3-7-6-4.4h7.6z"/></svg>',
  cat: '<svg viewBox="0 0 24 24"><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/></svg>',
  stock: '<svg viewBox="0 0 24 24"><path d="M21 12l-9 9-9-9V3h9zM7.5 9A1.5 1.5 0 107.5 6a1.5 1.5 0 000 3z"/></svg>',
  sample: '<svg viewBox="0 0 24 24"><path d="M4 4h16v4H4zM5 10h14v10H5zm4 3v2h6v-2z"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
};
export const v = {
  id: 'v5', theme: '#06c755', catalogLayout: 'top',
  name: { zh: 'V5 极简 · 手机优先 / LINE 优先', th: 'V5 มินิมอล · มือถือก่อน / LINE ก่อน' },
  desc: { zh: '为泰国中小商家和制衣店设计：单栏 App 式页面、底部常驻 LINE 按钮、快速入口，手机上最好用', th: 'สำหรับร้านผ้าและโรงงานตัดเย็บ SME: หน้าเดียวแบบแอป ปุ่ม LINE ติดล่างจอ ทางลัดใหญ่ ใช้บนมือถือง่ายที่สุด' },
  fonts: 'family=Prompt:wght@400;500;600&family=Sarabun:wght@400;500;600&family=Noto+Sans+SC:wght@400;600',
  header: (L, page) => `<header class="hd" data-header><a class="logo" href="index.html">${brandMark(28)}<span><b>Thai Kim Textile</b><small>by Five Point</small></span></a>
    <div class="lang">${langLinks(L, page)}</div><button class="burger" data-burger aria-label="menu"><span></span><span></span><span></span></button>
    <nav class="nav">${navItems(L, page)}</nav></header>`,
  footer: (L) => `<footer class="ft"><p><b>Thai Kim Textile</b> · ${esc(C[L].brand)}</p><p>${h(C[L].legal)}</p><p class="muted">${esc(C[L].footerGroup)}</p></footer>`,
  extra: (L) => `<div class="bar"><a href="tel:${CONTACT.phoneIntl || ''}">${ic.phone}<span>${{ th: 'โทร', en: 'Call', zh: '电话' }[L]}</span></a><a class="bar-line" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon(22)}<span>${esc(C[L].line)}</span></a><a href="stock.html">${ic.stock}<span>${{ th: 'สต็อก', en: 'Stock', zh: '库存' }[L]}</span></a></div>
  <aside class="side"><div class="side-in">${brandMark(56)}<h2>Thai Kim Textile</h2><p>${esc(C[L].lockup)}</p><div class="qr" aria-label="LINE QR">${{ th: 'QR LINE OA<br>[รอยืนยัน]', en: 'LINE OA QR<br>[to confirm]', zh: 'LINE 官方号二维码<br>[待确认]' }[L]}</div><p class="muted">${{ th: 'เว็บนี้ออกแบบสำหรับมือถือ — สแกนเพื่อเปิดบนโทรศัพท์', en: 'Designed for phones — scan to open on mobile', zh: '本版为手机设计 — 扫码在手机打开' }[L]}</p></div></aside>`,
  pageHead: (L, title, sub) => `<section class="ph"><h1>${h(title)}</h1><p>${h(sub)}</p></section>`,
  home: (L) => {
    const T = C[L];
    const hi = { th: 'สวัสดีค่ะ 👋', en: 'Hello 👋', zh: 'สวัสดี 👋 你好' }[L];
    const q = { th: 'หาผ้าอะไรอยู่คะ?', en: 'What fabric are you looking for?', zh: '想找什么面料？' }[L];
    const acts = [['new', 'catalog.html?tag=new', T.nav.new], ['cat', 'catalog.html', T.nav.catalog], ['stock', 'stock.html', T.stockTitle], ['sample', 'contact.html', { th: 'ขอผ้าตัวอย่าง', en: 'Request samples', zh: '索取米样' }[L]]];
    const faq = [
      [{ th: 'ดูราคาได้ไหม?', en: 'Can I see prices?', zh: '能看价格吗？' }[L], T.priceNote],
      [{ th: 'สั่งขั้นต่ำเท่าไร?', en: 'Minimum order?', zh: '起订量多少？' }[L], { th: 'ขึ้นกับรุ่นผ้า [รอยืนยัน] — ถามทีมขายทาง LINE', en: 'Depends on the fabric [to confirm] — ask our team on LINE', zh: '视面料而定 [待确认] — 请 LINE 咨询销售' }[L]],
      [{ th: 'ส่งตัวอย่างกี่วัน?', en: 'How fast are samples?', zh: '米样几天到？' }[L], { th: '[รอยืนยัน] ระยะเวลาจัดส่งผ้าตัวอย่าง', en: '[to confirm] sample lead time', zh: '[待确认] 米样寄送时效' }[L]],
      [{ th: 'มาดูผ้าที่ออฟฟิศได้ไหม?', en: 'Can I visit?', zh: '可以到办公室看布吗？' }[L], `${T.address} · ${{ th: 'กรุณานัดล่วงหน้า [รอยืนยัน]', en: 'please book ahead [to confirm]', zh: '请提前预约 [待确认]' }[L]}`],
    ];
    return `<main id="main">
<section class="hello"><p class="hi">${esc(hi)}</p><h1>${esc(q)}</h1>
  <form class="search" action="catalog.html" role="search"><input name="q" type="search" placeholder="${{ th: 'เช่น ลูกไม้ ลินิน FP59143', en: 'e.g. lace, linen, FP59143', zh: '如 蕾丝、亚麻、FP59143' }[L]}"><button aria-label="search">→</button></form>
  <a class="line-hero" href="${CONTACT.lineUrl}" target="_blank" rel="noopener">${lineIcon(28)}<span><b>${{ th: 'ส่งรูปผ้าทาง LINE', en: 'Send a fabric photo on LINE', zh: 'LINE 发面料图' }[L]}</b><small>${{ th: 'ทีมงานช่วยหาผ้าที่ใกล้เคียงให้', en: 'Our team finds the closest match', zh: '团队帮你找相近面料' }[L]}</small></span><i>›</i></a></section>
<nav class="acts">${acts.map(([k, href, t]) => `<a href="${href}"><span class="ico ico-${k}">${ic[k]}</span>${esc(t)}</a>`).join('')}</nav>
<section class="blk"><div class="bh"><h2>${esc(T.newTitle)}</h2><a href="catalog.html?tag=new">${esc(T.browse)} ›</a></div><p class="sub">${esc(T.newSub)}</p>
  <div class="list" data-tk="new" data-limit="6" data-compact></div>${priceNote(L)}</section>
<section class="blk blk-stock"><div class="bh"><h2>🔥 ${esc(T.stockTitle)} <small data-tk="count-clear"></small></h2><a href="stock.html">${esc(T.seeStock)} ›</a></div><p class="sub">${esc(T.stockSub)}</p>
  <div class="list" data-tk="stock" data-limit="3" data-compact></div></section>
<section class="blk"><h2>${{ th: 'สั่งผ้ากับเรา ง่าย ๆ', en: 'How ordering works', zh: '下单很简单' }[L]}</h2><ol class="steps">${T.steps.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ol></section>
<section class="blk"><h2>${{ th: 'คำถามที่พบบ่อย', en: 'FAQ', zh: '常见问题' }[L]}</h2>${faq.map(([a, b], i) => `<details${i ? '' : ' open'}><summary>${esc(a)}</summary><p>${h(b)}</p></details>`).join('')}</section>
<section class="blk"><h2>${esc(T.contactTitle)}</h2>${contactDl(L)}</section>
</main>`;
  },
};

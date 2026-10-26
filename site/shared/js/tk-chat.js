/* Thai Kim Textile — "หาผ้ากับเรา / 客户找产品" fabric-matching chat (FRONT-END DEMO ONLY).
 *
 * Shared by all 5 site versions; each version themes it with CSS variables (--tkc-*) in its own style.css.
 *  - No backend, no database, no network calls except reading the local shared/data/products.json.
 *  - Conversation + contact info are kept in this browser's localStorage only (so a reload shows history).
 *  - Production hooks (to be implemented server-side later):
 *      detectRegionByIP()  → today returns 'BKK'; production = IP geolocation
 *      matchProducts()     → today a local keyword/category match; production = 客户找产品 / 产品找客户 search system
 *      saveChatRecord()    → today only writes localStorage; production = POST to the chat-record DB
 *
 * Config (shared/data/products.json → settings.chat), all optional:
 *   { "enabled": true, "autoOpen": true, "autoOpenMobile": true, "reopenAfterMinimize": false, "maxRecs": 4, "demoBadge": true }
 * Per page: <html data-chat="off"> disables it; URL ?chat=off | ?chat=open | ?chat=reset (reset clears demo data).
 */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window;
  if (root.getAttribute('data-chat') === 'off') return;
  var qs = new URLSearchParams(location.search);
  if (qs.get('chat') === 'off') return;

  var L = root.getAttribute('data-lang') || 'th';
  var SHARED = root.getAttribute('data-shared') || '../../shared/';
  var VERSION = root.getAttribute('data-version') || '';
  var PAGE = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  var KEY = 'tk-chat-v1', MINKEY = 'tk-chat-min';

  // ---------------- strings ----------------
  var T = {
    th: {
      title: 'หาผ้ากับเรา', subtitle: 'Thai Kim Textile · Five Point', online: 'ทีมงานพร้อมช่วย',
      demo: 'Demo – ยังไม่เชื่อมฐานข้อมูล', launcher: 'หาผ้ากับเรา', minimize: 'ย่อแชท', reset: 'เริ่มแชทใหม่ (ล้างข้อมูลเดโม)', open: 'เปิดแชทหาผ้า',
      greet: 'สวัสดีค่ะ 👋 ยินดีต้อนรับสู่ Thai Kim Textile (ผ้าแบรนด์ Five Point)\nบอกเราได้เลยว่ากำลังหาผ้าแบบไหน — ประเภทผ้า สี เนื้อสัมผัส ใช้ตัดอะไร หรือส่งรูป / ลิงก์ผ้าตัวอย่างมาได้ค่ะ',
      chips: ['ลูกไม้สำหรับชุดเดรส', 'ลินินตัดเสื้อเชิ้ต', 'ผ้าสูทลายทาง', 'ผ้าสต็อกราคาพิเศษ'],
      placeholder: 'พิมพ์ผ้าที่ต้องการ หรือวางลิงก์…', send: 'ส่ง', attach: 'แนบรูปหรือลิงก์', attachImg: 'แนบรูปภาพ', attachLink: 'วางลิงก์ตัวอย่าง', linkPrompt: 'วางลิงก์ (เช่น รูปจาก Facebook / Shopee / Pinterest):', attached: 'แนบรูป', removeAttach: 'นำออก',
      formTitle: 'ก่อนเริ่มค้นหา ขอข้อมูลติดต่อสักนิดค่ะ', formSub: 'เพื่อให้ทีมขายส่งผลการจับคู่และผ้าตัวอย่างให้คุณได้', req: 'จำเป็น', opt: 'ไม่บังคับ',
      region: 'ภูมิภาค / ประเทศ', otherRegion: 'ระบุประเทศ / เมือง', phone: 'เบอร์มือถือ', name: 'ชื่อที่ให้เราเรียก', intro: 'แนะนำตัวสั้น ๆ', introPh: 'เช่น ชื่อบริษัท ประเภทธุรกิจ ผลิตอะไร จำนวนที่ใช้ต่อเดือน',
      biz: ['โรงงานตัดเย็บ', 'ร้านผ้า', 'แบรนด์แฟชั่น', 'ดีไซเนอร์'], bizLabel: 'ประเภทธุรกิจ (เลือกได้)',
      submit: 'ยืนยันและค้นหาผ้า', back: 'กลับไปที่แชท', privacy: 'ข้อมูลใช้เพื่อติดต่อกลับเรื่องผ้าเท่านั้น · นโยบายความเป็นส่วนตัว (PDPA) [รอยืนยัน]',
      eRegion: 'กรุณาเลือกภูมิภาค', eOther: 'กรุณาระบุประเทศ / เมือง', ePhone: 'กรุณากรอกเบอร์มือถือ', ePhoneBad: 'เบอร์ไม่ถูกต้อง สำหรับ {r} ควรมี {n} หลัก (ไม่ต้องใส่ 0 นำหน้า)', ePhoneOther: 'กรุณาใส่รหัสประเทศ เช่น +65 812 3456',
      thanks: 'ขอบคุณค่ะ{name} 🙏 ได้รับข้อมูลแล้ว ({phone})', searching: 'กำลังค้นหาผ่านระบบจับคู่สินค้า…',
      found: 'พบผ้าที่ใกล้เคียง {n} รายการ{cat} ✨ ราคาที่แสดงเป็นราคาผ้าตัวอย่างต่อเมตร ราคาล็อตใหญ่สอบถามทาง LINE', inCat: ' ในหมวด “{c}”',
      fallback: 'ยังไม่เจอผ้าที่ตรงคำค้นเป๊ะ ๆ ลองดูสินค้าใหม่และสินค้าแนะนำสัปดาห์นี้ก่อนนะคะ ทีมงานจะช่วยหาเพิ่มให้ค่ะ',
      follow: 'อยากได้ผ้าตัวอย่างหรือให้ทีมขายช่วยหาเพิ่ม กดปุ่มใต้การ์ด หรือพิมพ์รายละเอียดเพิ่มได้เลยค่ะ (ขั้นตอนติดต่อกลับ [รอยืนยัน])',
      gotImg: 'ได้รับรูปแล้วค่ะ (เดโม: ยังไม่ได้ค้นหาด้วยรูป จะใช้ข้อความประกอบในการค้นหา)',
      sample: 'ผ้าตัวอย่าง', per: 'เมตร', tbc: 'รอยืนยัน', reqSample: 'ขอผ้าตัวอย่าง', askLine: 'ถามทาง LINE', you: 'คุณ', bot: 'ผู้ช่วย', clearConfirm: 'ล้างประวัติแชทและข้อมูลติดต่อในเครื่องนี้?'
    },
    en: {
      title: 'Find your fabric', subtitle: 'Thai Kim Textile · Five Point', online: 'Our team is here to help',
      demo: 'Demo – not connected to database', launcher: 'Find fabric', minimize: 'Minimise chat', reset: 'New chat (clear demo data)', open: 'Open fabric chat',
      greet: 'Hello 👋 Welcome to Thai Kim Textile (Five Point fabrics).\nTell us what fabric you need — type, colour, hand-feel, what you will make — or send a photo / link of a reference.',
      chips: ['Lace for dresses', 'Linen for shirts', 'Striped suiting', 'Stock deals'],
      placeholder: 'Describe the fabric or paste a link…', send: 'Send', attach: 'Attach image or link', attachImg: 'Attach image', attachLink: 'Paste a reference link', linkPrompt: 'Paste a link (e.g. Facebook / Shopee / Pinterest image):', attached: 'Image attached', removeAttach: 'Remove',
      formTitle: 'Before we search — how can we reach you?', formSub: 'So our sales team can send you the matches and samples', req: 'Required', opt: 'Optional',
      region: 'Region / country', otherRegion: 'Your country / city', phone: 'Mobile number', name: 'How should we address you?', intro: 'About you', introPh: 'e.g. company, business type, what you make, monthly volume',
      biz: ['Garment factory', 'Fabric shop', 'Fashion brand', 'Designer'], bizLabel: 'Business type (optional)',
      submit: 'Confirm & find fabrics', back: 'Back to chat', privacy: 'Used only to follow up on your fabric request · privacy policy (PDPA) [to confirm]',
      eRegion: 'Please choose a region', eOther: 'Please enter your country / city', ePhone: 'Please enter your mobile number', ePhoneBad: 'Invalid number — for {r} it should have {n} digits (drop the leading 0)', ePhoneOther: 'Please include the country code, e.g. +65 812 3456',
      thanks: 'Thank you{name} 🙏 details received ({phone})', searching: 'Matching via our product search system…',
      found: 'Found {n} close matches{cat} ✨ Prices shown are per-metre sample prices; bulk prices on LINE.', inCat: ' in “{c}”',
      fallback: 'No exact match yet — here are this week’s new and featured fabrics while our team keeps looking.',
      follow: 'Want a sample or more options? Use the buttons under each card, or tell us more (follow-up process [to confirm]).',
      gotImg: 'Image received (demo: image search is not connected; we match on your text).',
      sample: 'Sample', per: 'm', tbc: 'to confirm', reqSample: 'Request sample', askLine: 'Ask on LINE', you: 'You', bot: 'Assistant', clearConfirm: 'Clear the chat history and contact details stored on this device?'
    },
    zh: {
      title: '找面料', subtitle: 'Thai Kim Textile · Five Point', online: '团队在线为您服务',
      demo: 'Demo – 未连接数据库', launcher: '找面料', minimize: '收起聊天', reset: '新对话（清除演示数据）', open: '打开找面料聊天',
      greet: '您好 👋 欢迎来到 Thai Kim Textile（Five Point 品牌面料）。\n请描述您需要的面料——品类、颜色、手感、做什么用，也可以发参考图片或链接。',
      chips: ['做连衣裙的蕾丝', '做衬衫的亚麻', '条纹西装面料', '库存特价'],
      placeholder: '描述面料，或粘贴链接…', send: '发送', attach: '附图片或链接', attachImg: '上传图片', attachLink: '粘贴参考链接', linkPrompt: '粘贴链接（如 Facebook / Shopee / Pinterest 图片）：', attached: '已附图片', removeAttach: '移除',
      formTitle: '开始匹配前，请留下联系方式', formSub: '方便销售把匹配结果和米样发给您', req: '必填', opt: '选填',
      region: '地区', otherRegion: '请填写国家 / 城市', phone: '手机号', name: '称呼', intro: '自我介绍', introPh: '例如：公司名、业务类型、做什么产品、月用量',
      biz: ['服装厂', '布店', '品牌', '设计师'], bizLabel: '业务类型（可选）',
      submit: '确认并开始匹配', back: '返回聊天', privacy: '仅用于就面料需求联系您 · 隐私政策（PDPA）[待确认]',
      eRegion: '请选择地区', eOther: '请填写国家 / 城市', ePhone: '请填写手机号', ePhoneBad: '号码格式不对：{r} 应为 {n} 位数字（去掉开头的 0）', ePhoneOther: '请带国家区号，例如 +65 812 3456',
      thanks: '谢谢{name} 🙏 已收到您的信息（{phone}）', searching: '正在通过产品匹配系统搜索…',
      found: '为您找到 {n} 款相近面料{cat} ✨ 价格为米样价（每米），大货价请 LINE 咨询。', inCat: '（{c}）',
      fallback: '暂时没有完全匹配的，先看看本周新品和主推款，团队会继续帮您找。',
      follow: '需要米样或更多选择，可点卡片下方按钮，或继续补充需求（后续跟进流程 [待确认]）。',
      gotImg: '已收到图片（演示版：未接入以图搜布，先按文字匹配）。',
      sample: '米样', per: '米', tbc: '待确认', reqSample: '索取米样', askLine: 'LINE 咨询', you: '您', bot: '助手', clearConfirm: '清除本机保存的聊天记录和联系方式？'
    }
  }[L];

  // Regions — hard-coded per the brief. Codes BKK / IDK as used internally.
  var REGIONS = [
    { id: 'BKK', cc: '+66', digits: [9, 9], label: { th: 'ไทย · กรุงเทพฯ (BKK)', en: 'Thailand · Bangkok (BKK)', zh: '泰国 · 曼谷 (BKK)' }, ex: '81 234 5678' },
    { id: 'IDK', cc: '+62', digits: [9, 12], label: { th: 'อินโดนีเซีย (IDK)', en: 'Indonesia (IDK)', zh: '印度尼西亚 (IDK)' }, ex: '812 3456 7890' },
    { id: 'HCM', cc: '+84', digits: [9, 10], label: { th: 'เวียดนาม · โฮจิมินห์', en: 'Vietnam · Ho Chi Minh City', zh: '越南 · 胡志明市' }, ex: '90 123 4567' },
    { id: 'HAN', cc: '+84', digits: [9, 10], label: { th: 'เวียดนาม · ฮานอย', en: 'Vietnam · Hanoi', zh: '越南 · 河内' }, ex: '90 123 4567' },
    { id: 'OTHER', cc: '', digits: null, label: { th: 'อื่น ๆ', en: 'Other', zh: '其他' }, ex: '+65 8123 4567' }
  ];
  function regionById(id) { for (var i = 0; i < REGIONS.length; i++) if (REGIONS[i].id === id) return REGIONS[i]; return REGIONS[0]; }

  /** Default region. DEMO: hard-coded to 'BKK'.
   *  PRODUCTION: look up the visitor's IP (server-side or a geo-IP edge header) and map the country/city to
   *  BKK / IDK / HCM / HAN, else 'OTHER'. Must stay a pure function returning one of the REGIONS ids. */
  function detectRegionByIP() { return 'BKK'; }

  // ---------------- storage ----------------
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  function now() { return new Date().toISOString(); }
  function uid() { return 'TKC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(); }
  var rec = load() || { id: uid(), createdAt: now(), contact: null, messages: [] };

  /** Persist the chat. DEMO: localStorage on this device only — nothing leaves the browser.
   *  PRODUCTION: send `record` to the chat-record API / DB (every chat is to be logged). Payload:
   *  {
   *    id, createdAt, updatedAt,
   *    site: { version: 'v1'..'v5', lang: 'th'|'en'|'zh', page: 'index'|'catalog'|'stock'|'contact', url, referrer },
   *    contact: { region: 'BKK'|'IDK'|'HCM'|'HAN'|'OTHER', regionOther, countryCode, phone, phoneE164,
   *               name, intro, businessType[], submittedAt, regionSource: 'ip'|'user' },
   *    messages: [ { role: 'user'|'bot', text, ts, links[], attachment: { name, type, size } (file itself uploaded separately),
   *                  recs: [productCode...] } ],
   *    recommendedProductIds: [ ...all codes ever recommended ],
   *    userAgent
   *  }
   *  Send it on contact submit and on every new message; server upserts by id. */
  function saveChatRecord(record) {
    record.updatedAt = now();
    record.site = { version: VERSION, lang: L, page: PAGE, url: location.pathname, referrer: d.referrer ? 'set' : '' };
    var all = [];
    record.messages.forEach(function (m) { (m.recs || []).forEach(function (c) { if (all.indexOf(c) < 0) all.push(c); }); });
    record.recommendedProductIds = all;
    try { localStorage.setItem(KEY, JSON.stringify(record)); } catch (e) { /* storage full / private mode: demo keeps working in memory */ }
  }
  if (qs.get('chat') === 'reset') { try { localStorage.removeItem(KEY); sessionStorage.removeItem(MINKEY); } catch (e) {} rec = { id: uid(), createdAt: now(), contact: null, messages: [] }; }

  // ---------------- helpers ----------------
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var tbc = function () { return '<mark class="tbc">' + esc(T.tbc) + '</mark>'; };
  var URLRE = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
  function linkify(text) {
    return esc(text).replace(/\[(รอยืนยัน|to confirm|待确认)\]/g, function (m, x) { return '<mark class="tbc">' + x + '</mark>'; })
      .replace(URLRE, function (u) { var href = /^https?:/i.test(u) ? u : 'https://' + u; return '<a href="' + href + '" target="_blank" rel="noopener nofollow ugc">' + u + '</a>'; })
      .replace(/\n/g, '<br>');
  }
  function el(html) { var t = d.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  var isMobile = function () { return w.matchMedia('(max-width: 640px)').matches; };
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? 50 : ms); }); };

  // ---------------- data + matching ----------------
  var DATA = { settings: {}, products: [] };
  var CATS = {
    lace: { k: ['ลูกไม้', 'lace', '蕾丝', 'guipure', 'กิปเปอร์'], n: { th: 'ลูกไม้', en: 'Lace', zh: '蕾丝' } },
    embroidery: { k: ['ปัก', 'embroider', 'eyelet', '绣', '刺绣', 'อายเล็ต'], n: { th: 'งานปัก', en: 'Embroidery', zh: '绣花' } },
    jacquard: { k: ['แจ็คการ์ด', 'แจ๊คการ์ด', 'jacquard', '提花', 'brocade', 'ผ้าไหมยก'], n: { th: 'แจ็คการ์ด', en: 'Jacquard', zh: '提花' } },
    tweed: { k: ['ทวีต', 'ทวีด', 'tweed', 'boucle', 'bouclé', '小香风', '粗花呢', 'chanel'], n: { th: 'ทวีต', en: 'Tweed-look', zh: '小香风' } },
    prints: { k: ['พิมพ์', 'ลายดอก', 'print', 'floral', 'chiffon', 'ชีฟอง', 'ย่น', 'crinkle', '印花', '压皱', '雪纺', '碎花'], n: { th: 'พิมพ์ลาย & ย่น', en: 'Prints & crinkle', zh: '印花压皱' } },
    stripes: { k: ['ลายทาง', 'สก็อต', 'สก๊อต', 'stripe', 'check', 'plaid', 'suit', 'สูท', '条', '格', '西装'], n: { th: 'ลายทาง & สก็อต', en: 'Stripes & checks', zh: '条格' } },
    satin: { k: ['ซาติน', 'satin', 'silk', 'ไหม', '缎', '丝', '真丝', 'ผ้ามัน'], n: { th: 'ซาติน', en: 'Satin', zh: '缎面' } },
    linen: { k: ['ลินิน', 'linen', 'ramie', 'cotton', 'คอตตอน', 'ฝ้าย', '亚麻', '麻', '棉'], n: { th: 'ลินิน & คอตตอน', en: 'Linen & cotton', zh: '亚麻棉' } },
    knit: { k: ['ถัก', 'knit', 'pique', 'piqué', 'polo', 'โปโล', 'jersey', 'เจอร์ซี่', '针织', '珠地', '卫衣'], n: { th: 'ผ้าถัก', en: 'Knits & piqué', zh: '针织珠地' } }
  };
  var USES = [
    [['เดรส', 'ชุดเดรส', 'dress', '连衣裙', '裙'], /dress|skirt/i], [['เชิ้ต', 'เสื้อ', 'shirt', 'blouse', '衬衫', '上衣'], /shirt|blouse|top/i],
    [['สูท', 'แจ็คเก็ต', 'suit', 'blazer', 'jacket', '西装', '外套'], /suit|blazer|jacket|coat/i], [['ยูนิฟอร์ม', 'uniform', '工装', '制服'], /uniform/i],
    [['เด็ก', 'kid', 'child', '童'], /kid|child/i], [['ฮิญาบ', 'hijab', 'abaya', 'มุสลิม', 'modest'], /abaya|hijab|modest/i]
  ];
  var STOCKW = ['สต็อก', 'ราคาพิเศษ', 'ลดราคา', 'stock', 'clearance', 'sale', 'deal', '库存', '特价'];
  var NEWW = ['ใหม่', 'new', '新'];
  function has(t, words) { for (var i = 0; i < words.length; i++) if (t.indexOf(words[i].toLowerCase()) >= 0) return true; return false; }

  /** Recommend products for a free-text request. DEMO: local keyword / category / use / FP-code match,
   *  fallback = new + featured. PRODUCTION: replace with a call to the 客户找产品 search system
   *  (text + optional image), returning product codes in ranked order. */
  function matchProducts(text, max) {
    var t = (text || '').toLowerCase(), P = DATA.products, scored = [], topCat = null, best = 0;
    var codes = (text.match(/fp\s?\d{4,6}/gi) || []).map(function (c) { return c.replace(/\s/g, '').toUpperCase(); });
    var catHits = Object.keys(CATS).filter(function (c) { return has(t, CATS[c].k); });
    var useHits = USES.filter(function (u) { return has(t, u[0]); }).map(function (u) { return u[1]; });
    var wantStock = has(t, STOCKW), wantNew = has(t, NEWW);
    P.forEach(function (p) {
      var s = 0, uses = ((p.uses && p.uses.en) || []).join(' ') + ' ' + (p.name.en || '');
      if (codes.indexOf(p.code) >= 0) s += 100;
      if (catHits.indexOf(p.category) >= 0) s += 10;
      useHits.forEach(function (re) { if (re.test(uses)) s += 4; });
      if (/cotton|ฝ้าย|棉/.test(t) && /\d%\s*C(?![a-z])|cotton/i.test(p.composition)) s += 3;
      if (/polyester|โพลี|涤/.test(t) && /\d%\s*(P|T)(?![a-z])/.test(p.composition)) s += 3;
      if (wantStock && p.isClearance) s += 8;
      if (wantNew && p.isNew) s += 5;
      if (s > 0) { s += (p.isNew ? 1 : 0) + (p.isFeatured ? 0.5 : 0); scored.push([s, p]); }
    });
    scored.sort(function (a, b) { return b[0] - a[0] || String(b[1].addedDate).localeCompare(String(a[1].addedDate)); });
    if (scored.length) { best = scored[0][0]; topCat = catHits.length === 1 ? catHits[0] : null; return { exact: true, cat: topCat, items: scored.slice(0, max).map(function (x) { return x[1]; }) }; }
    var fb = P.filter(function (p) { return p.isNew || p.isFeatured; }).sort(function (a, b) { return String(b.addedDate).localeCompare(String(a.addedDate)); });
    return { exact: false, cat: null, items: fb.slice(0, max) };
  }
  function priceHTML(p) {
    var st = DATA.settings || {};
    if (st.showSamplePrice === false) return '';
    var unit = (st.sampleUnit && st.sampleUnit[L]) || T.per;
    var v = p.samplePrice != null ? '฿' + Number(p.samplePrice).toLocaleString() + '/' + esc(unit) : tbc();
    return '<p class="tkc-price"><span>' + esc(T.sample) + '</span><b>' + v + '</b></p>';
  }
  function cardHTML(p) {
    var line = (DATA.settings && DATA.settings.lineUrl) || 'https://line.me/R/ti/p/~thaikimtextile';
    return '<article class="tkc-card"><img src="' + SHARED + esc(p.image) + '" alt="" loading="lazy" width="96" height="128">' +
      '<div class="tkc-cb"><p class="tkc-code">' + esc(p.code) + '</p><h4>' + esc((p.name && (p.name[L] || p.name.en)) || p.code) + '</h4>' +
      '<p class="tkc-comp">' + esc(p.composition || '') + (p.gsm ? ' · ' + esc(p.gsm) + ' gsm' : '') + '</p>' + priceHTML(p) +
      '<div class="tkc-acts"><a class="tkc-b1" href="contact.html?code=' + encodeURIComponent(p.code) + '&type=sample">' + esc(T.reqSample) + '</a>' +
      '<a class="tkc-b2" href="' + esc(line) + '" target="_blank" rel="noopener">' + esc(T.askLine) + '</a></div></div></article>';
  }

  // ---------------- UI ----------------
  var ICON = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2H9l-5 4v-4H4a2 2 0 01-2-2V6a2 2 0 012-2zm3 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/></svg>',
    min: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11h14v2H5z"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 11-5 5H5a7 7 0 107-7z"/></svg>',
    clip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 6.5v10a4.5 4.5 0 01-9 0V5a3 3 0 016 0v10.5a1.5 1.5 0 01-3 0V6.5H9v9a3 3 0 006 0V5a4.5 4.5 0 00-9 0v11.5a6 6 0 0012 0v-10z"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l18-8L3 4v6l12 2-12 2z"/></svg>'
  };
  var regionOpts = REGIONS.map(function (r) {
    return '<label class="tkc-reg"><input type="radio" name="region" value="' + r.id + '"><span>' + esc(r.label[L]) + (r.cc ? ' <small>' + r.cc + '</small>' : '') + '</span></label>';
  }).join('');
  var ui = el(
    '<div class="tkc" data-state="closed">' +
    '<button type="button" class="tkc-launch" aria-controls="tkc-panel" aria-expanded="false">' + ICON.chat + '<span>' + esc(T.launcher) + '</span><i class="tkc-dot" hidden></i></button>' +
    '<section class="tkc-panel" id="tkc-panel" role="dialog" aria-modal="false" aria-labelledby="tkc-title" hidden>' +
    '<header class="tkc-hd"><span class="tkc-grab" aria-hidden="true"></span><div class="tkc-av" aria-hidden="true">TK</div><div class="tkc-ht"><h2 id="tkc-title">' + esc(T.title) + '</h2><p><i class="tkc-on"></i>' + esc(T.online) + '</p></div>' +
    '<span class="tkc-demo" title="' + esc(T.demo) + '">' + esc(T.demo) + '</span>' +
    '<button type="button" class="tkc-ib tkc-reset" aria-label="' + esc(T.reset) + '" title="' + esc(T.reset) + '">' + ICON.reset + '</button>' +
    '<button type="button" class="tkc-ib tkc-min" aria-label="' + esc(T.minimize) + '" title="' + esc(T.minimize) + '">' + ICON.min + '</button></header>' +
    '<div class="tkc-log" role="log" aria-live="polite" aria-relevant="additions" tabindex="0"></div>' +
    '<div class="tkc-attach-prev" hidden></div>' +
    '<form class="tkc-compose" novalidate><div class="tkc-attach"><button type="button" class="tkc-ib tkc-clip" aria-haspopup="true" aria-expanded="false" aria-label="' + esc(T.attach) + '" title="' + esc(T.attach) + '">' + ICON.clip + '</button>' +
    '<div class="tkc-menu" role="menu" hidden><button type="button" role="menuitem" data-a="img">🖼️ ' + esc(T.attachImg) + '</button><button type="button" role="menuitem" data-a="link">🔗 ' + esc(T.attachLink) + '</button></div>' +
    '<input type="file" accept="image/*" hidden></div>' +
    '<label class="tkc-sr" for="tkc-in">' + esc(T.placeholder) + '</label><textarea id="tkc-in" rows="1" placeholder="' + esc(T.placeholder) + '" enterkeyhint="send"></textarea>' +
    '<button type="submit" class="tkc-send" aria-label="' + esc(T.send) + '">' + ICON.send + '</button></form>' +
    // contact form (modal card inside the chat)
    '<div class="tkc-modal" hidden><form class="tkc-form" role="dialog" aria-modal="true" aria-labelledby="tkc-ft" novalidate>' +
    '<h3 id="tkc-ft">' + esc(T.formTitle) + '</h3><p class="tkc-fs">' + esc(T.formSub) + '</p>' +
    '<fieldset class="tkc-f" aria-describedby="tkc-e-region"><legend>' + esc(T.region) + ' <em class="r">' + esc(T.req) + '</em></legend><div class="tkc-regs">' + regionOpts + '</div>' +
    '<div class="tkc-other" hidden><label for="tkc-other">' + esc(T.otherRegion) + ' <em class="r">' + esc(T.req) + '</em></label><input id="tkc-other" name="regionOther" autocomplete="country-name" aria-describedby="tkc-e-other"><p class="tkc-err" id="tkc-e-other"></p></div>' +
    '<p class="tkc-err" id="tkc-e-region"></p></fieldset>' +
    '<div class="tkc-f"><label for="tkc-phone">' + esc(T.phone) + ' <em class="r">' + esc(T.req) + '</em></label><div class="tkc-tel"><span class="tkc-cc" aria-hidden="true"></span><input id="tkc-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" aria-describedby="tkc-e-phone" required></div><p class="tkc-err" id="tkc-e-phone"></p></div>' +
    '<div class="tkc-f"><label for="tkc-name">' + esc(T.name) + ' <em class="o">' + esc(T.opt) + '</em></label><input id="tkc-name" name="name" autocomplete="name"></div>' +
    '<div class="tkc-f"><span class="tkc-lbl" id="tkc-biz-l">' + esc(T.bizLabel) + ' <em class="o">' + esc(T.opt) + '</em></span><div class="tkc-chips" role="group" aria-labelledby="tkc-biz-l">' +
    T.biz.map(function (b) { return '<button type="button" class="tkc-chip" aria-pressed="false">' + esc(b) + '</button>'; }).join('') + '</div></div>' +
    '<div class="tkc-f"><label for="tkc-intro">' + esc(T.intro) + ' <em class="o">' + esc(T.opt) + '</em></label><textarea id="tkc-intro" name="intro" rows="2" placeholder="' + esc(T.introPh) + '"></textarea></div>' +
    '<p class="tkc-priv">' + linkify(T.privacy) + '</p>' +
    '<div class="tkc-fa"><button type="button" class="tkc-back">' + esc(T.back) + '</button><button type="submit" class="tkc-go">' + esc(T.submit) + '</button></div>' +
    '</form></div>' +
    '</section></div>');
  var $ = function (s) { return ui.querySelector(s); };
  var panel = $('.tkc-panel'), launch = $('.tkc-launch'), log = $('.tkc-log'), compose = $('.tkc-compose'), input = $('#tkc-in');
  var modal = $('.tkc-modal'), form = $('.tkc-form'), fileIn = ui.querySelector('input[type=file]'), menu = $('.tkc-menu'), clip = $('.tkc-clip'), prev = $('.tkc-attach-prev');
  var pending = null, attach = null, busy = false, lastFocus = null;

  // ----- open / close -----
  function setOpen(open, byUser) {
    ui.setAttribute('data-state', open ? 'open' : 'closed');
    panel.hidden = !open; launch.setAttribute('aria-expanded', String(open));
    root.classList.toggle('tkc-open', open);
    if (open) { $('.tkc-dot').hidden = true; scrollEnd(); if (byUser) setTimeout(function () { input.focus(); }, 30); }
    else if (byUser) { try { sessionStorage.setItem(MINKEY, '1'); } catch (e) {} launch.focus(); }
  }
  launch.addEventListener('click', function () { setOpen(true, true); try { sessionStorage.removeItem(MINKEY); } catch (e) {} });
  $('.tkc-min').addEventListener('click', function () { setOpen(false, true); });
  $('.tkc-reset').addEventListener('click', function () {
    if (!w.confirm(T.clearConfirm)) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    rec = { id: uid(), createdAt: now(), contact: null, messages: [] }; log.innerHTML = ''; greet(); input.focus();
  });
  ui.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) { closeForm(); e.stopPropagation(); return; }
    if (!menu.hidden) { toggleMenu(false); clip.focus(); return; }
    if (ui.getAttribute('data-state') === 'open') setOpen(false, true);
  });
  // mobile: drag the header down to minimise
  (function () {
    var y0 = null, hd = $('.tkc-hd');
    hd.addEventListener('touchstart', function (e) { if (isMobile()) y0 = e.touches[0].clientY; }, { passive: true });
    hd.addEventListener('touchend', function (e) { if (y0 != null && e.changedTouches[0].clientY - y0 > 60) setOpen(false, true); y0 = null; }, { passive: true });
  })();

  // ----- messages -----
  function scrollEnd() { log.scrollTop = log.scrollHeight; }
  function render(m) {
    var html;
    if (m.role === 'user') {
      html = '<div class="tkc-m tkc-u"><span class="tkc-sr">' + esc(T.you) + ':</span>' +
        (m.attachment ? '<p class="tkc-att">' + (m._url ? '<img src="' + m._url + '" alt="">' : '') + '📎 ' + esc(m.attachment.name) + '</p>' : '') +
        (m.text ? '<p>' + linkify(m.text) + '</p>' : '') + '</div>';
    } else {
      html = '<div class="tkc-m tkc-b"><span class="tkc-sr">' + esc(T.bot) + ':</span>' + (m.text ? '<p>' + linkify(m.text) + '</p>' : '') +
        (m.chips ? '<div class="tkc-sugg">' + m.chips.map(function (c) { return '<button type="button" class="tkc-chip">' + esc(c) + '</button>'; }).join('') + '</div>' : '') +
        (m.recs && m.recs.length ? '<div class="tkc-recs">' + m.recs.map(function (c) { var p = byCode(c); return p ? cardHTML(p) : ''; }).join('') + '</div>' : '') + '</div>';
    }
    var node = el(html); log.appendChild(node); scrollEnd(); return node;
  }
  function byCode(c) { for (var i = 0; i < DATA.products.length; i++) if (DATA.products[i].code === c) return DATA.products[i]; return null; }
  function push(m, persist) { m.ts = m.ts || now(); var n = render(m); if (persist !== false) { var c = {}; for (var k in m) if (k[0] !== '_') c[k] = m[k]; rec.messages.push(c); saveChatRecord(rec); } if (panel.hidden && m.role === 'bot') $('.tkc-dot').hidden = false; return n; }
  function typing() { return render({ role: 'bot', text: '' }).classList.add('tkc-typing') || log.lastChild; }
  function greet() { push({ role: 'bot', text: T.greet, chips: T.chips }); }
  log.addEventListener('click', function (e) {
    var b = e.target.closest('.tkc-sugg .tkc-chip'); if (!b || busy) return;
    input.value = b.textContent; compose.requestSubmit ? compose.requestSubmit() : onSend(e);
  });

  // ----- composer -----
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; }
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); onSend(e); } });
  compose.addEventListener('submit', onSend);
  function toggleMenu(open) { menu.hidden = !open; clip.setAttribute('aria-expanded', String(open)); if (open) menu.querySelector('button').focus(); }
  clip.addEventListener('click', function () { toggleMenu(menu.hidden); });
  menu.addEventListener('click', function (e) {
    var a = e.target.closest('[data-a]'); if (!a) return; toggleMenu(false);
    if (a.getAttribute('data-a') === 'img') fileIn.click();
    else { var u = w.prompt(T.linkPrompt, 'https://'); if (u && /\S+\.\S+/.test(u) && u !== 'https://') { input.value = (input.value ? input.value + ' ' : '') + u.trim(); autosize(); } input.focus(); }
  });
  d.addEventListener('click', function (e) { if (!menu.hidden && !e.target.closest('.tkc-attach')) toggleMenu(false); });
  fileIn.addEventListener('change', function () {
    var f = fileIn.files && fileIn.files[0]; if (!f) return;
    // DEMO: the image never leaves the browser (object URL only). PRODUCTION: upload, then attach its id to the message.
    attach = { name: f.name, type: f.type, size: f.size, _url: URL.createObjectURL(f) };
    prev.innerHTML = '<img src="' + attach._url + '" alt=""><span>' + esc(T.attached) + ': ' + esc(f.name) + '</span><button type="button" class="tkc-ib">' + esc(T.removeAttach) + '</button>';
    prev.hidden = false; fileIn.value = ''; input.focus();
  });
  prev.addEventListener('click', function (e) { if (e.target.closest('button')) { attach = null; prev.hidden = true; prev.innerHTML = ''; input.focus(); } });

  function onSend(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (busy) return;
    var text = input.value.trim();
    if (!text && !attach) { input.focus(); return; }
    var m = { role: 'user', text: text, links: (text.match(URLRE) || []) };
    if (attach) { m.attachment = { name: attach.name, type: attach.type, size: attach.size }; m._url = attach._url; }
    push(m); input.value = ''; autosize(); attach = null; prev.hidden = true; prev.innerHTML = '';
    if (!rec.contact) { pending = m; openForm(); } else reply(m);
  }

  // ----- contact form (focus-trapped) -----
  var regInputs = form.querySelectorAll('input[name=region]'), phone = $('#tkc-phone'), cc = $('.tkc-cc'), other = $('#tkc-other'), otherWrap = $('.tkc-other');
  function curRegion() { var v = ''; regInputs.forEach(function (r) { if (r.checked) v = r.value; }); return v; }
  function syncRegion() {
    var r = regionById(curRegion() || 'BKK'), isO = curRegion() === 'OTHER';
    otherWrap.hidden = !isO; other.required = isO;
    cc.textContent = r.cc || '+'; cc.hidden = isO; phone.placeholder = isO ? r.ex : r.ex;
    phone.setAttribute('autocomplete', isO ? 'tel' : 'tel-national');
  }
  regInputs.forEach(function (r) { r.addEventListener('change', function () { syncRegion(); if (form.getAttribute('data-tried')) validate(); }); });
  form.querySelectorAll('.tkc-chips .tkc-chip').forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); }); });
  [phone, other].forEach(function (i) { i.addEventListener('input', function () { if (form.getAttribute('data-tried')) validate(); }); });
  function setErr(input, id, msg) {
    var p = $('#' + id); p.textContent = msg || ''; if (input) { if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
    return !msg;
  }
  function validate() {
    var rid = curRegion(), r = regionById(rid), ok = true, first = null, raw = phone.value.trim(), digits = raw.replace(/\D/g, '');
    if (!setErr(null, 'tkc-e-region', rid ? '' : T.eRegion)) { ok = false; first = first || regInputs[0]; }
    if (rid === 'OTHER' && !setErr(other, 'tkc-e-other', other.value.trim() ? '' : T.eOther)) { ok = false; first = first || other; }
    if (rid !== 'OTHER') setErr(other, 'tkc-e-other', '');
    var pm = '';
    if (!raw) pm = T.ePhone;
    else if (rid === 'OTHER') { if (!/^\+\d[\d\s-]{6,17}$/.test(raw) || digits.length < 7 || digits.length > 15) pm = T.ePhoneOther; }
    else {
      if (digits.indexOf(r.cc.slice(1)) === 0 && digits.length > r.digits[1]) digits = digits.slice(r.cc.length - 1); // typed the country code again
      if (digits[0] === '0') digits = digits.slice(1);
      if (/[^\d\s()+-]/.test(raw) || digits.length < r.digits[0] || digits.length > r.digits[1]) pm = T.ePhoneBad.replace('{r}', r.label[L]).replace('{n}', r.digits[0] === r.digits[1] ? r.digits[0] : r.digits[0] + '–' + r.digits[1]);
    }
    if (!setErr(phone, 'tkc-e-phone', pm)) { ok = false; first = first || phone; }
    return { ok: ok, first: first, digits: digits, region: r };
  }
  function focusables() { return [].slice.call(form.querySelectorAll('input:not([hidden]),textarea,button,select')).filter(function (x) { return !x.disabled && x.offsetParent !== null; }); }
  form.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = focusables(), a = f[0], z = f[f.length - 1];
    if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
  });
  function openForm() {
    lastFocus = d.activeElement;
    if (!curRegion()) { var def = detectRegionByIP(); regInputs.forEach(function (r) { r.checked = r.value === def; }); }
    syncRegion(); modal.hidden = false; ui.classList.add('tkc-has-modal');
    setTimeout(function () { phone.focus(); }, 30);
  }
  function closeForm() { modal.hidden = true; ui.classList.remove('tkc-has-modal'); (lastFocus && lastFocus.focus ? lastFocus : input).focus(); }
  $('.tkc-back').addEventListener('click', closeForm);
  form.addEventListener('submit', function (e) {
    e.preventDefault(); form.setAttribute('data-tried', '1');
    var v = validate(); if (!v.ok) { v.first && v.first.focus(); return; }
    var biz = [].slice.call(form.querySelectorAll('.tkc-chip[aria-pressed=true]')).map(function (b) { return b.textContent; });
    var isO = v.region.id === 'OTHER', ph = phone.value.trim();
    rec.contact = {
      region: v.region.id, regionOther: isO ? other.value.trim() : '', regionSource: v.region.id === detectRegionByIP() ? 'ip-default' : 'user',
      countryCode: isO ? '' : v.region.cc, phone: ph, phoneE164: isO ? '+' + ph.replace(/\D/g, '') : v.region.cc + v.digits,
      name: $('#tkc-name').value.trim(), intro: $('#tkc-intro').value.trim(), businessType: biz, submittedAt: now()
    };
    saveChatRecord(rec);
    modal.hidden = true; ui.classList.remove('tkc-has-modal'); input.focus();
    var nm = rec.contact.name ? (L === 'zh' ? '，' + rec.contact.name : ' ' + rec.contact.name) : '';
    push({ role: 'bot', text: T.thanks.replace('{name}', nm).replace('{phone}', rec.contact.phoneE164) });
    if (pending) { var p = pending; pending = null; reply(p); }
  });

  // ----- bot reply (mock) -----
  function reply(m) {
    busy = true; ui.classList.add('tkc-busy');
    var t1 = typing();
    wait(700).then(function () {
      log.removeChild(t1);
      if (m.attachment) push({ role: 'bot', text: T.gotImg });
      push({ role: 'bot', text: T.searching });
      var t2 = typing(); return wait(1100).then(function () { return t2; });
    }).then(function (t2) {
      log.removeChild(t2);
      var max = (DATA.settings.chat && DATA.settings.chat.maxRecs) || 4;
      var res = matchProducts(m.text || '', max);
      var txt = res.exact ? T.found.replace('{n}', res.items.length).replace('{cat}', res.cat ? T.inCat.replace('{c}', CATS[res.cat].n[L]) : '') : T.fallback;
      push({ role: 'bot', text: txt, recs: res.items.map(function (p) { return p.code; }) });
      return wait(500);
    }).then(function () { push({ role: 'bot', text: T.follow }); busy = false; ui.classList.remove('tkc-busy'); });
  }

  // ---------------- boot ----------------
  function boot(data) {
    DATA = data || DATA; DATA.settings = DATA.settings || {}; DATA.products = DATA.products || [];
    var cfg = DATA.settings.chat || {};
    if (cfg.enabled === false) return;
    if (cfg.demoBadge === false) ui.querySelector('.tkc-demo').remove();
    d.body.appendChild(ui);
    if (rec.messages.length) rec.messages.forEach(function (m) { render(m); }); else greet();
    var minimized = false; try { minimized = sessionStorage.getItem(MINKEY) === '1'; } catch (e) {}
    var auto = isMobile() ? cfg.autoOpenMobile !== false : cfg.autoOpen !== false;
    if (cfg.reopenAfterMinimize) minimized = false;
    if (qs.get('chat') === 'open' || (auto && !minimized)) setOpen(true, false); else setOpen(false, false);
  }
  function start() {
    fetch(SHARED + 'data/products.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(boot).catch(function () { boot(null); });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
  // exposed for tests / future integration (no network)
  w.TKChat = { detectRegionByIP: detectRegionByIP, matchProducts: function (t, n) { return matchProducts(t, n || 4); }, saveChatRecord: saveChatRecord, record: function () { return rec; } };
})();

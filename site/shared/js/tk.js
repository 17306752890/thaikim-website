/* Thai Kim Textile — shared product engine for all site versions (no dependencies).
 * Reads shared/data/products.json at runtime, so the local promotion specialist can
 * update products by editing that one file — no rebuild needed.
 * Ordering rule (boss meeting): new arrivals → new featured picks → long-running stock (rotated per visit).
 * Pricing rule: only per-metre SAMPLE price (THB) is ever shown; bulk price = "ask on LINE". */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var L = root.getAttribute('data-lang') || 'th';
  var SHARED = root.getAttribute('data-shared') || '../../shared/';
  root.classList.add('js');

  var S = {
    th: { new: 'ใหม่', featured: 'แนะนำ', stock: 'สต็อกประจำ', clearance: 'ราคาพิเศษ', sample: 'ผ้าตัวอย่าง', perUnit: '/', bulk: 'ราคาล็อตใหญ่', bulkShort: 'ราคาส่ง → LINE', askLine: 'สอบถามทาง LINE', ask: 'สอบถาม', comp: 'ส่วนประกอบ', gsm: 'GSM', width: 'หน้ากว้าง', use: 'เหมาะกับ', tbc: '[รอยืนยัน / 待确认]', search: 'ค้นหารหัสผ้า ชื่อ หรือส่วนประกอบ…', all: 'ทั้งหมด', category: 'ประเภทผ้า', tag: 'สถานะ', fiber: 'เส้นใย', weight: 'น้ำหนัก', light: 'บาง (<120)', mid: 'กลาง (120–200)', heavy: 'หนา (>200)', sort: 'เรียงตาม', rec: 'แนะนำ (ใหม่ก่อน)', newest: 'วันที่เพิ่มล่าสุด', code: 'รหัสผ้า', results: 'รายการ', reset: 'ล้างตัวกรอง', empty: 'ไม่พบผ้าที่ตรงกับเงื่อนไข ลองเปลี่ยนตัวกรอง หรือส่งรูปให้เราทาง LINE', added: 'เพิ่ม', filters: 'ตัวกรอง', clearPrice: 'ราคาสต็อก', loading: 'กำลังโหลด…', copied: 'คัดลอกแล้ว', copy: 'คัดลอกข้อความ', openLine: 'เปิด LINE', intentNo: 'เลขที่คำขอ', intentNote: 'ตัวอย่างเท่านั้น — ยังไม่ส่งข้อมูลไปที่ใด คัดลอกข้อความแล้วส่งทาง LINE', hello: 'สวัสดีครับ/ค่ะ Thai Kim Textile สนใจผ้า:' },
    en: { new: 'New', featured: 'Featured', stock: 'Core stock', clearance: 'Special price', sample: 'Sample', perUnit: '/', bulk: 'Bulk price', bulkShort: 'Bulk price → LINE', askLine: 'Ask on LINE', ask: 'Enquire', comp: 'Composition', gsm: 'GSM', width: 'Width', use: 'For', tbc: '[to confirm / 待确认]', search: 'Search code, name or composition…', all: 'All', category: 'Fabric type', tag: 'Status', fiber: 'Fibre', weight: 'Weight', light: 'Light (<120)', mid: 'Medium (120–200)', heavy: 'Heavy (>200)', sort: 'Sort', rec: 'Recommended (new first)', newest: 'Newest added', code: 'Code', results: 'items', reset: 'Clear filters', empty: 'No matching fabrics. Try other filters — or LINE us a photo.', added: 'Added', filters: 'Filters', clearPrice: 'Stock price', loading: 'Loading…', copied: 'Copied', copy: 'Copy message', openLine: 'Open LINE', intentNo: 'Request no.', intentNote: 'Demo only — nothing is sent. Copy the message and send it on LINE.', hello: 'Hello Thai Kim Textile, I am interested in:' },
    zh: { new: '新品', featured: '主推', stock: '常规备货', clearance: '特价', sample: '米样', perUnit: '/', bulk: '大货价', bulkShort: '大货价 → LINE', askLine: 'LINE 咨询', ask: '咨询', comp: '成分', gsm: '克重', width: '门幅', use: '适用', tbc: '[รอยืนยัน / 待确认]', search: '搜索编号、名称或成分…', all: '全部', category: '面料类别', tag: '状态', fiber: '纤维', weight: '厚薄', light: '轻薄 (<120)', mid: '适中 (120–200)', heavy: '厚重 (>200)', sort: '排序', rec: '推荐（新品优先）', newest: '最新上架', code: '编号', results: '款', reset: '清除筛选', empty: '没有符合条件的面料，换个筛选，或把图片 LINE 给我们。', added: '上架', filters: '筛选', clearPrice: '库存价', loading: '加载中…', copied: '已复制', copy: '复制消息', openLine: '打开 LINE', intentNo: '询价编号', intentNote: '仅为演示，不会发送任何数据。复制消息后通过 LINE 发送。', hello: '您好 Thai Kim Textile，我想咨询以下面料：' }
  }[L];
  var CAT = {
    lace: { th: 'ลูกไม้', en: 'Lace', zh: '蕾丝' }, embroidery: { th: 'งานปัก', en: 'Embroidery', zh: '绣花' }, jacquard: { th: 'แจ็คการ์ด', en: 'Jacquard', zh: '提花' },
    tweed: { th: 'ทวีต', en: 'Tweed-look', zh: '小香风' }, prints: { th: 'พิมพ์ลาย & ย่น', en: 'Prints & crinkle', zh: '印花压皱' }, stripes: { th: 'ลายทาง & สก็อต', en: 'Stripes & checks', zh: '条格' },
    satin: { th: 'ซาติน', en: 'Satin', zh: '缎面' }, linen: { th: 'ลินิน', en: 'Linen', zh: '亚麻' }, knit: { th: 'ผ้าถัก', en: 'Knits & piqué', zh: '针织珠地' }
  };
  var FIBERS = [['poly', /(^|[^A-Z])(P|T)(?![a-z])|polyester/i, { th: 'โพลีเอสเตอร์', en: 'Polyester', zh: '涤纶' }], ['cotton', /(\d%\s*C(?![a-z]))|cotton/i, { th: 'คอตตอน', en: 'Cotton', zh: '棉' }], ['linen', /linen|\d%\s*L(?![a-z])/i, { th: 'ลินิน', en: 'Linen', zh: '麻' }], ['rayon', /\d%\s*R(?![a-z])|rayon|viscose/i, { th: 'เรยอน', en: 'Rayon', zh: '人棉' }], ['nylon', /\d%\s*N(?![a-z])|nylon/i, { th: 'ไนลอน', en: 'Nylon', zh: '锦纶' }], ['tencel', /tencel|tel|\d%\s*M(?![a-z])|modal/i, { th: 'เทนเซล/โมดาล', en: 'Tencel/Modal', zh: '天丝/莫代尔' }]];

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tbc = '<mark class="tbc">' + esc(S.tbc) + '</mark>';

  // ---- visit-based rotation (seeded shuffle) ----
  function visitSeed() {
    var n = 0;
    try {
      n = parseInt(localStorage.getItem('tk-visits') || '0', 10);
      if (!sessionStorage.getItem('tk-session')) { n += 1; localStorage.setItem('tk-visits', n); sessionStorage.setItem('tk-session', '1'); }
    } catch (e) { n = Math.floor(Math.random() * 1000); }
    return n * 9301 + 49297 + Math.floor(Date.now() / 864e5); // changes per visit and per day
  }
  function shuffle(arr, seed) {
    var a = arr.slice(), s = seed % 233280;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var byDate = function (a, b) { return (b.addedDate || '').localeCompare(a.addedDate || ''); };
  function freshOrder(list, seed) {
    var nw = list.filter(function (p) { return p.isNew; }).sort(byDate);
    var ft = list.filter(function (p) { return !p.isNew && p.isFeatured; }).sort(byDate);
    var rest = list.filter(function (p) { return !p.isNew && !p.isFeatured; });
    return nw.concat(ft, shuffle(rest, seed)); // stock never leads; its order changes every visit
  }

  // ---- card ----
  var settings = {};
  function price(p, clear) {
    if (!settings.showSamplePrice) return '';
    var v = clear ? p.clearancePrice : p.samplePrice;
    var unit = (settings.sampleUnit && settings.sampleUnit[L]) || 'm';
    var val = (typeof v === 'number') ? '฿' + v.toLocaleString('th-TH') + ' <small>' + S.perUnit + esc(unit) + '</small>' : tbc;
    return '<div class="tk-price"><span>' + esc(clear ? S.clearPrice : S.sample) + '</span><b>' + val + '</b></div>';
  }
  function card(p, opts) {
    opts = opts || {};
    var badges = (p.isClearance ? '<i class="b-clear">' + S.clearance + '</i>' : '') + (p.isNew ? '<i class="b-new">' + S.new + '</i>' : '') + (p.isFeatured ? '<i class="b-feat">' + S.featured + '</i>' : '') + (!p.isNew && !p.isFeatured && !p.isClearance && p.isStock ? '<i class="b-stock">' + S.stock + '</i>' : '');
    var name = p.name[L] || p.name.en, sub = L === 'en' ? CAT[p.category].en : p.name.en;
    var uses = (p.uses && (p.uses[L] || p.uses.en) || []).join(' · ');
    var lineMsg = encodeURIComponent(S.hello + ' ' + p.code);
    return '<article class="tk-card" data-code="' + esc(p.code) + '">' +
      '<a class="tk-img" href="contact.html?code=' + esc(p.code) + '"><img src="' + SHARED + esc(p.image) + '" alt="' + esc(p.code + ' ' + p.name.en) + '" loading="lazy" width="480" height="640"><span class="tk-badges">' + badges + '</span><span class="tk-code">' + esc(p.code) + '</span></a>' +
      '<div class="tk-body"><p class="tk-cat">' + esc(CAT[p.category][L]) + '</p><h3>' + esc(name) + '</h3><p class="tk-sub">' + esc(sub) + '</p>' +
      '<dl class="tk-specs"><div><dt>' + S.comp + '</dt><dd>' + esc(p.composition) + '</dd></div>' + (p.gsm ? '<div><dt>' + S.gsm + '</dt><dd>' + esc(p.gsm) + '</dd></div>' : '') + (p.width ? '<div><dt>' + S.width + '</dt><dd>' + esc(p.width) + ' cm</dd></div>' : '') + '</dl>' +
      (opts.compact ? '' : (uses ? '<p class="tk-use">' + esc(uses) + '</p>' : '')) +
      price(p, opts.clearance) +
      '<div class="tk-actions"><a class="tk-ask" href="contact.html?code=' + esc(p.code) + '">' + S.ask + '</a><a class="tk-line" href="' + esc(settings.lineUrl) + '" target="_blank" rel="noopener" data-msg="' + lineMsg + '" title="' + esc(S.bulk) + '">' + S.bulkShort + '</a></div>' +
      '</div></article>';
  }

  // ---- catalog with filters (structure borrowed from the inventory platform: q / category / tags / fibre / weight / sort, URL-synced) ----
  function fiberKeys(p) { return FIBERS.filter(function (f) { return f[1].test(p.composition || ''); }).map(function (f) { return f[0]; }); }
  function weightKey(p) { var g = parseFloat(p.gsm); if (!g) return ''; return g < 120 ? 'light' : g <= 200 ? 'mid' : 'heavy'; }
  function chips(name, items, cur) {
    return '<div class="tk-chips" data-f="' + name + '">' + items.map(function (it) { return '<button type="button" class="tk-chip' + (cur === it[0] ? ' on' : '') + '" data-v="' + it[0] + '">' + esc(it[1]) + '</button>'; }).join('') + '</div>';
  }
  function catalog(el, all, seed) {
    var qs = new URLSearchParams(location.search);
    var st = { q: qs.get('q') || '', cat: qs.get('cat') || location.hash.slice(1) || '', tag: qs.get('tag') || '', fiber: qs.get('fiber') || '', weight: qs.get('weight') || '', sort: qs.get('sort') || 'rec' };
    if (!CAT[st.cat]) st.cat = '';
    var list = all.filter(function (p) { return !p.isClearance; });
    var layout = el.getAttribute('data-layout') || 'top';
    function panel() {
      return '<div class="tk-filters">' +
        '<label class="tk-search"><input type="search" value="' + esc(st.q) + '" placeholder="' + esc(S.search) + '" data-q></label>' +
        '<div class="tk-fgroup"><p>' + S.category + '</p>' + chips('cat', [['', S.all]].concat(Object.keys(CAT).map(function (k) { return [k, CAT[k][L]]; })), st.cat) + '</div>' +
        '<div class="tk-fgroup"><p>' + S.tag + '</p>' + chips('tag', [['', S.all], ['new', S.new], ['featured', S.featured], ['stock', S.stock]], st.tag) + '</div>' +
        '<div class="tk-fgroup"><p>' + S.fiber + '</p>' + chips('fiber', [['', S.all]].concat(FIBERS.map(function (f) { return [f[0], f[2][L]]; })), st.fiber) + '</div>' +
        '<div class="tk-fgroup"><p>' + S.weight + '</p>' + chips('weight', [['', S.all], ['light', S.light], ['mid', S.mid], ['heavy', S.heavy]], st.weight) + '</div>' +
        '</div>';
    }
    el.innerHTML = '<div class="tk-catalog tk-layout-' + layout + '">' + panel() + '<div class="tk-results"><div class="tk-bar"><b data-count></b><button type="button" class="tk-reset" data-reset>' + S.reset + '</button><label>' + S.sort + ' <select data-sort><option value="rec">' + S.rec + '</option><option value="newest">' + S.newest + '</option><option value="code">' + S.code + '</option></select></label></div><div class="tk-grid" data-grid></div></div></div>';
    var grid = el.querySelector('[data-grid]'), count = el.querySelector('[data-count]'), sortSel = el.querySelector('[data-sort]');
    sortSel.value = st.sort;
    function run() {
      var q = st.q.trim().toLowerCase();
      var r = list.filter(function (p) {
        if (st.cat && p.category !== st.cat) return false;
        if (st.tag === 'new' && !p.isNew) return false;
        if (st.tag === 'featured' && !p.isFeatured) return false;
        if (st.tag === 'stock' && !(p.isStock && !p.isNew && !p.isFeatured)) return false;
        if (st.fiber && fiberKeys(p).indexOf(st.fiber) < 0) return false;
        if (st.weight && weightKey(p) !== st.weight) return false;
        if (q && (p.code + ' ' + p.name.th + ' ' + p.name.en + ' ' + p.name.zh + ' ' + p.composition).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
      r = st.sort === 'newest' ? r.sort(byDate) : st.sort === 'code' ? r.sort(function (a, b) { return a.code.localeCompare(b.code); }) : freshOrder(r, seed);
      count.textContent = r.length + ' ' + S.results;
      grid.innerHTML = r.length ? r.map(function (p) { return card(p); }).join('') : '<p class="tk-empty">' + S.empty + '</p>';
      var u = new URLSearchParams(); ['q', 'cat', 'tag', 'fiber', 'weight'].forEach(function (k) { if (st[k]) u.set(k, st[k]); }); if (st.sort !== 'rec') u.set('sort', st.sort);
      history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.tk-chip'); if (b) { var g = b.parentNode.getAttribute('data-f'); st[g] = b.getAttribute('data-v'); b.parentNode.querySelectorAll('.tk-chip').forEach(function (x) { x.classList.toggle('on', x === b); }); run(); }
      if (e.target.closest('[data-reset]')) { st = { q: '', cat: '', tag: '', fiber: '', weight: '', sort: 'rec' }; el.querySelector('[data-q]').value = ''; sortSel.value = 'rec'; el.querySelectorAll('.tk-chips').forEach(function (c) { c.querySelectorAll('.tk-chip').forEach(function (x, i) { x.classList.toggle('on', i === 0); }); }); run(); }
    });
    el.querySelector('[data-q]').addEventListener('input', function (e) { st.q = e.target.value; run(); });
    sortSel.addEventListener('change', function () { st.sort = sortSel.value; run(); });
    run();
  }

  // ---- contact intent (borrowed pattern: structured request → request number → hand-off to LINE) ----
  function intent(form) {
    var code = new URLSearchParams(location.search).get('code');
    var need = form.querySelector('[name=need]');
    if (code && /^FP\d+$/.test(code) && need) need.value = code + ' — ';
    var out = form.querySelector('[data-intent-out]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var dt = new Date(), no = 'TK-' + String(dt.getFullYear()).slice(2) + ('0' + (dt.getMonth() + 1)).slice(-2) + ('0' + dt.getDate()).slice(-2) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      var f = new FormData(form), lines = [S.intentNo + ': ' + no];
      form.querySelectorAll('[name]').forEach(function (i) { if (i.type === 'file' || i.type === 'radio' && !i.checked) return; var v = f.get(i.name); if (v) lines.push((i.closest('label') && i.closest('label').firstChild.textContent.trim() || i.name) + ': ' + v); });
      var msg = lines.join('\n');
      out.hidden = false;
      out.innerHTML = '<p class="tk-no">' + esc(S.intentNo) + ' <b>' + no + '</b></p><pre>' + esc(msg) + '</pre><div class="tk-actions"><button type="button" class="tk-ask" data-copy>' + S.copy + '</button><a class="tk-line" href="' + esc(settings.lineUrl || '#') + '" target="_blank" rel="noopener">' + S.openLine + '</a></div><p class="tk-note">' + esc(S.intentNote) + '</p>';
      out.querySelector('[data-copy]').addEventListener('click', function (ev) { (navigator.clipboard ? navigator.clipboard.writeText(msg) : Promise.reject()).then(function () { ev.target.textContent = S.copied; }, function () {}); });
    });
  }

  // ---- generic UI ----
  d.querySelectorAll('[data-setlang]').forEach(function (a) { a.addEventListener('click', function () { try { localStorage.setItem('tk-lang', a.getAttribute('data-setlang')); } catch (e) {} }); });
  var burger = d.querySelector('[data-burger]');
  if (burger) burger.addEventListener('click', function () { var o = d.body.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o); });
  var hdr = d.querySelector('[data-header]');
  if (hdr) { var sc = function () { hdr.classList.toggle('scrolled', window.scrollY > 8); }; window.addEventListener('scroll', sc, { passive: true }); sc(); }
  function reveal() {
    var els = d.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }
  reveal();
  d.querySelectorAll('form[data-tk-intent]').forEach(function (f) { settings.lineUrl = 'https://line.me/R/ti/p/~thaikimtextile'; intent(f); });

  // ---- load data & render blocks ----
  var blocks = d.querySelectorAll('[data-tk]');
  if (!blocks.length) return;
  blocks.forEach(function (b) { if (!b.innerHTML.trim()) b.innerHTML = '<p class="tk-loading">' + S.loading + '</p>'; });
  fetch(SHARED + 'data/products.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (data) {
    settings = data.settings || {};
    var all = data.products || [], seed = visitSeed();
    var ordered = freshOrder(all.filter(function (p) { return !p.isClearance; }), seed);
    blocks.forEach(function (b) {
      var kind = b.getAttribute('data-tk'), n = parseInt(b.getAttribute('data-limit') || '0', 10), compact = b.hasAttribute('data-compact');
      if (kind === 'new') {
        var nw = ordered.slice(0, n || settings.newThisWeekCount || 8);
        b.innerHTML = nw.map(function (p) { return card(p, { compact: compact }); }).join('');
      } else if (kind === 'stock') {
        var cl = shuffle(all.filter(function (p) { return p.isClearance; }), seed);
        b.innerHTML = (n ? cl.slice(0, n) : cl).map(function (p) { return card(p, { clearance: true, compact: compact }); }).join('');
      } else if (kind === 'catalog') {
        catalog(b, all, seed);
      } else if (kind === 'count-new') { b.textContent = all.filter(function (p) { return p.isNew; }).length; }
      else if (kind === 'count-all') { b.textContent = all.length; }
      else if (kind === 'count-clear') { b.textContent = all.filter(function (p) { return p.isClearance; }).length; }
      else if (kind === 'updated') { b.textContent = settings.updated || ''; }
    });
    reveal();
  }).catch(function () { blocks.forEach(function (b) { b.innerHTML = '<p class="tk-empty">products.json?</p>'; }); });
})();

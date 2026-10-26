#!/usr/bin/env python3
"""Generates site/refs/index.html — a Chinese summary page of design reference websites.
Screenshots live in site/refs/img/*.webp (1200x750, taken 2026-10-26 at 1440x900)."""
import html, pathlib
OUT = pathlib.Path(__file__).resolve().parent.parent / 'site' / 'refs' / 'index.html'
E = html.escape

TH = [
 ('真正高端（最值得参考）', '前 5 个是泰国面料网站里真正有高级感的', [
  ('01-jim-thompson-fabrics', 'Jim Thompson Fabrics', 'https://www.jimthompsonfabrics.com/', '泰国最知名的丝绸品牌旗下室内面料线：家居面料、墙布、饰边。', '全屏室内场景大图，泰式图案很浓，排版克制。', '用“面料在真实空间里”的大图做首屏，泰味和高级感同时有。'),
  ('02-jim-thompson', 'Jim Thompson', 'https://www.jimthompson.com/', '泰丝时装与生活方式品牌（75 周年老牌）。', '杂志级时装大片 + 系列故事（传承纹样、品牌联名）。', '把“传承纹样”讲成故事；不足是电商味较重，有折扣弹窗。'),
  ('03-pasaya', 'PASAYA', 'https://pasaya.com/en/', '泰国家居面料品牌，母公司 Satin Textiles 有自有工厂，拿过 G Mark 等设计奖。', '米白底、衬线字、居中 Logo，配多张面料生活照。', '干净的品牌色 + “工厂到品牌”的叙事。'),
  ('04-whiterose', 'Whiterose Design', 'https://whiterose.co.th/', '曼谷高端墙纸与面料代理（William Morris 等）。', '全屏室内大图，衬线斜体大标题。', '每个系列配实景图，并直接写出每平米价格区间。'),
  ('05-nitas-tessile', 'Nitas Tessile', 'https://www.nitas-tessile.com/', '曼谷窗帘与沙发面料商，面向设计师提供样本册。', '北欧风室内实拍，低饱和色调。', '为设计师单独设“索取样本”入口。'),
 ]),
 ('好看的 B2B 工厂站', '结构清楚、可信度高，适合借鉴 B2B 信息架构', [
  ('06-charan-lace', 'Charan Lace', 'https://charanlace.com/', '曼谷蕾丝与绣花厂，1976 年成立，以出口为主。', '首屏蕾丝微距大图，冲击力强（模板感稍重）。', '用蕾丝特写做主视觉，直接对应我们的蕾丝 / 绣花品类。'),
  ('07-orchid-lace', 'Orchid Lace', 'https://orchidlace.co.th/', '泰国绣花与蕾丝厂。', '深色底 + 绣花微距 + 视频。', '暗色背景把绣花质感衬出来。'),
  ('08-boonchuay', 'Boonchuay Group', 'https://boonchuay.com/', '泰国一站式织造、染整厂。', '现代企业站：大标题、数字、认证区块清楚。', '“一站式服务 + 认证”的 B2B 信任结构。'),
  ('09-futuretex', 'Futuretex', 'https://www.futuretexgroup.com/', '泰国针织面料垂直一体化工厂。', '粗体大字 + 数据卡片，很现代。', '用大字和数字讲清产能和工艺。'),
  ('10-sangetsu-goodrich-th', 'Sangetsu Goodrich (Thailand)', 'https://www.sangetsu-goodrich.co.th/', '日资集团的泰国公司：面料、墙布、地材。', '展厅实景 + 品类分区，规整。', '多品牌、多品类的导航方式。'),
  ('11-vichitr', 'VICHITR', 'https://www.vichitr.com/', '泰国窗帘与沙发面料品牌（带电商）。', '柔和面料大图，泰英双语。', '把功能卖点做成系列（防螨、宠物友好等）。'),
 ]),
 ('中等', '有可取之处，但整体不算高端', [
  ('12-thai-taffeta', 'Thai Taffeta（TTC）', 'https://www.thai-taffeta.com/', '罗勇的功能性面料厂，织染一体。', '户外运动大图，主打“创新面料”。', '功能面料配应用场景图。'),
  ('13-gemma-knits', 'GEMMA Knits', 'https://www.gemmaknits.com/', '泰国高端运动 / 内衣针织面料厂。', '人像大图，但版式普通。', '用“穿在身上的效果”卖面料。'),
  ('14-saha-union', 'Saha Union', 'https://www.sahaunion.co.th/en', '泰国上市的纺织起家集团。', '深色企业站 + 建筑图形。', '集团感与投资者信息的呈现。'),
  ('15-toray-textiles-th', 'Toray Textiles (Thailand)', 'https://www.toray.co.th/en/ttt/', '东丽在泰国的面料厂。', '图标 + 功能面料图，偏信息型。', '把功能（防水等）做成图形说明。'),
 ]),
 ('设计偏弱（凑满 20 个）', '仅供了解泰国同行现状，设计上不建议参考', [
  ('16-royal-universal-lace', 'Royal Universal Lace', 'https://royaluniversallace.com/', '曼谷蕾丝与绣花厂。', '模板感重。', '只参考工厂实拍。'),
  ('17-homework-fabrics', 'Homework Fabrics', 'https://homeworkfabrics.com/', '曼谷大型窗帘与沙发面料厂。', '有高端尝试（金色 Logo + 丝绒图），但排版小、显旧。', '丝绒等面料的氛围图。'),
  ('18-sirimon', 'SIRIMON', 'https://sirimonofficial.com/', '泰丝时装品牌（成品，不是面料商）。', '丝绸特写有质感，但站点简单。', '丝绸特写的拍法。'),
  ('19-naraya-silk', 'NaRaYa Silk', 'https://narayasilk.com/', '泰丝服饰与配件（偏成品）。', '色彩好看，版式普通。', '色彩搭配。'),
  ('20-bischoff-gamma', 'Bischoff Gamma (Thailand)', 'https://www.bischoff-gamma.com/', '泰国与瑞士合资的绣花 / 蕾丝厂。', '页面老旧。', '只参考蕾丝产品图。'),
 ]),
]
INTL = [
 ('面料 / 材料', '欧洲顶级面料与材料品牌', [
  ('01-dedar', 'Dedar', 'https://dedar.com/', '意大利家居面料。', '大幅布料与室内场景 + 衬线字。', '面料特写当主视觉，文字极少。'),
  ('02-kvadrat', 'Kvadrat', 'https://www.kvadrat.dk/en', '丹麦设计面料集团。', '北欧式留白，一块纯色布撑起首屏。', '单色面料大图 + 简洁导航，显得专业、规模大。'),
  ('03-sophie-hallette', 'Sophie Hallette', 'https://www.sophiehallette.com/?lang=en', '法国蕾丝老厂。', '全屏黑白织机画面，品牌名居中，菜单隐藏。', '用工艺画面讲出蕾丝的专业感。'),
  ('04-fortuny', 'Fortuny', 'https://www.fortuny.com/', '威尼斯手工面料（1921）。', '人物披着提花布、背景是威尼斯，地域感强。', '把面料放进泰国 / 曼谷场景里拍。'),
  ('05-holland-sherry', 'Holland & Sherry', 'https://www.hollandandsherry.com/', '英国高端西装面料商。', '首屏分“服装 / 家居”两大入口，大图细字。', '首屏直接分成 2–3 条业务入口（新品 / 全部面料 / 特价库存）。'),
  ('06-dormeuil', 'Dormeuil', 'https://dormeuil.com/', '法国西装面料老牌。', '居中大 Logo + 纪录片式人物大图。', '用故事和人物照片做出品牌温度。'),
  ('07-reda', 'Reda 1865', 'https://www.reda1865.com/', '意大利羊毛面料厂。', '电影感暗调画面 + 极小衬线字。', '暗色电影感配色 + “始于某年”的传承叙事。'),
  ('08-taroni', 'Taroni', 'https://www.taroni.it/', '意大利科莫丝绸厂。', '超现实全屏视觉，丝绸人像悬在地球上方。', '首屏可以大胆做概念视觉，不一定放产品。'),
  ('09-mantero', 'Mantero 1902', 'https://mantero.com/', '科莫丝绸与印花品牌。', '杂志式大片 + 品牌宣言。', '每一季系列做成专题页。'),
  ('10-de-le-cuona', 'de Le Cuona', 'https://delecuona.com/', '英国天然纤维面料（亚麻、羊绒）。', '米色暖调静物摄影，“true luxury takes time”。', '暖中性色调 + 天然材质叙事，适合亚麻 / 棉。'),
 ]),
 ('奢侈时装 / 生活方式', '高级感来自克制的排版和摄影', [
  ('11-loewe', 'LOEWE', 'https://www.loewe.com/usa/en/home', '西班牙奢侈品牌。', '超大字标 + 强烈的单品静物图。', '一个主推单品 + 大字标题，做“本周主推面料”首屏。'),
  ('12-khaite', 'KHAITE', 'https://khaite.com/', '纽约高端女装。', '时装大片 + 极简衬线字。', '模特穿成衣的效果图，展示面料做成衣服的样子。'),
  ('13-the-row', 'The Row', 'https://www.therow.com/', '美国高端极简时装。', '黑白人像，大量留白，导航克制。', '克制排版让网站立刻显“贵”。'),
  ('14-toteme', 'TOTEME', 'https://toteme.com/en-us', '北欧极简时装。', '双栏大图，像 Lookbook。', '双图并排展示“面料 + 成衣”。'),
  ('15-aesop', 'Aesop', 'https://www.aesop.com/', '澳洲护肤与生活方式品牌。', '温暖质感摄影，统一的字体系统。', '统一色调和字体，每页都像同一个品牌。'),
 ]),
 ('高端 B2B / 获奖网站', '材料品牌的 B2B 结构 + 顶级网页动效', [
  ('16-alcantara', 'Alcantara', 'https://www.alcantara.com/', '意大利材料品牌（B2B，面向汽车、时尚）。', '全屏材质微距 + 新闻和应用案例。', '“材料 + 应用案例 + 新闻”的 B2B 结构。'),
  ('17-tencel', 'TENCEL™（Lenzing）', 'https://www.tencel.com/', '纤维品牌。', '清新人物 + 纤维特写，大字讲卖点。', '用大字讲清可持续、功能等技术卖点。'),
  ('18-vitra', 'Vitra', 'https://www.vitra.com/en-us/home', '瑞士设计家具。', '单品 + 建筑光影大图，导航专业。', '“一个产品一个场景”的英雄图。'),
  ('19-lusion', 'Lusion', 'https://lusion.co/', '3D 互动工作室，Awwwards 2023 年度网站。', 'WebGL 3D 与流畅动效。', '首屏可互动的 3D 布料 / 色卡效果。'),
  ('20-locomotive', 'Locomotive', 'https://locomotive.ca/en', '加拿大网页代理商，Awwwards 2023 年度代理商。', '大胆排版 + 滚动动效。', '滚动动效与大字排版带来的节奏感。'),
 ]),
]

def host(u):
    return u.split('//', 1)[1].split('/', 1)[0].replace('www.', '')

def cards(prefix, tiers, sid):
    out = []
    for ti, (tname, tsub, items) in enumerate(tiers):
        out.append(f'<div class="tier" id="{sid}-{ti+1}"><h3>{E(tname)}</h3><p class="tsub">{E(tsub)} · {len(items)} 个</p><div class="grid">')
        for slug, name, url, does, prem, borrow in items:
            n = slug[:2]
            img = f'img/{prefix}-{slug}.webp'
            out.append(f'''<article class="card">
<a class="shot" href="{img}" data-full="{img}" aria-label="放大查看 {E(name)} 截图"><img src="{img}" alt="{E(name)} 官网首屏截图" loading="lazy" decoding="async" width="1200" height="750"><span class="no">{n}</span></a>
<div class="body"><h4>{E(name)}</h4><a class="url" href="{E(url)}" target="_blank" rel="noopener">{E(host(url))} ↗</a>
<dl><div><dt>做什么</dt><dd>{E(does)}</dd></div><div><dt>高级在哪</dt><dd>{E(prem)}</dd></div><div><dt>可借鉴</dt><dd>{E(borrow)}</dd></div></dl></div></article>''')
        out.append('</div></div>')
    return '\n'.join(out)

def subnav(sid, tiers):
    return ''.join(f'<a href="#{sid}-{i+1}">{E(t[0])}</a>' for i, t in enumerate(tiers))

page = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>泰国官网设计参考汇总 · Thai Kim Textile × Five Point</title>
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Thai Kim Textile · Five Point 泰国官网设计参考：20 个泰国面料官网 + 20 个国际高端官网">
<link rel="icon" href="../shared/img/brand/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap">
<style>
:root{{--ink:#17181c;--mut:#6b6a66;--line:#e4dfd6;--bg:#f7f4ee;--card:#fff;--acc:#1b2d60;--gold:#b98a3e}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth;scroll-padding-top:70px}}
body{{margin:0;font:15px/1.7 "Noto Sans SC",system-ui,sans-serif;color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased}}
a{{color:inherit}}
.top{{position:sticky;top:0;z-index:20;background:rgba(247,244,238,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}}
.top .in{{max-width:1240px;margin:auto;padding:12px 24px;display:flex;align-items:center;gap:22px;overflow-x:auto;white-space:nowrap;scrollbar-width:none}}
.top b{{font-family:"Noto Serif SC",serif;letter-spacing:.02em;margin-right:auto}}.top a{{text-decoration:none;font-size:.9rem;color:var(--mut)}}.top a:hover{{color:var(--ink)}}
.top .q{{font-size:.8rem;border:1px solid var(--line);border-radius:999px;padding:3px 12px}}
header.hero{{max-width:1240px;margin:auto;padding:72px 24px 40px}}
.kick{{color:var(--gold);font-weight:700;letter-spacing:.2em;font-size:.78rem;margin:0}}
h1{{font:700 clamp(2.2rem,5vw,3.8rem)/1.15 "Noto Serif SC",serif;margin:.25em 0 .3em}}
.lead{{max-width:760px;color:#3d3c39;font-size:1.05rem}}
.facts{{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}}.facts span{{background:#fff;border:1px solid var(--line);border-radius:999px;padding:5px 14px;font-size:.85rem}}
.note{{margin-top:22px;max-width:760px;border-left:3px solid var(--gold);background:#fffaf0;padding:12px 16px;font-size:.92rem;color:#5a4a2a}}
section.sec{{max-width:1240px;margin:auto;padding:40px 24px}}
.sh{{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:12px;border-top:2px solid var(--ink);padding-top:18px;margin-bottom:8px}}
.sh h2{{font:700 clamp(1.6rem,3vw,2.3rem)/1.2 "Noto Serif SC",serif;margin:0}}.sh h2 small{{color:var(--gold);font-size:.55em;margin-right:10px;font-family:"Noto Sans SC";letter-spacing:.1em}}
.subnav{{display:flex;flex-wrap:wrap;gap:8px}}.subnav a{{font-size:.82rem;text-decoration:none;border:1px solid var(--line);background:#fff;border-radius:999px;padding:4px 12px}}.subnav a:hover{{border-color:var(--ink)}}
.tier{{margin-top:34px}}.tier h3{{font:700 1.3rem "Noto Serif SC",serif;margin:0}}.tsub{{margin:2px 0 16px;color:var(--mut);font-size:.9rem}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:22px}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;transition:transform .3s,box-shadow .3s}}
.card:hover{{transform:translateY(-3px);box-shadow:0 22px 40px -28px rgba(0,0,0,.45)}}
.shot{{position:relative;display:block;aspect-ratio:16/10;background:#e9e5dc;overflow:hidden;cursor:zoom-in}}
.shot img{{width:100%;height:100%;object-fit:cover;object-position:top;display:block;transition:transform .6s}}.card:hover .shot img{{transform:scale(1.03)}}
.no{{position:absolute;left:10px;top:10px;background:rgba(23,24,28,.82);color:#fff;font-weight:700;font-size:.8rem;border-radius:6px;padding:2px 8px}}
.body{{padding:14px 18px 18px}}.body h4{{margin:0;font-size:1.12rem}}
.url{{display:inline-block;font-size:.85rem;color:var(--acc);text-decoration:none;margin:2px 0 8px;word-break:break-all}}.url:hover{{text-decoration:underline}}
dl{{margin:0;display:grid;gap:6px}}dl div{{display:grid;grid-template-columns:4.6em 1fr;gap:8px;font-size:.9rem}}dt{{color:var(--mut)}}dd{{margin:0}}
dl div:last-child dd{{color:var(--acc);font-weight:500}}
footer{{max-width:1240px;margin:auto;padding:30px 24px 60px;color:var(--mut);font-size:.85rem;border-top:1px solid var(--line)}}
dialog{{border:0;padding:0;background:transparent;max-width:min(1440px,96vw)}}dialog::backdrop{{background:rgba(10,10,12,.86)}}
dialog img{{display:block;max-width:100%;max-height:88vh;border-radius:8px}}dialog p{{color:#fff;text-align:center;margin:10px 0 0;font-size:.9rem}}
dialog button{{position:fixed;top:14px;right:18px;background:#fff;border:0;border-radius:50%;width:40px;height:40px;font-size:1.3rem;cursor:pointer}}
@media (max-width:640px){{header.hero{{padding:44px 18px 24px}}section.sec{{padding:28px 16px}}.grid{{grid-template-columns:1fr}}.top .in{{padding:10px 16px;gap:16px}}}}
</style></head><body>
<nav class="top"><div class="in"><b>设计参考汇总</b><a href="#th">泰国面料官网 20</a><a href="#intl">国际高端官网 20</a><a href="#how">怎么用</a><a class="q" href="../">官网草稿 ↗</a></div></nav>
<header class="hero"><p class="kick">THAI KIM TEXTILE · FIVE POINT</p><h1>泰国官网设计参考汇总</h1>
<p class="lead">为 Thai Kim Textile（Five Point 品牌）泰国官网收集的设计参考：先看 20 个泰国本地面料 / 纺织公司官网（按设计档次排序），再看 20 个国际顶级面料、时装与获奖网站。每张卡片都有首屏截图（点击放大）、原站链接、公司业务、高级在哪，以及我们可以借鉴的点。</p>
<div class="facts"><span>整理日期：2026-10-26</span><span>截图：电脑端 1440×900 首屏</span><span>共 40 个网站</span></div>
<p class="note">坦白说：泰国面料公司官网里，真正有高级感的只有前 5 个左右；越往后越普通，最后一档“设计偏弱”只是为了凑满 20 个、了解同行现状。高端视觉更多要向第二部分的国际网站学习。</p></header>
<section class="sec" id="th"><div class="sh"><h2><small>PART 1</small>泰国面料 / 纺织公司官网</h2><div class="subnav">{subnav('th', TH)}</div></div>
{cards('th', TH, 'th')}</section>
<section class="sec" id="intl"><div class="sh"><h2><small>PART 2</small>国际高端官网参考</h2><div class="subnav">{subnav('intl', INTL)}</div></div>
{cards('intl', INTL, 'intl')}</section>
<section class="sec" id="how"><div class="sh"><h2><small>NEXT</small>怎么用这份参考</h2></div>
<p class="lead">请同事挑出 3–5 个最喜欢的（写编号即可，例如“泰国 01、03，国际 02、10”），并说明喜欢的是哪一点：配色、首屏大图、排版字体、动效，还是信息结构。我们会据此重新设计 Thai Kim Textile 官网。</p></section>
<footer>截图于 2026-10-26 拍摄，各网站内容可能已更新；版权归各网站所有，仅供内部设计参考。 · <a href="../">查看之前的官网草稿</a></footer>
<dialog id="lb"><button type="button" aria-label="关闭">×</button><img alt=""><p></p></dialog>
<script>
(function(){{var d=document.getElementById('lb'),im=d.querySelector('img'),cap=d.querySelector('p');
document.addEventListener('click',function(e){{var a=e.target.closest('a.shot');if(!a||!d.showModal)return;e.preventDefault();im.src=a.getAttribute('data-full');var c=a.closest('.card');cap.textContent=c.querySelector('h4').textContent+' · '+c.querySelector('.url').textContent.replace(' ↗','');d.showModal();}});
d.addEventListener('click',function(e){{if(e.target!==im)d.close();}});}})();
</script>
</body></html>'''
OUT.write_text(page, encoding='utf-8')
print('wrote', OUT)

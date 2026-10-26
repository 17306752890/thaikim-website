# Thai Kim Textile · Five Point — 泰国官网草稿（5 个版本）

> 草稿，仅供内部评审。所有页面 `noindex` + 顶部草稿横幅；黄色 `[รอยืนยัน / 待确认]` 为待核实信息。**仓库会公开：不要提交任何密码、密钥或内部链接。**

- 公司：**Thai Kim Textile**（泰国对外名称）· 品牌：**Five Point**
- 5 个版本共用一份产品数据和一个前端引擎，根目录 `index.html` 是版本选择页（中文 + 泰文）。

| 版本 | 方向 | 路径 |
|---|---|---|
| V1 | 藏青 + 金 · 高端 B2B | `/v1/` |
| V2 | 目录优先 · 库存平台式（大搜索框 + 左侧筛选） | `/v2/` |
| V3 | 泰式丝绸 · 人文杂志风（衬线泰文、泰文数字、筒裙花边纹样） | `/v3/` |
| V4 | 时装大片 · Lookbook（黑白 + 荧光粉、跑马灯、动效） | `/v4/` |
| V5 | 极简 · 手机优先 / LINE 优先（底部常驻 LINE 按钮） | `/v5/` |

每个版本：`th/`（默认）、`en/`、`zh/` × `index`（首页）、`catalog`（目录 / 新品）、`stock`（库存特价频道）、`contact`（联系 / 询价单）。

## 目录结构
```
site/shared/            ← 原样复制到 dist/shared/，5 个版本共用
  data/products.json    ← ★ 产品数据（当地推广专员维护）
  js/tk-chat.js         ← ★ 客户找产品聊天 Demo（5 个版本共用）
  css/tk-chat.css       ← 聊天样式（各版本用 --tkc-* 变量换肤，写在 src/css/vN.css 末尾）
  js/tk.js              ← 前端引擎：新品优先排序、库存每次访问轮换、筛选目录、询价单
  css/tk.css            ← 卡片 / 筛选 / 表单基础样式（各版本用 CSS 变量换肤）
  img/p/                ← 产品图（webp，480×640）
  img/cat/ img/brand/   ← 品类图、Logo、场景图
  img/thumbs/           ← 选择页缩略图 v1–v5.webp
src/common.mjs          ← 三语文案与联系方式（占位标记写在这里）
src/kit.mjs             ← 共用 HTML 片段（导航、草稿横幅、联系表、询价表单）
src/versions/vN.mjs     ← 每个版本的页头 / 首页 / 页脚
src/css/vN.css          ← 每个版本的样式
scripts/build.mjs       ← 零依赖生成器 → dist/
scripts/screenshots.mjs ← Playwright 截图 + QA（坏图 / 横向溢出 / 泰文字体）
scripts/chat-shots.mjs  ← 聊天 Demo 截图 + QA → screenshots/chat/
.github/workflows/pages.yml ← GitHub Pages 自动部署
```

## 当地推广专员：如何更新新品 / 推荐 / 库存（不需要写代码）
编辑 `site/shared/data/products.json`（GitHub 网页上点铅笔即可编辑，提交后约 1 分钟自动上线）。

**顶部 `settings`：**
| 字段 | 作用 |
|---|---|
| `updated` | 页面显示的“最近更新”日期，每次更新请改 |
| `showSamplePrice` | **米样价总开关**。`false` = 全站不显示任何价格 |
| `currency` / `sampleUnit` | THB / 每米 |
| `rotateStock` | `true` = 普通备货每次访问随机换顺序，避免老款永远排第一 |
| `newThisWeekCount` | “本周新品 / สินค้าใหม่” 区块显示数量 |
| `lineId` / `lineUrl` | 大货询价跳转的 LINE（待确认是否为销售官方号） |

**每个产品：**
| 字段 | 作用 |
|---|---|
| `isNew` + `addedDate` | 新品，按日期从新到旧排在最前面 |
| `isFeatured` | 推荐款，排在新品后面 |
| `isStock` | 普通备货：排在最后，**每次访问随机轮换** |
| `isClearance` + `clearancePrice` | 进入“库存特价频道 / ผ้าสต็อกราคาพิเศษ” |
| `samplePrice` | 米样价（泰铢 / 米）。`null` = 显示 `[รอยืนยัน / 待确认]` |

规则：**网站不显示任何大货价**；大货一律“LINE 询价”。排序 = 新品 → 推荐 → 备货（随机）。

> 现在的 isNew / isFeatured / isStock / isClearance 是为演示随便打的标，价格全部为空，上线前由推广专员按真实情况填写。

## 本地运行
```bash
node scripts/build.mjs                 # 生成 dist/
cd dist && python3 -m http.server 4321 # 打开 http://127.0.0.1:4321/
PW=/path/to/playwright/index.mjs node scripts/screenshots.mjs   # 截图 + QA（需要 Playwright）
```
只改 `products.json` 不需要重新构建（页面运行时读取）；改文案 / 版式需要重新 `build`。

## 部署到 GitHub Pages（给同事一个链接）
1. 推送到 GitHub 仓库的 `main` 分支。
2. 仓库 Settings → Pages → Source 选 **GitHub Actions**。
3. `.github/workflows/pages.yml` 会运行 `node scripts/build.mjs` 并发布 **`dist/`** 整个目录（选择页在根目录）。
4. 链接：`https://<用户名或组织>.github.io/<仓库名>/`（全部相对路径，任意子路径可用）。
   - 注意：免费账号的 Pages 需要公开仓库；仓库内不含任何密钥。

## 截图
`screenshots/vN/th-index-desktop.webp`（1440）与 `th-index-mobile.webp`（390；V2 手机版过长保存为 .jpg）；`screenshots/chooser-*.webp` 为选择页。原始 PNG 不入库。

## 客户找产品 · 聊天 Demo（纯前端）
- 每个版本、每个页面都会加载：电脑端右下角自动展开；手机端为底部抽屉（可下拉 / 点 “–” 收起成悬浮按钮）。V5 中聊天窗位于底部 LINE 栏上方，不遮挡。
- 流程：问候（随页面语言 TH/EN/ZH）→ 访客描述需求 / 附图 / 贴链接 → **首次发送时弹出联系方式卡片**（地区、手机号必填；称呼、业务类型、自我介绍选填）→ “正在通过产品匹配系统搜索…” → 推荐 3–4 款面料卡片（米样价或 [待确认]、索取米样、LINE 咨询）。
- 地区写死：泰国·曼谷 BKK（默认）/ 印尼 IDK / 越南胡志明 / 越南河内 / 其他（需手填）；手机号区号随地区：+66 / +62 / +84；“其他”需自带区号。
- **无后端、无数据库、无网络请求**：对话与联系方式只存在访客浏览器 localStorage（`tk-chat-v1`），刷新可看到历史。头部 ↺ 按钮可清空。
- 上线时要接的三个函数（都在 `site/shared/js/tk-chat.js`，注释里写了数据格式）：
  - `detectRegionByIP()` — 现在固定返回 `'BKK'`，正式版改为 IP 定位；
  - `matchProducts()` — 现在是本地关键词 / 品类 / 用途 / FP 编号匹配，没命中则推荐新品与主推；正式版改为调用“客户找产品”搜索系统；
  - `saveChatRecord(record)` — 现在只写 localStorage；正式版把每次聊天（地区、手机号、称呼、介绍、消息与时间、页面 / 版本、推荐的产品编号）存入数据库。
- 开关：`products.json → settings.chat`：`enabled`（总开关）、`autoOpen` / `autoOpenMobile`（进页面自动打开）、`reopenAfterMinimize`（访客收起后本次访问是否还自动打开，默认否）、`maxRecs`（每次推荐数量）、`demoBadge`（显示 “Demo – 未连接数据库” 标签）。单页关闭：`<html data-chat="off">`；网址参数 `?chat=off` / `?chat=open` / `?chat=reset`（清空演示数据）。

## 内部资料
调研笔记（含本机路径和内部系统名）放在 `private-notes/`，已加入 `.gitignore`，**不会被推送**。

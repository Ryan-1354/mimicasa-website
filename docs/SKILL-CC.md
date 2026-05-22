# Figma Dev Handoff Skill（Claude Code 用）

## 概覽

這個 skill 定義了 Claude Code 如何根據 Figma 設計稿、CLAUDE.md 和 tokens.json 開發靜態網站的完整流程。

開始開發前必須完整閱讀 CLAUDE.md 和 tokens.json，不得跳過。

---

## 開發前準備

### 必讀檔案
```
1. CLAUDE.md        專案規格、品牌調性、功能規格、UX 備注
2. docs/tokens.json 色彩、字體、spacing、radius 的所有數值
3. Figma 連結       透過 MCP 讀取精確數值和圖片資源
```

### 確認技術棧
```
Vanilla HTML + CSS + JavaScript
無任何框架（無 React、Vue、Tailwind、Bootstrap）
CSS 使用原生 Custom Properties（CSS Variables）
部署：GitHub Pages 或 Cloudflare Pages
```

---

## Step 1：建立專案結構

按照 CLAUDE.md 的專案結構建立資料夾和檔案：

```
project/
├── zh/
│   ├── index.html
│   ├── about.html
│   ├── features.html
│   └── campus.html
├── en/
│   ├── index.html
│   ├── about.html
│   ├── features.html
│   └── campus.html
├── assets/
│   ├── images/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── content/
├── docs/
│   └── tokens.json
├── favicon.ico
├── favicon.svg
├── og-image.jpg
├── robots.txt
├── sitemap.xml
└── CLAUDE.md
```

---

## Step 2：建立 CSS Token 系統

將 tokens.json 轉換為 CSS Custom Properties，放在 style.css 最頂部：

```css
:root {
  /* Color - Semantic */
  --color-text-primary:           #292929;
  --color-text-secondary:         #525252;
  --color-text-muted:             #bdbdbd;
  --color-text-accent:            #857765;
  --color-text-inverse-primary:   #ffffff;
  --color-text-inverse-secondary: #bdbdbd;
  --color-text-inverse-tertiary:  #989898;
  --color-text-inverse-accent:    #e0cfb9;

  --color-bg-default:  #ffffff;
  --color-bg-section:  #fdfcf9;
  --color-bg-dark:     #232d11;
  --color-bg-overlay:  rgba(41, 41, 41, 0.5);

  --color-border-default:   #dcdcdc;
  --color-border-brand:     #59702f;
  --color-border-accent:    #857765;
  --color-border-secondary: #989898;

  --color-action-primary-bg:              #59702f;
  --color-action-primary-bg-hover:        #40521f;
  --color-action-primary-label:           #ffffff;
  --color-action-link-dark-default:       #525252;
  --color-action-link-dark-hover:         #292929;
  --color-action-link-light-default:      #ffffff;
  --color-action-link-light-hover:        #59702f;

  /* Spacing */
  --size-spacing-inset-xs:   4px;
  --size-spacing-inset-sm:   8px;
  --size-spacing-inset-md:   12px;
  --size-spacing-inset-lg:   16px;
  --size-spacing-inset-xl:   24px;

  --size-spacing-stack-xs:   4px;
  --size-spacing-stack-sm:   8px;
  --size-spacing-stack-md:   12px;
  --size-spacing-stack-lg:   16px;
  --size-spacing-stack-2xl:  24px;
  --size-spacing-stack-3xl:  48px;
  --size-spacing-stack-4xl:  64px;

  --size-spacing-inline-xs:  4px;
  --size-spacing-inline-sm:  8px;
  --size-spacing-inline-md:  12px;
  --size-spacing-inline-lg:  16px;
  --size-spacing-inline-xl:  20px;
  --size-spacing-inline-2xl: 24px;

  --size-spacing-layout-md:  40px;
  --size-spacing-layout-xl:  80px;
  --size-spacing-layout-2xl: 120px;

  /* Radius */
  --size-radius-xs:   4px;
  --size-radius-sm:   8px;
  --size-radius-md:   12px;
  --size-radius-lg:   16px;
  --size-radius-xl:   20px;
  --size-radius-2xl:  24px;
  --size-radius-3xl:  28px;
  --size-radius-pill: 1000px;
}
```

**命名規則**：token 的 slash（/）改為連字號（-）
```
color/text/primary  →  --color-text-primary
size/spacing/inset/lg  →  --size-spacing-inset-lg
```

---

## Step 3：建立字體系統

```css
/* Google Fonts 引入 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@600&family=Noto+Sans+TC:wght@300;400;500&family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

/* 源樣明體（本地安裝）*/
@font-face {
  font-family: 'GenYoMin2 TW';
  src: url('../assets/fonts/GenYoMin2TW-EL.otf') format('opentype');
  font-weight: 250;
  font-style: normal;
}

/* Typography Classes */
.text-zh-h1 {
  font-family: 'Noto Serif TC', serif;
  font-weight: 600;
  font-size: 60px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.text-zh-h2 {
  font-family: 'Noto Serif TC', serif;
  font-weight: 600;
  font-size: 48px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.text-zh-h3 {
  font-family: 'Noto Serif TC', serif;
  font-weight: 600;
  font-size: 30px;
  line-height: 1.2;
}
.text-zh-h4 {
  font-family: 'Noto Serif TC', serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.2;
}
.text-zh-body {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.5;
}
.text-zh-body-small {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 1.5;
}
.text-zh-label {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.04em;
}
```

---

## Step 4：HTML 頁面結構

每個頁面的基本結構：

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>頁面標題 — 咪咪 & 家田蒙特梭利幼兒園</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <!-- Open Graph -->
  <meta property="og:title" content="咪咪 & 家田蒙特梭利幼兒園">
  <meta property="og:image" content="/og-image.jpg">
  <meta property="og:type" content="website">
</head>
<body>
  <header id="navbar"><!-- Navbar --></header>
  <main><!-- 頁面內容 --></main>
  <footer><!-- Footer --></footer>
  <div id="modal-overlay"><!-- Modal --></div>
  <script src="../assets/js/main.js"></script>
</body>
</html>
```

**圖片路徑規則**
```
開發階段   使用 Figma MCP URL
           src="https://www.figma.com/api/mcp/asset/xxxxx"

上線前替換為本地路徑
           src="../assets/images/hero-bg.jpg"
```

---

## Step 5：Navbar 實作

```html
<header id="navbar" class="navbar navbar--transparent">
  <div class="navbar__inner">
    <!-- 左：Wordmark -->
    <a href="/zh/index.html" class="navbar__brand">
      <div class="navbar__wordmark">
        <!-- Logo SVG -->
        <span class="navbar__brand-zh">咪咪 家田蒙特梭利幼兒園</span>
      </div>
      <span class="navbar__brand-en">MImi Casa Montessori Preschool</span>
    </a>

    <!-- 中：Brandmark -->
    <a href="/zh/index.html" class="navbar__brandmark">
      <img src="..." alt="brandmark">
    </a>

    <!-- 右：Nav links -->
    <nav class="navbar__nav">
      <a href="/zh/about.html" class="nav-link">關於我們</a>
      <a href="/zh/features.html" class="nav-link">教學特色</a>
      <a href="/zh/campus.html" class="nav-link">校園環境</a>
      <button class="btn btn--primary" onclick="openModal()">預約參觀</button>
      <a href="/en/index.html" class="nav-link">EN</a>
    </nav>

    <!-- 漢堡（手機）-->
    <button class="navbar__hamburger" id="hamburger" aria-label="選單">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
```

**Navbar Scroll 行為**
```js
let lastScrollY = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY === 0) {
    navbar.className = 'navbar navbar--transparent';
  } else if (currentScrollY < lastScrollY) {
    navbar.className = 'navbar navbar--dark navbar--visible';
  } else {
    navbar.className = 'navbar navbar--dark navbar--hidden';
  }
  lastScrollY = currentScrollY;
}, { passive: true });
```

```css
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 500;
  padding: var(--size-spacing-inset-lg) var(--size-spacing-layout-2xl);
  transition: transform 0.3s ease, background 0.3s ease;
}
.navbar__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}
.navbar--transparent { background: transparent; }
.navbar--dark        { background: var(--color-bg-dark); }
.navbar--hidden      { transform: translateY(-100%); }
.navbar--visible     { transform: translateY(0); }

/* 深色背景時隱藏 Brandmark */
.navbar--dark .navbar__brandmark { display: none; }
.navbar--dark .navbar__inner     { grid-template-columns: 1fr 1fr; }
```

---

## Step 6：互動元件實作規範

### Button
```css
.btn--primary {
  background: var(--color-action-primary-bg);
  color: var(--color-action-primary-label);
  padding: var(--size-spacing-inset-md) var(--size-spacing-inset-xl);
  border-radius: var(--size-radius-xs);
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.04em;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn--primary:hover  { background: var(--color-action-primary-bg-hover); }
.btn--primary:active { transform: scale(0.97); }
```

### Card（Features）
```css
.card {
  background: var(--color-bg-default);
  border-radius: var(--size-radius-lg);
  padding: var(--size-spacing-inset-lg) var(--size-spacing-inset-xl);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover  {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.card:active {
  transform: scale(0.97);
  box-shadow: none;
}
```

### Link（可點擊）
```css
/* 淺色背景 */
.link--dark {
  color: var(--color-action-link-dark-default);
  text-decoration: none;
  border-bottom: 1px solid var(--color-action-link-dark-default);
  padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;
}
.link--dark:hover {
  color: var(--color-action-link-dark-hover);
  border-color: var(--color-action-link-dark-hover);
}
.link--dark:active { transform: scale(0.98); }

/* 深色背景 */
.link--light {
  color: var(--color-action-link-light-default);
  text-decoration: none;
  border-bottom: 1px solid var(--color-action-link-light-default);
  padding-bottom: 2px;
  transition: opacity 0.2s;
}
.link--light:hover { opacity: 0.7; }
```

### Nav Link
```css
.nav-link {
  color: var(--color-action-link-light-default);
  text-decoration: none;
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.04em;
  transition: opacity 0.2s;
}
.nav-link:hover  { opacity: 0.7; }
.nav-link.active { border-bottom: 1px solid #ffffff; }
```

---

## Step 7：RWD 實作規範

```css
/* 桌機（預設） */
.section {
  padding: var(--size-spacing-layout-xl) var(--size-spacing-layout-2xl);
}

/* 平板 */
@media (max-width: 1439px) {
  :root {
    --size-spacing-layout-2xl: 60px;
  }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}

/* 手機 */
@media (max-width: 767px) {
  :root {
    --size-spacing-layout-2xl: 20px;
    --size-spacing-layout-xl:  48px;
  }
  .navbar__nav       { display: none; }
  .navbar__hamburger { display: flex; }
  .features-grid     { grid-template-columns: 1fr; }
  .location-layout   { flex-direction: column; }
  .footer-grid       { grid-template-columns: 1fr; }
}
```

**Typography RWD（clamp）**
```css
.text-zh-h1 { font-size: clamp(32px, 4.2vw, 60px); }
.text-zh-h2 { font-size: clamp(26px, 3.3vw, 48px); }
```

---

## Step 8：Google Maps 實作

```html
<div class="location-map">
  <iframe
    id="map-iframe"
    src="GOOGLE_MAPS_EMBED_URL_MIMI"
    width="100%"
    height="600"
    style="border:0; border-radius: var(--size-radius-lg);"
    allowfullscreen
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade">
  </iframe>
</div>
```

**Tab 切換**
```js
const maps = {
  mimi: 'GOOGLE_MAPS_EMBED_URL_MIMI',
  casa: 'GOOGLE_MAPS_EMBED_URL_CASA'
};

function switchCampus(campus) {
  document.getElementById('map-iframe').src = maps[campus];
  // 同步更新右側資訊
  document.querySelectorAll('.campus-info').forEach(el => {
    el.style.display = el.dataset.campus === campus ? 'block' : 'none';
  });
  // 更新 tab active 狀態
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.campus === campus);
  });
}
```

---

## Step 9：Google Apps Script 表單串接

```js
const GAS_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';

async function submitForm(formData) {
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = '傳送中…';

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp:    new Date().toLocaleString('zh-TW'),
        childName:    formData.get('child-name'),
        birthday:     formData.get('birthday'),
        gender:       formData.get('gender'),
        campus:       formData.get('campus'),
        parentName:   formData.get('parent-name'),
        phone:        formData.get('phone'),
        email:        formData.get('email'),
        notes:        formData.get('notes')
      })
    });

    if (response.ok) {
      showSuccessView();
    } else {
      throw new Error('送出失敗');
    }
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.textContent = '送出預約申請';
    alert('送出失敗，請稍後再試');
  }
}
```

---

## Step 10：Scroll Reveal

```js
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
[data-reveal].revealed {
  opacity: 1;
  transform: none;
}
[data-reveal][data-delay="1"] { transition-delay: 0.1s; }
[data-reveal][data-delay="2"] { transition-delay: 0.2s; }
[data-reveal][data-delay="3"] { transition-delay: 0.3s; }
```

---

## 常見注意事項

```
1. 圖片開發用 Figma MCP URL，上線前替換本地路徑
2. color/bg/overlay 用 rgba(41,41,41,0.5) 不是 hex
3. CSS Custom Property 命名：slash → 連字號
   color/text/primary → --color-text-primary
4. 語言版本共用 style.css 和 main.js
5. 圖片路徑用 ../assets/ 因為 HTML 在子目錄
6. visited 狀態設 color: inherit，避免瀏覽器預設紫色
7. 所有 a[href^="tel:"] 和 a[href^="mailto:"] 不需要底線，
   只有 link/icon-text 元件的可點擊版本才有底線
```

---

## 上線前檢查清單

```
□ favicon.ico / favicon.svg
□ og-image.jpg（1200×630px）
□ robots.txt
□ sitemap.xml（所有頁面 URL 正確）
□ Figma MCP URL 全部替換為本地圖片路徑
□ Google Apps Script URL 已填入
□ 業主通知信箱已確認並填入
□ Google Maps 示意圖替換為真實 Embed URL
□ 家田幼兒園服務時間已補齊
□ 所有 TBD 欄位已補齊
□ 網域設定指向正確
□ HTTPS 憑證啟用
□ 手機瀏覽器測試（iOS Safari、Android Chrome）
```

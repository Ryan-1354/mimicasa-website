# 咪咪 & 家田蒙特梭利幼兒園 — 專案說明

## 專案結構

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
│   ├── images/        ← 網站圖片（JPG/PNG/SVG）
│   ├── css/
│   │   └── style.css  ← 所有頁面共用
│   └── js/
│       └── main.js    ← 所有頁面共用
├── content/           ← 網站內容文件（參考用，不被網站引用）
│   ├── zh/
│   │   └── copy.docx
│   └── en/
│       └── copy.docx
├── docs/
│   ├── tokens.json
│   └── design-notes.md
├── favicon.ico
├── favicon.svg
├── og-image.jpg
├── robots.txt
├── sitemap.xml
├── README.md
└── CLAUDE.md
```

**圖片規範**
```
照片         JPG，品質 80–90，1x
Logo / icon  SVG
去背素材      PNG
og-image     JPG，品質 90，1200x630px
命名規則      kebab-case：hero-bg.jpg、philosophy-classroom.jpg
```

**開發階段圖片**：使用 Figma MCP URL，上線前替換為 assets/images/ 本地路徑。

---

## 品牌調性

**定位**：精品幼兒園、國際學校、高端早教品牌
**目標用戶**：30 歲左右都市雙薪家庭，重視美感與品質

**視覺方向**
```
參考座標    精品嬰兒用品品牌、北歐系幼兒雜誌、高端早教機構官網
避免        傳統幼稚園的彩色可愛風格、過多圓角、卡通元素
```

**設計原則**
```
大量留白    呼吸感強，不堆砌資訊
色彩克制    主色綠只用在 CTA 和重點，不大面積塗色
字體輕盈    細字重為主，標題用有質感的明體
圖片優先    大圖、佔版面、真實校園照片
互動細膩    動畫 subtle，過渡時間 200–300ms
```

**文案語氣（中文）**
```
不用         快樂、可愛、寶貝、萌
使用         成長、探索、啟發、尊重、美感、國際視野
```

**文案語氣（英文）**
```
Avoid        cute, fun, adorable, cozy, playful
Use          growth, exploration, inspire, respect, aesthetics, global perspective
Tone         calm, confident, editorial — like a premium lifestyle brand, not a daycare
```

---

## 專案概覽

- **品牌名稱**：咪咪 & 家田蒙特梭利幼兒園 / MImi & Casa Montessori Preschool
- **技術棧**：Vanilla HTML / CSS / JavaScript，無任何框架
- **部署**：GitHub Pages 或 Cloudflare Pages
- **外部依賴**：
  - Google Fonts（Noto Serif TC、Noto Sans TC、DM Sans）
  - Google Apps Script（表單資料寫入 Google Sheet + 寄送通知信）
  - Google Maps Embed API（校區地圖 iframe）
  - Figma MCP assets（開發階段圖片來源）

---

## 網站架構

兩層 IA，不到第三層。

```
/zh/index.html        中文版首頁（Landing Page）
/zh/about.html        關於我們
/zh/features.html     教學特色
/zh/campus.html       校園環境

/en/index.html        英文版首頁
/en/about.html        About Us
/en/features.html     Our Features
/en/campus.html       Campus
```

語言切換：中文版顯示 `EN`，英文版顯示 `繁中`，點擊跳轉對應語言同一頁面。

---

## 設計系統

### 色彩（直接從 Figma Variables 同步）

**Semantic 層（開發使用這層）**
```
color/text/primary           #292929
color/text/secondary         #525252
color/text/muted             #bdbdbd
color/text/accent            #857765   卡片標題
color/text/inverse-primary   #ffffff
color/text/inverse-secondary #bdbdbd
color/text/inverse-tertiary  #989898
color/text/inverse-accent    #e0cfb9   footer 校區名稱

color/bg/default             #ffffff
color/bg/section             #fdfcf9
color/bg/dark                #232d11   footer / navbar scroll
color/bg/overlay             #29292980 modal 遮罩

color/border/default         #dcdcdc
color/border/brand           #59702f
color/border/accent          #857765
color/border/secondary       #989898

color/action/primary/bg              #59702f
color/action/primary/bg-hover        #40521f
color/action/primary/label           #ffffff
color/action/link/label/dark/default  #525252
color/action/link/label/dark/hover    #292929
color/action/link/label/light/default #ffffff
color/action/link/label/light/hover   #59702f
color/action/nav-link/default         #ffffff   hover 用 CSS opacity:0.7
```

### 字體系統（直接從 Figma Variables 同步）

**中文版**
```
logo-nav    GenYoMin2 TW EL，24px，line-height 100%，letter-spacing 5%
logo-page   GenYoMin2 TW EL，32px，line-height 100%，letter-spacing 5%
h1          Noto Serif TC 600，60px，line-height 120%，letter-spacing -2%
h2          Noto Serif TC 600，48px，line-height 120%，letter-spacing -2%
h3          Noto Serif TC 600，30px，line-height 120%，letter-spacing 0%
h4          Noto Serif TC 600，24px，line-height 120%，letter-spacing 0%
body        Noto Sans TC 400，18px，line-height 150%，letter-spacing 0%
body-small  Noto Sans TC 400，15px，line-height 150%，letter-spacing 0%
label       Noto Sans TC 500，16px，line-height 150%，letter-spacing 4%
```

**英文版**
```
logo-nav    Cormorant Garamond Light，13px，line-height 100%，letter-spacing 12%
logo-page   Cormorant Garamond Light，16px，line-height 100%，letter-spacing 12%
h1          Cormorant Garamond 400，72px，line-height 120%，letter-spacing -2%
h2          Cormorant Garamond 400，60px，line-height 120%，letter-spacing -2%
h3          Cormorant Garamond 600，36px，line-height 120%，letter-spacing 0%
h4          Cormorant Garamond 600，28px，line-height 120%，letter-spacing 0%
body        DM Sans 400，16px，line-height 150%，letter-spacing 0%
body-small  DM Sans 300，14px，line-height 150%，letter-spacing 0%
label       DM Sans 500，16px，line-height 150%，letter-spacing 4%
```

### 斷點
```
phone    0px
tablet   768px
desktop  1440px
```

### Spacing（從 Figma Variables 同步）
```
size/spacing/inset/xs    4px
size/spacing/inset/sm    8px
size/spacing/inset/md    12px
size/spacing/inset/lg    16px
size/spacing/inset/xl    24px

size/spacing/stack/xs    4px
size/spacing/stack/sm    8px
size/spacing/stack/md    12px
size/spacing/stack/lg    16px
size/spacing/stack/2xl   24px
size/spacing/stack/3xl   48px
size/spacing/stack/4xl   64px

size/spacing/layout/md   40px
size/spacing/layout/xl   80px
size/spacing/layout/2xl  120px
```

### Radius（從 Figma Variables 同步）
```
size/radius/xs    4px
size/radius/sm    8px
size/radius/lg    16px
size/radius/pill  1000px
```

---

## 頁面結構（首頁）

```
1. Navbar          固定置頂，Smart Navbar 捲動行為
2. Hero            全幅背景圖
3. Philosophy      教育理念
4. Features        特色與優勢（6 宮格卡片）
5. Map             我們的位置
6. CTA Banner      預約參觀
7. Footer
```

---

## 主要功能規格

### Navbar

**尺寸**
```
padding-y    size/spacing/inset/lg    16px
padding-x    size/spacing/layout/2xl  120px
實際高度      約 132px（內容撐開）
```

**連結**
```
關於我們  →  /zh/about.html
教學特色  →  /zh/features.html
校園環境  →  /zh/campus.html
預約參觀  →  開啟 Modal（綠色按鈕）
EN        →  /en/index.html
```

**Wordmark + Brandmark**：點擊前往首頁（`/zh/index.html`）

**捲動行為（Smart Navbar）**
```
scrollY = 0（頁面頂端）
  背景：透明
  版型：三欄 Grid — Wordmark | Brandmark | 導覽連結 + CTA
  Wordmark 與 Brandmark 同時顯示

往下捲動
  Navbar 收起 — transform: translateY(-100%)，transition: 0.3s ease

往上捲動（scrollY > 0）
  Navbar 展開
  背景：color/bg/dark（#232d11）
  版型：兩欄 Grid — Wordmark | 導覽連結 + CTA
  Brandmark 隱藏
```

```js
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY === 0) {
    navbar.classList.remove('has-bg');
    navbar.classList.add('visible');
  } else if (currentScrollY < lastScrollY) {
    navbar.classList.add('visible', 'has-bg');
  } else {
    navbar.classList.remove('visible');
  }
  lastScrollY = currentScrollY;
});
```

**Nav link 互動**
```
default    color/action/nav-link/default（白色）
hover      CSS opacity: 0.7
active     白色底線 1px，標示當前頁面
```

**≤768px**：Nav-right 隱藏，顯示漢堡按鈕，全螢幕 Drawer

---

### Hero Section

```
全幅背景圖 + 深色 overlay（rgba(0,0,0,0.35)）
左側大標題：「這裡是孩子白天的家」
右對齊副標：「孩子成長的秘密花園」
CTA 按鈕置底置中：「立即預約參觀」→ 點擊開啟報名參觀 Modal
```

---

### Features 卡片互動規格

每張卡片點擊後跳到 `/zh/features.html` 對應的 section（anchor link）。

**視覺**
```
箭頭 →   靜止狀態顯示在標題右側，color/text/muted
整張卡片可點擊，cursor: pointer
```

**互動狀態（三個裝置統一）**
```css
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.card:active {
  transform: scale(0.97);
  box-shadow: none;
}
```

---

### Google Maps Section 規格

**Tab 切換**
```
點擊 Tab 切換學校（咪咪幼兒園 / 家田幼兒園）
Active tab：底線 3px color/action/primary/bg，文字 color/text/primary
Inactive tab：文字 color/text/muted，無底線
切換時 iframe src 同步更換，右側資訊同步更新
```

**左側 iframe**
```
桌機：600×600px，border-radius: size/radius/lg（16px）
loading="lazy"，referrerpolicy="no-referrer-when-downgrade"
設計稿左側為示意圖，上線前替換為真實 Google Maps Embed URL
```

**右側資訊互動**
```
地址   點擊開啟 Google Maps（target="_blank"）
       <a href="https://maps.google.com/?q=114臺北市內湖區瑞陽里文德路66巷69弄30號" target="_blank">

電話   點擊直接撥打
       <a href="tel:+886226576881">

信箱   點擊開啟郵件客戶端
       <a href="mailto:m470502@ms47.hinet.net">

可點擊 link 樣式：
  default   文字 + 底線 1px（color/action/link/label/dark/default）
  hover     底線加深（color/action/link/label/dark/hover）
  active    scale 0.98
```

**咪咪幼兒園**
```
全名    臺北市私立咪咪蒙特梭利幼兒園
地址    114臺北市內湖區瑞陽里文德路66巷69弄30號
電話    (02) 2657-6881
傳真    (02) 2657-8368
Email   m470502@ms47.hinet.net
服務時間 週一至週五 07:30-18:00
```

**家田幼兒園**
```
全名    臺北市私立家田蒙特梭利幼兒園
地址    臺北市內湖區大湖街158巷2-3號
電話    (02) 8791-8581
傳真    (02) 8791-2625
Email   casa.m470502@msa.hinet.net
服務時間 TBD（待業主確認）
```

---

### 預約參觀 Modal

**觸發點**
```
Navbar「預約參觀」按鈕
Hero CTA「立即預約參觀」按鈕
Location Section「預約參觀」按鈕
```

**表單欄位**
```
孩子姓名、出生年月日、性別、欲參觀校區
家長姓名、聯絡電話、電子郵件、希望參觀時段 / 備註
```

**送出後**
```
1. 資料寫入 Google Sheet（Google Apps Script Web App）
2. Google Apps Script 同時寄送通知信至業主信箱
3. Google Sheet 支援日期過濾，最小單位為日
4. 顯示成功畫面
```

---

### Google Sheet 規格
```
欄位：時間戳記、孩子姓名、生日、性別、校區、家長姓名、電話、Email、備註
時間戳記格式：YYYY/MM/DD HH:MM:SS
所有報名資料集中同一張 Sheet，不分中英文版本
```

---

### Google Apps Script 設定
```js
const GAS_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";
// 負責：寫入 Google Sheet + 發送通知信
// 收件信箱：TBD（待業主確認）
```

---

### Footer 互動

```
電話    <a href="tel:+886XXXXXXXXX">   直接撥打
信箱    <a href="mailto:xxx@xxx">      開啟郵件客戶端
地址    <a href="https://maps.google.com/?q=..." target="_blank">  開啟地圖
hover   CSS opacity: 0.7
```

---

### Scroll Reveal
```
IntersectionObserver，threshold: 0.1
進場：opacity 0→1，translateY 20px→0，transition 0.65s ease
```

---

## 注意事項

- 圖片開發階段用 Figma MCP URL，上線前替換為 assets/images/ 本地路徑
- Google Maps 左側目前為示意圖，上線前替換為真實 Embed URL
- color/bg/overlay 為 #29292980，工程師使用 rgba(41,41,41,0.5)
- 語言版本共用同一份 CSS 和 JS，只有文字內容和字體不同
- 兩個校區共用同一個網站，不分開部署
- 家田幼兒園服務時間待業主確認
- 業主通知信箱待確認

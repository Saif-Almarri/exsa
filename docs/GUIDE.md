# EXSA User Guide

> The complete reference for building with EXSA — written for both **developers** and **AI agents**. Read top to bottom, or jump to the [Cheat Sheet](#cheat-sheet).

EXSA is a token-driven CSS framework. It styles semantic HTML automatically, ships 68 components, 20 themes and 10 skins, and uses a **zero-specificity, layered cascade** so your own CSS always wins without `!important`.

---

## 1. The file

EXSA is one CSS file plus optional extras:

| File | Contents | Use when |
|---|---|---|
| `exsa.bundle.css` | **The framework** — tokens, reset, utilities, classless element styling, overrides, all 68 components, with a default theme built in. | Always — the one required file. |
| `exsa.js` | All behaviors in one file. | Any interactive component (dropdown, modal, tabs…). |
| `exsa.fluid.css` | Optional fluid scaling + density profiles. | Viewport-fluid type/spacing. |
| `exsa.debug.css` / `exsa.debug.js` | Dev-only linter. Never ship. | Development. |
| `themes/*.css` | 20 color palettes. | Rebrand a palette. |
| `skins/*.css` | 10 surface-material recipes. | Change how surfaces are drawn. |

`exsa.bundle.css` bundles the classless core **and** all 68 components, so one file covers everything — plain semantic HTML plus every component class (`.btn`, `.card`, `.modal`, `.badge`, `.dropdown`, …).

---

## 2. Quick start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Site</title>

  <!-- The framework (core + components) -->
  <link rel="stylesheet" href="exsa.bundle.css">

  <!-- Optional theme + skin -->
  <link rel="stylesheet" href="themes/breeze.css">
  <link rel="stylesheet" href="skins/glass.css">

  <!-- Font Awesome Free (icons) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

  <!-- Behaviors (optional) -->
  <script src="exsa.js" defer></script>
</head>

<!-- class="exsa" turns on classless styling -->
<body class="exsa">
  <nav>
    <ul>
      <li><strong>Brand</strong></li>
      <li><a href="#">Docs</a></li>
      <li><a href="#">Pricing</a></li>
    </ul>
  </nav>

  <main>
    <header>
      <h1>Build faster.</h1>
      <p>Plain HTML, styled automatically.</p>
      <p><button>Get Started</button></p>
    </header>

    <section>
      <article>
        <h3>Zero Config</h3>
        <p>No build step. Just link and build.</p>
      </article>
      <article>
        <h3>20 Themes</h3>
        <p>Swap one file to recolor everything.</p>
      </article>
    </section>
  </main>
</body>
</html>
```

Link order matters: **core → theme → skin → fluid → debug**.

---

## 3. Two rules that govern everything

### Rule 1 — The guard (`:not([class])`)

Classless styling only applies to elements **without a `class` attribute**. Add *any* class — even `class=""` — and EXSA steps aside for that element.

```html
<!-- EXSA styles this -->
<table>…</table>

<!-- EXSA steps aside — you control it -->
<table class="data-grid">…</table>
```

For pure JS hooks, use `data-*` attributes instead of `class`, so styling intent and behavior intent never collide.

### Rule 2 — The cascade (`@layer` + `:where()`)

Everything EXSA ships is inside `@layer` blocks and uses `:where()` (zero specificity). **Your unlayered CSS always wins**, no matter how specific EXSA's selector looks.

```css
/* This always beats EXSA — no !important needed */
.btn { background: purple; }
```

EXSA's 10 layers, lowest to highest priority:

```
tokens → themes → skins → fluid → reset → utilities → elements → components → layouts → overrides
```

Unlayered author CSS beats **all** of them. The `u-*` utilities (layer `overrides`) are the escape hatch *within* EXSA when you want an EXSA rule to win over another EXSA rule.

---

## 4. Classless HTML (Guarded Classless)

Opt-in by adding `class="exsa"` to `<body>`.

### Elements styled automatically

| Element | What you get |
|---|---|
| `<nav>` + `<ul><li>` | Horizontal bar, dropdown submenus, mobile-collapsible |
| `<table>` + `<thead>`/`<tbody>` | Styled header, borders, padding, rounded corners |
| `<form>` + `<input>`/`<select>`/`<textarea>` | Styled controls, labels, validation states |
| `<button>` | Neutral bordered button with hover/active states |
| `<blockquote>` + `<footer>` | Large centered quote with attribution |
| `<dialog>` | Animated entry, backdrop, responsive width |
| `<code>`, `<pre>` | Inline/preformatted code |
| `<details>`, `<summary>` | Disclosure widget |
| `<hr>`, `<small>`, `<mark>`, `<kbd>`, `<abbr>`, `<sup>` | Themed text accents |
| `<figure>` + `<figcaption>` | Captioned media |

### Structural auto-detection (via `:has()`)

EXSA reads *structure* to pick a layout — no classes needed:

| Markup pattern | Result |
|---|---|
| `<section>` with **2+ `<article>`** | Card grid |
| `<section>` with **2+ `<figure>`** | Gallery |
| `<section>` with **3+ `<p>`** | Stats row |
| `<main>` with **`<aside>` first** | Sidebar layout |
| `<main><header>` containing **`<img>`/`<figure>`/`<svg>`/`<video>`** | Split hero |
| `<article>` containing **`<aside>`** | Callout/note |

### Cards vs. callouts vs. sidebars — get this right

```html
<!-- CARDS: <article>, 2+ in a <section> -->
<section>
  <article>
    <h3>Card one</h3>
    <p>Two or more articles become a responsive grid.</p>
  </article>
  <article>
    <h3>Card two</h3>
    <p>Each card gets border, shadow, padding.</p>
  </article>
</section>

<!-- CALLOUT: <aside> inside an <article> -->
<article>
  <aside>
    <strong>Note:</strong> This is a callout with an accent bar.
  </aside>
</article>

<!-- SIDEBAR: <aside> as the first child of <main> -->
<main>
  <aside>…sidebar…</aside>
  <div>…content…</div>
</main>
```

> **Rule:** card = `<article>`, callout = `<aside>` (in `<article>`), sidebar = `<aside>` (in `<main>`). For a single/advanced card (horizontal, image, glass), use the `.card` component.

---

## 5. Layout utilities

Always active — no `.exsa` prefix needed.

### Containers

```html
<div class="container">        1080px max, centered</div>
<div class="container-sm">     800px max</div>
<div class="container-full">   100% width</div>
```

### Flexbox

```html
<div class="flex gap">
  <div class="flex-none">Fixed</div>
  <div class="flex-1">Grows to fill</div>
</div>
```

| Category | Classes |
|---|---|
| Display | `.flex` `.flex-inline` `.flex-col` `.flex-col-rev` `.flex-row-rev` `.flex-wrap` `.flex-nowrap` |
| Sizing | `.flex-1` `.flex-auto` `.flex-none` |
| Justify | `.justify-start` `-end` `-center` `-between` `-around` `-evenly` |
| Align | `.items-start` `-end` `-center` `-baseline` `-stretch` |
| Self | `.self-start` `-end` `-center` `-stretch` |
| Content | `.content-start` `-end` `-center` `-between` `-around` |
| Gap | `.gap-0` `.gap-xs` `.gap-sm` `.gap-md` `.gap` `.gap-lg` `.gap-xl` `.gap-2xl` |

### Grid

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap">
  <div>1</div><div>2</div><div>3</div>
</div>
```

| Class | Effect |
|---|---|
| `.grid` | `display: grid` |
| `.grid-cols-1`–`.grid-cols-8` | Fixed column count |
| `.grid-auto-fit` | `repeat(auto-fit, minmax(200px, 1fr))` — auto-wrapping cards |

### Responsive prefixes

| Prefix | Breakpoint |
|---|---|
| `max-sm:` | <576px |
| `md:` | ≥768px |
| `lg:` | ≥1024px |
| `xl:` | ≥1280px |
| `xxl:` | ≥1440px |

> Between 576–767px there is no prefix — elements use their base (mobile-first) styles. `max-sm:` is for sub-576px tweaks; `md:` is 768px and up.

```html
<div class="grid-cols-1 md:grid-cols-3 lg:grid-cols-4">…</div>
<div class="flex-col md:flex-row">…</div>
```

### Complex layouts

For anything beyond equal columns, **don't reach for a class — write plain CSS.** EXSA is zero-specificity and layered, so your unlayered CSS always wins (no `!important`). Add a class to any element and style it freely:

```html
<div class="app">
  <header>…</header>
  <aside>…</aside>
  <main>…</main>
  <footer>…</footer>
</div>
```

```css
.app {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  grid-template-areas:
    "header header header"
    "aside  main   main"
    "footer footer footer";
  gap: var(--gap);
}
.app header { grid-area: header; }
.app aside  { grid-area: aside; }
.app main   { grid-area: main; }
.app footer { grid-area: footer; }
```

Complex layouts are **your CSS, not EXSA's utilities**: use the built-in primitives (`.grid-cols-*`, `.grid-auto-fit`, flex) for the common cases, and drop in custom grid/flex CSS — which always beats the framework — for the rest.

### Override utilities (`u-*`)

Force-win utilities that beat components/layouts:

```html
<div class="card u-text-center u-m-0 u-p-0 u-radius-full">…</div>
```

Common: `.u-text-start/-center/-end`, `.u-block`, `.u-flex`, `.u-none`, `.u-w-full`, `.u-m-0`, `.u-p-0`, `.u-mx-auto`, `.u-radius-0`, `.u-radius-full`, `.u-text-xs`–`.u-text-2xl`, `.u-fw-normal/-bold/-heavy`, `.u-font-sans/-mono/-heading`, `.u-text-muted`, `.u-uppercase`, `.u-fluid-type`.

---

## 6. Design tokens (95)

All tokens live in `:root`. Override any of them in your own CSS (unlayered) to customize globally.

```css
:root {
  --color-link: #0af;
  --border-radius: 12px;
  --gap: 1.25rem;
  --font-size-base: 1rem;
}
```

### Key tokens

| Group | Examples |
|---|---|
| Colors | `--color-bg`, `--color-text`, `--color-link`, `--color-border`, `--color-success`, `--color-danger`, `--color-warning` |
| Typography | `--font-family`, `--font-family-mono`, `--font-family-heading`, `--font-size-xs`–`--font-size-2xl`, `--line-height` |
| Shape | `--border-radius`, `--box-shadow` |
| Spacing | `--gap-xs`–`--gap-2xl`, `--width-card`, `--width-content` |
| Z-index | `--z-dropdown`, `--z-modal`, `--z-toast`, … (one scale for the whole framework) |
| Surface (skins) | `--surface-bg`, `--surface-border`, `--surface-radius`, `--surface-shadow-*`, `--surface-backdrop`, `--surface-canvas` |

Every component reads tokens — never hardcoded values. Change a token, every component follows.

---

## 7. Theming

### Dark / light / auto

```html
<html data-theme-mode="dark">   <!-- force dark -->
<html data-theme-mode="light">  <!-- force light -->
<html>                          <!-- follow OS -->
```

### 20 themes (palette axis)

`themes/*.css` — link one after the core. Themes own **colors only**.

Breeze · Night · Coral · Forest · Sepia · Steel · Ledger · Clinic · Console · Mono · Nova · Prism · Volt · Abyss · Ember · Ink · Shadow · Sojourn · Travei · Tropic

### 10 skins (material axis)

`skins/*.css` — link one after the theme. Skins own **how surfaces are drawn** (backgrounds, borders, shadows, blur, radius) and compose with any theme via `color-mix()`.

flat · glass · neomorphic · clay · skeuomorphic · glossy · brutalist · metallic · glow · neon

**20 themes × 10 skins = 200 looks from 30 files.**

### Runtime switching

```js
document.getElementById('theme-link').href = 'themes/night.css';
```

---

## 8. Components (68)

All components ship in `exsa.bundle.css`. Use them by adding their classes to your markup.

| Category | Components |
|---|---|
| Layout | Accordion, Drawer, Footer, Hero, Modal, Pricing Table |
| Navigation | Topbar, Sidebar, Back-to-Top, Breadcrumbs, Context Menu, Pagination, Stepper, Timeline, Tooltip |
| Content | Avatar, Badge, Card, Code Block, Data List, Separator, Table |
| Media | Lightbox, Music Player, Video Gallery, Carousel, Slideshow |
| Data | Bar Chart, Donut Chart, Progress Bars, Range Slider, KPI, Activity, Calendar, Dashboard |
| Forms | Checkbox, Color Picker, Date Picker, Dropdown, Input Group, Password Input, Popover, Radio, Rating, Select, Toggle, Tags Input, Transfer |
| Feedback | Alert, Cookie Bar, Skeleton Loader, Spinner, Toast, Empty State, Notifications |
| Advanced | Command Palette, Kanban, Tree, Upload |

### Common component examples

**Buttons**
```html
<button class="btn btn--primary">Primary</button>
<button class="btn btn--success">Success</button>
<button class="btn btn--danger">Danger</button>
<button class="btn btn--warning">Warning</button>
<button class="btn btn--outline">Outline</button>
<button class="btn btn--ghost">Ghost</button>
<button class="btn btn--soft">Soft</button>
<button class="btn btn--sm">Small</button>
<button class="btn btn--lg">Large</button>
<button class="btn btn--icon" aria-label="Settings"><i class="fa-solid fa-gear"></i></button>
```

**Card**
```html
<div class="card">
  <img class="card__image" src="hero.jpg" alt="">
  <div class="card__body">
    <h3 class="card__title">Title</h3>
    <p class="card__text">Body text.</p>
  </div>
  <div class="card__footer">
    <button class="btn btn--primary">Action</button>
  </div>
</div>
```
Variants: `.card--horizontal`, `.card--horizontal-reverse`, `.card--hoverable`, `.card--glass`.

**Badge**
```html
<span class="badge badge--primary">New</span>
<span class="badge badge--success">Done</span>
<span class="badge badge--danger badge--dot"></span>
<span class="badge badge--count">5</span>
```

**Avatar**
```html
<span class="avatar avatar--lg">
  <img src="me.jpg" alt="Me">
</span>
<span class="avatar avatar--primary"><span class="avatar__fallback">JD</span></span>
```

**Alert**
```html
<div class="alert alert--success">
  <span class="alert__icon"><i class="fa-solid fa-check"></i></span>
  <div class="alert__body">
    <strong class="alert__title">Saved</strong>
    <span class="alert__msg">Your changes were saved.</span>
  </div>
  <button class="alert__close" aria-label="Dismiss"><i class="fa-solid fa-xmark"></i></button>
</div>
```

**Modal** (open with `.modal--open`, behavior from `exsa.js`)
```html
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
  <div class="modal__dialog">
    <header class="modal__header">
      <h2 class="modal__title" id="m-title">Title</h2>
      <button class="modal__close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
    </header>
    <div class="modal__body">…</div>
    <footer class="modal__footer">
      <button class="modal__btn">Cancel</button>
      <button class="modal__btn modal__btn--primary">Confirm</button>
    </footer>
  </div>
</div>
```

**Dropdown**
```html
<div class="dropdown">
  <button class="dropdown__trigger">Menu <span class="dropdown__arrow"></span></button>
  <ul class="dropdown__menu">
    <li><button class="dropdown__item">Edit</button></li>
    <li><button class="dropdown__item dropdown__item--danger">Delete</button></li>
  </ul>
</div>
```

**Tabs**
```html
<div class="tabs" role="tablist">
  <button class="tabs__tab tabs__tab--active" role="tab">One</button>
  <button class="tabs__tab" role="tab">Two</button>
</div>
<div class="tabs__panel tabs__panel--active">Panel one</div>
<div class="tabs__panel">Panel two</div>
```

**Table**
```html
<div class="table-wrap">
  <table class="tbl tbl--striped tbl--bordered tbl--sortable">
    <thead><tr><th data-sort>Name</th><th data-sort>Role</th></tr></thead>
    <tbody>
      <tr><td>Alice</td><td>Engineer</td></tr>
    </tbody>
  </table>
</div>
```

**Form controls**
```html
<label class="checkbox"><input type="checkbox"><span class="checkbox__box"></span><span class="checkbox__label">Remember me</span></label>
<label class="radio"><input type="radio" name="x"><span class="radio__circle"></span><span class="radio__label">Option</span></label>
<label class="toggle"><input type="checkbox"><span class="toggle__track"></span><span class="toggle__label">On</span></label>

<div class="select">
  <select class="select__field"><option>One</option><option>Two</option></select>
</div>

<div class="input-group">
  <label class="input-group__label">Email</label>
  <div class="input-group__wrap">
    <span class="input-group__icon"><i class="fa-solid fa-envelope"></i></span>
    <input class="input-group__input" type="email" placeholder="you@example.com">
  </div>
</div>

<div class="password-input">
  <input class="password-input__field" type="password">
  <button class="password-input__toggle" aria-label="Show password"><i class="fa-solid fa-eye"></i></button>
</div>
```

**Progress / Spinner / Skeleton**
```html
<div class="progress-item">
  <div class="progress-item__track"><div class="progress-item__fill" style="width:60%"></div></div>
</div>
<span class="spinner spinner--sm" role="status" aria-label="Loading"></span>
<div class="skeleton"><div class="skeleton__line skeleton__line--h2"></div><div class="skeleton__line"></div></div>
```

**Breadcrumbs / Pagination / Stepper**
```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol><li><a href="#">Home</a></li><li class="breadcrumbs__sep">/</li><li class="breadcrumbs__current">Docs</li></ol>
</nav>

<nav class="pagination"><a class="pagination__link" href="#">1</a><a class="pagination__link pagination__link--active">2</a></nav>

<ol class="stepper">
  <li class="stepper__step stepper__step--done"><span class="stepper__dot"></span><span class="stepper__label">Step 1</span></li>
  <li class="stepper__step stepper__step--active"><span class="stepper__dot"></span><span class="stepper__label">Step 2</span></li>
</ol>
```

For the full set (lightbox, carousel, kanban, calendar, upload, tree, command palette, notifications, etc.), see the class names in `exsa.bundle.css` — each component is a self-documented block.

---

## 9. JavaScript

`exsa.js` wires all interactive components. It's optional — pure-CSS components work without it.

### Shared helpers (on the global `EXSA` object)

```js
EXSA.ready(fn)                // run on DOMContentLoaded (or immediately if ready)
EXSA.trapFocus(container)     // lock Tab inside; returns an off() cleanup
EXSA.getFocusable(container)  // first focusable element, or null
EXSA.bp.up('md')              // matchMedia min-width wrapper → .matches
EXSA.bp.down('md')            // matchMedia max-width wrapper
EXSA.bp.val('md')             // raw breakpoint value string
```

### State via class (the majority)

Most components are controlled by toggling a class — no JS API needed.

| Component | State class |
|---|---|
| Modal | `.modal--open` |
| Dropdown | `.dropdown--open` |
| Popover | `.popover--open` |
| Context menu | `.ctx-menu--open` |
| Lightbox | `.lightbox--open` |
| Tabs | `.tabs__tab--active` / `.tabs__panel--active` |
| Topbar | `.topbar--open` (mobile), `.topbar--scrolled` |
| Back-to-top | `.back-top--visible` |
| Cookie bar | `.cookie-bar--visible` |
| Drawer | checkbox `.drawer__toggle` `checked` |

### Events

Interactive components dispatch `exsa:*` CustomEvents on their root element:

```js
kanban.addEventListener('exsa:kanban-drop', e => console.log(e.detail));
upload.addEventListener('exsa:upload-done', e => console.log(e.detail));
calendar.addEventListener('exsa:day-select', …);
transfer.addEventListener('exsa:transfer-change', e => console.log(e.detail));
table.addEventListener('exsa:table-sort', …);
carousel.addEventListener('exsa-slide-change', e => console.log(e.detail.index));
```

> **Note:** components inserted into the DOM *after* page load aren't auto-initialized. Initialize after dynamic content, or re-bind manually.

---

## 10. Icons (Font Awesome)

EXSA uses Font Awesome. Add FA Free 6, then use any icon:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

<i class="fa-solid fa-magnifying-glass"></i>
<i class="fa-solid fa-house"></i>
<i class="fa-solid fa-bell"></i>
```

- Icons inherit `currentColor`, so they match the active theme.
- Components that draw their own icons (select chevron, back-to-top arrow, form-helper marks, copy button) already use FA glyphs — load the FA stylesheet for them to render.
- Self-host the woff2 files for offline/CSP-strict deployments. FA Free is CC BY 4.0 / OFL / MIT.

---

## 11. Fluid scaling & density profiles (optional)

Link `exsa.fluid.css` to make spacing/type/shape scale with viewport, and to enable density profiles:

```html
<html data-profile="compact">   <!-- denser (dashboards) -->
<html data-profile="spacious">  <!-- airier (landing pages) -->
<html>                          <!-- default comfortable -->
```

No breakpoints, no utility classes — tokens scale via `clamp()`.

---

## 12. Debug mode (dev only)

```html
<html data-debug>
```

With `exsa.debug.css` + `exsa.debug.js` linked last, you get:
- Red dashed outline + label on any component missing a required part.
- Amber outline + "did you mean?" for misspelled class names.
- Console warnings for class-name conflicts with other stylesheets.

Never ship these files.

---

## 13. Accessibility & browser support

**Built-in:** `:focus-visible` rings, `prefers-reduced-motion`, `prefers-color-scheme`, skip-link, `.sr-only`, logical properties (RTL), WCAG-AA theme contrast.

**Minimum browsers:** `@layer` requires Chrome 99 / Firefox 97 / Safari 15.4. Older browsers degrade in defined steps (they drop the layered stylesheet; no half-applied theme). IE11 unsupported.

---

## 14. Cheat sheet

```html
<body class="exsa">                         <!-- enable classless -->
<section>                                   <!-- card grid if 2+ <article> -->
  <article>…</article>
  <article>…</article>
</section>
<article><aside>…</aside></article>          <!-- callout -->
<main><aside>…</aside><div>…</div></main>    <!-- sidebar -->

<div class="container">…</div>
<div class="flex items-center gap">…</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap">…</div>

<button class="btn btn--primary">…</button>
<div class="card">…</div>
<span class="badge badge--success">…</span>
<span class="avatar">…</span>
<div class="alert alert--success">…</div>
<div class="dropdown">…</div>
<div class="modal">…</div>

<i class="fa-solid fa-search"></i>          <!-- icon -->
:root { --color-link: #0af; }                <!-- token override -->
<html data-theme-mode="dark">               <!-- force theme -->
<html data-profile="compact">               <!-- density -->
```

---

## 15. Rules for AI agents

When generating EXSA markup, follow these invariants:

1. **Add `class="exsa"` to `<body>`** to enable classless styling.
2. **Link `exsa.bundle.css`** — the single CSS file.
3. **Card = `<article>`** (2+ inside a `<section>`). **Callout = `<aside>`** inside `<article>`. **Sidebar = `<aside>`** first in `<main>`.
4. **The guard:** a `class` attribute on a structural element disables classless styling for that element. Use `data-*` for JS hooks.
5. **Zero specificity:** never use `!important` to fight EXSA — unlayered author CSS always wins.
6. **All components live in `exsa.bundle.css`** — `.btn`, `.card`, `.modal`, `.badge`, `.dropdown`, etc. are all available.
7. **Icons are Font Awesome** (`fa-solid fa-*`), not `.ic-*`.
8. **Interactivity comes from `exsa.js`** — include it (deferred) for dropdowns, modals, tabs, etc.
9. **Theme first, skin second:** `themes/*.css` then `skins/*.css`, both after the core.
10. **Respect `data-theme-mode`** (dark/light) and **`data-profile`** (compact/spacious) on `<html>` rather than writing custom color/density overrides.
11. **Tokens over hardcoded values** — when styling, override `--*` tokens, not component internals.

## 16. Serving & compression

Compression happens in transit — you never change the framework files. The browser asks for gzip/brotli, the server compresses the response, and it is decompressed automatically before rendering.

| File | Raw | gzip | brotli |
|---|---|---|---|
| `exsa.bundle.css` | ~262 KB | ~53 KB | ~44 KB |
| `exsa.js` | ~110 KB | ~27 KB | ~24 KB |

Managed hosts compress automatically — Cloudflare, Netlify, Vercel, GitHub Pages, and Caddy all serve gzip (or brotli) out of the box. Only self-managed servers need a config block.

**Nginx**

```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/css application/javascript text/html image/svg+xml application/json;
```

**Apache** (`.htaccess`)

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain
  AddOutputFilterByType DEFLATE application/javascript application/json image/svg+xml
</IfModule>
```

**IIS** (`Web.config`)

```xml
<system.webServer>
  <urlCompression doStaticCompression="true" doDynamicCompression="true" />
</system.webServer>
```

Prefer brotli when available (`mod_brotli` on Apache, the `brotli` module on Nginx) — it is ~18% smaller than gzip.

# EXSA CSS Framework — Built on Tokens, Not Tools

> **v1.0.0-rc.3** — Release candidate.

**EXSA is a lightweight, token-driven CSS framework.** One CSS file, 68 components, 20 themes, 10 skins, one JS file. Zero build step. Works with any server.

> *Link one file. Get a complete design system. Change one token — every component recolors.*
>
> 📘 **User Guide:** [Complete framework reference for developers & AI](GUIDE.md)
>
> 📖 **Read the Philosophy:** [Why EXSA exists, and why no framework could have done this before](PHILOSOPHY.md)

---

## The files

EXSA is deliberately simple to ship. Everything you need is in a handful of files at the repo root:

| File | What it is |
|---|---|
| `exsa.bundle.css` | **The framework** — tokens, reset, utilities, classless element styling, overrides, all 68 components, with a default theme built in. The one required file. |
| `exsa.js` | All behaviors in one file (dropdowns, modals, tabs, carousel, …). Link when any component needs interactivity. |
| `exsa.fluid.css` | Optional fluid tokens + density profiles. |
| `exsa.debug.css` / `exsa.debug.js` | Development-only markup/class linter. Never ship. |
| `themes/*.css` | 20 color palettes. Optional — override the default theme. |
| `skins/*.css` | 10 surface-material recipes. Optional — change how surfaces are drawn. |

`exsa.bundle.css` ships a built-in light/dark default theme via `light-dark()`, so it alone is enough to get started.

---

## Why EXSA?

CSS frameworks force a choice: utility-first means memorizing hundreds of classes. Component-first means fighting specificity. Both usually mean build steps, config files, and `npm install`.

EXSA chooses a third path.

**Tokens are the design system.** 95 design tokens drive 68 components, 20 themes, and every utility. Change `--color-link` in one place — every button, badge, link, and card recolors instantly. No recompile. No variable hunt.

**Classes are optional.** Add `class="exsa"` to `<body>` and plain HTML — `<nav>`, `<section>`, `<table>`, `<form>`, `<button>`, `<blockquote>`, `<dialog>` — becomes a styled UI. Add any class to a structural element and EXSA steps aside. Zero specificity. No `!important`.

**There is no build.** No CLI. No PostCSS. No config file. Just `<link>` the files and you have a complete design system. No `npm install`. Ever.

**No template engine needed.** EXSA doesn't care if your view is a plain `.php` file, a static `.html` file, or served from Python, Node, Ruby, or Go. No Twig. No Blade. No SASS. No Webpack. If your server outputs HTML, EXSA styles it.

**CSS first, JS optional.** The core (`exsa.bundle.css` + a theme) is pure CSS. Components need `exsa.js` only for the ~32 that are interactive — dropdowns, modals, tabs, toasts. If you don't need them, nothing breaks.

In short: EXSA is what happens when you trust CSS custom properties, `@layer`, and `:where()` to do the work that frameworks usually delegate to tools. Its signature feature — **Guarded Classless™** — styles semantic HTML automatically, then steps aside the moment you add a single class.

---

## Built for Where CSS Is Going

Every architectural choice — `@layer` for cascade control, custom properties for theming, `:where()` for zero specificity, `:has()` for structural detection — is built on W3C standards browsers are actively investing in. As those standards mature, EXSA's foundation strengthens. No framework churn. No migration guides.

The codebase is intentionally small so it can evolve with the language rather than fight it.

---

## Quick Start

### Getting the files

Clone or vendor the repo — pin to the release tag for a stable copy:

```bash
git clone --branch v1.0.0-rc.3 --depth 1 https://github.com/Saif-Almarri/exsa.git
```

Copy only the files you use into your project. Vendoring keeps upgrades explicit and works fully offline. No `npm install`.

### What to link, and when

#### ✅ Required on every page

| File | Notes |
|---|---|
| `exsa.bundle.css` | **The only required file** — tokens, reset, utilities, Guarded Classless element styles, all 68 components, built-in light/dark theme. |

#### ➕ Optional — link only what you use

| File | Link it… | Notes |
|---|---|---|
| `themes/<name>.css` | After the core | Recolor everything with your own palette. |
| `skins/<name>.css` | After the core + theme | Change how surfaces are drawn (glass, neon, clay…). |
| `exsa.js` | Before `</body>` | All behaviors in one file. |
| `exsa.fluid.css` | After the core + theme | Fluid scaling + `data-profile` density. |

#### 🧪 Development only — never ship

| File | Notes |
|---|---|
| `exsa.debug.css` + `exsa.debug.js` | Markup-contract linter and class spellchecker. Enable with `<html data-debug>`. Link last. |

Link order matters: **core → theme → skin → fluid → debug** for CSS.

### Link and build

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Site</title>

  <!-- 1. The framework (core + components) -->
  <link rel="stylesheet" href="exsa.bundle.css">

  <!-- 2. Optional theme + skin -->
  <link rel="stylesheet" href="themes/breeze.css">
  <link rel="stylesheet" href="skins/glass.css">

  <!-- 3. Behaviors (optional) -->
  <script src="exsa.js" defer></script>
</head>

<!-- 4. Opt-in to classless element styling -->
<body class="exsa">

  <nav>
    <ul>
      <li><strong>Brand</strong></li>
      <li><a href="#">Docs</a></li>
      <li><a href="#">Pricing</a></li>
      <li><a href="#">Blog</a></li>
    </ul>
  </nav>

  <main>
  <header>
    <h1>Build faster. Ship sooner.</h1>
    <p>Plain semantic HTML, styled automatically. Add a class to anything, EXSA steps aside.</p>
    <p><button>Get Started</button></p>
  </header>

  <section>
    <article>
      <h3>⚡ Zero Config</h3>
      <p>No build step. No CLI. No config file. Just link and build.</p>
    </article>
    <article>
      <h3>🎨 20 Themes</h3>
      <p>Swap one file. Every component recolors instantly.</p>
    </article>
    <article>
      <h3>🧩 68 Components</h3>
      <p>All bundled in one file — no dead styles to manage.</p>
    </article>
  </section>

  <h2 style="text-align:center;margin-top:var(--gap-2xl)">Simple pricing</h2>
  <table>
    <thead>
      <tr><th>Plan</th><th>Price</th><th>Projects</th><th>Support</th></tr>
    </thead>
    <tbody>
      <tr><td>Starter</td><td>Free</td><td>3</td><td>Community</td></tr>
      <tr><td>Pro</td><td>$29/mo</td><td>Unlimited</td><td>Email</td></tr>
      <tr><td>Enterprise</td><td>Custom</td><td>Unlimited</td><td>24/7 Dedicated</td></tr>
    </tbody>
  </table>

  <blockquote>
    <p>"The best DX we've ever used. Shipped our MVP in a weekend."</p>
    <footer>— Developer, Startup Inc.</footer>
  </blockquote>
  </main>

  <footer>
    <small>&copy; 2026 My Site. Built with EXSA.</small>
  </footer>

</body>
</html>
```

Every element above — the nav bar, the hero, the cards, the pricing table, the testimonial, the footer — is styled by EXSA's classless layer. **Zero component classes.** Plain HTML, baseline styling, always overridable.

---

## Architecture: The 10-Layer Cascade

EXSA uses CSS `@layer` to enforce a browser-native cascade. **Unlayered user CSS always wins** — no specificity fights, no `!important` wars.

```
Priority  Layer                 Covers
────────  ────────────────────  ──────────────────────────────────
  1       @layer exsa.tokens    95 design tokens in :root
  2       @layer exsa.themes    Theme token overrides (palette axis)
  3       @layer exsa.skins     Surface material recipes (skin axis)
  4       @layer exsa.fluid     Fluid clamp() tokens & density profiles
  5       @layer exsa.reset     Box model, focus rings, RTL, body
  6       @layer exsa.utilities Flex, grid, containers, breakpoints
  7       @layer exsa.elements  Guarded Classless — semantic HTML with instant opt-out
  8       @layer exsa.components 68 BEM components, zero specificity
  9       @layer exsa.layouts   Page shells (reserved)
  10      @layer exsa.overrides u-* escape-hatch utilities

  ∞       Unlayered             User CSS — always wins
```

### Why this matters

```css
/* Your CSS — any file, any selector, no :where(), no !important */
.my-button { background: purple; }

/* It ALWAYS beats EXSA's .btn--primary */
/* Unlayered CSS > all 10 @layers. Every time. */
```

---

## Design Tokens

All 95 tokens live in `:root` inside `@layer exsa.tokens`. Themes override the color tokens from `@layer exsa.themes` (swap one file, everything recolors). Skins override the thirteen `--surface-*` tokens from `@layer exsa.skins` (swap one file, every surface redraws, including the page backdrop via `--surface-canvas`).

### Base colors

| Token | Default | Purpose |
|---|---|---|
| `--color-bg` | `#fff` | Main background |
| `--color-bg-secondary` | `#e9e9e9` | Cards, inputs, hover states |
| `--color-text` | `#000` | Primary text |
| `--color-text-secondary` | `#757575` | Muted text |
| `--color-link` | `#118bee` | Links and primary accent |
| `--color-secondary` | `#920de9` | Secondary accent (purple) |
| `--color-border` | `#e9e9e9` | Borders, dividers, input outlines |
| `--color-overlay` | `rgba(0,0,0,.5)` | Modal/drawer backdrops |

### Semantic tokens

| Token | Default | Consumed by |
|---|---|---|
| `--color-success` | `#16a34a` | Buttons, badge, alert, toast, form-validation |
| `--color-danger` | `#dc2626` | Buttons, badge, alert, toast, form-validation |
| `--color-warning` | `#d97706` | Buttons, badge, alert |
| `--color-button-text` | `#fff` | Buttons, date-picker, topbar |
| `--color-button-text-inverse` | `#000` | Button text on light backgrounds |

### Layout tokens

| Token | Default |
|---|---|
| `--border-radius` | `5px` |
| `--box-shadow` | `2px 2px 10px` |
| `--font-family` | System font stack |
| `--font-family-mono` | SF Mono, Cascadia Code, Fira Code, Consolas |
| `--line-height` | `1.5` |
| `--width-card` | `285px` |
| `--width-content` | `1080px` |

### Gap scale

| Token | Value |
|---|---|
| `--gap-xs` | `0.25rem` |
| `--gap-sm` | `0.5rem` |
| `--gap-md` | `0.75rem` |
| `--gap` | `1rem` |
| `--gap-lg` | `1.5rem` |
| `--gap-xl` | `2rem` |
| `--gap-2xl` | `3rem` |

---

## Layout System

Always active — no `.exsa` prefix needed.

### Containers

```html
<div class="container">        1080px max, auto-centered</div>
<div class="container-sm">     800px max</div>
<div class="container-full">   100% width</div>
```

### Flexbox (1D layout)

```html
<div class="flex gap">
  <div class="flex-none">Sidebar</div>
  <div class="flex-1">Content</div>
</div>
```

| Category | Classes |
|---|---|
| Display | `.flex`, `.flex-inline`, `.flex-col`, `.flex-col-rev`, `.flex-row-rev`, `.flex-wrap`, `.flex-nowrap` |
| Sizing | `.flex-1`, `.flex-auto`, `.flex-none` |
| Justify | `.justify-start`, `-end`, `-center`, `-between`, `-around`, `-evenly` |
| Align | `.items-start`, `-end`, `-center`, `-baseline`, `-stretch` |
| Self | `.self-start`, `-end`, `-center`, `-stretch` |
| Gap | `.gap-0`, `.gap-xs`, `.gap-sm`, `.gap`, `.gap-lg`, `.gap-xl` |

### CSS Grid (2D layout)

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap">
  <div>Card</div>
  <div>Card</div>
  <div>Card</div>
</div>
```

| Class | Effect |
|---|---|
| `.grid` | `display: grid` |
| `.grid-cols-1`–`.grid-cols-8` | Fixed columns |
| `.grid-auto-fit` | `repeat(auto-fit, minmax(200px, 1fr))` — auto-wrapping cards |

### Responsive Breakpoints

> **Spacing, typography, and shape scale fluidly without breakpoints** — link `exsa.fluid.css` and tokens handle the rest. Use the responsive classes below only for structural changes.

| Breakpoint | Flex classes | Grid classes |
|---|---|---|
| **max-sm** `<576px` | `.max-sm:flex-col`, `.max-sm:flex-wrap` | `.max-sm:grid-cols-1` |
| **md** `≥768px` | — | `.md:grid-cols-2`–`.md:grid-cols-6` |
| **lg** `≥1024px` | — | `.lg:grid-cols-3`–`.lg:grid-cols-6` |
| **xl** `≥1280px` | — | `.xl:grid-cols-3`–`.xl:grid-cols-6` |
| **xxl** `≥1440px` | — | `.xxl:grid-cols-3`–`.xxl:grid-cols-6` |

> **The 576–767px range has no responsive prefix** — elements use their base (mobile-first) styles. `max-sm:` is for sub-576px tweaks; `md:` starts at 768px. This is intentional, not a gap.

---

## Guarded Classless

EXSA's signature feature. Opt-in by adding `class="exsa"` to `<body>`. Semantic HTML elements — `<nav>`, `<section>`, `<table>`, `<form>`, `<button>`, `<blockquote>`, `<dialog>`, `<article>`, `<aside>` — get automatic baseline styling. Add any class to any of those elements and EXSA instantly steps aside. Zero specificity. No `!important`.

### Coexisting with other CSS

EXSA ships entirely inside `@layer` blocks and uses plain, unprefixed utility names. Class names are global — so when EXSA shares a page with other stylesheets, the outcome is predictable:

- **Unlayered author CSS always beats layered CSS.** Your own `.container { … }` written normally overrides EXSA's.
- **To let EXSA win instead**, put competing rules in an `@layer` declared before the `exsa.*` layers (later layers win), or drop the duplicate rule.
- **Debug mode detects conflicts for you** — with `<html data-debug>`, `exsa.debug.js` warns when a non-EXSA stylesheet defines a class name the framework also uses.

### Navigation

```html
<nav>
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">Products</a>
      <ul>
        <li><a href="#">Widgets</a></li>
        <li><a href="#">Gadgets</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

- Horizontal bar with dropdowns on hover/focus
- Collapsible submenus on mobile via `:focus-within`
- RTL-aware via logical properties

### Cards & Callouts

```html
<section>
  <article>                           <!-- card: border, shadow, rounded -->
    <h3>Title</h3>
    <p>This is a card.</p>
  </article>
  <article>
    <h3>Another</h3>
    <p>Two or more articles in a section become a card grid.</p>
  </article>
</section>

<article>
  <aside>                             <!-- callout: accent bar -->
    <strong>Note:</strong> This is a sidebar callout.
  </aside>
</article>
```

- **Cards** = `<article>` — 2+ in a `<section>` form a responsive grid
- **Callouts** = `<aside>` inside an `<article>` — uses `border-inline-start`, auto-flips in RTL
- For single/advanced cards (horizontal, image, glass), use the `.card` component

### Forms

```html
<form>
  <label>Email <input type="email" required></label>
  <label>Message <textarea></textarea></label>
</form>
```

- Styled inputs, selects, textareas, checkboxes, radios
- Validation feedback via `:user-invalid` / `:valid`

### Tables

```html
<table>
  <thead><tr><th>Name</th><th>Role</th></tr></thead>
  <tbody>
    <tr><td>Alice</td><td>Engineer</td></tr>
    <tr><td>Bob</td><td>Designer</td></tr>
  </tbody>
</table>
```

- Styled header, rounded corners, cell padding
- Corners use logical properties — auto-flip in RTL

### Other elements

| Element | Styling |
|---|---|
| `<button>` | Neutral bordered button with hover and click feedback |
| `<blockquote>` | Centered, large text, optional `<footer>` for attribution |
| `<dialog>` | Animated entry, backdrop, scrollable, responsive width |
| `<code>`, `<pre>` | Inline code blocks, pre-wrapped pre blocks |
| `<details>`, `<summary>` | Clickable disclosure widgets |
| `<hr>` | Themed divider |
| `<small>` | Secondary text color |
| `<mark>` | Highlighted text |
| `<sup>` | Badge-style superscript |

---

## Dark Mode & Theming

### Three-mode system

Set `data-theme-mode` on `<html>`:

```html
<html data-theme-mode="dark">   <!-- force dark — ignores OS -->
<html data-theme-mode="light">  <!-- force light — ignores OS -->
<html>                          <!-- auto — follows OS preference -->
```

### 20 Themes

| Theme | Vibe | Theme | Vibe |
|---|---|---|---|
| **Breeze** | Clean blue & white | **Nova** | Deep slate + electric blue |
| **Night** | Dark navy & slate | **Prism** | Cool slate + teal |
| **Coral** | Warm red-orange | **Volt** | Navy + electric yellow |
| **Forest** | Calm greens | **Abyss** | Deep purple & charcoal |
| **Sepia** | Paper-like warmth | **Ember** | Warm amber & brown |
| **Steel** | Industrial grey | **Ink** | High-contrast black & white |
| **Ledger** | Ink & parchment | **Shadow** | Muted grey & slate |
| **Clinic** | Medical teal | **Sojourn** | Warm sandstone & terracotta |
| **Console** | Phosphor-green terminal | **Travei** | Cool cyan & slate |
| **Mono** | Pure black & white | **Tropic** | Vibrant teal & coral |

Every theme is ~30 lines of color custom properties — the palette axis owns colors only. All 20 pass WCAG AA contrast.

### 10 Skins — the material axis

Themes answer *which colors*. Skins answer *how surfaces are drawn* — backgrounds, borders, shadows, blur, radius. A skin is a ~30-line token-only file in `@layer exsa.skins`: link one after core + theme and every surface follows.

| Skin | Look |
|---|---|
| `flat` | solid surfaces, thin borders, zero effects |
| `glass` | clear: translucent tint + bright edge, no frost |
| `neomorphic` | dual light/dark shadows, no borders |
| `clay` | inflated: soft gradient, big soft shadow |
| `skeuomorphic` | bevel gradients, layered shadows, serif |
| `glossy` | frosted: translucent + backdrop blur + sheen |
| `brutalist` | zero radius, thick borders, hard offset shadows |
| `metallic` | brushed-metal banding, machined inset edges |
| `glow` | frosted: translucent + blur + neon glow — best on dark |
| `neon` | neon signage — darkened plates with glowing edges |

```html
<link rel="stylesheet" href="skins/glass.css">
```

Skins never hardcode colors — every value derives from the active theme via `color-mix()`, so 20 palettes × 10 skins = 200 looks from 30 files.

### Runtime theme switching

```js
// Give the theme <link> an id="theme-link", then swap its href at runtime:
document.getElementById('theme-link').href = 'themes/night.css';
```

---

## Components

All 68 components ship in `exsa.bundle.css` — no per-component files to manage. Link the bundle, then use any component class.

### Button variants

```html
<button class="btn btn--primary">Primary</button>
<button class="btn btn--success">Success</button>
<button class="btn btn--danger">Danger</button>
<button class="btn btn--warning">Warning</button>
<button class="btn btn--neutral">Neutral</button>
<button class="btn btn--outline">Outline</button>
<button class="btn btn--ghost">Ghost</button>
```

Sizes: `.btn--sm`, `.btn--lg` | Modifiers: `.btn--icon`, `.btn--block` | State: `disabled`

### Full component list (68)

| Category | Components |
|---|---|
| **Layout** | Accordion, Drawer, Footer, Hero, Modal, Pricing Table |
| **Navigation** | Topbar, Sidebar, Back to Top, Breadcrumbs, Context Menu, Pagination, Stepper, Timeline, Tooltip |
| **Content** | Avatar, Badge, Card, Code Block, Data List, Separator, Table |
| **Media** | Lightbox, Music Player, Video Gallery, Carousel, Slideshow |
| **Data** | Bar Chart, Donut Chart, Progress Bars, Range Slider |
| **Forms** | Checkbox, Color Picker, Advanced Color Picker, Date Picker, Dropdown, Form Validation, Input Group, Password Input, Popover, Radio, Rating, Select, Toggle |
| **Actions** | Buttons, Panel Resizer, Tabs |
| **Feedback** | Alert, Cookie Bar, Skeleton Loader, Spinner, Toast |

---

## Controlling Components from JavaScript

EXSA is CSS-first: most component state is a class, not a method call. Toggle the class and the component follows.

### State via class (the majority)

| Component | State hook | Programmatic control |
|---|---|---|
| Modal | `.modal--open` | `el.classList.add('modal--open')` — overlay, Esc, close and focus-trap are wired by `exsa.js` |
| Drawer | `.drawer__toggle` checkbox | set its `checked` property |
| Lightbox | `.lightbox--open` | `classList` |
| Topbar | `.topbar--open` (mobile menu), `.topbar--scrolled` | `classList` |
| Dropdown | `.dropdown--open` | `classList` |
| Context menu | `.ctx-menu--open` | `classList` |
| Popover | `.popover--open` | `classList` |
| Tabs | `.tabs__tab--active` + `.tabs__panel--active` | `classList` |
| Back to top | `.back-top--visible` | `classList` |
| Cookie bar | `.cookie-bar--visible` | `classList` |

### Shared helpers (in `exsa.js`)

```js
EXSA.ready(fn)                // run on DOMContentLoaded (or immediately if ready)
EXSA.trapFocus(container)     // locks Tab inside; returns an off() cleanup function
EXSA.getFocusable(container)  // first focusable element, or null
EXSA.bp.up('md')              // matchMedia min-width wrapper — use .matches
EXSA.bp.down('md')            // matchMedia max-width wrapper
EXSA.bp.val('md')             // raw breakpoint value
```

### Events fired by components

Interactive components dispatch `exsa:*` CustomEvents on their root element:

```js
kanban.addEventListener('exsa:kanban-drop', e => console.log(e.detail));
upload.addEventListener('exsa:upload-done', e => console.log(e.detail));
calendar.addEventListener('exsa:day-select', ...);
transfer.addEventListener('exsa:transfer-change', e => console.log(e.detail));
table.addEventListener('exsa:table-sort', ...);
carousel.addEventListener('exsa-slide-change', e => console.log(e.detail.index));
```

> **Known limitation** — components inserted into the DOM *after* page load aren't auto-initialized by every behavior. Initialize the page after your dynamic content is inserted, or re-bind manually.

---

## Icons

EXSA uses [Font Awesome](https://fontawesome.com) for icons. Add Font Awesome Free 6 to your page, then use any icon:

```html
<!-- Font Awesome Free 6 (CDN) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

<i class="fa-solid fa-magnifying-glass"></i>
<i class="fa-solid fa-heart"></i>
<i class="fa-solid fa-gear"></i>
```

- Icons inherit `currentColor`, so they auto-match the active theme.
- Components that draw their own icons (select chevron, back-to-top arrow, form-helper marks, code-block copy button) already use Font Awesome glyphs internally — they need the FA stylesheet above.
- Self-host the woff2 files (CC BY 4.0 / OFL / MIT) for offline or CSP-strict deployments.

> **Note:** Font Awesome Free is free for commercial use. Pro (more icons, more styles) is a paid subscription.

---

## Accessibility

EXSA targets WCAG 2.1 AA compliance.

### Built-in

| Feature | Implementation |
|---|---|
| `:focus-visible` | Keyboard focus rings on all interactive elements |
| `prefers-reduced-motion` | Disables animations for users who prefer reduced motion |
| Skip link | `.skip-link` — visually hidden until focused |
| `.sr-only` | Screen-reader-only content utility |
| Color contrast | All 20 themes pass WCAG AA (4.5:1+) |
| Logical properties | `border-inline-start`, `inset-inline-end`, etc. — auto-flip in RTL |
| `prefers-color-scheme` | Auto dark/light mode |

### Still in progress

- Full keyboard audit across all 68 components
- Screen reader testing (NVDA, VoiceOver)

---

## Browser Support

| Feature | Minimum |
|---|---|
| Custom properties | Chrome 49, Firefox 31, Safari 9.1 |
| `:where()` | Chrome 88, Firefox 78, Safari 14 |
| `@layer` | Chrome 99, Firefox 97, Safari 15.4 |
| Container queries | Chrome 105, Firefox 110, Safari 16 |
| `:has()` | Chrome 105, Firefox 121, Safari 15.4 |
| Logical properties | Chrome 89, Firefox 66, Safari 15 |
| `color-mix()` | Chrome 111, Firefox 113, Safari 16.2 |
| `light-dark()` | Chrome 123, Firefox 120, Safari 17.5 |

**Support tiers** — older browsers degrade in defined steps; the page never gets a half-applied theme.

| Cohort | Behavior |
|---|---|
| 2024+ (Chrome 123+, Firefox 121+, Safari 17.5+) | **Full** — layers, `color-mix()`, `:has()`, container queries, `light-dark()`. |
| 2023 (Chrome 111–122, Firefox 113–120, Safari 16.2–17.4) | `light-dark()` falls back to a built-in system-color palette. Firefox < 121 lacks `:has()`: classless card/hero auto-detection renders as plain vertical cards. |
| 2022 – early 2023 (Chrome 99–110, Firefox 97–112, Safari 15.4–16.1) | `@layer` works; `color-mix()` doesn't — surface tokens fall back to flat, opaque values. Styled and readable. |
| Pre-2022 (Chrome < 99, Firefox < 97, Safari < 15.4) | **Unstyled.** `@layer` is a hard requirement. |

**Not supported**: IE11 (no custom properties).

---

## File Size

| File | Size |
|---|---|
| `exsa.bundle.css` | ~268 KB |
| `exsa.js` | ~112 KB |
| `exsa.fluid.css` | ~3 KB (optional) |
| Each theme | ~1.4 KB |
| Each skin | ~1 KB |

No minification needed — the files are already compact.

Compressed over the wire, they are far smaller: gzip takes `exsa.bundle.css` to ~53 KB and brotli to ~44 KB. Managed hosts (Cloudflare, Netlify, Vercel, GitHub Pages) compress automatically; self-managed servers need a one-line config (see the User Guide, §16).

---

## Comparison

| | EXSA | Bootstrap | Tailwind |
|---|---|---|---|
| **Build step** | None | None (SCSS optional) | Yes (PostCSS/CLI) |
| **No template engine needed** | ✅ | ✅ | ❌ |
| **Guarded Classless™** | Yes — semantic HTML with opt-out | No | No |
| **Runtime theming** | 20 themes, live-swappable | Light/dark in 5.3 | Dark mode with `dark:` |
| **CSS Grid utilities** | Yes | Limited | Yes |
| **`@layer` cascade** | Yes — 10 layers | No | Yes (v3.2+) |
| **`:has()` support** | Yes | No | No |
| **Container queries** | Yes | No | Yes (v3.2+) |
| **Component library** | 68 token-driven components | 20+ components | None (Headless UI separate) |
| **Specificity model** | Zero (`:where()` + `@layer`) | Normal | Normal |

---

## Project Structure

```
root
├── exsa.bundle.css       The framework (core + 68 components + default theme)
├── exsa.js               All behaviors, one file
├── exsa.fluid.css        Fluid tokens & density profiles (optional)
├── exsa.debug.css        Markup/class linter (dev only)
├── exsa.debug.js         Debug tooling (dev only)
├── themes/               20 color palettes
├── skins/                10 surface-material recipes
├── docs/                 README + PHILOSOPHY
├── LICENSE               MIT License
└── TRADEMARK.md          Trademark guidelines
```

---

## Getting Started (No Server)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Site</title>
  <link rel="stylesheet" href="exsa.bundle.css">
  <link rel="stylesheet" href="themes/breeze.css">
</head>
<body class="exsa">
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">Blog</a></li>
    </ul>
  </nav>
  <main>
    <section>
      <h1>Hello World</h1>
      <p>This page is styled entirely by EXSA's classless mode.</p>
      <article>
        <h3>Info Card</h3>
        <p>Cards work without any classes.</p>
      </article>
      <article>
        <h3>Second Card</h3>
        <p>Two or more articles form a grid.</p>
      </article>
    </section>
  </main>
  <footer>
    <p>&copy; 2026</p>
  </footer>
</body>
</html>
```

---

## License

EXSA is [MIT licensed](../LICENSE) — use it freely in personal, commercial, and client projects.

See [TRADEMARK.md](../TRADEMARK.md) for guidelines on using the EXSA name and the Guarded Classless™ methodology.

---

## Feedback & Community

EXSA is at v1.0.0-rc.3 — your feedback shapes what 1.0 becomes.

- 🐛 **Bug reports & feature requests:** [GitHub Issues](https://github.com/Saif-Almarri/exsa/issues)
- 💬 **Questions & ideas:** [GitHub Discussions](https://github.com/Saif-Almarri/exsa/discussions)

### How to Give Great Feedback

- **Found a bug?** Include your browser and version, a minimal code snippet, and what you expected vs. what happened.
- **Want a feature?** Describe the problem you're solving, not just the solution.
- **Theme or component idea?** Share a mockup or a description.

---

## Co-Founders Wanted

EXSA was founded by **Saif Almarri**, who invented the 10-layer cascade architecture and the Guarded Classless™ pattern. He leads product direction.

EXSA has three contributor slots — one per co-founder role. Invite-only, not an open call:

- 🧩 **Technical** — own the component library and engineering
- 📣 **Growth** — own ads, video, community, and marketing (no coding)
- 📢 **Brand & Community** — own conferences, technical writing, and community trust

👉 **[See CONTRIBUTING.md](CONTRIBUTING.md)** for the full story and how to start.

---

## Inventor's Statement

The **10-layer CSS cascade architecture** (tokens → themes → skins → fluid → reset → utilities → elements → components → layouts → overrides), the **Guarded Classless™** pattern, and the **Fluid Scale + Density Profiles** system are original inventions of Saif Almarri, first published in 2026. See [PHILOSOPHY.md](PHILOSOPHY.md) for the full technical documentation and design rationale.

---

*Built on the idea that CSS custom properties are the design system. @layer enforces the cascade. Themes are just token overrides. Components are just files. Semantic HTML works out of the box — add a class, the framework gets out of your way. No build step. No config. Just CSS, the way it was meant to work.*

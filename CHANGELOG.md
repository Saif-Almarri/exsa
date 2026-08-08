# Changelog

All notable changes to EXSA will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-beta.2] — 2026-07-28

### ✨ Added

- **Card horizontal variants** — `.card--horizontal` and `.card--horizontal-reverse` with CSS Grid layout (image beside content, footer under body). New sub-elements: `.card__head-row`, `.card__rating`, `.card__divider`.
- **Typography tokens** — `--font-size-xs` through `--font-size-2xl` (7 tokens), `--font-weight-normal/bold/heavy` (3 tokens), `--font-family-mono`.
- **Border token** — `--color-border` added; all element borders now reference it instead of `--color-bg-secondary`.
- **Overlay & button tokens** — `--color-overlay` (modal/drawer backdrops), `--color-button-text-inverse` (dark theme button text).
- **Logical alignment classes** — `.text-start` and `.text-end` alongside `.text-left`/`.text-right`.

### 🔧 Fixed

- **Skip-link** — RTL border-radius, `inset-inline-start` for logical positioning, forced-colors support.
- **Nav dropdown** — gap changed from `1.7rem` to `margin-top: var(--gap-xs)`.
- **Sup badge** — `vertical-align: super` replaces `top: -2px`.
- **List padding** — `padding-inline-start: 1.2em` replaces physical `padding-left`.
- **Form width** — `input:not([type])` included in full-width selector.
- **`img:not([alt])`** — red dashed outline dev warning for missing alt text.
- **`[hidden]`** — `display: none !important` prevents accidental overrides.

### 📦 Size

- **26 KB** raw, **~5.6 KB** gzipped (was 19.8 KB / ~6.7 KB). Growth from new tokens, horizontal card, and a11y improvements. Comments trimmed — cheatsheet.php is the canonical docs source.

---

## [1.0.0-beta] — 2026-07-24

### 🚀 First Public Release

Initial beta launch of EXSA — a 5-layer CSS framework built on tokens, not tools.

### ✨ Added

- **5-layer cascade architecture** (`@layer`):
  1. `exsa.tokens` — 61 CSS custom properties
  2. `exsa.reset` — Box model, focus rings, accessibility, RTL
  3. `exsa.layout` — 85+ flex/grid utilities
  4. `exsa.elements` — Guarded Classless™ semantic HTML styling
  5. `exsa.components` — 50 BEM components with zero specificity (`:where()`)

- **50 Components:** accordion, alert, avatar, back-to-top, badge, breadcrumbs, buttons, card, checkbox, code-block, color-picker, context-menu, cookie-bar, dashboard, data-list, date-picker, donut, drawer, dropdown, footer, form-required, form-validation, input-group, lightbox, modal, music-player, pagination, password-input, popover, pricing-table, progress, radio, range-slider, rating, resizer, select, separator, sidebar, skeleton, slideshow, spinner, stepper, table, tabs, timeline, toast, toggle, tooltip, topbar, video-gallery

- **110 SVG Icons** — stroke-based, currentColor, 24×24. Browsable gallery at `icons.php`. Use with `<span class="ic ic-name"></span>`. Covers navigation, actions, text editing, media, account, security, commerce, and developer tools.

- **20 Themes:** abyss, breeze, clinic, console, coral, ember, forest, ink, ledger, mono, night, nova, prism, sepia, shadow, sojourn, steel, travei, tropic, volt

- **Guarded Classless™** — Semantic HTML styled automatically; adding any class instantly opts out

- **CDN support** via jsDelivr — no install required

- **Bundle Generator** — select only the components you need

- **Design tokens export** (`tokens.json`) — for Figma, JS, or Tailwind config

- **OpenLiteSpeed / CyberPanel compatibility**

### 📦 Size

- **19.8 KB** core (style.css)
- Components: ~1 KB each
- Themes: ~1–2 KB each

### 🔗 Links

- **Website:** [exsa.dev](https://exsa.dev)
- **GitHub:** [github.com/Saif-Almarri/exsa](https://github.com/Saif-Almarri/exsa)
- **CDN:** `https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/style.css`

# Changelog

All notable changes to EXSA will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-beta.3] — 2026-08-14

### ✨ Added

- **Two new page layouts** — `layouts/fullpage.css` (single-viewport landing: backdrop, centered brand, social rings, pure-CSS `:target` panels) and `layouts/onepage.css` (multi-section marketing page: photo hero, nested hover dropdowns, banner, carousel, features grid, dark footer). Layouts are selectable in the Bundle Generator.
- **Token-driven z-index scale** — 19 `--z-*` tokens (from `--z-floating: 10` to `--z-skip: 10000`) in `style.css`. Every cross-component overlay (topbar, modal, drawer, toast, lightbox…) and layout shell layer consumes them. Modals now sit above the topbar (`--z-modal: 1050`).
- **Code Block behavior** — `js/code-block.js`: copy-to-clipboard (Clipboard API + fallback) and automatic syntax highlighting (`hl-tag/attr/val/cmt`) that skips already-highlighted blocks. Loaded by showcase, elements, and page-layouts.
- **Generator: Page Layouts section** — pick any of the six layouts; bundled into `bundle.css` with stats and cache-busted assets.
- **Form Required showcase demo** — automatic `:user-invalid` / required-asterisk feedback documented in the showcase.

### 🔧 Fixed

- **Generator JS bundle was broken** — behaviors were regex-extracted from the legacy `components.js` using markers that don't exist; now each behavior's `source` file (`js/*.js`) is fetched directly from the manifest.
- **Removed all `!important` from components** — back-top/lightbox/cookie-bar hover filters replaced with element-prefixed selectors that beat the guarded `:where()` link rules naturally; topbar list padding no longer needs `!important`.
- **Tooltip sizing** — long tips now wrap into a clamped bubble (`width: max-content; max-width: min(320px, 100vw - 24px)`) instead of overflowing the viewport or collapsing into a skinny column.
- **Tooltip demo clipping** — `.doc-demo:has(.tooltip)` now overflows visibly, matching the color-picker fix.
- **Docs synced** — six layouts documented in `docs.php` and `page-layouts.php`; topbar CTA reads “Generate custom CSS”.

### 📦 Size

- **32 KB** core (z-index scale + layout tokens added).

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

## [1.0.0-beta] — 2026-July

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

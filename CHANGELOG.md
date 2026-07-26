# Changelog

All notable changes to EXSA will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-beta] — 2026-07-24

### 🚀 First Public Release

Initial beta launch of EXSA — a 5-layer CSS framework built on tokens, not tools.

### ✨ Added

- **5-layer cascade architecture** (`@layer`):
  1. `exsa.tokens` — 37 CSS custom properties
  2. `exsa.reset` — Box model, focus rings, accessibility, RTL
  3. `exsa.layout` — 85+ flex/grid utilities
  4. `exsa.elements` — Guarded Classless™ semantic HTML styling
  5. `exsa.components` — 50 BEM components with zero specificity (`:where()`)

- **50 Components:** accordion, alert, avatar, back-to-top, badge, breadcrumbs, buttons, card, checkbox, code-block, color-picker, context-menu, cookie-bar, dashboard, data-list, date-picker, donut, drawer, dropdown, footer, form-base, form-validation, input-group, lightbox, modal, music-player, pagination, password-input, popover, pricing-table, progress, radio, range-slider, rating, resizer, select, separator, sidebar, skeleton, slideshow, spinner, stepper, table, tabs, timeline, toast, toggle, tooltip, topbar, video-gallery

- **17 Themes:** abyss, breeze, clinic, console, coral, ember, forest, ink, ledger, mono, night, nova, prism, sepia, shadow, steel, volt

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

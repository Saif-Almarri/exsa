# Trademarks & Original Inventions

"EXSA" and "Guarded Classless" are trademarks of Saif Almarri.

The EXSA code is MIT-licensed — you are free to use, modify, and distribute it.
The EXSA name, logo, and the ideas listed below are protected as trademarks and
original inventions. This means:

- ✅ You may use the EXSA name to attribute the framework in your project
  (e.g., "Built with EXSA").
- ✅ You may refer to any of the ideas below when discussing or teaching the
  architectural patterns — with proper attribution to Saif Almarri / EXSA.
- ❌ You may not use the EXSA name or logo to promote a derivative or
  competing framework, product, or service.
- ❌ You may not claim any of the ideas below as your own original invention.

---

## EXSA's Original Ideas

These are the inventions that make EXSA the only framework of its kind.
First published in 2026 by **Saif Almarri** as part of the EXSA CSS Framework.

### 1. The 5-Layer Cascade Architecture

CSS `@layer` enforces browser-native priority: **tokens → reset → layout →
elements → components.** Each layer feeds the next. Themes and user CSS sit
*outside* all layers — unlayered styles always override layered ones.
Specificity becomes irrelevant. No `!important` wars. Ever.

```
@layer exsa.tokens      → 61 CSS custom properties
     exsa.reset       → box model, focus, a11y, RTL, scrollbar
     exsa.layout      → 90+ flex & grid utilities
     exsa.elements    → Guarded Classless™ semantic HTML styling
     exsa.components  → 50 BEM components (intentionally unlayered)
```

### 2. Guarded Classless™

The signature pattern: `:where(.exsa element:not([class]))`. Add `class="exsa"`
to `<body>` and plain semantic HTML — `<nav>`, `<table>`, `<form>`, `<button>`,
`<blockquote>`, `<dialog>`, `<aside>` — gets automatic baseline styling.

Add **any class** to any of those elements, and EXSA instantly steps aside.
Zero specificity. No overrides needed. The framework defers to the developer
by default.

### 3. Token-Driven Design System

61 CSS custom properties drive all 50 components, 20 themes, and every layout
utility. Change `--color-link` in one place — every button, badge, link, card,
and toggle recolors instantly. No recompile. No variable hunt across 2,000 files.

Components don't have colors. They have `var(--color-link)`. Themes are just
~30 lines of token overrides. The tokens *are* the design system.

### 4. Zero Build Step. Zero Config. Zero Template Engine.

No CLI. No PostCSS. No Webpack. No `vite.config.js`. No Twig. No Blade.
No SASS. No `npm install` required — ever.

Two `<link>` tags and you have a complete design system with 50 components and
20 themes. Works with plain `.php` files, static `.html`, or any server
(Python, Node, Ruby, Go). `npm install @exsa/exsa` works too — but you'll
never need it. This is a permanent design constraint, not a temporary state.

### 5. Components as Files, Not Dependencies

Every component is a single CSS file (~1 KB). Link only what you need — zero
dead styles. No monolithic bundle. No tree-shaking config. For production,
the **Generator** at [exsa.dev/generator.php](https://exsa.dev/generator.php)
bundles only your selected components into one file. Same outcome as
tree-shaking — no build step needed.

### 6. CSS First, JavaScript Optional

The core (`style.css` + a theme) is pure CSS — tokens, reset, layout utilities,
and Guarded Classless™ element styling. Zero JavaScript. 58% of components
(29 of 50) are pure CSS too. The remaining 21 add interactivity via
`components.js` — a single `<script>` tag, same zero-build philosophy.

### 7. Fluid Tokens with Behavioral Profiles

`clamp()`-based spacing, typography, and border-radius scale smoothly with
viewport width — no `@media` queries, no breakpoints, no responsive utility
classes on every element.

Behavioral profiles — `data-profile="compact"` (dashboards), default
(comfortable), `data-profile="spacious"` (landing pages) — change the density
of every component with one HTML attribute. `--space-factor`, `--radius-factor`,
`--font-factor`, and `--motion-factor` cascade through the entire design system.
One optional file (`exsa.fluid.css`). Zero build.

---

## Attribution

The code is MIT-licensed. The ideas above are original inventions. If you build
on these ideas, credit the source: **Saif Almarri / EXSA CSS Framework (2026).**

See [PHILOSOPHY.md](PHILOSOPHY.md) for the full technical documentation and
design rationale behind each idea.

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

## EXSA's Original Inventions

Three architectural ideas, first published in 2026 by **Saif Almarri** as part
of the EXSA CSS Framework. These are what make EXSA a category of one.

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

### 3. Fluid Scale + Density Profiles

Two responsive systems combined into one — no other framework does both.

**Fluid by default.** Spacing, typography, and border-radius scale smoothly with
viewport width. No `@media` queries. No breakpoints. No responsive utility
classes. The UI breathes with the screen — automatically.

**Density profiles.** `data-profile="compact"` (dashboards, data-heavy UIs),
default (comfortable), or `data-profile="spacious"` (landing pages, marketing)
on `<html>` — and every component shifts density. One attribute. Four factors
(`--space-factor`, `--radius-factor`, `--font-factor`, `--motion-factor`)
cascade through all 50 components simultaneously.

One optional file (`exsa.fluid.css`). Zero build.

---

## Design Principles (not inventions)

These aren't new ideas — but they're non-negotiable in EXSA:

- **Token-driven.** 61 CSS custom properties drive every component and theme.
  Components don't have colors — they have `var(--color-link)`. Themes are ~30
  lines of token overrides. (Token systems predate EXSA; see Open Props.)
- **Zero build step.** Two `<link>` tags, no CLI, no config file. Works with
  plain `.php` files. (Many frameworks work this way; it's a choice, not an
  invention.)
- **Components as files.** Each component is a single ~1 KB CSS file. Link only
  what you need. (Standard practice across the industry.)
- **CSS first, JS optional.** 58% of components are pure CSS. Interactive
  behaviors are one `<script>` tag. (Many frameworks are CSS-only.)

---

## Attribution

The three inventions above are original work. The code is MIT-licensed. If you
build on these ideas, credit the source: **Saif Almarri / EXSA CSS Framework (2026).**

See [PHILOSOPHY.md](PHILOSOPHY.md) for the full technical documentation and
design rationale.

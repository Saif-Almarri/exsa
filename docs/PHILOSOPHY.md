# The EXSA Philosophy

*Why we built a CSS framework in an era that already has hundreds.*

---

## Inventor's Statement

The **9-layer CSS cascade architecture** (tokens → themes → fluid → reset →
utilities → elements → components → layouts → overrides)
and the **Guarded Classless™** pattern (`:where(.exsa element:not([class]))`)
are original inventions of **Saif Almarri**, first published in 2026 as part
of the EXSA CSS Framework.

This document serves as a definitive public record of these inventions.
The EXSA code is MIT-licensed — use it freely, build on it, ship it.
But the architectural methodology is my original work. If you build on
these ideas, I ask that you attribute them as such.

---

## The Core Belief

> **CSS custom properties are the design system. The cascade should enforce the architecture. The framework should defer to the developer.**

EXSA was not built because the world needed another button component. It was built because three W3C standards — `@layer`, `:where()`, and `:not([class])` — reached broad browser support, and no one had yet combined them into a single architectural pattern.

That pattern is **Guarded Classless™**.

---

## Why Guarded Classless Didn't Exist Before

Bootstrap launched in 2011. Tailwind launched in 2017. Neither could have built what EXSA does — the CSS features didn't exist yet.

| Feature | Browser Support | What It Enables |
|---------|----------------|-----------------|
| `:not([class])` | ~2015 | Detect whether the developer has customized an element |
| `:where()` | Chrome 88 (2021) | Zero-specificity selectors — your styles always win |
| `@layer` | Chrome 99 (2022) | Cascade order without specificity wars |
| `:has()` | Chrome 105, Safari 15.4 (2022) · Firefox 121 (2023) | Structural detection — styles react to what an element contains |
| Container queries | Chrome 105, Safari 16 (2022) · Firefox 110 (2023) | Components respond to their own width, not the viewport |

EXSA is the first framework designed *after* these features became baseline. Every architectural decision flows from asking: *what can CSS do now that it couldn't do five years ago?*

---

## The Three Pillars

### 1. Guarded Classless — style HTML, then get out of the way

Add `class="exsa"` to `<body>`. Semantic elements — `<nav>`, `<table>`, `<form>`, `<button>`, `<blockquote>`, `<dialog>`, `<aside>` — get automatic baseline styling.

Add a **`class` attribute** to any of those elements — any value, even `class=""` or a JavaScript hook class — and EXSA steps aside for that element. (For pure JavaScript hooks, prefer `data-*` attributes, so styling intent and behavior intent never collide.)

```
<!-- EXSA styles this automatically -->
<table>...</table>

<!-- EXSA steps aside — you're in control -->
<table class="data-grid">...</table>
```

This is the reversal of the traditional framework power dynamic. Most frameworks say: "we style this, override us if you can." EXSA says: "we style this only if you haven't customized it." The framework defers to the developer by default.

**Technical implementation:** `:where(.exsa table:not([class]))` — zero specificity, self-guarding, one rule per element.

### 2. Token-Driven Everything

All 53 components share 82 design tokens. Every color, every shadow, every border-radius, every gap, every z-index — it all flows from `:root` tokens.

Swap one theme file. Every component, every element style, every utility class recolors instantly. No rebuild. No recompile. No class-name hunt across 200 files.

This is not "CSS variables are nice to have." This is: *the tokens are the design system.* The components are just expressions of the tokens.

### 3. The Cascade as Architecture

CSS `@layer` is the most underused feature in the language. EXSA builds its entire architecture on it:

```
@layer exsa.tokens      → 82 design tokens
     exsa.themes       → theme token overrides
     exsa.fluid        → clamp() scaling, density profiles
     exsa.reset        → box model, focus, a11y, RTL
     exsa.utilities    → flex, grid, containers
     exsa.elements     → Guarded Classless
     exsa.components   → 53 BEM components
     exsa.layouts      → page shells
     exsa.overrides    → u-* escape-hatch utilities
```

Each layer feeds the next. Themes and user CSS sit *outside* all layers — unlayered styles always override layered ones. Specificity becomes irrelevant. You never need `!important`.

### 4. Fluid as an Option. Adaptive When Needed.

Link the optional `exsa.fluid.css` and tokens drive responsive behavior, not just colors. Via `clamp()`, scalar values like spacing, font size, and border radius scale smoothly with viewport width. No `@media` queries. No breakpoints. No responsive utility classes on every element.

```css
/* exsa.fluid.css — mobile to desktop, no breakpoints, no classes */
--gap: calc(clamp(0.75rem, 0.6rem + 0.5vw, 1.25rem) * var(--space-factor));
```

Behavioral profiles (`data-profile="compact"`, `data-profile="spacious"`) change the density of every component with one HTML attribute — `--space-factor`, `--radius-factor`, `--font-factor` cascade through the entire design system. Fluid for values. Adaptive for layout. One optional file. Zero build.

---

## What EXSA Is Not

- **Not a utility framework.** EXSA believes component classes (`card`, `btn--primary`) carry more meaning than atomic utilities (`bg-white rounded-lg shadow-md p-6`). Semantic HTML should work without 12 classes on a div.
- **Not a design system.** EXSA ships no design opinions — 20 themes prove the same component can look completely different. The tokens are the system. You bring the design.
- **Not a JavaScript framework.** No React, Vue, or Svelte wrappers needed. EXSA is CSS — it works with any backend, any static server, no package manager required.
- **Not a "minimal" framework.** 53 components, 20 themes, 90+ layout utilities, a bundle generator, and a classless engine. Small in KB. Not small in capability.

---

## The Design Principles

1. **Defer to the developer.** Guarded Classless. Zero specificity. Unlayered user CSS always wins.
2. **Tokens are the truth.** Components don't have colors. They have `var(--color-link)`. Themes are just token overrides.
3. **One file, one component.** No monolithic CSS. Link only what you need. For production, the **Generator** bundles only your selected components — same outcome as tree-shaking, no build step needed.
4. **The platform is the framework.** `@layer`, `:where()`, custom properties, container queries, `prefers-reduced-motion`, `forced-colors` — EXSA doesn't reinvent. It orchestrates what browsers already do.
5. **Zero build step, forever.** No bundler. No CLI. No config file. No template engine required — Twig, Blade, SASS, PostCSS: none of it. Plain `.php` files and `<link>` tags always work. The Generator handles optimization when you're ready. This is not a temporary state. It is a permanent design constraint.

---

## Why This Matters

CSS frameworks have spent a decade oscillating between two extremes:
- **Bootstrap:** opinionated, component-first, specificity-heavy, hard to customize
- **Tailwind:** utility-first, highly customizable, but 12 classes on a single div, hard-coded values everywhere

EXSA offers a third path: **token-driven components with classless fallback.** Semantic HTML gets a respectable baseline for free. Components upgrade the experience when you're ready. Themes swap instantly. The framework never fights you.

---

## The Competitive Landscape — EXSA's Position

No other framework occupies the intersection EXSA does.

| Category | Example | Components | Tokens | Classless | Guarded* |
|----------|---------|:---:|:---:|:---:|:---:|
| Utility | Tailwind, UnoCSS | ❌ | ❌ | ❌ | ❌ |
| Traditional | Bootstrap, Bulma | ✅ | ❌ | ❌ | ❌ |
| Token-only | Open Props, Pollen | ❌ | ✅ | ❌ | ❌ |
| Classless | Pico, Water, Simple, Sakura | ❌ | ❌ | ✅ | ❌ |
| **EXSA** | — | ✅ 53 | ✅ 82 | ✅ | ✅ |

*\*Guarded = styles automatically, but steps aside when you add any class*

**Open Props** (Adam Argyle, Google) is philosophically closest — design tokens as CSS variables. But it ships zero components. You get `--size-3`; you don't get `.card`, `.modal`, or `.toast`. EXSA gives you both: the token system *and* 53 components already wired to it.

**Pico CSS** (~13K GitHub stars) proved developers want classless semantic HTML styling. But it has no guard — add a class and Pico still imposes its styles. You fight it with specificity. And it offers very few components beyond forms and typography.

**Water.css, MVP.css, Simple.css, Sakura** — all classless, all beautiful for simple pages. None have components. None have a guard. None are token-driven. They style unconditionally and leave you to override.

The classless frameworks validated the demand. But they all hit the same wall: the framework and the developer fight for control. EXSA is the only one that solved this — `:not([class])` means the framework defers to the developer by default.

This is CSS, the way it was meant to work.

---

## Who EXSA Is For

EXSA is for developers who want their CSS to be as simple as their PHP.

If your templates are plain `.php` files and your server is Apache or nginx, EXSA is built for you. No Twig. No Blade. No `npm install`. No `vite.config.js`. Drop the files in `public/`, add two `<link>` tags, and you have a complete design system with 53 components, 20 themes, and automatic semantic HTML styling.

EXSA also works with any other stack — Python, Ruby, Node, React, Vue, Svelte, Hugo, WordPress — but it was designed first and foremost for the developer who chose PHP because it's simple, and expects their CSS framework to be just as simple. Two `<link>` tags. Universal CSS. Zero friction.

---

*Written by Saif Almarri, July 2026. EXSA CSS Framework.*

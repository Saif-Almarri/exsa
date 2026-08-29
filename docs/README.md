# EXSA CSS Framework — Built on Tokens, Not Tools

> **v1.0.0-rc.1** — Release candidate. API frozen, breaking changes documented. [See what's new →](CHANGELOG.md)

**EXSA is a lightweight CSS framework.** 32 KB core. 68 components. 20 themes. Zero build step. Works with any server — just link two CSS files and start building.

> *Link two files. Get a complete design system. Change one token — every component recolors.*
>
> 📖 **Read the Philosophy:** [Why EXSA exists, and why no framework could have done this before](PHILOSOPHY.md)

---

## Why EXSA?

CSS frameworks force a choice: utility-first means memorizing hundreds of classes. Component-first means fighting specificity. Both mean build steps, config files, and `npm install`.

EXSA chooses a third path.

**Tokens are the design system.** 94 design tokens drive 68 components, 20 themes, and every utility. Change `--color-link` in one place — every button, badge, link, and card recolors instantly. No recompile. No variable hunt across 2,000 files.

**Classes are optional.** Add `class="exsa"` to `<body>` and plain HTML — `<nav>`, `<section>`, `<table>`, `<form>`, `<button>`, `<blockquote>`, `<dialog>` — becomes a styled UI. Add any class to a structural element and EXSA steps aside. Zero specificity. No `!important`. You're always in control.

**Fluid by default.** Spacing, typography, and shape scale smoothly with viewport width — no breakpoints needed. Add `data-profile="compact"` or `data-profile="spacious"` to `<html>` and every component shifts density with one attribute. One optional file. Zero build.

**There is no build.** No CLI. No PostCSS. No config file. Just `<link>` two files from the CDN and you have a complete design system. No `npm install`. Ever.

**No template engine needed.** EXSA doesn't care if your view is a plain `.php` file, a static `.html` file, or served from Python, Node, Ruby, or Go. No Twig. No Blade. No SASS. No Webpack. If your server outputs HTML, EXSA styles it. Drop the files in your `public/` folder and you're done.

**Components are files, not dependencies.** Every component is a single CSS file (~1 KB). Link what you need — zero dead styles.

**CSS first, JS optional.** The core (`exsa.css` + a theme) is pure CSS — tokens, reset, layout utilities, Guarded Classless element styling. Zero JavaScript. 46% of components (31 of 68) are pure CSS too. The remaining 37 add interactivity via one behavior file each in `dist/js/` — same zero-build philosophy. Dropdowns, modals, tabs, toasts — if you need them, link the JS. If you don't, nothing breaks. Same choice every CSS framework offers, just without the toolchain.

In short: EXSA is what happens when you trust CSS custom properties, `@layer`, and `:where()` to do the work that frameworks usually delegate to tools. Bootstrap launched in 2011. Tailwind in 2017. But the three CSS features that make Guarded Classless™ possible — `:not([class])`, `:where()`, and `@layer` — only became baseline together in 2022. EXSA is the first framework to combine all three into a single architectural pattern. Its signature feature — **Guarded Classless™** — styles semantic HTML automatically, then steps aside the moment you add a single class. No overrides needed. No `!important`. Ever.

## Built for Where CSS Is Going

EXSA isn't designed for CSS as it was in 2015. It's designed for CSS as it is now — and where CSS is headed in the future.

Every architectural choice — `@layer` for cascade control, custom properties for theming, `:where()` for zero specificity, container queries for responsive cards — is built on W3C standards that browsers are actively investing in. As those standards mature, EXSA's foundation strengthens. No framework churn. No migration guides. No "version 2 with breaking changes."

The codebase is intentionally small (~680 lines of core CSS) so it can evolve with the language rather than fight it. When CSS adds a native `popover` — swap the popover component. When `scroll-driven animations` land — add a file. The architecture stays the same.

---

## Quick Start

### Getting the files

**Link only what you need. No download. No installer.**

EXSA distributes as individual files — you never download the whole framework, so there are never dead styles to ship.

```html
<!-- Core — the only required file (ships a built-in default theme) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/dist/exsa.css">
<!-- Theme — optional: add one for your own palette, or skip it entirely -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/dist/themes/breeze.css">

<!-- Add a component only when you use it -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/dist/components/buttons.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/dist/components/modal.css">

<!-- Add a behavior only when you use it -->
<script src="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/dist/js/modal.js"></script>
```

> Pin a version by replacing `@main` with `@1.0.0-rc.1` (or any tag)

**Want the files locally instead?**

```bash
git clone https://github.com/Saif-Almarri/exsa.git
```

**Optional: Fluid tokens & profiles.** Link `exsa.fluid.css` after the core to make spacing, typography, and shape scale smoothly with viewport width — no breakpoints needed. Built-in behavioral profiles (Compact / Comfortable / Spacious) change density with one HTML attribute. One file. Build-free.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/dist/exsa.fluid.css">
```

Your project folder needs only the files you link:
```
your-project/
├── dist/
│   ├── exsa.css          ← core
│   ├── exsa.fluid.css    ← fluid tokens & profiles (optional)
│   ├── components/       ← copy only the component files you use
│   ├── themes/           ← copy only the theme files you use
│   ├── layouts/          ← copy only the layout file you use (optional)
│   └── js/               ← copy only the behavior files you use (optional)
└── your-page.html
```

Only `dist/exsa.css` is required — it ships a built-in default theme. The theme file (and everything else) is optional. Nothing unused ever ships.

### What to link, and when

#### ✅ Required on every page

| File | Notes |
|---|---|
| `dist/exsa.css` | **The only required file.** Core — tokens, reset, utilities, Guarded Classless element styles **and a built-in default theme** (light/dark). No JS. |
| `dist/themes/<name>.css` | **Optional** — the core's built-in defaults already theme the page. Add one theme per page to brand your own palette; swap it to recolor everything. |

> **Bundle shortcut** — one `dist/exsa.bundle.css` replaces core + theme + components (breeze included). Want a different theme? Link it **after** the bundle; its token overrides win.
>
> Prefer your own mix? Use the **[Generator](https://exsa.dev/generator.php)** — pick the components you need, a theme (optional — the core has built-in defaults), and a layout if you use one; it packages them into one `exsa.bundle.css` (styles + theme) + `bundle.js` (behaviors) download. Zero dead styles. No CLI. No config.

#### ➕ Optional — link only what you use

| File | Link it… | Notes |
|---|---|---|
| `dist/exsa.fluid.css` | For fluid scaling + density profiles | Spacing / typography / shape scale with viewport; `data-profile` attributes. Link **after** core + theme. |
| `dist/components/<name>.css` | When the component appears on the page | ~1 KB each — zero dead styles. Link **after** core. |
| `dist/layouts/<name>.css` | When using a layout shell (dash, store, general, …) | Link **after** core + theme. |
| `dist/js/exsa-core.js` | Before any behavior file that needs shared helpers | Focus-trap + breakpoint helpers. Load **first**. |
| `dist/js/<name>.js` | For interactive components only | One behavior file per component; several warn if `exsa-core.js` isn't loaded first. |
| `dist/exsa.bundle.css` | Instead of core + every component | Prebuilt: core + all components + breeze. **CSS only — no JS**; pair with `dist/exsa.js` for behaviors. |
| `dist/exsa.js` | Instead of every behavior file | Prebuilt: all behaviors bundled. |
| `dist/templates/<name>/` | Starting a new project | Copy the whole template folder; it links its own local files. |

> **Icon assets** — the `.ic-*` classes reference `components/icons/*.svg` by relative URL. Copy that folder next to any component CSS (or bundle) you ship, or icons render blank.

#### 🧪 Development only — never ship

| File | Notes |
|---|---|
| `dist/exsa.debug.css` + `dist/exsa.debug.js` | Markup-contract linter, class spellchecker, class-conflict detector. Enable with `<html data-debug>`. Link **last**. |

Link order matters: **core → theme → fluid → components/layouts → debug** for CSS, and
**`exsa-core.js` before any behavior file** for JS.

### Link and build

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Site</title>

  <!-- 1. Core (tokens, reset, utilities, element styles) -->
  <link rel="stylesheet" href="dist/exsa.css">

  <!-- 2. Optional — a theme (20 to choose from; the core ships built-in defaults) -->
  <link rel="stylesheet" href="themes/breeze.css">
</head>

<!-- 3. Opt-in to classless element styling -->
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
    <aside>
      <h3>⚡ Zero Config</h3>
      <p>No build step. No CLI. No config file. Just link and build.</p>
    </aside>
    <aside>
      <h3>🎨 20 Themes</h3>
      <p>Swap one file. Every component recolors instantly. No rebuild needed.</p>
    </aside>
    <aside>
      <h3>🧩 68 Components</h3>
      <p>Link only what you need. Each component is a single ~1 KB CSS file.</p>
    </aside>
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

That's it. Every element above — the nav bar, the hero, the feature cards, the pricing table, the testimonial, the footer — is styled by EXSA's classless layer. **Zero component classes. Zero component files linked.** Plain HTML, baseline styling, always overridable.

This is the EXSA model: classless styles give you a respectable baseline for free. When you need more — striped rows, hover effects, color variants — link the dedicated component file (`table.css`, `buttons.css`, etc.) and add the component classes. You upgrade when you're ready. You never fight the framework.

---

## Architecture: The 10-Layer Cascade

EXSA uses CSS `@layer` to enforce a browser-native cascade. **Unlayered user CSS always wins** — no specificity fights, no `!important` wars.

```
Priority  Layer                 Covers
────────  ────────────────────  ──────────────────────────────────
  1       @layer exsa.tokens    92 design tokens in :root
  2       @layer exsa.themes    Theme token overrides (palette axis)
  3       @layer exsa.skins     Surface material recipes (skin axis)
  4       @layer exsa.fluid     Fluid clamp() tokens & density profiles
  5       @layer exsa.reset     Box model, focus rings, RTL, body
  6       @layer exsa.utilities Flex, grid, containers, breakpoints
  7       @layer exsa.elements  Guarded Classless — semantic HTML with instant opt-out
  8       @layer exsa.components 68 BEM components, zero specificity
  9       @layer exsa.layouts   Page shells (general, dashboard, store)
  10      @layer exsa.overrides u-* escape-hatch utilities

  ∞       Unlayered             User CSS — always wins
```

### Why this matters

```css
/* Your CSS — any file, any selector, no :where(), no !important */
.my-button { background: purple; }

/* It ALWAYS beats EXSA's .btn--primary */
/* Unlayered CSS > all 9 @layers. Every time. */
```

---

## Design Tokens

All 94 tokens live in `:root` inside `@layer exsa.tokens`. Themes override the color tokens from `@layer exsa.themes` (layer 2 — swap one file, everything recolors; themes own colors only, shape and font pairing belong to the skin axis); skins override the twelve `--surface-*` tokens from `@layer exsa.skins` (layer 3 — swap one file, every surface redraws, including the page backdrop via `--surface-canvas`). **Export:** [`tokens.json`](../tokens.json) for Figma, JS, or Tailwind config — generated from `manifest.json` + the CSS, never hand-edited.

### Base colors

| Token | Default | Purpose |
|---|---|---|
| `--color-bg` | `#fff` | Main background |
| `--color-bg-secondary` | `#e9e9e9` | Cards, inputs, hover states |
| `--color-text` | `#000` | Primary text |
| `--color-text-secondary` | `#757575` | Muted text — WCAG AA on white |
| `--color-link` | `#118bee` | Links and primary accent |
| `--color-secondary` | `#920de9` | Secondary accent (purple) |
| `--color-secondary-accent` | `#920de90b` | Subtle purple tint |
| `--color-accent` | `#118bee15` | Subtle blue tint |
| `--color-border` | `#e9e9e9` | Borders, dividers, input outlines |
| `--color-overlay` | `rgba(0,0,0,.5)` | Modal/drawer backdrops |

### Semantic tokens

| Token | Default | Consumed by |
|---|---|---|
| `--color-success` | `#16a34a` | Buttons, badge, alert, toast, form-validation |
| `--color-success-hover` | `#15803d` | Buttons |
| `--color-danger` | `#dc2626` | Buttons, badge, alert, toast, form-validation |
| `--color-danger-hover` | `#b91c1c` | Buttons |
| `--color-warning` | `#d97706` | Buttons, badge, alert |
| `--color-warning-hover` | `#b45309` | Buttons |
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
| `--width-card-medium` | `460px` |
| `--width-card-wide` | `800px` |
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
<div class="flex flex-wrap justify-between items-center gap">
  <div class="col-3">Sidebar</div>
  <div class="col-5">Content</div>
</div>
```

> `.col-*` bases are pure fractions — the row's `gap-*` utility supplies the gutters.

| Category | Classes |
|---|---|
| Display | `.flex`, `.flex-inline`, `.flex-col`, `.flex-col-rev`, `.flex-row-rev`, `.flex-wrap`, `.flex-nowrap` |
| Sizing | `.flex-1`, `.flex-auto`, `.flex-none`, `.col-1`–`.col-6` |
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
| `.grid-cols-1`–`.grid-cols-6` | Fixed columns |
| `.grid-auto-fit` | `repeat(auto-fit, minmax(200px, 1fr))` — auto-wrapping cards |
| `.grid-auto-fill` | `repeat(auto-fill, minmax(200px, 1fr))` |

### Responsive Breakpoints

> **Spacing, typography, and shape scale fluidly without breakpoints** — link `exsa.fluid.css` and tokens handle the rest. Use the responsive classes below only for structural changes: switching columns, flex direction, or layout overrides at specific widths.

| Breakpoint | Flex classes | Grid classes |
|---|---|---|
| **sm** `≤575px` | `.sm:flex-col`, `.sm:flex-wrap` | `.sm:grid-cols-1` |
| **md** `≥768px` | `.md:col-2`, `.md:col-3`, `.md:col-4` | `.md:grid-cols-2`, `-3`, `-4` |
| **lg** `≥1024px` | `.lg:col-2`–`.lg:col-5` | `.lg:grid-cols-3`–`.lg:grid-cols-6` |

---

## Guarded Classless

EXSA's signature feature. Opt-in by adding `class="exsa"` to `<body>`. Semantic HTML elements — `<nav>`, `<table>`, `<form>`, `<button>`, `<blockquote>`, `<dialog>`, `<aside>` — get automatic baseline styling. Add any class to any of those elements and EXSA instantly steps aside. Zero specificity. No `!important`. You're always in control.

### Coexisting with other CSS

EXSA ships entirely inside `@layer` blocks and uses plain, unprefixed utility names (`.flex`, `.grid`, `.container`, `.text-center`, …). Class names are global — two frameworks can both define `.container` — so when EXSA shares a page with other stylesheets, the outcome is predictable:

- **Unlayered author CSS always beats layered CSS.** Your own `.container { … }` written normally overrides EXSA's, everywhere.
- **To let EXSA win instead**, put the competing rules in an `@layer` declared *before* the `exsa.*` layers (later layers win), or simply drop the duplicate rule.
- **Don't mix two utility frameworks on one page** unless you accept that the framework whose layer comes later wins per-property. Deterministic, but rarely pleasant.
- **Debug mode detects conflicts for you** — with `<html data-debug>`, `exsa.debug.js` warns in the console whenever a non-EXSA stylesheet defines a class name the framework also uses.

### Navigation

```html
<nav>
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">Products</a>
      <ul>                              <!-- dropdown submenu -->
        <li><a href="#">Widgets</a></li>
        <li><a href="#">Gadgets</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

- Horizontal bar with dropdowns on hover/focus
- Collapsible submenus on mobile via `:focus-within` (tap to expand)
- RTL-aware via logical properties

### Cards & Callouts

```html
<section>
  <aside>                              <!-- card: shadow, border, rounded -->
    <h3>Title</h3>
    <p>This is a card. Container queries adjust its padding automatically.</p>
  </aside>
</section>

<article>
  <aside>                              <!-- callout: purple accent bar -->
    <strong>Note:</strong> This is a sidebar callout.
  </aside>
</article>
```

- Cards respond to container width via `@container` queries (not just viewport)
- Callout uses `border-inline-start` — auto-flips in RTL

### Forms

```html
<form>
  <label>Email <input type="email" required></label>   <!-- * auto-added for required -->
  <label>Message <textarea></textarea></label>
</form>
```

- Styled inputs, selects, textareas, checkboxes, radios
- For validation feedback (<code>:user-invalid</code>, required asterisks), link <code>form-required.css</code>

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

- Styled header with background, rounded corners, cell padding
- Cells wrap naturally (no forced `nowrap`)
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

| Theme | Vibe | Default mode |
|---|---|---|
| **Breeze** | Clean blue & white | Light |
| **Night** | Dark navy & slate | Dark |
| **Coral** | Warm red-orange | Light |
| **Forest** | Calm greens | Light |
| **Sepia** | Paper-like warmth | Light |
| **Steel** | Industrial grey | Light |
| **Ledger** | Ink & parchment | Light |
| **Clinic** | Medical teal | Light |
| **Console** | Phosphor-green terminal | Dark |
| **Mono** | Pure black & white | Light |
| **Nova** | Deep slate + electric blue | Dark |
| **Prism** | Cool slate + teal | Light |
| **Volt** | Navy + electric yellow | Dark |
| **Abyss** | Deep purple & charcoal | Dark |
| **Ember** | Warm amber & brown | Light |
| **Ink** | High-contrast black & white | Light |
| **Shadow** | Muted grey & slate | Dark |
| **Sojourn** | Warm sandstone & terracotta | Light |
| **Travei** | Cool cyan & slate | Light |
| **Tropic** | Vibrant teal & coral | Light |

Every theme is ~28 lines of color custom properties — the palette axis owns colors only; shape (radius) and font pairing live on the skin axis. All 20 pass WCAG AA contrast.

### 10 Skins — the material axis

Themes answer *which colors*. Skins answer *how surfaces are drawn* —
backgrounds, borders, shadows, inner highlights, blur, radius, and optional
font pairing. A skin is a ~25-line token-only file in `@layer exsa.skins`:
link one after core + theme (or the bundle) and every surface follows.

| Skin | Look |
|---|---|
| `flat` | solid surfaces, thin borders, zero effects — the baseline |
| `glass` | frosted: backdrop blur + translucent tint |
| `neomorphic` | dual light/dark shadows, no borders, radius 18px |
| `clay` | inflated: soft gradient, big soft shadow, inner top highlight |
| `skeuomorphic` | bevel gradients, layered shadows, serif body + headings |
| `glossy` | specular sheen across the surface |
| `brutalist` | zero radius, thick borders, hard offset shadows, mono body + Impact headings |
| `metallic` | brushed-metal banding, machined inset edges, mono headings |
| `glow` | neon link/secondary glow, mono headings — best on dark themes |
| `neon` | neon signage — darkened plates with glowing tube edges, mono headings |

```html
<link rel="stylesheet" href="dist/skins/glass.css">
```

Skins never hardcode colors — every value derives from the active theme via
`color-mix()`, so 20 palettes × 10 skins = 200 looks from 30 files. The twelve
`--surface-*` tokens are exported in [`tokens.json`](../tokens.json); a
custom skin is the same ~25-line file with your own values.

### Luxury font pairings (link-based, optional)

EXSA ships no font binaries — the core uses system font stacks, and
`--font-family` / `--font-family-heading` accept any face you link. Curated
open-source (SIL OFL) luxury pairings for the standard two-font setup:

| Display (headings) | Niche | Pair with (body) |
|---|---|---|
| Playfair Display | editorial serif | Jost |
| Cormorant Garamond | high-fashion | Tenor Sans |
| Bodoni Moda | Didone / fashion | Jost |
| Cinzel | jewelry / engraved | Jost |
| Marcellus | heritage / Trajan | EB Garamond |
| DM Serif Display | modern editorial | Tenor Sans |
| Jost | geometric sans | any serif above |
| Tenor Sans | understated sans | any serif above |

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900&family=Jost:wght@400;600&display=swap" rel="stylesheet">
```

```css
:root {
  --font-family: 'Jost', sans-serif;                 /* body     */
  --font-family-heading: 'Playfair Display', serif;  /* headings */
}
```

Caveats: strict CSPs must allow `fonts.googleapis.com` / `fonts.gstatic.com`;
self-host the woff2 files (OFL — include the license file) for privacy,
offline, or CSP-strict deployments.

### Runtime theme switching

```js
// Swap theme at runtime — no rebuild, no page reload
document.getElementById('theme-link').href = 'themes/night.css';
```

---

## Components

EXSA ships 68 standalone component CSS files in `dist/components/`. Each is ~1 KB, self-contained, and token-driven.

### Using components

```html
<link rel="stylesheet" href="dist/exsa.css">
<link rel="stylesheet" href="dist/themes/breeze.css">
<link rel="stylesheet" href="dist/components/buttons.css">
<link rel="stylesheet" href="dist/components/modal.css">
<link rel="stylesheet" href="dist/components/card.css">

<button class="btn btn--primary">Primary</button>
<button class="btn btn--danger">Delete</button>
```

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
| **Forms** | Checkbox, Color Picker, Advanced Color Picker, Date Picker, Dropdown, Form Required Helpers, Form Validation, Input Group, Password Input, Popover, Radio, Rating, Select, Toggle |
| **Actions** | Buttons, Panel Resizer, Tabs |
| **Feedback** | Alert, Cookie Bar, Skeleton Loader, Spinner, Toast |

## Controlling Components from JavaScript

EXSA is CSS-first: most component state is a class, not a method call. Toggle the class and the component follows — no JS API needed for most scripting.

### State via class (the majority)

| Component | State hook | Programmatic control |
|---|---|---|
| Modal | `.modal--open` | `el.classList.add('modal--open')` — overlay, Esc, close and focus-trap are already wired by `js/modal.js` |
| Drawer | `.drawer__toggle` checkbox | set its `checked` property |
| Lightbox | `.lightbox--open` | `classList` |
| Topbar | `.topbar--open` (mobile menu), `.topbar--scrolled` | `classList` |
| Dropdown | `.dropdown--open` | `classList` |
| Context menu | `.ctx-menu--open` | `classList` |
| Popover | `.popover--open` | `classList` |
| Tabs | `.tabs__tab--active` + `.tabs__panel--active` | `classList` |
| Back to top | `.back-top--visible` | `classList` |
| Cookie bar | `.cookie-bar--visible` | `classList` |

### Shared helpers (`js/exsa-core.js`)

```js
EXSA.trapFocus(container)    // locks Tab inside; returns an off() cleanup function
EXSA.getFocusable(container) // first focusable element, or null
EXSA.bp.up('md')             // matchMedia min-width wrapper — use .matches
EXSA.bp.down('md')           // matchMedia max-width wrapper
EXSA.bp.val('md')            // raw breakpoint value
```

### Events fired by components

Interactive components dispatch `exsa:*` CustomEvents on their root element —
subscribe to react to state changes without touching the component internals:

```js
kanban.addEventListener('exsa:kanban-drop', e => console.log(e.detail));      // {card, cardId, fromColId, toColId, afterId}
upload.addEventListener('exsa:upload-done', e => console.log(e.detail));      // exsa:upload-add / -error / -remove
calendar.addEventListener('exsa:day-select', ...);                            // also exsa:event-click, exsa:month-change
transfer.addEventListener('exsa:transfer-change', e => console.log(e.detail)); // {values, added, removed}
palette.addEventListener('exsa:command-select', ...);                          // exsa:command-open / -close
table.addEventListener('exsa:table-sort', ...);                                // exsa:table-filter, exsa:row-toggle
carousel.addEventListener('exsa-slide-change', e => console.log(e.detail.index));
```

Full event names and `detail` shapes are documented in each component's JS header comment.

> **Known limitation** — there is no global init/destroy registry yet: a component inserted into the DOM *after* page load isn't auto-initialized by every behavior. Initialize the page after your dynamic content is inserted, or re-bind manually.

---

## Icons

EXSA ships with **112 SVG icons** — 103 Feather Icons (stroke-based, MIT) + 9 Simple Icons brand logos (CC0) — all rendered via CSS masks with `currentColor`, so they inherit the text color of their parent. Use the mask classes:

```html
<span class="ic ic-search"></span>
<span class="ic ic-heart"></span>
<span class="ic ic-settings"></span>
```

| Category | Examples |
|---|---|
| **Navigation** | menu, home, search, chevron-*, external-link, map-pin |
| **Actions** | plus, edit, copy, paste, trash, download, upload, share, settings |
| **Text Editing** | type, bold, italic, underline, align-*, list |
| **Media** | image, play, pause, video, camera, mic |
| **Account & Security** | user, lock, unlock, key, shield, log-in, log-out |
| **Commerce** | cart, credit-card, dollar-sign, tag, gift, truck |
| **Developer** | terminal, database, cloud, code, layers, layout |
| **Status** | check, info, warning, x-circle, eye, help-circle |

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
| `@container` queries | Cards respond to container width, not just viewport |

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

**Full support**: Chrome 123+, Firefox 121+, Safari 17.5+ (2024+). Older browsers degrade gracefully — `:has()`/container queries silently fall back, and color tokens fall back to a built-in system-color palette (`Canvas`, `LinkText`, …) that stays dark-aware via `color-scheme`, so the page remains styled and readable but uses system colors instead of the theme.

**Not supported**: IE11 (no custom properties).

---

## File Size

| File | Size |
|---|---|
| `exsa.css` | 32.4 KB (820 lines) |
| `exsa.fluid.css` | ~1.5 KB (optional) |
| Each theme | ~1 KB (~30 lines) |
| Each component | ~1 KB |
| Full framework (core + theme) | ~33 KB |
| Typical deploy (core + theme + 10 components) | ~43 KB |
No minification needed — the files are already compact.

---

## Comparison

| | EXSA | Bootstrap | Tailwind |
|---|---|---|---|
| **Build step** | None | None (SCSS optional) | Yes (PostCSS/CLI) |
| **No template engine needed** | ✅ Yes — plain `.php` files, no Twig, no Blade | ✅ (HTML/CSS only) | ❌ Requires Node.js + PostCSS |
| **File size (base)** | 32 KB | ~50 KB (minified grid+reboot) | ~4 KB (compiled, no utilities yet) |
| **Guarded Classless™** | Yes — semantic HTML with opt-out | No | No |
| **Runtime theming** | 20 themes, live-swappable | Light/dark in 5.3 | Dark mode with `dark:` |
| **CSS Grid utilities** | Yes | Limited | Yes |
| **`@layer` cascade** | Yes — 9 layers | No | Yes (v3.2+) |
| **`:has()` support** | Yes | No | No |
| **Container queries** | Yes | No | Yes (v3.2+) |
| **Component library** | 68 token-driven components | 20+ components | None (Headless UI separate) |
| **Specificity model** | Zero (`:where()` + `@layer`) | Normal | Normal |

---

## Project Structure

```
root
├── dist/                    ← the product — copy only what you link
│   ├── exsa.css              Core (tokens, reset, utilities, elements, overrides)
│   ├── style.css            Deprecated alias — @import of exsa.css (removed in v1.0.0)
│   ├── exsa.fluid.css        Fluid tokens & density profiles (optional)
│   ├── js/                   Behaviors — one file per component (+ exsa-core.js, exsa.js)
│   ├── layouts/               3 page layouts (general, dashboard, store)
│   ├── templates/             2 starter templates (fullpage, onepage)
│   ├── components/            68 component files + icons/
│   └── themes/                20 themes
├── tools/                   build-debug.mjs — generates the debug linter files
├── docs/                    This README, PHILOSOPHY, CHANGELOG, CONTRIBUTING
├── manifest.json            Machine-readable catalog (components, themes, tokens)
├── tokens.json              Design-token export — generated (Figma, JS, Tailwind)
├── README.md                Repo map + quick start
├── LICENSE                  MIT License
└── TRADEMARK.md             Trademark guidelines
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
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="stylesheet" href="dist/exsa.css">
  <link rel="stylesheet" href="dist/themes/breeze.css">
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
      <aside>
        <h3>Info Card</h3>
        <p>Cards work without any classes.</p>
      </aside>
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

EXSA is at v1.0.0-rc.1 — your feedback shapes what 1.0 becomes.

- 🐛 **Bug reports & feature requests:** [GitHub Issues](https://github.com/Saif-Almarri/exsa/issues)
- 💬 **Questions & ideas:** [GitHub Discussions](https://github.com/Saif-Almarri/exsa/discussions)
- 🤝 **Interested in a co-founder role or contributor?** Email [safe@windowslive.com](mailto:safe@windowslive.com)

### How to Give Great Feedback

- **Found a bug?** Include your browser and version, a minimal code snippet, and what you expected vs. what happened.
- **Want a feature?** Describe the problem you're solving, not just the solution. The best features come from real-world pain points.
- **Theme or component idea?** Share a mockup or a description. EXSA's token system makes new components surprisingly easy to create.
- **Just want to say thanks?** Star the repo ⭐ and share EXSA with your team — it helps more than you'd think.

---

## Co-Founders Wanted

EXSA was founded by **Saif Almarri**, who invented the 9-layer cascade architecture, Guarded Classless™ pattern, and built the entire framework solo. He holds **28% equity** and leads product direction.

EXSA has three contributor slots — one per co-founder role. Invite-only, not an open call:

- 🧩 **Technical** — own the component library and engineering
- 📣 **Growth** — own ads, video, community, and marketing (no coding)
- 📢 **Brand & Community** — own conferences, technical writing, and community trust

No revenue yet. No salary. Everyone starts as a contributor. **24% equity each** — vests when effort meets the role targets. As fast as a month, or up to 12 months. Earned by shipping, not time served. Tracked publicly on GitHub.

👉 **[See CONTRIBUTING.md](CONTRIBUTING.md)** for the full story and how to start.

---

## Inventor's Statement

The **10-layer CSS cascade architecture** (tokens → themes → skins → fluid → reset → utilities → elements → components → layouts → overrides), the **Guarded Classless™** pattern, and the **Fluid Scale + Density Profiles** system are original inventions of Saif Almarri, first published in 2026. See [PHILOSOPHY.md](PHILOSOPHY.md) and [TRADEMARK.md](../TRADEMARK.md) for the full technical documentation and design rationale.

---

*Built on the idea that CSS custom properties are the design system. @layer enforces the cascade. Themes are just token overrides. Components are just files. Semantic HTML works out of the box — add a class, the framework gets out of your way. No build step. No config. Just CSS, the way it was meant to work.*

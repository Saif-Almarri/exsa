# EXSA CSS Framework — Built on Tokens, Not Tools

**EXSA is a lightweight CSS framework.** 19.5 KB core. 50 components. 17 themes. Zero build step. Works with any server — just link two CSS files and start building.

> *Link two files. Get a complete design system. Change one token — every component recolors.*

---

## Why EXSA?

CSS frameworks force a choice: utility-first means memorizing hundreds of classes. Component-first means fighting specificity. Both mean build steps, config files, and `npm install`.

EXSA chooses a third path.

**Tokens are the design system.** 37 CSS custom properties drive 50 components, 17 themes, and every utility. Change `--color-link` in one place — every button, badge, link, and card recolors instantly. No recompile. No variable hunt across 2,000 files.

**Classes are optional.** Add `class="exsa"` to `<body>` and plain HTML — `<nav>`, `<section>`, `<table>`, `<form>`, `<button>`, `<blockquote>`, `<dialog>` — becomes a styled UI. Add any class to a structural element and EXSA steps aside. Zero specificity. No `!important`. You're always in control.

**There is no build.** No CLI. No PostCSS. No config file. Just `<link>` two files and you have a complete design system. Works with PHP, Python, Node, nginx, Apache — any server that serves static files.

**Components are files, not dependencies.** Every component is a single CSS file (~1 KB). Link what you need. The Generator bundles only your selected components into one file — zero dead styles.

In short: EXSA is what happens when you trust CSS custom properties, `@layer`, and `:where()` to do the work that frameworks usually delegate to tools. Its signature feature — **Guarded Classless™** — styles semantic HTML automatically, then steps aside the moment you add a single class. No fighting. No `!important`. Ever.

## Built for Where CSS Is Going

EXSA isn't designed for CSS as it was in 2015. It's designed for CSS as it is now — and where CSS is headed in the future.

Every architectural choice — `@layer` for cascade control, custom properties for theming, `:where()` for zero specificity, container queries for responsive cards — is built on W3C standards that browsers are actively investing in. As those standards mature, EXSA's foundation strengthens. No framework churn. No migration guides. No "version 2 with breaking changes."

The codebase is intentionally small (~600 lines of core CSS) so it can evolve with the language rather than fight it. When CSS adds a native `popover` — swap the popover component. When `scroll-driven animations` land — add a file. The architecture stays the same.

---

## Quick Start

### Getting the files

```bash
# Clone the framework only (no website pages)
git clone https://github.com/Saif-Almarri/exsa.git
```

Or download the latest ZIP from [GitHub Releases](https://github.com/Saif-Almarri/exsa/releases) — you'll get the same files.

Your project folder needs these:
```
your-project/
├── style.css          ← core
├── components/        ← 50 component CSS files
├── themes/            ← 17 theme files
├── components.js       ← interactive behaviors (optional)
└── your-page.html
```

### Link and build

```html
<!-- 1. Core (tokens, reset, layout, element styles) -->
<link rel="stylesheet" href="style.css">

<!-- 2. A theme (17 to choose from) -->
<link rel="stylesheet" href="themes/breeze.css">

<!-- 3. Opt-in to classless element styling -->
<body class="exsa">
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a>
        <ul>
          <li><a href="#">Team</a></li>
          <li><a href="#">History</a></li>
        </ul>
      </li>
    </ul>
  </nav>

  <section>
    <aside>
      <h3>Card Title</h3>
      <p>This card's colors come from tokens. Change the theme file — it recolors instantly.</p>
    </aside>
  </section>

  <table>
    <thead><tr><th>Name</th><th>Role</th></tr></thead>
    <tbody>
      <tr><td>Alice</td><td>Engineer</td></tr>
      <tr><td>Bob</td><td>Designer</td></tr>
    </tbody>
  </table>

  <button>Click Me</button>
</body>
```

That's it. Every element above — the nav bar with dropdowns, the card, the table, the button — is styled by EXSA's classless layer. **Zero component classes. Zero component files linked.** Plain HTML, baseline styling, always overridable.

This is the EXSA model: classless styles give you a respectable baseline for free. When you need more — striped rows, hover effects, color variants — link the dedicated component file (`table.css`, `buttons.css`, etc.) and add the component classes. You upgrade when you're ready. You never fight the framework.

---

## Architecture: The 5-Layer Cascade

EXSA uses CSS `@layer` to enforce a browser-native cascade. **Unlayered user CSS always wins** — no specificity fights, no `!important` wars.

```
Priority  Layer                 Covers
────────  ────────────────────  ──────────────────────────────────
  1       @layer exsa.tokens    37 CSS custom properties in :root
  2       @layer exsa.reset     Box model, focus rings, RTL, body
  3       @layer exsa.layout    Flex, grid, containers, breakpoints
  4       @layer exsa.elements  Guarded Classless — semantic HTML with instant opt-out
  5       @layer exsa.components 50 BEM components, zero specificity

  ∞       Unlayered             Themes & user CSS — always win
```

### Why this matters

```css
/* Your CSS — any file, any selector, no :where(), no !important */
.my-button { background: purple; }

/* It ALWAYS beats EXSA's .btn--primary */
/* Unlayered CSS > all 5 @layers. Every time. */
```

---

## Design Tokens

All 37 tokens live in `:root` inside `@layer exsa.tokens`. Themes override them by being unlayered. **Export:** [`tokens.json`](tokens.json) for Figma, JS, or Tailwind config.

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

### Semantic tokens

| Token | Default | Consumed by |
|---|---|---|
| `--color-success` | `#16a34a` | Buttons, badge, alert, toast, form-validation |
| `--color-success-hover` | `#15803d` | Buttons |
| `--color-danger` | `#dc2626` | Buttons, badge, alert, toast, form-validation |
| `--color-danger-hover` | `#b91c1c` | Buttons |
| `--color-warning` | `#d97706` | Buttons, badge, alert |
| `--color-warning-hover` | `#b45309` | Buttons |
| `--color-button-text` | *(theme-defined)* | Buttons, date-picker, topbar |

### Layout tokens

| Token | Default |
|---|---|
| `--border-radius` | `5px` |
| `--box-shadow` | `2px 2px 10px` |
| `--font-family` | System font stack |
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

| Category | Classes |
|---|---|
| Display | `.flex`, `.flex-inline`, `.flex-col`, `.flex-col-rev`, `.flex-row-rev`, `.flex-wrap`, `.flex-nowrap` |
| Sizing | `.flex-1`, `.flex-auto`, `.flex-none`, `.col-1`–`.col-5` |
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

| Breakpoint | Flex classes | Grid classes |
|---|---|---|
| **sm** `≤575px` | `.sm:flex-col`, `.sm:flex-wrap` | `.sm:grid-cols-1` |
| **md** `≥768px` | `.md:col-2`, `.md:col-3`, `.md:col-4` | `.md:grid-cols-2`, `-3`, `-4` |
| **lg** `≥1024px` | `.lg:col-2`–`.lg:col-5` | `.lg:grid-cols-3`–`.lg:grid-cols-6` |

---

## Guarded Classless

EXSA's signature feature. Opt-in by adding `class="exsa"` to `<body>`. Semantic HTML elements — `<nav>`, `<table>`, `<form>`, `<button>`, `<blockquote>`, `<dialog>`, `<aside>` — get automatic baseline styling. Add any class to any of those elements and EXSA instantly steps aside. Zero specificity. No `!important`. You're always in control.

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
- For validation feedback (<code>:user-invalid</code>, required asterisks), link <code>form-base.css</code>

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

### 17 Themes

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

Every theme is ~30 lines of CSS custom properties. All 17 pass WCAG AA contrast.

### Runtime theme switching

```js
// Swap theme at runtime — no rebuild, no page reload
document.getElementById('theme-link').href = 'themes/night.css';
```

---

## Components

EXSA ships 50 standalone component CSS files in `components/`. Each is ~1 KB, self-contained, and token-driven.

### Using components

```html
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="themes/breeze.css">
<link rel="stylesheet" href="components/buttons.css">
<link rel="stylesheet" href="components/modal.css">
<link rel="stylesheet" href="components/card.css">

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

### Full component list (50)

| Category | Components |
|---|---|
| **Layout** | Accordion, Drawer, Footer, Modal, Pricing Table |
| **Navigation** | Topbar, Sidebar, Back to Top, Breadcrumbs, Pagination, Stepper, Timeline, Tooltip |
| **Content** | Avatar, Badge, Card, Code Block, Table |
| **Media** | Lightbox, Music Player, Video Gallery, Slideshow |
| **Data** | Donut Chart, Bar Chart, Progress Bars, Range Slider |
| **Actions** | Buttons, Checkbox, Color Picker, Date Picker, Dropdown, Form Validation, Icon Button, Input Group, Loading Button, Password Input, Radio, Rating, Select, Tabs, Toggle, Panel Resizer |
| **Feedback** | Alert, Cookie Bar, Skeleton Loader, Spinner, Toast |

---

## Generator

The **EXSA Generator** (`generator.php`) lets you cherry-pick components and themes, then download a single ZIP with only what you need.

1. Select components (or all 50)
2. Pick a theme (or bundle multiple)
3. Choose options: minify, include comments
4. Download ZIP — ready to deploy

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
| Color contrast | All 17 themes pass WCAG AA (4.5:1+) |
| Logical properties | `border-inline-start`, `inset-inline-end`, etc. — auto-flip in RTL |
| `prefers-color-scheme` | Auto dark/light mode |
| `@container` queries | Cards respond to container width, not just viewport |

### Still in progress

- Full keyboard audit across all 50 components
- Screen reader testing (NVDA, VoiceOver)
- Focus trap management in modals/drawers

---

## VS Code IntelliSense

EXSA ships a CSS custom data file (`exsa.css-data.json`) that enables autocomplete and hover documentation for all 37 tokens and 5 `@layer` names — **zero extensions required**.

To activate: your workspace `.vscode/settings.json` should contain:

```json
{
  "css.customData": ["./exsa.css-data.json"]
}
```

Then:
- Type `var(--color-` → see all 37 tokens with descriptions
- Hover any token → see its default value and purpose
- Type `@layer exsa.` → see the 5 layer names

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

**Full support**: Chrome 111+, Firefox 121+, Safari 17+ (2023+). Older browsers degrade gracefully — cosmetic features like `:has()` and container queries silently fall back.

**Not supported**: IE11 (no custom properties).

---

## File Size

| File | Size |
|---|---|
| `style.css` | ~19.5 KB (~230 lines) |
| Each theme | ~1 KB (~30 lines) |
| Each component | ~1 KB |
| Full framework (core + theme) | ~20.5 KB |
| Typical deploy (core + theme + 10 components) | ~30 KB |
| `exsa.css-data.json` | ~4 KB |

No minification needed — the files are already compact. The Generator can minify for production.

---

## Comparison

| | EXSA | Bootstrap | Tailwind |
|---|---|---|---|
| **Build step** | None | None (SCSS optional) | Yes (PostCSS/CLI) |
| **npm install** | No | Yes | Yes |
| **File size (base)** | ~19.5 KB | ~50 KB (minified grid+reboot) | ~4 KB (compiled, no utilities yet) |
| **Guarded Classless™** | Yes — semantic HTML with opt-out | No | No |
| **Runtime theming** | 17 themes, live-swappable | Light/dark in 5.3 | Dark mode with `dark:` |
| **CSS Grid utilities** | Yes | Limited | Yes |
| **`@layer` cascade** | Yes — 5 layers | No | Yes (v3.2+) |
| **`:has()` support** | Yes | No | No |
| **Container queries** | Yes | No | Yes (v3.2+) |
| **VS Code IntelliSense** | Custom data file, zero extensions | Requires extension | Requires official plugin |
| **Component library** | 50 token-driven components | 20+ components | None (Headless UI separate) |
| **Specificity model** | Zero (`:where()` + `@layer`) | Normal | Normal |

---

## Project Structure

```
root
├── style.css              Core (tokens, reset, layout, elements, components)
├── components.js          JavaScript behaviors (class-driven, portable)
├── manifest.json          Component & theme registry
├── tokens.json            Design token export (Figma, JS, Tailwind)
├── exsa.css-data.json     VS Code IntelliSense definitions
├── package.json           NPM metadata
├── README.md              This file
├── LICENSE                License
├── themes/
│   ├── breeze.css         ← 17 theme files
│   ├── night.css
│   └── ...
├── components/
│   ├── buttons.css        ← 50 component files
│   ├── modal.css
│   └── ...
└── components/icons/      SVG icon library
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
  <link rel="stylesheet" href="style.css">
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

Copyright © 2026 Saif Almarri. EXSA CSS Framework. All rights reserved. — see LICENSE file.

---

*Built on the idea that CSS custom properties are the design system. @layer enforces the cascade. Themes are just token overrides. Components are just files. Semantic HTML works out of the box — add a class, the framework gets out of your way. No build step. No config. Just CSS, the way it was meant to work.*

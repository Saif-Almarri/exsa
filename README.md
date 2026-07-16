# EXSA — The CSS Framework Built on Tokens, Not Tools

> **Link two files. Get a complete design system. Change one token — every component recolors.**
>
> No CLI. No npm. No build step. No config. Just CSS.

---

## Quick Start

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
</body>
```

That's it. You now have: styled navigation with dropdowns, card components, form elements, tables, blockquotes, a responsive grid system, and full dark/light mode — all from semantic HTML with zero component classes.

---

## Architecture: The 5-Layer Cascade

EXSA uses CSS `@layer` to enforce a browser-native cascade. **Unlayered user CSS always wins** — no specificity fights, no `!important` wars.

```
Priority  Layer                 Covers
────────  ────────────────────  ──────────────────────────────────
  1       @layer exsa.tokens    36 CSS custom properties in :root
  2       @layer exsa.reset     Box model, focus rings, RTL, body
  3       @layer exsa.layout    Flex, grid, containers, breakpoints
  4       @layer exsa.elements  Classless element styles (.exsa)
  5       @layer exsa.components Form, table, blockquote, dialog

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

All 36 tokens live in `:root` inside `@layer exsa.tokens`. Themes override them by being unlayered. **Export:** [`tokens.json`](tokens.json) for Figma, JS, or Tailwind config.

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
| `--gap` | `1rem` |
| `--gap-lg` | `1.5rem` |
| `--gap-xl` | `2rem` |

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

## Classless Elements

Opt-in by adding `class="exsa"` to `<body>`. All styling happens through semantic HTML — no component classes needed.

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

- `:has(:user-invalid)` auto-highlights form border when validation fails
- `label:has(+ :required)::after` auto-adds red asterisk — no extra markup
- Styled inputs, selects, textareas, checkboxes, radios

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

- Striped rows, styled header, rounded corners
- Cells wrap naturally (no forced `nowrap`)
- Corners use logical properties — auto-flip in RTL

### Other elements

| Element | Styling |
|---|---|
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

### 13 Themes

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

Every theme is ~30 lines of CSS custom properties. All 13 pass WCAG AA contrast.

### Runtime theme switching

```js
// Swap theme at runtime — no rebuild, no page reload
document.getElementById('theme-link').href = 'themes/night.css';
```

---

## Components

EXSA ships 42 standalone component CSS files in `components/`. Each is ~1 KB, self-contained, and token-driven.

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

### Full component list (42)

| Category | Components |
|---|---|
| **Layout** | Accordion, Drawer, Footer, Modal, Pricing Table |
| **Navigation** | Topbar, Sidebar, Back to Top, Breadcrumbs, Pagination, Stepper, Timeline, Tooltip |
| **Content** | Avatar, Badge, Card, Table |
| **Media** | Lightbox, Music Player, Video Gallery, Slideshow |
| **Data** | Donut Chart, Bar Chart, Progress Bars, Range Slider |
| **Actions** | Buttons, Checkbox, Color Picker, Date Picker, Dropdown, Form Validation, Icon Button, Input Group, Loading Button, Password Input, Radio, Rating, Select, Tabs, Toggle, Panel Resizer |
| **Feedback** | Alert, Cookie Bar, Skeleton Loader, Spinner, Toast |

---

## Generator

The **EXSA Generator** (`generator.html`) lets you cherry-pick components and themes, then download a single ZIP with only what you need.

1. Select components (or all 42)
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
| Color contrast | All 13 themes pass WCAG AA (4.5:1+) |
| Logical properties | `border-inline-start`, `inset-inline-end`, etc. — auto-flip in RTL |
| `prefers-color-scheme` | Auto dark/light mode |
| `@container` queries | Cards respond to container width, not just viewport |

### Still in progress

- Full keyboard audit across all 42 components
- Screen reader testing (NVDA, VoiceOver)
- Focus trap management in modals/drawers

---

## VS Code IntelliSense

EXSA ships a CSS custom data file (`exsa.css-data.json`) that enables autocomplete and hover documentation for all 36 tokens and 5 `@layer` names — **zero extensions required**.

To activate: your workspace `.vscode/settings.json` should contain:

```json
{
  "css.customData": ["./concept_d/exsa.css-data.json"]
}
```

Then:
- Type `var(--color-` → see all 36 tokens with descriptions
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
| `style.css` | ~11 KB (~600 lines) |
| Each theme | ~1 KB (~30 lines) |
| Each component | ~1 KB |
| Full framework (core + theme) | ~12 KB |
| Typical deploy (core + theme + 10 components) | ~22 KB |
| `exsa.css-data.json` | ~4 KB |

No minification needed — the files are already compact. The Generator can minify for production.

---

## Comparison

| | EXSA | Bootstrap | Tailwind |
|---|---|---|---|
| **Build step** | None | None (SCSS optional) | Required (PostCSS) |
| **npm install** | No | Yes (or CDN) | Yes |
| **File size (base)** | ~11 KB | ~50 KB (minified grid+reboot) | ~4 KB (compiled, no utilities yet) |
| **Classless mode** | Yes (`.exsa`) | No | No |
| **Runtime theming** | 13 themes, live-swappable | Light/dark in 5.3 | Dark mode with `dark:` |
| **CSS Grid utilities** | Yes | Limited | Yes |
| **`@layer` cascade** | Yes — 5 layers | No | Yes (v3.2+) |
| **`:has()` support** | Yes | No | No |
| **Container queries** | Yes | No | Yes (v3.2+) |
| **VS Code IntelliSense** | Custom data file, zero extensions | Requires extension | Requires official plugin |
| **Component library** | 42 token-driven components | 20+ components | None (Headless UI separate) |
| **Specificity model** | Zero (`:where()` + `@layer`) | Normal | Normal |

---

## Project Structure

```
root
├── style.css              Core (tokens, reset, layout, elements, components)
├── exsa.css-data.json     VS Code IntelliSense definitions
├── showcase.html          42-component demo page
├── index.html             Landing page
├── generator.html         Component/theme bundle builder
├── compare.html           EXSA vs Bootstrap visual comparison
├── README.md              This file
├── layers.png             Cascade diagram
├── themes/
│   ├── breeze.css         ← 13 theme files
│   ├── night.css
│   └── ...
├── components/
│   ├── buttons.css        ← 42 component files
│   ├── modal.css
│   └── ...
├── components.js          JavaScript behaviors (class-driven, portable)
└── demo.css               Showcase page styles
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

MIT — see LICENSE file.

---

*Built on the idea that CSS custom properties are the design system. @layer enforces the cascade. Themes are just token overrides. Components are just files. No build step. No config. Just CSS, the way it was meant to work.*

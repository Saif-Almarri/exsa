# EXSA CSS Framework

> Built on tokens, not tools — a 10-layer cascade, 95 design tokens, 68 components,
> 20 themes · 10 skins. One file. Zero build step. **v2.0.0**

A token-driven CSS framework. Plain semantic HTML is styled automatically — add a
`class` and EXSA steps aside. All 68 components ship in a single `exsa.bundle.css`.

| File / Folder | What it is |
|---|---|
| `exsa.bundle.css` | **The framework** — tokens, reset, utilities, classless elements, overrides, all 68 components, built-in default theme. The one required file. |
| `exsa.js` | All behaviors in one file (dropdowns, modals, tabs, carousel, …). |
| `exsa.fluid.css` | Optional fluid scaling + density profiles. |
| `exsa.debug.css` / `exsa.debug.js` | Dev-only linter. Never ship. |
| `themes/` | 20 color palettes. Optional — override the default theme. |
| `skins/` | 10 surface-material recipes. Optional — change how surfaces are drawn. |
| `docs/` | README, User Guide, Philosophy. |
| `demo.html` | One-page theme demo (topbar, hero, cards, team, theme selector). |

## Quick start

**1. Clone (or vendor) the repo:**

```bash
git clone --branch v2.0.0 --depth 1 https://github.com/Saif-Almarri/exsa.git
```

**2. Link the framework:**

```html
<link rel="stylesheet" href="exsa.bundle.css">
<link rel="stylesheet" href="themes/breeze.css">   <!-- optional palette -->
<link rel="stylesheet" href="skins/glass.css">     <!-- optional surface -->
<script src="exsa.js" defer></script>             <!-- optional behaviors -->
```

**3. Opt in and build:**

```html
<body class="exsa">
  <main>
    <header>
      <h1>Build faster. Ship sooner.</h1>
      <p>Plain semantic HTML, styled automatically.</p>
      <p><button>Get started</button></p>
    </header>
  </main>
</body>
```

**CDN — quick testing only (no `integrity` by design):**

```html
<!-- core (core + 68 components + default theme) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@2.0.0/exsa.bundle.css">
<!-- optional palette / surface -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@2.0.0/themes/breeze.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@2.0.0/skins/glass.css">
<!-- optional behaviors -->
<script src="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@2.0.0/exsa.js" defer></script>
```

Full documentation: [`docs/README.md`](docs/README.md) · User Guide: [`docs/GUIDE.md`](docs/GUIDE.md) · Philosophy: [`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md)

MIT License — see [LICENSE](LICENSE).

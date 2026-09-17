# EXSA CSS Framework

> Built on tokens, not tools — a 10-layer cascade, 95 design tokens, 68 components,
> 20 themes · 10 skins, 1 layout base + app-frame focus layer + recipes. Zero build step. **v1.0.0-rc.3**

This repository contains the library, so a developer
who clones it sees a library.

| Folder | What's inside | For |
|---|---|---|
| [`dist/`](dist/) | `exsa.css`, `exsa.fluid.css`, `themes/`, `skins/`, `components/`, `layouts/`, `js/` | **the product** — copy only the files you link |
| [`docs/`](docs/) | README, PHILOSOPHY, CHANGELOG, CONTRIBUTING | documentation |
| [`tools/`](tools/) | `validate.mjs` (release gate), `build-bundle.mjs`, `build-tokens.mjs`, `build-debug.mjs` | regenerate `dist/` + run the checks CI runs |
| `manifest.json` | Single machine-readable catalog (components, themes, layouts, JS, **design tokens**) | consumed by tooling |
| `tokens.json` | Design-token export (Figma, JS, Tailwind) | design tooling |

## Quick start

**1. Clone (or vendor) the repo — recommended:**

```bash
git clone --branch v1.0.0-rc.3 --depth 1 https://github.com/Saif-Almarri/exsa.git
```

Link from `exsa/dist/…`, or copy only the files you use into your project.

**2. Custom bundle** — the [Generator](https://exsa.dev/generator.php) packages the
components, theme, and layout you pick into one `exsa.bundle.css` + `bundle.js`.

**3. CDN links — quick testing only (no `integrity` by design):**

```html
<!-- @main = latest, testing only — pin @1.0.0-rc.3 for anything you ship -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.3/dist/exsa.css">
<!-- theme: optional — exsa.css ships a built-in default theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.3/dist/themes/breeze.css">
<!-- skin: optional — the material axis (solid / clear / frosted box treatments) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.3/dist/skins/glass.css">
<!-- behaviors (optional): every JS component, prebuilt, in one file -->
<script src="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.3/dist/exsa.js"></script>
```

**Bundle shortcut** — swap the first two links for one: `dist/exsa.bundle.css` ships
with all 68 components + the icons library + the Breeze theme baked in.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.3/dist/exsa.bundle.css">
```

Add `class="exsa"` to `<body>` and plain HTML is styled automatically. Add components
only when you use them, from `dist/components/` + `dist/js/`. Pair the bundle with
the `exsa.js` tag above and every component works — no per-component links. Want a
different theme? Link `dist/themes/<name>.css` **after** the bundle; the theme layer
wins. Not bundled: `exsa.fluid.css`, `dist/skins/`, and `dist/layouts/` — link those separately.

Full documentation: [`docs/README.md`](docs/README.md) · Philosophy: [`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md) · What's new: [`docs/CHANGELOG.md`](docs/CHANGELOG.md)

MIT License — see [LICENSE](LICENSE).

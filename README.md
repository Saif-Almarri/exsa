# EXSA CSS Framework

> Built on tokens, not tools — a 10-layer cascade, 94 design tokens, 68 components,
> 1 layout base + app-frame focus layer + recipes. Zero build step. **v1.0.0-rc.2**

This repository contains the library, so a developer
who clones it sees a library.

| Folder | What's inside | For |
|---|---|---|
| [`dist/`](dist/) | `exsa.css`, `exsa.fluid.css`, `components/`, `themes/`, `layouts/`, `js/` | **the product** — copy only the files you link |
| [`docs/`](docs/) | README, PHILOSOPHY, CHANGELOG, CONTRIBUTING | documentation |
| [`tools/`](tools/) | `validate.mjs` (release gate), `build-bundle.mjs`, `build-tokens.mjs`, `build-debug.mjs` | regenerate `dist/` + run the checks CI runs |
| `manifest.json` | Single machine-readable catalog (components, themes, layouts, JS, **design tokens**) | consumed by tooling |
| `tokens.json` | Design-token export (Figma, JS, Tailwind) | design tooling |

## Quick start (2 links)

```html
<!-- pinned to v1.0.0-rc.2 — bump the version when you upgrade (@main = latest, testing only) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.2/dist/exsa.css"
      integrity="sha384-hofP4EvOsGvjq909MlJVMwwwW4ImiZYBsXR3KKmRQXZrXhuH2yLba6jrIQp25UkP" crossorigin="anonymous">
<!-- theme: optional — exsa.css ships a built-in default theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.2/dist/themes/breeze.css"
      integrity="sha384-cSX/ha32sMk/hWdkcebLcNuelWANa8AlyDjr0uR4HB7iDfoSoBg2VyI6BCEfW6Vo" crossorigin="anonymous">

<!-- behaviors (optional): every JS component, prebuilt, in one file -->
<script src="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.2/dist/exsa.js"
        integrity="sha384-Qb+rAmCRUv+6oMfUBpW46K2xffB4qkSH5LCNH/QXcSnkcHg1ovdcepZvGjf139L5" crossorigin="anonymous"></script>
```

Add `class="exsa"` to `<body>` and plain HTML is styled automatically. Add components
only when you use them, from `dist/components/` + `dist/js/`.

**Bundle shortcut** — swap the first two links for one: `dist/exsa.bundle.css` ships
with all 68 components + the icons library + the Breeze theme baked in.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.2/dist/exsa.bundle.css"
      integrity="sha384-gTn9GlgDHR7Q/Fo6+N6cbZcGAWW9hbCF5wy5C1KIlxcqvC6gkR3uuxfRENSVRDKP" crossorigin="anonymous">
```

Pair it with the `exsa.js` tag above and every component works — no per-component
links. Want a different theme? Link `dist/themes/<name>.css` **after** the bundle;
the theme layer wins. Not bundled: `exsa.fluid.css` and `dist/layouts/` —
link those separately when you use them.

Full documentation: [`docs/README.md`](docs/README.md) · Philosophy: [`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md) · What's new: [`docs/CHANGELOG.md`](docs/CHANGELOG.md)

MIT License — see [LICENSE](LICENSE).

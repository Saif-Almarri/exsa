# EXSA CSS Framework

> Built on tokens, not tools — a 9-layer cascade, 82 design tokens, 68 components,
> 3 layouts, 2 starter templates. Zero build step. **v1.0.0-rc.1**

This repository contains the library, not the website — separated so a developer
who clones it sees a library. The exsa.dev website is developed separately and
is not part of this repo.

| Folder | What's inside | For |
|---|---|---|
| [`dist/`](dist/) | `exsa.css`, `exsa.fluid.css`, `components/`, `themes/`, `layouts/`, `templates/`, `js/` | **the product** — copy only the files you link |
| [`docs/`](docs/) | README, PHILOSOPHY, CHANGELOG, CONTRIBUTING | documentation |
| [`tools/`](tools/) | `build-debug.mjs` — generates `dist/exsa.debug.css` + `dist/exsa.debug.js` (the markup-contract linter) | the one tool the debug files need |
| `manifest.json` | Single machine-readable catalog (components, themes, layouts, templates, JS, **design tokens**) | consumed by tooling |
| `tokens.json` | Design-token export (Figma, JS, Tailwind) | design tooling |

## Quick start (2 links)

```html
<!-- pinned to v1.0.0-rc.1 — bump the version when you upgrade (@main = latest, testing only) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.1/dist/exsa.css"
      integrity="sha384-hofP4EvOsGvjq909MlJVMwwwW4ImiZYBsXR3KKmRQXZrXhuH2yLba6jrIQp25UkP" crossorigin="anonymous">
<!-- theme: optional — exsa.css ships a built-in default theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.1/dist/themes/breeze.css"
      integrity="sha384-cSX/ha32sMk/hWdkcebLcNuelWANa8AlyDjr0uR4HB7iDfoSoBg2VyI6BCEfW6Vo" crossorigin="anonymous">

<!-- behaviors (optional): every JS component, prebuilt, in one file -->
<script src="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.1/dist/exsa.js"
        integrity="sha384-Qb+rAmCRUv+6oMfUBpW46K2xffB4qkSH5LCNH/QXcSnkcHg1ovdcepZvGjf139L5" crossorigin="anonymous"></script>
```

Add `class="exsa"` to `<body>` and plain HTML is styled automatically. Add components
only when you use them, from `dist/components/` + `dist/js/`.

**Bundle shortcut** — swap the first two links for one: `dist/exsa.bundle.css` ships
with all 68 components + the icons library + the Breeze theme baked in.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@1.0.0-rc.1/dist/exsa.bundle.css"
      integrity="sha384-gTn9GlgDHR7Q/Fo6+N6cbZcGAWW9hbCF5wy5C1KIlxcqvC6gkR3uuxfRENSVRDKP" crossorigin="anonymous">
```

Pair it with the `exsa.js` tag above and every component works — no per-component
links. Want a different theme? Link `dist/themes/<name>.css` **after** the bundle;
the theme layer wins. Not bundled: `exsa.fluid.css`, `dist/layouts/`, `dist/templates/` —
link those separately when you use them.

Full documentation: [`docs/README.md`](docs/README.md) · Philosophy: [`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md) · What's new: [`docs/CHANGELOG.md`](docs/CHANGELOG.md)

MIT License — see [LICENSE](LICENSE).

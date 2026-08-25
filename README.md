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
<!-- CDN — pin a version: @main → @1.0.0-rc.1 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/dist/exsa.css">
<!-- theme: optional — exsa.css ships a built-in default theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/dist/themes/breeze.css">

<!-- behaviors (optional): every JS component, prebuilt, in one file -->
<script src="https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/dist/exsa.js"></script>
```

Add `class="exsa"` to `<body>` and plain HTML is styled automatically. Add components
only when you use them, from `dist/components/` + `dist/js/`.

Full documentation: [`docs/README.md`](docs/README.md) · Philosophy: [`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md) · What's new: [`docs/CHANGELOG.md`](docs/CHANGELOG.md)

MIT License — see [LICENSE](LICENSE).

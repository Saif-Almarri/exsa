# EXSA Framework — Professionalization Plan

> Goal: turn a great CSS architecture into a great product. Reduce developer confusion,
> make the 9-layer story real, and separate the library from the website.
>
> Based on the framework review (2026-08-22). See "Findings" section at the end for the
> full audit trail. Phases are ordered by dependency — foundations first, then the
> things built on top of them. Each phase is independently shippable.

---

## Phase 0 — Baseline & Guardrails ✅ done

**Goal:** Make regressions detectable before any restructuring begins.

- [x] Add a Node validation script (`tools/validate.mjs`) that checks:
  - every file referenced in `manifest.json` exists
  - every token in `tokens.json` exists in `style.css`
  - no `!important` in `components/`, `layouts/`, `themes/`
  - (active from Phase 2 onward) every component/layout/theme file is wrapped in its `@layer`
  - (active from Phase 1 onward) no page references the deleted `components.js`
- [x] Add `npm test` / CI hook running the validator (GitHub Actions).
- [x] Record current bundle sizes (core, per-component) in `CHANGELOG.md` as the baseline.
- [x] Tag current state `v1.0.0-beta.3` (already tagged) as the rollback point.

**Done when:** `tools/validate.mjs` runs green on today's code and fails on known drift
(the 61-vs-80 token mismatch).

---

## Phase 1 — Core Fixes (the foundation of everything) ✅ done

**Goal:** Get the core files correct before anything is built on top of them.

1. **Delete the legacy JS bundle**
   - [x] Parity audit first (done 2026-08-22): all 28 behaviors in `components.js` exist
         in `js/` — `carousel.js` + `code-block.js` are new-only, so nothing is lost.
   - [x] Migrate the 7 site pages still loading `components.js?v=14` (index, docs,
         cheatsheet, icons, generator, source, theme-builder) to the `js/*.js` files
         they actually use.
   - [x] Fix `docs.php`: it loads BOTH `components.js` and `js/topbar.js` (topbar
         initializes twice — second handler undoes the first) and its prose still
         advertises the bundle as the primary API.
   - [x] Update the `README.md` file tree (drop the LEGACY entry), then delete
         `components.js` (deleted in the rc.1 commit; validator `--no-legacy` guards it).
   - [x] Move the inline `.ic` styles out of `includes/head.php` into the site's own CSS
     (created in Phase 4; temporarily `landing.css`).

2. **Fix token-count drift**
   - [x] Single authoritative count everywhere: `style.css` header, `README.md`,
         `tokens.json` (currently 61 vs 80).
   - [x] Validator rule added so it can never drift again (Phase 0).

3. **Collapse dark-mode blocks**
   - [x] Replace the 4 synced token blocks in `style.css` with `light-dark()` pairs
         + a `color-scheme` flip on `[data-theme-mode="dark"|"light"]`.
   - [x] Apply the same collapse to the 20 theme files — each currently re-implements
         the light/dark/forced-mode plumbing; the core should own the switching and
         themes should define only light/dark token pairs.
   - [x] Delete the "keep the four blocks in sync" comment.

4. **Rename the core**
   - [x] `style.css` → `exsa.css` (hard rename at rc.1 — the one-cycle `@import` alias was skipped).
   - [x] Update all library references; site pages keep `style.css` until Phase 4.

**Done when:** validator green on core rules; `exsa.css` serves with an alias in place.

---

## Phase 2 — Cascade Layers (make Layer 5 real) ✅ done

**Goal:** The layer architecture is the base every later change relies on. Phase 3
removes `!important` rules *because* this phase landed first.

- [x] Declare the full layer order in the core `@layer` statement —
      `exsa.tokens, exsa.themes, exsa.fluid, exsa.reset, exsa.utilities, exsa.elements, exsa.components, exsa.layouts`:
      token-vs-token precedence is tokens → themes → fluid (fluid's `clamp()` values must
      keep beating a theme's `--border-radius`, matching today's link order).
- [x] Wrap every `components/*.css` in `@layer exsa.components { … }`.
- [x] Wrap every `layouts/*.css` in `@layer exsa.layouts { … }`.
- [x] Wrap every `themes/*.css` in `@layer exsa.themes { … }`.
- [x] Wrap `exsa.fluid.css` in `@layer exsa.fluid { … }` (today it is unlayered and wins
      by accident — the explicit layer preserves that behavior on purpose).
- [x] Remove the cascade workarounds this enables (element-prefixed selectors added to
      beat `:where()` — revisit back-top/lightbox/cookie-bar/topbar rules from
      `CHANGELOG 1.0.0-beta.3`).
- [x] Enable the validator's `@layer`-wrapper check (now the expected state, including
      `exsa.fluid.css`).

**Done when:** every component/layout/theme file opens with `@layer`; validator green;
no `!important` remains outside the reset layer.

---

## Phase 2.5 — Override Utilities (Option C) ✅ done

**Goal:** Give the framework an in-vocabulary override path without sacrificing the
"components are authoritative" discipline.

- [x] `exsa.overrides` layer declared after `exsa.layouts` (position 9).
- [x] 18 `u-*` single-property utilities in `exsa.css` (`.u-text-center`, `.u-flex`,
      `.u-w-full`, `.u-gap-*`, `.u-m-0`…).
- [x] Docs updated (README/PHILOSOPHY layer tables, source viewer, CSS data).

**Done when:** `card u-text-center` wins; `card text-center` stays a no-op; unlayered
user CSS beats `u-*` too.

---

## Phase 3 — Layouts Consolidation (6 → 4 + 2 templates) ✅ done (2026-08-22)

**Goal:** One app shell per use case, zero duplicated patterns, no name collisions,
no library → website asset dependencies. Runs before the restructure so files move once.

Verdict per file (from the layouts audit):

| File | Action |
|---|---|
| `layouts/dashboard.css` | Keep — extract `dash-card`/`dash-stat` primitives into components |
| `layouts/general.css` | Keep, shrink — remove dashboard-mode classes, `!important`s, duplicated sync |
| `layouts/blog.css` | Merge into `general.css` (prose + toc modes) |
| `layouts/store.css` | Keep — extract product card, fix badge positioning bug |
| `layouts/fullpage.css` | Keep — move to `templates/` (hardcoded scene, not token layout) |
| `layouts/onepage.css` | Keep — move to `templates/`; fix asset + palette/licensing |
| `components/dashboard.css` | Delete (legacy float demo) — replace with extracted dashboard primitives |

- [x] Delete duplicated `body:has(.topbar--sm/lg/xl)` sync from general/blog/store
      (already defined in `components/topbar.css`).
- [x] Delete duplicated hero and sticky-footer patterns from blog/store.
- [x] Remove the 4 `!important` rules from `general.css` (Phase 2 layers make them moot).
- [x] Remove dashboard-mode classes from `general.css`
      (`layout--aside-full/full-height/content-scroll/aside-collapsed`) — document the
      migration path → `layouts/dashboard.css`.
- [x] Merge `blog.css` into `general.css` (`blog--prose`, `blog--has-toc` move over;
      delete the rest as duplicates).
- [x] Extract `dash-card`/`dash-stat`/`dash-grid`/`dash__toolbar` into
      `components/dashboard.css`; delete the legacy float demo it replaces.
- [x] Extract the store product card into a component (reuse `card.css`); fix
      `.shop__card-badge` (missing `position: relative` parent) and the dead
      `.shop__content { margin: 0 }` rule.
- [x] Move `fullpage.css` + `onepage.css` to `templates/` and label them "starter skins —
      hardcoded palette, override via tokens where documented".
- [x] Fix `onepage.css`: remove `../includes/images/1.jpg` dependency (default to a
      gradient); rewrite Helios-derived palette values (MIT-safe) or add CC-BY attribution.
- [x] Update `page-layouts.php`, `docs.php`, and the generator's layout list to the new
      file set.

**Done when:** `layouts/` contains 3 files (general, dashboard, store); `templates/`
contains 2; no `!important` and no duplicated topbar-sync remain; the generator and docs
match the manifest.

---

## Phase 3.5 — HTML Templates (folder-based) ✅ done

- [x] `templates/fullpage/` + `templates/onepage/` — each ships a complete
      `index.html` (all zones pre-wired) + its skin CSS + local SVG assets.
- [x] CDN links by default (pin-friendly), self-hosted alternative commented.
- [x] Manifest entries carry `html` + `css` pairs; validator recurses `templates/`.
- [x] Browser-verified: `:target` panels open/close, pan tile + images load locally.

---

## Phase 4 — Repo Restructure (library / site / tools) ✅ done (2026-08-22)

**Goal:** A developer who clones the repo sees a library, not a website. The final file
set from Phase 3 moves once, in one commit.

```
exsa/
├── dist/            ← the product (what developers copy)
│   ├── exsa.css
│   ├── exsa.fluid.css
│   ├── exsa.js                  (Phase 6)
│   ├── exsa.bundle.css          (Phase 6)
│   ├── components/  themes/  layouts/  templates/  js/  icons/
├── site/            ← exsa.dev website
│   ├── *.php, includes/, landing.css, demo.css, images/
├── tools/           ← validate.mjs + migration scripts (deviation: generator.php & theme-builder.php stayed in site/ — they are web pages whose includes and relative links assume the site root)
├── manifest.json    ← single metadata source of truth
├── docs/            ← README.md, PHILOSOPHY.md, CHANGELOG.md, CONTRIBUTING.md
└── LICENSE, TRADEMARK.md
```

- [x] Physically move files into `dist/`, `site/`, `docs/` (git mv for tracked files) — 234 files in dist/, 43 in site/, 4 in docs/.
- [x] Rewrite root `README.md` as the "map": library → `dist/`, website → `site/`, tooling → `tools/`.
- [x] Update all relative paths — site pages link `../dist/…` (scripted via `tools/rewrite-site-paths.mjs`); generator fetches `../manifest.json` + `../dist/…`; source viewer and theme-builder read `../dist/…`; manifest/tokens paths prefixed `dist/`; nginx root → `site/`.
- [x] CDN paths are now `@main/dist/…` (documented as a **breaking change** for 1.0.0 — see Phase 8). Browser-verified: all site pages, generator ("All files loaded successfully"), theme-builder, and templates load from the new URLs.

**Done when:** `git clone` + reading the root README → a developer can find, link, and
copy the library without touching any `.php` file.

---

## Phase 5 — One Metadata Source of Truth ✅ done (2026-08-22)

**Goal:** Kill the three-way data drift (`manifest.json`, `tokens.json`, `exsa.css-data.json`).

- [x] `manifest.json` is the canonical catalog — new `tokens` section (64 core + 19 z-index + 8 component + 3 layout tokens with names/types/notes; values stay in CSS), `requires` dependency edges on the 4 behaviors that use `exsa-core.js` (drawer, lightbox, modal, video-gallery).
- [x] `tools/build-tokens.mjs` generates `tokens.json` from the manifest + the CSS files (values parsed from `dist/exsa.css`, component/layout files; rem→px computed; `--check` mode for CI). Never hand-edited again.
- [x] `exsa.css-data.json` had **zero consumers** (grep across the repo) — deleted as dead data. Stray duplicate `dist/templates/fullpage.css` + `onepage.css` (byte-identical to the folder versions) also removed.
- [x] Validator rules 6–10: catalog ↔ CSS definitions both directions (no undocumented core tokens), fallback-less `var(--x)` must resolve in core/fluid/same-file (theme key drift), `components[].js` null-or-file, `--check-tokens` compares `tokens.json` to generator output. `npm test` now runs `--layers --no-legacy --check-tokens`.
- [x] Latent bugs surfaced & fixed while wiring this up: `manifest.components.range-slider.js` was the bare string `"range-slider"` (now `dist/js/range-slider.js`); `carousel.css` used `var(--slide-size)` with **no fallback and no definition** (now defaults to `100%` on `.carousel__slides`); `--blockquote-border` was documented as `none` but really `4px solid var(--color-secondary)` — the generated export now tells the truth.

**Done when:** ✅ one catalog (manifest) + one generated export (tokens.json); a token added to `exsa.css` + one catalog line flows into the JSON via `node tools/build-tokens.mjs` — and CI fails if you forget either step.

---

## Phase 6 — JS Hardening & Prebuilt Bundles ✅ done (2026-08-22)

**Goal:** Make JS impossible to mis-link, and give non-PHP users the generator's output.

- [x] Every behavior file gets a DOM-ready guard — all 29 files wrapped by `tools/add-dom-guards.mjs` (`__exsaInit` + `readyState` check): `<head>`, `defer`, and end-of-body all work now.
- [x] Dependency graph in `manifest.json` — done in Phase 5 (`requires: ["dist/js/exsa-core.js"]` on drawer/lightbox/modal/video-gallery).
- [x] Runtime guard — injected into the same 4 behaviors: without `exsa-core.js` they skip with a console warning instead of throwing.
- [x] `tools/build-bundle.mjs` produces `dist/exsa.js` (exsa-core first + all 29 behaviors, ~69 KB) and `dist/exsa.bundle.css` (core + 56 component files + breeze, ~186 KB) — with relative `url()` icons **rebased** to the bundle location (233 refs — otherwise every icon 404s). `npm run build`; validator rule 11 (`--check-bundles`) + rule 10 (`--check-tokens`) make CI fail on stale generated files.
- [x] Latent-bug sweep: `a-icon` → `ic` in toast.js; `cc-theme` → `exsa-theme` in theme-switcher.js (legacy key still read); drawer.js resolves its own `.drawer__panel` (close-label → backdrop sibling → page fallback); orphaned `loading-button.js` deleted (old `.btn-loading` demo, zero references).
- [x] Site pages switched to the bundle (12 files incl. `includes/head.php` — ~80 `<link>`/`<script>` tags deleted). **Bonus bug found while dogfooding:** `icons.php` generated mask paths at `components/icons/` (110 × 404) → `../dist/components/icons/`. All 10 pages browser-verified: zero failed requests, zero page errors, carousel upgraded, dropdown/tabs live, breeze applied.

**Done when:** ✅ the docs site runs on two generated files — `dist/exsa.bundle.css` + `dist/exsa.js` — and every behavior activates with zero console errors.

---

## Phase 7 — Naming, Docs & DX Consistency ✅ done (2026-08-23)

**Goal:** One convention, documented and enforced.

- [x] Standardize BEM — swept all 56 component CSS files: every class belongs to its block; the only exceptions are documented legacy abbreviations (`tbl`, `sep`, `pricing`, `range`, `ctx-menu`, `ex-cp`, `progress-item`, `media-*`, `dash-*`, `vt-*`, `bg-*`, `ic-*`), now listed in CONTRIBUTING. `has-*` / `layout--*` state classes verified `<body>`-only. Dead demo classes `st-icon` / `ig-icon` removed from showcase (5 spots, live demos + code snippets).
- [x] Documented the convention in `CONTRIBUTING.md` — new "component-author checklist" (7 gate items CI enforces) + "Add a component in six steps" guide. Fixed stale claims there too: "Five @layer levels" → nine, "80 tokens" → 82.
- [x] `?v=NN` cache busters → one PHP constant: `site/includes/version.php` (`$EXSA_VER = 31`), included at the top of all 10 pages; 38 `?v=…` occurrences rewired to `?v=<?= $EXSA_VER ?>`. Bump one number → every asset refreshes.
- [x] Duplicated `.ic` rules removed from docs/generator/icons/index (19 inline lines) — the `.ic` base + all 110 masks now come from `icons.css` inside the bundle. Page-specific size overrides (`.why-item__icon .ic{width:22px}` etc.) kept — they're real overrides, not duplicates.
- [x] `PHILOSOPHY.md` reconciled with shipped code: Inventor's Statement now says 9-layer cascade; "steps aside completely" → per-element wording documenting the `class=""` and JS-hook-class edge cases (use `data-*` for hooks); "Fluid by Default" → "Fluid as an Option" (one optional file, `exsa.fluid.css`); feature table gains `:has()` and container queries with real support dates.

**Done when:** ✅ a new contributor can ship a component by following one page of `CONTRIBUTING.md` without reading framework source.

---

## Phase 8.5 — Spacing-Tokenization Pass ✅ done (2026-08-23)

**Goal:** Make the density-profile promise true — and find out how unstandardized the spacing really was.

- [x] `npm run audit` — new `--token-audit` mode in the validator: reports hardcoded `margin`/`padding`/`gap` declarations (actionable = px/rem; informational = em/%/vh geometry; token defaults listed separately). First run: **350 literal spacing declarations** across the whole framework.
- [x] `tools/tokenize-spacing.mjs` rewrote all 394 px/rem spacing values to `calc(N * var(--space-factor, 1))` — zero visual change at factor 1 (verified in-browser: 20px → 20px), and `data-profile` now genuinely scales every component (verified: card body 20px → 16px compact / 26px spacious).
- [x] Two wrongly-transformed token defaults reverted (`--gap`, `--scroll-margin-top`) and the script hardened with a lookbehind so custom properties can never be touched again.
- [x] Re-audit: **0 actionable** px/rem literals; 33 informational em/% geometry; 7 token defaults (the gap scale itself). Bundles + tokens regenerated.

**Done when:** ✅ `npm run audit` reports zero actionable spacing — and the PHILOSOPHY claim "profiles change the density of every component" is now literally true.

---

## Phase 8.6–8.14 — Contract Tooling & Hardening ✅ done

**Goal:** Give EXSA's "structured markup" promise teeth — machine-checked contracts,
regression detectors, and a debug-time linter/spellchecker.

- [x] **8.6 — Markup contracts:** `manifest.json` carries `structure` arrays for the
      components with required inner parts; debug CSS flags missing parts.
- [x] **8.7 — Regression detectors:** `.calc(` corruption rule, site token-reference
      linter (`var(--x)` + bare multi-part tokens), multi-viewport overflow sweep
      (`tools/layer-probe.mjs`).
- [x] **8.8 — Contracts for slideshow, popover, sidebar** — per-part missing labels
      (fixed the `:not(:has())` AND-chaining bug; drawer rootless sibling contract).
- [x] **8.9 — Conditional layout contracts** — general/dashboard/store/fullpage/onepage
      (34 rules, 8 layout fixtures, `site/qa/layout-probe.html`).
- [x] **8.10 — Remaining required components** — accordion, code-block, data-list,
      drawer, dropdown, modal, range-slider, select, timeline.
- [x] **8.11 — Class-name spellchecker** — `dist/exsa.debug.js` (841-class registry,
      Levenshtein ≤2 "did you mean?" suggestions, `data-dbg-allow` escape hatch).
- [x] **8.12 — ARIA guidance** in all 14 component CSS headers.
- [x] **8.13 — Semantics guidance** in layout/template headers (5 files).
- [x] **8.14 — Fluid layer documented as optional per-project** (cascade comments,
      fluid header, docs; the prebuilt bundle intentionally excludes it).

**Done when:** ✅ `npm test` / `npm run audit` green; `contract-probe` 35/35,
`layout-probe` 8/8, `spell-probe` 8/8, layer-probe overflow-free across 1280/768/390.

---

## Phase 8 — Release & Verification ✅ done (rc.1 tagged 2026-08-24)

- [x] Regression probes in `site/qa/` run via Playwright: `layer-probe` (multi-viewport
      overflow sweep + screenshots), `contract-probe` (35 checks), `layout-probe`
      (+ 8 fixtures), `spell-probe` (8 checks). Full per-theme screenshot matrix
      was descoped in favor of these structural probes.
- [x] Version bump to `1.0.0-rc.1`; `CHANGELOG.md` documents the breaking changes:
  - `dist/` path prefix on CDN
  - `style.css` → `exsa.css`
  - `@layer`-wrapped components (override behavior now layer-based)
  - `components.js` removed
  - `layouts/blog.css` merged into `general.css`
  - dashboard-mode classes removed from `general.css`
  - `components/dashboard.css` repurposed (legacy demo replaced by primitives)
  - `fullpage.css` / `onepage.css` moved to `templates/`
- [x] Update `README.md`, `PHILOSOPHY.md`, manifest `schemaVersion`, and all site docs
      for the new structure — and verify every absolute claim in the philosophy holds
      against the shipped code before publishing (layer promise, guard wording,
      token counts).
- [x] Re-run validator + bundle-size report; publish.

**Done when:** ✅ `npm test` + `npm run audit` + all four probes green on the tagged rc.1;
a fresh clone, two links, and one token override reproduce the full design system
with zero warnings.

---

## Phase summary

| Phase | Focus | Risk | Effort |
|---|---|---|---|
| 0 | Validator + CI | None | ~1 day |
| 1 | Core fixes: legacy, tokens, light-dark, rename | Low | ~1–2 days |
| 2 | Cascade layers (`@layer` everywhere) | Low–Medium | ~2 days |
| 3 | Layouts consolidation (6 → 4 + 2 templates) | Medium | ~2–3 days |
| 4 | Repo restructure `dist/ site/ tools/` | Medium (paths) | ~2 days |
| 5 | Manifest as single source | Medium (tools) | ~1–2 days |
| 6 | JS hardening + prebuilt bundles | Low–Medium | ~2 days |
| 7 | Naming/docs consistency | Low | ~1–2 days |
| 8 | RC release + visual regression | Medium | ~2 days |

Suggested sequencing: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Each phase leaves the repo
shippable.

Dependency logic: 0 guards everything. 1–2 fix the core and the cascade — the base.
3 consolidates layouts *on top of* the layers (no `!important` removals before layers
exist). 4 moves the now-final file set once. 5 catalogs the final structure in the
manifest. 6 consumes that catalog for dependency order and bundles. 7 documents the
final structure. 8 ships it.

---

## Audit findings behind this plan

1. **Library + website share one root** — 14 PHP pages, `landing.css`, `demo.css`,
   `includes/`, `nginx.conf` sit next to the framework files.
2. **Layer 5 is declared but empty** — no component/layout/theme uses `@layer`;
   CHANGELOG shows cascade workarounds (`!important` removals) fighting this.
3. **Two JS systems ship** — legacy `components.js` (28 behaviors) vs `js/` (superset:
   same 28 + `carousel.js` + `code-block.js`). 7 site pages still load the legacy
   bundle; `docs.php` loads it AND `js/topbar.js` (topbar initializes twice) and its
   prose advertises the bundle as the primary API. The extracted files carry latent
   bugs (`a-icon` in toast, `cc-theme` key, global-first `.drawer__panel` in drawer).
   Plus `.ic` styles duplicated inline in `includes/head.php`.
4. **Three metadata files, already drifted** — token count says 61 in `style.css`, 80 in
   `README.md`/`tokens.json`.
5. **Naming inconsistent** — `style.css` vs `exsa.fluid.css`; `layout--*`/`shop--*`/
   `blog--*`/`dash--*` state classes vs BEM elements; two `dashboard.css` files.
6. **Dark mode = 4 manually-synced token blocks.**
7. **JS: undeclared dependencies** (`modal.js` → `exsa-core.js`), no DOM-ready guard,
   no prebuilt single file.
8. **Docs site doesn't dogfood the generator** — per-page `?v=` cache busters and
   8–10 hand-linked files per page.
9. **Layouts: duplication + boundary violations** — topbar-sync/hero/sticky-footer
   patterns reimplemented 3–4×; `general.css` duplicates dashboard mode;
   `components/dashboard.css` (legacy float demo) collides with `layouts/dashboard.css`;
   store/fullpage reimplement components; `onepage.css` depends on a docs-site asset
   (`../includes/images/1.jpg`) and borrows an HTML5UP CC-BY palette; 4 `!important`
   rules remain in `general.css`; `.shop__card-badge` bug (no positioned parent).
10. **Philosophy claims vs shipped code** — the "5-layer cascade" promise is only 4/5
    real (component layer declared but empty); "steps aside completely" is per-element,
    not per-subtree (`code`/`kbd`/`hr` inside classed containers still styled; empty
    `class=""` opts out; no opt-back-in for JS-hook classes); "fluid by default" is an
    opt-in file; the baseline table omits `:has()` + container queries (2023); all 20
    themes re-implement the dark-mode plumbing.

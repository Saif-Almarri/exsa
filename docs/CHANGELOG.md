# Changelog

All notable changes to EXSA will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🔧 Changed

- **Dropdown keyboard nav now covers notification items** — `js/dropdown.js` only arrow-navigated `.dropdown__item`, so the Notifications dropdown (whose items are `.notifications__item`) got no ArrowUp/Down support and Enter on the trigger didn't focus the first item. The item lookup now includes `.notifications__item:not([disabled])`.

- **Chart sizing contract documented; showcase demos aligned** — charts are width-driven (full: 600×240 ≈ 2.5:1, sparkline: 300×60 = 5:1) and height follows automatically, but the showcase demos set heights that didn't match the ratio, leaving the SVGs letterboxed inside their boxes (e.g. 120px of chart in a 160px box). Demos now use ratio-matched sizes and `chart.css` documents the rule.

- **Notifications items leaked button chrome** — when `.notifications__item` was authored as `<button role="menuitem">`, UA styles bled through (buttonface background, 2px outset border, Arial font, shrink-to-fit width ~165px in a 320px menu) because the component never neutralized button styles like its sibling `.dropdown__item` does. Items now reset background/border/font/color/text-align and fill the full menu width — correct for both `<div>` (docs markup) and `<button>` (interactive) usage.

- **Utilities layer is now layout-only** — the typography suite (`.text-*`, `.fw-*`, `.font-*`, `.italic`, `.uppercase`, `.capitalize`, `.text-muted`, `.fluid-type`, plus the `.text-start/end/center/left/right` alignment set and `sm:text-center`) sat in `exsa.utilities` (layer 5), where any element/component rule in a later layer silently beat it — a class that did nothing. Re-homed in `exsa.overrides` as `u-*` escape hatches (`u-text-lg`, `u-fw-bold`, `u-font-mono`, `u-uppercase`, `u-capitalize`, `u-text-muted`, `u-fluid-type`, …) that always win; alignment got the existing `u-text-start/center/end` plus new `u-text-left/right`. The utilities layer now matches its documented "flex, grid, containers" scope.

- **Guarded Classless™ guard asymmetry fixed** — `:where(.exsa ol li)`, `:where(.exsa ul li)`, `:where(.exsa details)`, `:where(.exsa details summary)`, and `:where(.exsa details details)` lacked `:not([class])`, unlike the rest of the classless engine, so classed component markup kept matching prose rules. That was the root cause of the earlier tree "neutralize classless …" patches — and it also gave every nested tree node a stray 2px border + 16px padding. Guards now sit on the list/details container; `tree.css` declares its row weight explicitly and drops the dead margin neutralizer.

- **Density-factor claims corrected** — `--radius-factor` / `--font-factor` were documented as cascading "through the entire design system," but their only consumers were `exsa.fluid.css`'s `--border-radius` / `--font-size-*` tokens and the dashboard cluster (`--radius-factor` has exactly one consumer; `.dash--dense`'s body-level override was a no-op — `--border-radius` resolves at `:root`). `PHILOSOPHY.md` and the `manifest.json` factor notes now state exactly what scales. Wiring the factors through all components remains an open option for a future release.

- **Token discipline in the classless button** — `:where(.exsa button:not([class]))` hardcoded `font-size: .88rem`; it now uses `var(--font-size-base)`, so the button follows theme/fluid font scaling. The table `.84rem` (classless + `.tbl`) is a deliberate in-between size and is now commented as such.

- **KPI grid no longer drops its third card on desktop** — `.kpi-grid` was `minmax(200px, 1fr)`, so three cards need 632px of content width. The showcase demo frame capped at 620px (564px after stage padding), which could never fit three columns — every desktop saw 2 cards on the first row and 1 below. The grid minimum is now 180px (572px for three, still comfortable for a 1.75rem value with 20px padding) and the demo frame is 700px, so the KPI row stays 3-across from ~1000px viewports up and wraps gracefully below.

- **Alert demo width is now responsive** — the Alert / Notice showcase stage was a fixed `max-width:620px`, so the alerts never reflected their container. The stage now uses `width:90%`, and the alerts scale with the page at every viewport.

- **"Your First Page" docs example corrected** — the snippet put `h2` + paragraphs + an `aside` inside one classless `<section>`, which rendered everything in a single flex row (sections lay direct children out side-by-side by design). The example now shows prose in `<main>` and two `aside` cards in the section, and the copy explains the flex-row behavior, where prose belongs, and the class-based opt-out.

- **Showcase code snippets rewritten to match the demos** — an automated stage-vs-snippet audit found 29 of 69 sections where the code snippet drifted from the live demo (e.g. Music Player's snippet lacked the `.music-player` root and `data-duration`; Alert's was `<div class="alert alert--info">…</div>`; Sidebar showed a bare `<ul>` instead of `sidebar__sub-menu`; KPI never showed `kpi-grid`). Every snippet now shows one complete, copy-pasteable example that matches the demo markup exactly. Snippets intentionally show a single example per component — variant classes (`--sm`, `--danger`, …) are described in each section's prose and demo instead.

- **Hero snippet now teaches the real component** — the snippet used `body.exsa > header` with `.btn`-classed buttons and never mentioned linking anything, but the actual component is `components/hero.css` (detects `<header>` as a direct child of `<body>` and inverts *classless* buttons to white). Pasted snippets therefore rendered a plain full-width header instead of the hero. The snippet now includes the `hero.css` link and classless buttons, the demo buttons match the inverted look, and the description states the direct-child requirement. Live-verified: snippet renders 60vh, absolute figure, centered white text, inverted buttons.

- **Hero buttons no longer stretch full-width** — `hero.css`'s header is a flex column, so with default `align-items: stretch` any button authored as a direct child of `<header>` stretched to the full hero width. The header now centers its children (`align-items: center`) and direct-child buttons keep their own padding (`:not(button)` added to the generic text rule), so buttons render auto-width in both authorings — side-by-side when wrapped in a `<p>` (the documented snippet) and stacked-but-centered when direct children. The old generic rule was also silently stripping button padding (38px → 18px tall).

- **`elements.php` snippets aligned with the demos** — the stage-vs-snippet audit run on the Elements page found three drifts. Callout: the snippet's recolored example dropped the `<article>` wrapper, which is what triggers the `article > aside` detection — pasted as-is it rendered a bare unstyled `<aside>`; it now keeps the wrapper and the demo's green knob values. Stats: the demo claimed 61 tokens while the framework documents 82 everywhere else (demo corrected to 82), and the snippet now shows the big-number inline `<strong>` styling the demo uses, since the auto-detected stats row only provides the grid, not the large digits. Form: the snippet was over-abbreviated — no `<select>`, range input, radio fieldset, read-only state, or `<p>` wrapper around the submit button; it's now one complete copy-pasteable form covering every control the demo shows. The Links and Lists snippets were completed too (visited-link `<code>` text, list `<h4>` headings), and the Callout snippet now includes the demo's inner link.

- **Showcase snippet variant coverage completed** — a follow-up pass closed the remaining per-section omissions: Badge (all five colors + count/dot), Avatar (sizes, colored fallback, busy/offline statuses), Card (grid wrapper + no-image card with `badge--default` and rating), Activity (warning/danger/muted items), Empty State (`--sm`), Select (`--error`), Range (`--sm`), Color Picker (`--sm`/`--lg`), Date Picker (calendar icon), Input Group (text addon + search icon), Loading Button (`--neutral`), Data List (`label--primary`), Separator (vertical toolbar example with badge), Tags Input (`chip--success`), Command Palette (trigger button). The other flagged sections (Hero, Product Card, Pricing, Tree, Progress, Tabs, Upload, Skeleton, Form Required, Modal, Drawer, Cookie Bar) were already complete from the earlier rewrite.

- **docs.php "Adding Components" now leads with the ready-made bundles** — the section presented only per-file links and the Generator, so a reader who linked the bundle got styles but no interactivity (the JS bundle was never mentioned). It now lists three paths in order: ready-made bundles (`exsa.bundle.css` — core + all 68 components + icons + Breeze theme — plus `exsa.js` — exsa-core + all 37 behaviors), the Bundle Generator (custom CSS + JS), and individual files. The bundle's exclusions (`exsa.fluid.css`, layouts, templates) and the theme-override path are spelled out. The root `README.md` quick start gained a matching "Bundle shortcut" with an SRI-hashed jsDelivr link.

### ✨ Added

- **The 5→9 layer upgrade, and why** — the beta shipped a 5-layer cascade (`tokens → reset → layout → elements → components`); this release is a 9-layer cascade (`tokens → themes → fluid → reset → utilities → elements → components → layouts → overrides`). Every new layer is a new place for developers to take control without specificity escalation: **`themes`** makes a full-palette swap a one-`<link>` change that the cascade itself enforces; **`fluid`** layers `clamp()`-scaled spacing, type, and radius plus `data-profile="compact|spacious"` density on top of any theme; **`utilities`** (renamed from `layout`) keeps structural helpers at a predictable depth; **`layouts`** lets page shells restyle components with no per-page CSS; **`overrides`** adds the `u-*` escape hatch that always beats components and layouts — and unlayered user CSS still wins over all of it. More tiers to intervene, zero `!important` anywhere.

- **"Controlling Components from JavaScript" docs section** — the state-via-class table (`.modal--open`, drawer checkbox, `.topbar--open`, …), the `EXSA.trapFocus` / `getFocusable` / `bp` helpers, and the `exsa:*` event contract, plus the known lifecycle limitation (no init/destroy registry yet).

- **Onepage template design refresh** — the starter skin no longer reads as a wireframe: an illustrated hero backdrop (`img/hero-bg.svg` — mountain sunset in the skin palette), three new illustration placeholders (`photo-1/2/3.svg` — mountains, aurora sea, moon dunes), Roboto Slab display headings (Google Fonts with system-stack fallback), and visible card borders on the white bands (the skin previously retokened the card border to white-on-white).

- **13 new components + 8 new behaviors** — activity feed, calendar, chart (SVG line/area/bar/sparkline), command palette, empty state, kanban board, KPI card, notifications, product card, tags input, transfer list, tree, and upload dropzone (`dist/components/*.css` + `dist/js/*.js`, all manifest-registered with structure contracts and DOM-ready guards). The Table component gains sortable headers (`tbl--sortable`), search filtering (`.table-search`), and row selection (`tbl--selectable`) via `js/table.js`; two new icons (`inbox`, `chart`) bring the mask library to 112. Component count: 53 → 68; behaviors 29 → 37.

- **Markup contract (Phase 8.6)** — components that require a DOM skeleton now declare it as a `structure` schema in `manifest.json` (root / required / optional parts). Three layers enforce it: `npm test` cross-checks every `__` part between the CSS and the schema; `dist/exsa.debug.css` (generated by `tools/build-debug.mjs`, enable with `<html data-debug>`) draws a red dashed outline + label on any root missing a required part — pure CSS; and `npm run probe:contract` renders reference snippets plus deliberately broken markup in a real browser (14 good + 3 bad checks). A self-heal fallback makes a `.progress-item__fill` placed without its track still render.

- **`light-dark()` system-color fallback for pre-2024 browsers** — the core now ships a `@supports not (light-dark())` block that maps its color tokens to system colors (`Canvas`, `LinkText`, …) so browsers without `light-dark()` stay styled, readable, and dark-aware — without duplicating any theme file (one file per theme remains the authoring model). Browser Support docs now list the `light-dark()` baseline (Chrome 123 / Firefox 120 / Safari 17.5).

- **Class-conflict detector in debug mode** — `dist/exsa.debug.js` now warns in the console whenever a non-EXSA stylesheet defines a class name the framework also uses (`.flex`, `.container`, …), with a cap of 10 warnings per page. Combined with the new "Coexisting with other CSS" section in the docs, mixing EXSA with third-party CSS is now diagnosable in seconds: enable `<html data-debug>` and check the console.

### 🐞 Fixed

- **`.col-*` baked gutters removed** — `flex-basis` was `calc(50% - var(--gap-sm))` and friends: the gutter was subtracted from the item width instead of coming from the row, so it double-counted whenever the flex row used a `gap-*` utility (the pattern shown in the docs) and left trailing dead space otherwise. Bases are now pure fractions (`50%`, `33.333%`, `25%`, `20%`, `16.667%` — all breakpoints), and the gutter comes solely from the parent's `gap-*` utility, matching the docs example.

- **Starter templates shipped with broken CDN links** — `onepage` and `fullpage` referenced `@main/exsa.css`, `@main/themes/…`, `@main/components/…`, `@main/js/…`, none of which exist (everything lives under `dist/`). Corrected to `@main/dist/…` and fixed the self-host comments (`../dist/…`). Note: the templates render fully only once the current repo state is pushed to GitHub (the public repo is still the pre-`dist/` beta layout).

- **Theme Builder exported unlayered themes** — the export omitted the `@layer exsa.themes { … }` wrapper, so a downloaded theme was unlayered CSS and, dropped into `dist/themes/`, failed validation (rule 4). The exporter now emits the block-form wrapper; the affected `dist/themes/volt.css` was rewrapped.

- **Theme Builder preset drift** — the 7 preset themes (`breeze`, `night`, …) were hardcoded JS copies that drifted from `dist/themes/*.css` (e.g. Night's light mode was loaded with its dark background `#0f1117` instead of the real `#f8fafc`). Presets are now parsed server-side from the actual theme files via a shared `parseThemeCss()` helper, so they can never drift again. The builder's toggle preview also used the nonexistent `.toggle__slider` class — now `.toggle__track` + label.

- **Product card rendering** — two bugs in `components/product-card.css` (and the same image bug in `layouts/store.css`): `.shop__card` lacked `position: relative`, so the absolute `.shop__card-badge` anchored to an ancestor instead of the card; and `object-fit: cover` was set on the `.shop__card-image` wrapper instead of its `<img>`, leaving letterboxed images inside the square frame. The image now covers the 1:1 box, the badge sits on the card corner, and the px spacing was calc-wrapped to the `--space-factor` convention.

- **Theme switcher broken on `site/` pages** — `dist/js/theme-switcher.js` hardcoded `themes/<name>.css`, which resolves against the page URL and 404s for pages not at the site root (e.g. `site/showcase.php`, `site/elements.php` — their inline demo switchers also double-bound and raced the framework's). The switcher now resolves the theme file relative to the current `#theme-stylesheet` href, so it works at any page depth, on CDN links, and preserves the cache buster; the redundant inline switchers were removed.

- **Avatar responsiveness** — sizes were fixed px (40/56/80/160/320) and never scaled on small screens; now vw-clamped (desktop values unchanged, mobile scales down) with proportional fallback text. The status dot also gained a minimum 8px size plus a background-colored ring so it reads on any photo.
- **General layout mobile stacking** — `layouts/general.css` had no responsive rules: the shell kept sidebar + content side-by-side at every viewport, squeezing content to ~130px on phones. Added a ≤860px block — shell stacks vertically, asides go full-width, sidebar nav caps at 45vh.
- **Showcase demo rows** — `.doc-demo__stage` now wraps instead of overflowing on narrow screens.

## [1.0.0-rc.1] — 2026-08-23

### ⚠️ Breaking changes (from beta)

- **CDN paths are now `@main/dist/…`** — the library moved into `dist/` (`exsa.css`, `components/`, `themes/`, `layouts/`, `templates/`, `js/`). Pin `@1.0.0-rc.1` for stability.
- **Core renamed `style.css` → `exsa.css`** — `dist/style.css` remains as a one-line deprecation shim and will be removed in 1.0.0.
- **Everything is layer-wrapped** — all 84 framework CSS files live inside the 9 `@layer exsa.*` cascade; unlayered user CSS always beats components. Themes moved into `@layer exsa.themes` (they are no longer unlayered).
- **`components.js` removed** — behaviors are per-component files in `dist/js/` (or the prebuilt `dist/exsa.js` bundle).
- **Layouts consolidated 6 → 3 + 2 templates** — `blog.css` merged into `general.css` (blog mode: `blog--prose`, `blog--has-toc`); `fullpage.css`/`onepage.css` moved to `dist/templates/` as starter-kit folders.
- **Prebuilt bundles** — `dist/exsa.bundle.css` (core + all 56 components + breeze) and `dist/exsa.js` (core + 29 behaviors) replace hand-rolled bundles.
- **Spacing is tokenized** — every `margin`/`padding`/`gap` is `calc(N × var(--space-factor, 1))`; with `exsa.fluid.css`, `data-profile="compact|spacious"` rescales density globally. Pixel-identical at defaults.
- **Theme format** — themes now use `light-dark()` pairs with `color-scheme: light dark`; force a mode with `<html data-theme-mode="light|dark">`.
- **Theme persistence key** — renamed `cc-theme` → `exsa-theme` (the old key is still read once for migration).
- **Icon class fix** — toast icons use the `.ic` convention (the dead `a-icon` class is gone).

### ✨ Added

- **Layer probe (release gate)** — `site/qa/layer-probe.html` + `tools/layer-probe.mjs` (`npm run probe` / `npm run probe:baseline`): 26 in-browser cascade probes (tokens → theme → u-* → user CSS, guarded elements, JS behaviors, density profiles, RTL, focus ring) plus 6 pixel-diff screenshots with a 2% tolerance.
- **`schemaVersion` in `manifest.json`** — the manifest is now a stable, versioned contract for tooling (starter kits, generators, sync scripts). Fields are additive only; breaking schema changes will bump `schemaVersion`.
- **Framework validator** — `tools/validate.mjs` + `package.json` (`npm test`): manifest file references exist, every `tokens.json` token is defined, no `!important` outside the reset layer, optional `--layers` / `--no-legacy` checks, `--baseline` stats.
- **Token definitions completed** — `--justify-nav` and `--blockquote-border` were documented but never defined; now real `:root` tokens. `exsa.css` `:root` defines 82 tokens (64 documented in `tokens.json`); all docs updated from the stale 61/80 claims.
- **Core renamed `style.css` → `exsa.css`** — `style.css` is now a one-line `@import` deprecation alias (removed in v1.0.0). Manifest, tokens.json, generator, theme-builder, source viewer, and all docs point at `exsa.css`.
- **Dark mode collapsed with `light-dark()`** — the four manually-synced token blocks (core + 21 theme files) became single `light-dark()` definitions with `color-scheme` flips for forced modes. ~90 silently-drifted forced-mode values were normalized across themes. Total CSS: 326.5 KB → 277.9 KB (−15%). Requires Chrome 123+ / Firefox 120+ / Safari 17.5+.
- **Legacy `components.js` bundle deleted** — all 7 site pages migrated to `js/*.js` (only topbar + theme-builder's toggle were actually needed). `docs.php` no longer double-loads topbar behavior; its prose now documents the per-component `js/` model.
- **Icon system consolidated** — inline `.ic` styles removed from `includes/head.php`; all pages now load `components/icons.css` once (duplicate links removed from 5 pages).
- **Theme Builder exports the new format** — generates a single `light-dark()` block + forced-mode flips; its PHP parser reads `light-dark()` pairs from `:root`.
- **Layer 5 is real — full 8-layer cascade** — `exsa.css` now declares `tokens → themes → fluid → reset → layout → elements → components → layouts`. All 84 framework CSS files are layer-wrapped (`@layer exsa.components;` on 56 components, `exsa.layouts` on 6 layouts, `exsa.themes` on 21 themes, `exsa.fluid` on exsa.fluid.css). Unlayered user CSS now always beats every component without specificity escalation — the "no `!important`" promise is enforced, not just advertised.
- **Cascade workarounds retired** — element-prefixed `filter:none` counter-selectors in back-top/cookie-bar/lightbox merged into their natural hover rules (layer order now beats the guarded `:where()` core rules).
- **Validator hardened** — `npm test` now runs with `--layers --no-legacy`; every new component file must be layer-wrapped or CI fails.
- **Override utilities (`u-*`)** — new top layer `exsa.overrides` with 18 single-property escape-hatch classes (`.u-text-center`, `.u-flex`, `.u-w-full`, `.u-gap-*`, `.u-m-0`, `.u-radius-full`…). Unprefixed utilities stay structural (components win); `u-*` always beats components and layouts; unlayered user CSS still beats everything.
- **Utilities layer renamed** `exsa.layout` → `exsa.utilities` — kills the `exsa.layout`/`exsa.layouts` name collision and encodes the "theme + structure" model in the cascade itself.
- **Cascade inversion bug fixed** — mixing blockless `@layer` statements (distributed files) with block statements (core) silently inverted the layer order in Chromium; all 84 distributed files now use the full block form `@layer exsa.X { … }`. Verified in-browser: `u-*` beats components, plain utilities stay structural, user CSS always wins. Validator now requires the block form (and bans stray U+FEFF characters — 41 cleaned out of the CSS files).
- **Layouts consolidated 6 → 3 + 2 templates** — `blog.css` merged into `general.css` (blog mode: `blog--prose`, `blog--has-toc`); dashboard-mode classes (`layout--aside-full/full-height/content-scroll/aside-collapsed`) removed from `general.css` in favor of `layouts/dashboard.css`; all `!important` gone from `general.css` (validator green for the first time); `.dash-card`/`.dash-grid`/`.dash-stat`/`.dash__toolbar` extracted to `components/dashboard.css` (replacing the legacy float demo, with standalone token fallbacks); `fullpage.css` + `onepage.css` moved to `templates/` as starter skins — onepage's docs-site image dependency removed (gradient default) and its Helios-derived palette attributed (CC BY 3.0). `store.css` fixes: badge positioning parent, dead no-sidebar rule removed, topbar sync deduplicated. **Templates upgraded to full folders** — each ships `index.html` (all zones pre-wired, CDN links with self-hosted alternatives, local SVG assets) + its skin CSS: copy a folder, open, edit.
- **Markup contracts (runtime linter)** — `dist/exsa.debug.css` is generated from the manifest `structure` schemas; opt in with `<html data-debug>` and any component root missing a required part gets a red dashed outline + a label naming the missing part. 26 components covered (`npm run probe:contract`, 35 checks): progress, tabs, checkbox, radio, toggle, avatar, donut, alert, stepper, rating, password-input, input-group, breadcrumbs, pagination, slideshow, popover, sidebar, accordion, code-block, data-list, drawer (sibling contract on the rootless toggle), dropdown, modal, range-slider, select, timeline. Optional-only and JS-generated components are deliberately excluded so the linter never false-alarms.
- **Conditional layout contracts** — layouts declare per-mode `structure` (`"when": "body.dash--sidebar"` → requires `.dash__sidebar` + `.dash__content`): the whole shell surface (general, dashboard, store, fullpage, onepage) is covered by 34 rules (`npm run probe:layout`, 8 fixtures). Catches the silent blank-page class of layout bug.
- **Regression detectors** — validator rule 14 flags the `.calc(` corruption signature; rule 15 lints every site page for references to undefined tokens (first catch: the removed `--layout-aside-collapsed` docs row); the layer probe now sweeps 768px and 390px viewports for horizontal overflow.
- **Class-name spellchecker (dev)** — `dist/exsa.debug.js` (opt-in with `<html data-debug>`, loaded after `exsa.debug.css`): any class whose prefix is a registered EXSA root but is not itself registered gets an amber outline with a Levenshtein "did you mean?" suggestion (`card__ttile` → `card__title?`); covers `__` parts, `--` modifiers, and the `u-` utility namespace. Custom extensions opt out with `data-dbg-allow="card__cta"`. Registry is auto-generated from the dist CSS (`npm run probe:spell`, 8 checks). Red = missing required part; amber = likely misspelled class.
- **ARIA guidance completed** — every interactive component now documents its ARIA contract in the CSS header: added carousel (aria-roledescription/live, JS-managed states), advanced-color-picker (dialog + slider value text), progress (progressbar role or native `<progress>`), tooltip (role + accessible tip duplication), pagination + breadcrumbs (`aria-current`), stepper (`aria-current="step"`), spinner (`role="status"`), toggle (role=switch via JS), alert (`role="alert"` for dynamic alerts), buttons (aria-pressed/label/busy), avatar (`role="img"`), skeleton (`aria-busy`), icons (decorative `aria-hidden` rule). Layout shells got matching `Semantics:` guidance (native elements per zone — `<main>` content, `<aside>` sidebars, `<header>` heroes) in dashboard/general/store/fullpage/onepage headers.
- **Repo restructured (Phase 4)** — library → `dist/` (exsa.css, exsa.fluid.css, components/, themes/, layouts/, templates/, js/ — 234 files), website → `site/` (all PHP pages, includes/, site CSS, nginx.conf — 43 files), docs → `docs/` (README, PHILOSOPHY, CHANGELOG, CONTRIBUTING). Root README is now a map; `tools/` holds the validator + migration scripts (generator & theme-builder stay in `site/` as web pages). Manifest/tokens paths prefixed `dist/`; site pages link `../dist/…`; generator fetches `../manifest.json` + `../dist/…`; nginx root → `site/`. **CDN paths are now `@main/dist/…` — breaking change for 1.0.0.**
- **One metadata source of truth (Phase 5)** — `manifest.json` now carries the canonical token catalog (64 core + 19 z-index + 8 component + 3 layout tokens: names, types, notes) plus JS `requires` edges (drawer/lightbox/modal/video-gallery → exsa-core.js); **`tools/build-tokens.mjs` generates `tokens.json`** from the manifest + actual CSS values, and CI (`npm test` → `--check-tokens`) fails if it's stale. `exsa.css-data.json` had zero consumers — deleted. Validator gains 5 rules: catalog ↔ CSS definitions both ways, fallback-less `var(--x)` must resolve (theme key drift), `components[].js` null-or-file, generated-tokens equality. **Latent bugs fixed en route:** range-slider's manifest `js` was the bare string `"range-slider"`; carousel used an undefined, fallback-less `--slide-size` (now defaults `100%`); the token export now reports `--blockquote-border`'s real value instead of a stale `none`.
- **JS hardened + prebuilt bundles (Phase 6)** — all 29 behavior files are now DOM-ready guarded (work from `<head>`, `defer`, or end-of-body — scripted by `tools/add-dom-guards.mjs`); the four EXSA-dependent behaviors (drawer/lightbox/modal/video-gallery) degrade with a console warning instead of throwing when `exsa-core.js` is missing. **`tools/build-bundle.mjs` ships `dist/exsa.js` (~69 KB, core + every behavior) and `dist/exsa.bundle.css` (~186 KB, core + 56 component files + breeze)** with relative `url()` icon paths rebased for the bundle location; `npm run build` regenerates both and CI (`--check-bundles`) fails if they're stale. **Latent bugs fixed:** `a-icon` class in toast.js (icons never rendered — now `ic`), `cc-theme` storage key → `exsa-theme` (old key still read once for migration), drawer.js now resolves its own `.drawer__panel` instead of the first on the page; orphaned `loading-button.js` (old `.btn-loading` demo, zero references) deleted. **The entire site now dogfoods the bundles** (12 files, ~80 `<link>`/`<script>` tags deleted) — plus a mask-path bug in `icons.php` (`components/icons/` → `../dist/components/icons/`) fixed; all 10 pages browser-verified with zero failed requests.
- **Demo images self-hosted** — the showcase depended on 29 external `picsum.photos` URLs (avatars, cards, lightbox, video gallery, carousel, hero) that render empty when the service is unreachable; the fullpage template's placeholder photo also became a bundled `img/photo-1.svg`. All showcase demos now use the local photos in `site/includes/images/` (`1–11.jpg`, `s1–s5.jpg`, `f1–f4.jpg`, `bg.jpg`, `man.png`, `carto.png`) — the component library renders fully offline.
- **Naming, docs & DX consistency (Phase 7)** — all 56 component files verified BEM-conformant (documented abbreviations listed in CONTRIBUTING); `has-*`/`layout--*` state classes confirmed `<body>`-only; dead demo classes (`st-icon`, `ig-icon`) removed. **`CONTRIBUTING.md` now has a component-author checklist + a six-step "add a component" guide** (layer wrapper, manifest entry, token catalog, gate commands). **One cache-bust version** — `site/includes/version.php` (`$EXSA_VER = 31`) replaces 38 scattered `?v=NN`; bump once, everything refreshes. **19 duplicated inline `.ic` rules removed** from four pages (the bundle's `icons.css` covers the base + all 110 masks). **`PHILOSOPHY.md` reconciled with shipped code** — 9-layer cascade wording, per-element "steps aside" with the `class=""` / JS-hook edge cases, "Fluid as an Option", and the feature table now lists `:has()` + container queries with real support dates.
- **Pre-release full-repo audit (Phase 8 gate)** — sweep for leftovers, bugs, and misalignment. Fixed: `source.php`'s layer viewer still parsed 5 layers and globbed `components/` (empty list) instead of `dist/components/` — now renders all 9 layers with synthetic themes/fluid/layouts sections and the full cascade-order table; every remaining `5-layer` claim and stale count (`80 tokens`, `61 custom properties`, `six layouts`) corrected across `manifest.json`, docs, and site meta (9-layer + 82 tokens everywhere); doc code examples updated to `dist/…` paths; orphaned `site/landing.css` and the unwired `.stylelintrc.json` deleted; dead demo classes (`ig-icon`, `ib-icon`, `st-icon`) removed from `demo.css`; stale `components.js` mention in `accordion.css` header fixed; `.htaccess` comment updated. Verified: **no genuine duplicate class definitions** across distributed CSS — every cross-file hit is an intentional scoped override (layouts adapting components, icon sizing, complementary error states).
- **Spacing-tokenization pass (Phase 8.5)** — new `npm run audit` (`--token-audit`) exposed **350 hardcoded `margin`/`padding`/`gap` literals** that ignored the density-profile tokens. `tools/tokenize-spacing.mjs` rewrote all 394 px/rem spacing values to `calc(N × var(--space-factor, 1))` — pixel-identical at the default factor (browser-verified), and **`data-profile="compact|spacious"` now genuinely rescales every component** (card body: 20px → 16px / 26px), making the PHILOSOPHY density claim literally true. Re-audit: **0 actionable** literals (only intentional em/% geometry and the `--gap-*` scale defaults remain).
- **Showcase + cheatsheet copy audit** — every claim and snippet in `site/showcase.php` and `site/cheatsheet.php` fact-checked against the shipped CSS/JS. Fixed: stale `80 custom properties` / `5 layers` / `--color-error` / `animated SVG checkmark` / `--sliceN` percentage wording; dead `a-icon` classes normalized to `ic`; the music-player demo's external Unsplash image self-hosted; manifest "Bar Chart" entry corrected (dash primitives vs. `.bar-row` in donut.css). Cheatsheet: badge/tooltip/tabs/cookie-bar/dashboard modifiers replaced with the real ones, toast auto-dismiss corrected to 3.5s, JS line counts updated, token grid completed to all **82 tokens** (colors, typography, breakpoints, density factors, full z-index scale), utilities badge made exact (89 + responsive variants). **Latent bug fixed:** the tokenizer corrupted dot-form values (`.1rem` → `.calc(1rem …)` = 16px instead of 1.6px) in `exsa.css`, `carousel.css`, `drawer.css`, `separator.css` — all 17 restored to `calc(0.Nrem …)` and bundles rebuilt.

### 📦 Baseline (2026-08-23)

- Core `dist/exsa.css`: **32.8 KB** (7.7 KB gzipped) — 85 CSS files (56 components, 21 themes, 3 layouts, 2 template folders, fluid)
- Bundles: `dist/exsa.bundle.css` **194.0 KB** (core + 56 components + breeze) · `dist/exsa.js` **68.7 KB** (core + 29 behaviors)
- `npm test` green: 114 manifest refs, 64 tokens, 85 CSS files · `npm run probe` green: 26 browser probes + 6 screenshots
- Tag `v1.0.0-rc.1` created as the release-candidate gate; `v1.0.0-beta.3` remains the pre-professionalization rollback point
- Known open issues: none — the last 5 `!important` rules (in `layouts/general.css`) were removed during the layouts consolidation, and the validator now enforces the no-`!important` promise


---

## [1.0.0-beta.3] — 2026-08-14

### ✨ Added

- **Two new page layouts** — `layouts/fullpage.css` (single-viewport landing: backdrop, centered brand, social rings, pure-CSS `:target` panels) and `layouts/onepage.css` (multi-section marketing page: photo hero, nested hover dropdowns, banner, carousel, features grid, dark footer). Layouts are selectable in the Bundle Generator.
- **Token-driven z-index scale** — 19 `--z-*` tokens (from `--z-floating: 10` to `--z-skip: 10000`) in `style.css`. Every cross-component overlay (topbar, modal, drawer, toast, lightbox…) and layout shell layer consumes them. Modals now sit above the topbar (`--z-modal: 1050`).
- **Code Block behavior** — `js/code-block.js`: copy-to-clipboard (Clipboard API + fallback) and automatic syntax highlighting (`hl-tag/attr/val/cmt`) that skips already-highlighted blocks. Loaded by showcase, elements, and page-layouts.
- **Generator: Page Layouts section** — pick any of the six layouts; bundled into `bundle.css` with stats and cache-busted assets.
- **Form Required showcase demo** — automatic `:user-invalid` / required-asterisk feedback documented in the showcase.

### 🔧 Fixed

- **Generator JS bundle was broken** — behaviors were regex-extracted from the legacy `components.js` using markers that don't exist; now each behavior's `source` file (`js/*.js`) is fetched directly from the manifest.
- **Removed all `!important` from components** — back-top/lightbox/cookie-bar hover filters replaced with element-prefixed selectors that beat the guarded `:where()` link rules naturally; topbar list padding no longer needs `!important`.
- **Tooltip sizing** — long tips now wrap into a clamped bubble (`width: max-content; max-width: min(320px, 100vw - 24px)`) instead of overflowing the viewport or collapsing into a skinny column.
- **Tooltip demo clipping** — `.doc-demo:has(.tooltip)` now overflows visibly, matching the color-picker fix.
- **Docs synced** — six layouts documented in `docs.php` and `page-layouts.php`; topbar CTA reads “Generate custom CSS”.

### 📦 Size

- **32 KB** core (z-index scale + layout tokens added).

---

## [1.0.0-beta.2] — 2026-07-28

### ✨ Added

- **Card horizontal variants** — `.card--horizontal` and `.card--horizontal-reverse` with CSS Grid layout (image beside content, footer under body). New sub-elements: `.card__head-row`, `.card__rating`, `.card__divider`.
- **Typography tokens** — `--font-size-xs` through `--font-size-2xl` (7 tokens), `--font-weight-normal/bold/heavy` (3 tokens), `--font-family-mono`.
- **Border token** — `--color-border` added; all element borders now reference it instead of `--color-bg-secondary`.
- **Overlay & button tokens** — `--color-overlay` (modal/drawer backdrops), `--color-button-text-inverse` (dark theme button text).
- **Logical alignment classes** — `.text-start` and `.text-end` alongside `.text-left`/`.text-right`.

### 🔧 Fixed

- **Skip-link** — RTL border-radius, `inset-inline-start` for logical positioning, forced-colors support.
- **Nav dropdown** — gap changed from `1.7rem` to `margin-top: var(--gap-xs)`.
- **Sup badge** — `vertical-align: super` replaces `top: -2px`.
- **List padding** — `padding-inline-start: 1.2em` replaces physical `padding-left`.
- **Form width** — `input:not([type])` included in full-width selector.
- **`img:not([alt])`** — red dashed outline dev warning for missing alt text.
- **`[hidden]`** — `display: none !important` prevents accidental overrides.

### 📦 Size

- **26 KB** raw, **~5.6 KB** gzipped (was 19.8 KB / ~6.7 KB). Growth from new tokens, horizontal card, and a11y improvements. Comments trimmed — cheatsheet.php is the canonical docs source.

---

## [1.0.0-beta] — 2026-July

### 🚀 First Public Release

Initial beta launch of EXSA — a 5-layer CSS framework built on tokens, not tools.

### ✨ Added

- **5-layer cascade architecture** (`@layer`):
  1. `exsa.tokens` — 61 CSS custom properties
  2. `exsa.reset` — Box model, focus rings, accessibility, RTL
  3. `exsa.utilities` — 85+ flex/grid utilities
  4. `exsa.elements` — Guarded Classless™ semantic HTML styling
  5. `exsa.components` — 50 BEM components with zero specificity (`:where()`)

- **50 Components:** accordion, alert, avatar, back-to-top, badge, breadcrumbs, buttons, card, checkbox, code-block, color-picker, context-menu, cookie-bar, dashboard, data-list, date-picker, donut, drawer, dropdown, footer, form-required, form-validation, input-group, lightbox, modal, music-player, pagination, password-input, popover, pricing-table, progress, radio, range-slider, rating, resizer, select, separator, sidebar, skeleton, slideshow, spinner, stepper, table, tabs, timeline, toast, toggle, tooltip, topbar, video-gallery

- **110 SVG Icons** — stroke-based, currentColor, 24×24. Browsable gallery at `icons.php`. Use with `<span class="ic ic-name"></span>`. Covers navigation, actions, text editing, media, account, security, commerce, and developer tools.

- **20 Themes:** abyss, breeze, clinic, console, coral, ember, forest, ink, ledger, mono, night, nova, prism, sepia, shadow, sojourn, steel, travei, tropic, volt

- **Guarded Classless™** — Semantic HTML styled automatically; adding any class instantly opts out

- **CDN support** via jsDelivr — no install required

- **Bundle Generator** — select only the components you need

- **Design tokens export** (`tokens.json`) — for Figma, JS, or Tailwind config

- **OpenLiteSpeed / CyberPanel compatibility**

### 📦 Size

- **19.8 KB** core (style.css)
- Components: ~1 KB each
- Themes: ~1–2 KB each

### 🔗 Links

- **Website:** [exsa.dev](https://exsa.dev)
- **GitHub:** [github.com/Saif-Almarri/exsa](https://github.com/Saif-Almarri/exsa)
- **CDN:** `https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/style.css`

# EXSA — Skins: the Material Axis (design + implementation plan)

> Proposed feature: a second theming axis so one token file can restyle every
> surface — Flat, Glassmorphism, Neumorphism, Claymorphism, Skeuomorphism,
> Glossy —
> without touching component, layout, or template code. Fonts stay out of the
> framework — a docs-only typography reference (§10) curates luxury pairings
> that developers link themselves.
>
> **Status (2026-08-28):** design approved; fonts scoped to a docs reference,
> no binaries. Implemented: heading-font wiring, surface tokens + `exsa.skins`
> layer, validator skin contracts, all ten skins (`flat`, `glass`,
> `neomorphic`, `clay`, `skeuomorphic`, `glossy`, `brutalist`, `metallic`,
> `glow`, `neon`), bundle `--skin` option, proof migration (`card.css`, `store.css`);
> Phase 3 complete — components, layouts, and templates migrated (24 files);
> Phase 4 mostly done — `skins.php` lab page live, Theme Tester removed,
> docs updated; theme contract tightened — themes are color-only
> (`--border-radius` + font tokens moved to the skin axis).
> Phase 4 complete (2026-08-29) — skin picker shipped in the generator;
> theme-builder deliberately stays colors-only.
>
> **Gates (no npm):** the published package ships no dev scripts. Run the local tools directly:
> `node tools/validate.mjs --layers --no-legacy --check-tokens --check-bundles --check-debug --token-audit` ·
> `node tools/build-bundle.mjs && node tools/build-tokens.mjs && node tools/build-debug.mjs`.

---

## 1. Goal

A developer should be able to change **how surfaces are drawn** — backgrounds,
borders, shadows, inset highlights, blur, radius, font pairing — with **one
custom-property file and one `<link>`**, the same way they already change colors
with a theme. Glassmorphism vs. Neumorphism vs. Claymorphism are not different
colors; they are different *surface recipes*. Today those recipes are hardcoded
inside components, so no variable change can swap them.

## 2. The architecture: two orthogonal axes

| Axis | Layer | Owns | Files |
|---|---|---|---|
| **Palette** | `@layer exsa.themes` | `--color-*` only — colors, nothing else | 21 theme files (20 catalog + custom starter) |
| **Material** | `@layer exsa.skins` *(new)* | `--surface-*` recipes + optional font pairing | 9 skin files (new) |
| **Structure** | components / layouts / templates | consume tokens only, never hardcode recipes | refactor, no new concepts |

- **Themes are pure color files** — `--border-radius` and font tokens moved out
  (2026-08-28); the runtime-swap contract and validator rules unchanged.
  Shape and typography pairing belong to the skin axis.
- **Skins are token-only files** (~25 lines of custom properties on `:root`).
  They answer one question: *how is a surface drawn?*
- **Composition is free**: 20 palettes × 10 materials = 200 looks from 30 files —
  not 200 files.

## 3. Cascade: add one layer, in the middle

```css
@layer exsa.tokens, exsa.themes, exsa.skins, exsa.fluid, exsa.reset,
        exsa.utilities, exsa.elements, exsa.components, exsa.layouts,
        exsa.overrides;
```

9 layers → 10. Skins sit **after themes, before fluid**, deliberately:

1. **Skins beat theme values** for any shared token, regardless of `<link>` order
   (name-determined precedence, not order-determined).
2. **Fluid can later scale skin tokens** (`--radius-factor`, `--space-factor`).
3. **Layouts/templates (later layers) keep authority over their own defaults** —
   skins *feed* the structure layers, never dominate them. `dash--sidebar-dark`
   re-pointing `--surface-bg` on its subtree is a token-level local mode.
4. **`exsa.overrides` stays the escape hatch** (`u-*` utilities; unlayered user
   CSS always wins).

### Rejected alternatives

| Option | Verdict |
|---|---|
| Skins inside `exsa.themes` | Works, but loses deterministic skin-vs-theme precedence and muddles two validator contracts |
| Skins inside `exsa.overrides` | Renders identically, but inverts control (nothing can re-default skin tokens), breaks the documented escape-hatch identity, kills the fluid hook |
| Skins via templates | Templates style only their own zones; can't restyle components/user markup; style × template file explosion |
| Skins via layouts | Layouts are pure structure; no host for material; (they do need ~4 token migrations — §8) |
| Per-style full bundles (`exsa.glass.css` = re-baked bundle) | Ships identical component CSS once per style (99% duplicated bytes), re-bakes every fix N times, violates "nothing unused ever ships" |

## 4. The surface token contract

Defined in `dist/exsa.css`, `@layer exsa.tokens`. **Every default equals today's
rendered pixels** — zero visual change until a skin is applied.

| Token | Default (flat-equivalent) |
|---|---|
| `--surface-bg` | `var(--color-bg)` |
| `--surface-bg-elevated` | `var(--color-bg-secondary)` |
| `--surface-border` | `1px solid var(--color-border)` |
| `--surface-border-control` | `1px solid var(--color-border)` (control boundary — skins must keep it visible, never `none`) |
| `--surface-radius` | `var(--border-radius)` |
| `--surface-shadow-sm` | subtle, `color-mix(in srgb, var(--color-text) 8%, transparent)` |
| `--surface-shadow-md` | `0 8px 32px`, `12%` text mix |
| `--surface-shadow-lg` | `0 16px 48px`, `16%` text mix |
| `--surface-shadow-side` | `8px 0 32px var(--color-shadow)` (drawer edge) |
| `--surface-inset` | no-op `inset 0 0 0 0 transparent` (composable in shadow lists; clay / skeuomorphic / metallic / glow replace it) |
| `--surface-backdrop` | `none` (full backdrop-filter value; glass sets `blur(12px) saturate(1.4)`) |
| `--surface-canvas` | `var(--color-bg)` (skin-preferred page backdrop — page chrome consumes it) |

**Rules for skin authors:**

- Never hardcode colors — derive everything from palette tokens via
  `color-mix()`, so any skin composes with any theme and both forced modes.
- Never set `--surface-border-control` to `none` — inputs must keep a
  visible boundary (validator-enforced, a11y).
- Set `--border-radius` to match `--surface-radius` — legacy small-element
  consumers (`code`, `kbd`, `sup`, skip-link, un-migrated controls) follow
  the skin's shape.
- Directional recipes (dual shadows, bevels, streaks) wrap their neutrals in
  `light-dark()` — dark mode inverts the light source (black shadows, dimmed
  highlights), it doesn't just recolor.
- May re-point font tokens (`--font-family`, `--font-family-heading`) for
  material-typical typography (brutalist → mono body + Impact headings,
  skeuomorphic → serif body + headings) — pairing guidance lives in the
  typography reference (§10).
- No `backdrop-filter` over animated surfaces (documented renderer crash —
  repo rule already applied in `site/glass.css`).
- **The site renders with tints, never backdrop-filter**: `head.php` pins
  `--surface-backdrop: none` site-wide and all page chrome drops the
  property (frosted looks use near-opaque `color-mix` tints). Skins keep
  shipping the token for consumers who accept the risk; `exsa.overrides`
  additionally forces `none` under `prefers-reduced-motion` for everyone.

## 5. The ten skins

`dist/skins/` — token-only files in `@layer exsa.skins`:

| Skin | Recipe |
|---|---|
| `flat.css` | solid `bg`, thin border, zero effects (no shadows) — the baseline |
| `glass.css` | translucent `bg` + `backdrop` blur/saturate + light border + soft ambient shadow |
| `neomorphic.css` | mid-tone grey canvas + matching surfaces (bg/text-secondary mix — the classic #e1e6ec on light themes), strong dual shadows, pressed inset pair for inputs/badges/chips, radius 20px |
| `clay.css` | inflated: dual inset pair (white top-left + dark bottom-right) baked into every elevation, large offset outer shadow, stronger soft gradient, radius 28px |
| `skeuomorphic.css` | bevel gradient `bg`, inset highlights, layered shadows, radius 8px, serif body + headings |
| `glossy.css` | wet finish: bright diagonal streak + bottom shading layered into `bg`, crisp top rim + dark inner bottom edge, soft shadows |
| `brutalist.css` | zero radius, 3px hard borders, hard offset shadows (3/5/7px), mono body + Impact-style headings |
| `metallic.css` | brushed-metal banding in `bg`, machined dual inset edges, subtle shadows, mono headings |
| `glow.css` | neon glow: link/secondary colored shadows + luminous border, mono headings — best on dark themes |
| `neon.css` | neon signage: darkened plates, glowing tube edges (inner + outer glow), mono headings — vs. glow's soft ambient halo |

### Effect cookbook

One row per effect — every CSS-expressible surface effect maps onto the eleven
tokens. The spacing scale stays on the density axis (`--space-factor` profiles),
but a skin MAY set `--space-factor` itself as a resting-density suggestion —
it applies only when `exsa.fluid.css` is not linked (fluid, layer 4, always
overrides skins, layer 3). Skin proposes, fluid disposes.

| Effect | Token | Example value |
|---|---|---|
| Elevation | `--surface-shadow-sm/md/lg` | `0 8px 32px color-mix(in srgb, var(--color-text) 12%, transparent)` |
| Side elevation | `--surface-shadow-side` | `8px 0 32px var(--color-shadow)` |
| Inner glow | `--surface-inset` | `inset 0 2px 6px color-mix(in srgb, #fff 55%, transparent)` |
| Inner shadow | `--surface-inset` | `inset 3px 3px 8px color-mix(in srgb, var(--color-text) 15%, transparent)` |
| Bevel | `--surface-inset` (dual insets) | `inset 0 1px 0 color-mix(in srgb, #fff 70%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--color-text) 10%, transparent)` |
| Specular highlight | `--surface-bg` (gradient layer) | `linear-gradient(115deg, color-mix(in srgb, #fff 35%, transparent), transparent 45%), var(--color-bg)` |
| Gloss / sheen | `--surface-bg` (top gradient layer) | same mechanism, wider streak |
| Hard shadow / outline | `--surface-shadow-md` + `--surface-border` | `4px 4px 0 var(--color-text)` + `2px solid var(--color-text)` (brutalist) |
| Metallic banding | `--surface-bg` (multi-stop gradient) + `--surface-inset` | metallic: light→dark→light banded gradient + dual inset edges |
| Neon glow | `--surface-shadow-md` + `--surface-border` | `0 0 14px color-mix(in srgb, var(--color-link) 40%, transparent)` + luminous border |
| Frosted / reflective | `--surface-backdrop` + `--surface-border` | `blur(12px) saturate(1.4)` + light border line |
| Shape | `--surface-radius` | `18px` (neo), `24px` (clay) |
| Density hint | `--space-factor` | clay `1.06`, brutalist `0.95` — resting density only; fluid/`data-profile` always wins |
| Outline | `--surface-border` | `1px solid …` or `none` |
| Control boundary | `--surface-border-control` | brutalist `3px solid var(--color-text)`; neo/clay subtle but visible; never `none` |
| Surface tint | `--surface-bg` / `--surface-bg-elevated` | `color-mix(in srgb, var(--color-bg) 55%, transparent)` |
| Page canvas | `--surface-canvas` | glass folds aurora + ambient blobs into the value; glow adds neon pools; clay a soft ambient tint; others stay `var(--color-bg)` |
| Legacy shape | `--border-radius` | same as the skin's `--surface-radius` (flat 5px, clay 28px, brutalist 0) — small-element consumers follow the material |

`site/glass.css` is deleted (2026-08-28) — its job splits cleanly: the glass
material lives in `skins/glass.css`, and the shared site chrome (aurora via
`--surface-canvas`, panels, topbar crash-safe rules, footer) moved into a
token-driven block in `site/includes/head.php`, which defaults
`$EXSA_SKIN = 'glass'`. Every site page now participates in the skin axis.

All ten skins shipped (2026-08-28; neon 2026-08-29).

**Skipped candidates (deliberate):** Neumorphism — already shipped as
`neomorphic.css`. Bento Grid — a layout pattern (grid + gap density), not a
material; its visual parts (radius + soft shadow) are what `clay.css` already
does, and spacing belongs to `--space-factor` profiles, not skins.

## 6. Distribution: bundle + overlay (no second bundle)

`exsa.bundle.css` stays **the one component bundle**. A skin is linked after it —
the same documented pattern themes already use ("link after the bundle; token
overrides win"):

```html
<link rel="stylesheet" href="dist/exsa.bundle.css">
<link rel="stylesheet" href="dist/skins/glass.css">   <!-- ~1 KB -->
```

Single-file lovers get their personalized bundle from the **Generator**
(`generator.php`): add "skin" to the picker; it already concatenates
core + components + theme + layout into one downloadable file. Nothing is
prebaked in `dist/`.

## 7. Component tokenization ("where needed")

The enabling work. Replace hardcoded **surface recipes** with `var(--surface-*)`:

- **In scope:** background, border, border-radius, box-shadow, inset shadow,
  backdrop-filter, surface gradients.
- **Out of scope:** structure (grid, sizing, positioning), animation, behavior —
  skins never touch those.

Migration in component batches, each gated by the token-audit:

1. Cards: `card.css`, `product-card.css`, `pricing-table.css`
2. Overlays: `modal`, `drawer`, `toast`, `dropdown`, `tooltip`, `popover`,
   `command-palette`
3. Chrome: `topbar`, `footer`, `table`, `tabs`, `badge`, `buttons`
4. Everything else, incl. tokenizing `.glass*` in `background.css`
   (kept as opt-in utilities, now skin-driven)

### Migration applied (2026-08-28)

| File | Migration |
|---|---|
| `card.css`, `product-card.css`, `pricing-table.css` | bg / border / radius / hover shadow → surface tokens |
| `modal.css` | dialog → `--surface-bg` / `--surface-radius` / `--surface-shadow-lg` |
| `drawer.css` | panel → `--surface-bg` / `--surface-shadow-side` |
| `dropdown.css`, `popover.css` (+arrow), `context-menu.css`, `tags-input.css` | menu panels → surface tokens + `--surface-shadow-md` |
| `toast.css` | surface tokens + `--surface-shadow-md` |
| `topbar.css` | bar → `--surface-bg-elevated` / `--surface-border`, scrolled elevation → `--surface-shadow-md`, transparent frost → skin-tinted `--surface-bg` (no backdrop-filter — crash rule); dropdown menu panel → surface tokens |
| `alert.css`, `buttons.css` | surface variants → `--surface-bg` |
| `consent-bar.css` | bar → surface tokens |
| `accordion.css`, `data-list.css`, `table.css`, `timeline.css`, `video-gallery.css` | container surfaces → surface tokens |
| `kanban.css` | hover / drag elevation → `-md` / `-lg` |
| `back-top.css` | floating shadow → `-lg` |
| `store.css`, `dashboard.css` | card shadow + drawer shadow → surface tokens; dark sidebar → local `--surface-bg` re-point |
| Second sweep (2026-08-28): `alert` (base + sm radius), `consent-bar` btn, `dropdown` trigger, `modal` btn, `slideshow` arrow, `avatar` fallback squircle, `donut` bars, `skeleton` lines, `lightbox` thumb, `checkbox` box, `tooltip` tip | radius → `--surface-radius`; control surfaces → `--surface-bg` + `--surface-border-control` |
| `select.css`, `date-picker.css`, `tags-input.css`, `password-input.css`, `input-group.css`, `table.css` (search) | form fields: bg + radius → surface tokens; **border stays functional** |
| `kpi.css` | card surface → surface tokens (bg/border/radius/shadow + icon radius + divider; accent edge + icon tint stay semantic) |
| `pagination.css` | links: bg + radius → surface tokens; border stays functional |
| `table.css` | wrap (bg/border/radius/elevation shadow) + responsive rows + `th` header bg → surface tokens |
| `progress.css` | track + fill radius → `--surface-radius` (fill colors stay semantic) |

**Input policy (a11y):** form fields consume `--surface-bg`,
`--surface-radius`, `--surface-inset`, and `--surface-border-control` so
skins re-tint and re-shape them — but their boundary always stays visible:
the validator rejects any skin that sets the control token to `none`
(neo/clay use a subtle 1px line, brutalist a 3px hard line).

**Deliberately left hardcoded:** form-control borders (see input policy
above), badge/chip/steps/tabs *colors* (semantic theme-colored — they now
consume `--surface-inset` for clay's pressed-in look, but the skin axis never
recolors semantics), tree rows, range-slider/radio/checkbox/toggle controls,
progress/data-viz fills (semantic colors — tracks follow the skin's radius),
focus/validation/inset-selection rings (semantic, theme-colored), micro
control shadows (knobs, thumbs, toggle, timeline dot), media overlays
(`lightbox`, `video-gallery` modal — fixed dark presentation), inverted
tooltips (`background: var(--color-text)`), `.glass*` utilities (explicit
glass recipes), and already-theme-driven `var(--box-shadow)` consumers.
Solid buttons follow skins via radius + `--surface-inset`; their raised
per-state shadows stay component-level (the shared elevation levels carry
legacy default values, so adopting them would drift).

## 8. Layouts, templates, and existing blind spots

- **Layouts** ✅ done 2026-08-28: `store.css` card shadow →
  `--surface-shadow-md`; `dashboard.css` drawer shadow →
  `--surface-shadow-side`; `.dash--sidebar-dark` → local `--surface-bg`
  re-point (the token-level local-mode pattern).
- **Templates** ✅ done 2026-08-28 (identity-preserving): `fullpage.css` /
  `onepage.css` now consume `--surface-radius` for their cards/images so a
  skin re-shapes them; their brand palettes (`--onepage-accent`,
  `--fullpage-pan-color`, white bands, brand elevation shadows) stay
  hardcoded — the templates are documented "starter skins", and skins
  still restyle every component/layout on a template page.
- **Today's partial-skin blind spots close automatically**: the ~8 components
  already using `var(--box-shadow)` plus every migrated component become
  skin-complete.

## 9. Build & tooling changes

| Tool | Change |
|---|---|
| `dist/exsa.css` ✅ | `--surface-*` group in `exsa.tokens`; add `exsa.skins` to the layer declaration; wire `h1–h6` to `--font-family-heading` |
| `manifest.json` ✅ | `surface` token entries + `skins` catalog |
| `tools/build-tokens.mjs` ✅ | export the new group → `tokens.json` (docs/Figma get it free) |
| `tools/validate.mjs` ✅ | skin contracts: wrapped in `@layer exsa.skins`, token-only (`:root` selectors), no `!important`, no `backdrop-filter` over animated surfaces; extend `--token-audit` to surface values |
| `tools/build-bundle.mjs` / `build-debug.mjs` ◐ | optional skin insertion after the theme (`--skin` done; debug: not needed — skins are token-only); default: no skin — backward compatible |
| `tools/add-layers.mjs` / `wrap-layers.mjs` ✅ | skin group in the layer manifests |
| `site/includes/head.php` ✅ | optional `$EXSA_SKIN` skin link (default: none) |
| `site/theme-builder.php` / `generator.php` ✅ | generator packages `skins/<name>.css` into the ZIP (stat + size accounted); theme-builder stays colors-only by design — the lab covers theme × skin previews |
| `site/skins.php` *(new)* ✅ | dedicated Theme × Skin lab page — live theme/skin/mode swap + computed-token readout; takes over the Theme Tester role |
| `site/showcase.php` ✅ | Theme Tester sidebar block (`#theme-select` / `#mode-select` + mode JS) deleted; intro copy points to the lab |

Rows marked ✅ are implemented (2026-08-28); the rest belong to Phases 3–4.

## 10. Typography reference (docs-only, link-based)

Fonts are **out of scope for distribution** — EXSA's duty ends at the token
interface: `--font-family` (body) and `--font-family-heading` (headings,
wired 2026-08-28) accept any face a developer links. The framework
ships no binaries and no license files; this reference is documentation.

A docs/site page curates the luxury shortlist — per family: niche, a tested
pairing (display + body), the Google Fonts `<link>`, and the token snippet:

| Family | Niche | Pairing |
|---|---|---|
| Playfair Display | editorial headline serif | + Jost |
| Cormorant Garamond | high-fashion display | + Tenor Sans |
| Bodoni Moda | Didone / fashion | + Jost |
| Cinzel | jewelry / engraved capitals | + Jost |
| Marcellus | heritage / Trajan-esque | + EB Garamond |
| EB Garamond | bookish / old-money body | + Marcellus |
| DM Serif Display | modern editorial | + Tenor Sans |
| Jost | geometric luxury sans | + any serif above |
| Tenor Sans | understated pairing sans | + any serif above |

**Page contents:** per pairing, a Google Fonts `<link>` plus the standard
two-font token snippet — the setup most websites use: one face for body, one
for headings:

```css
:root {
  --font-family: 'Jost', sans-serif;                 /* body     */
  --font-family-heading: 'Playfair Display', serif;  /* headings */
}
```

Honest caveats: strict CSPs must allow `fonts.googleapis.com` /
`fonts.gstatic.com`; self-host the woff2 files (OFL — include the license file)
for privacy, offline, or CSP-strict deployments. All nine are SIL OFL. Iconic
commercial faces (Didot, Bodoni, Futura…) stay out.

**Not shipped:** `dist/fonts/`, `fonts.css`, or `OFL.txt` binaries — deliberately,
to keep the core 32 KB and EXSA free of redistribution duties.

## 11. Docs & QA

- `docs/README.md`: cascade diagram (10 layers), skin table, generator docs.
- `docs/PHILOSOPHY.md` / `docs/CHANGELOG.md` entries.
- Gates: full `validate.mjs` run green; `qa/` fixtures and baseline probes render
  unchanged **without** a skin; WCAG AA contrast spot-checks (glass inherits the
  palette, so contrast holds).

## 12. Rollout

1. **Phase 1 — Foundation:** surface tokens + layer insertion +
   manifest/validator contracts + heading-font wiring — ✅ done 2026-08-28
   (surface group in `exsa.css` + `tokens.json`; `exsa.skins` layer; rule 18
   skin contracts; skin dirs in layer tools).
2. **Phase 2 — Skins & build:** ship the 9 skins; bundle/generator integration —
   ✅ skins done (flat, glass, neomorphic, clay, skeuomorphic, glossy,
   brutalist, metallic, glow) + bundle `--skin` option; generator picker remains
   (Phase 4).
3. **Phase 3 — Component migration:** batch-by-batch tokenization under the
   audit gate — ✅ done 2026-08-28: components (24 files, see §7 mapping),
   layouts, and templates migrated; controls/data-viz/semantic items
   deliberately kept theme-driven (§7).
4. **Phase 4 — Site, docs, QA:** ◐ in progress — ✅ `head.php` skin link,
   ✅ `site/skins.php` lab page (live theme × skin swap + token readout),
   ✅ Theme Tester deleted from `showcase.php`, ✅ typography reference in
   `docs/README.md`, ✅ README/PHILOSOPHY/CHANGELOG updated. Remaining:
   generator/theme-builder skin picker + showcase demos.

## 13. Backward compatibility

- No skin linked → identical pixels (defaults = today's values).
- Themes, bundles, and the 9→10 layer list remain valid for existing users.
- Runtime switching: two `<link>` swaps (theme + skin), same as today's one.

---

**Done when:** the nine skins render distinct materials across components,
layouts, and templates; custom skins are one ~25-line token file; the
typography reference curates luxury pairings without shipping binaries;
all gates green; docs reflect the new axis.

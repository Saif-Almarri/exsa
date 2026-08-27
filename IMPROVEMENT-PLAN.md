# EXSA — Cascade-Honesty Fixes (2026-08-26)

> Follow-up to the utilities-layer and density-factor review, extended with the
> classless-guard, token-discipline, and typography-size findings. All items verified
> in code (and in-browser where noted). Nothing blocks the current release.
> Priority: Finding 1 → Finding 3 → Finding 2 (decision) → Finding 4 → Finding 5.
>
> **Status (2026-08-26):** Findings 1–4 implemented; Finding 5 deferred per priorities.
>
> **Gates (no npm):** the published package intentionally ships no dev scripts
> (commit `983c5d2`). Run the local tools directly:
> `node tools/validate.mjs --layers --no-legacy --check-tokens --check-bundles --check-debug` ·
> `node tools/build-bundle.mjs && node tools/build-tokens.mjs && node tools/build-debug.mjs` ·
> `node tools/contract-probe.mjs`.

---

## Finding 1 — Typography utilities live in a layer that can't override

**Stated scope:** `docs/README.md` and `docs/PHILOSOPHY.md` describe `exsa.utilities`
as "Flex, grid, containers, breakpoints"; `docs/CHANGELOG.md` states "unprefixed
utilities stay structural (components win)".

**Reality:** `dist/exsa.css`'s `exsa.utilities` layer also ships a full typography
suite — `.text-xs…2xl`, `.fw-*`, `.font-*`, `.italic`, `.uppercase`, `.capitalize`,
`.text-muted`, `.fluid-type` — plus the `.text-start/end/center/left/right` alignment
set. None of these are documented anywhere.

**Failure mode:** `exsa.utilities` is layer 5; elements/components/layouts (6–8) win
regardless of specificity. Verified in-browser: `.text-lg` on a `.badge` leaves the
computed font-size unchanged (11.2px). The class applies silently and does nothing —
the same trap as `.text-center` on guarded `.exsa header/main/footer`.

**Recommendation:** move the typography utilities into `exsa.overrides` as `u-*`
classes (the documented always-overrides contract), or delete them. Grep `site/` for
usage first; no docs reference them, so doc churn is zero.

**Point-of-confusion comment:** add one line at the top of `exsa.utilities` and
`exsa.overrides` in `dist/exsa.css` — nobody reads `PHILOSOPHY.md` while debugging a
dead class:

```
/* layout only — unprefixed utilities lose to elements/components/layouts; use u-* (exsa.overrides) to force-win */
```

Touching core CSS requires rebuilding the bundle
(`node tools/build-bundle.mjs && node tools/build-tokens.mjs && node tools/build-debug.mjs`),
or the validate gate fails the stale-bundle check.

**Done when:** the utilities layer contains only layout/structure classes; any
remaining typography override exists as `u-*`; a live probe shows the class wins;
`node tools/validate.mjs --layers --no-legacy --check-tokens --check-bundles --check-debug`
is green.

**Status: ✅ done.** Typography suite moved to `exsa.overrides` as `u-*` (incl.
`.u-fluid-type` and new `.u-text-left/right`); `sm:text-center` removed; the
point-of-confusion comments added; bundle rebuilt; gates green.

---

## Finding 2 — "--radius-factor / --font-factor cascade through the entire design system" is overstated

**Claim:** `docs/PHILOSOPHY.md:103` groups all three factors as cascading system-wide;
`manifest.json` / `tokens.json` present them as profile knobs.

**Reality (grep of `dist/`):**

| Factor | Consumers | Verdict |
|---|---|---|
| `--space-factor` | ~215 usages across all 50 component files | claim holds |
| `--font-factor` | only `components/dashboard.css` (5) + `layouts/dashboard.css` (1); in `exsa.fluid.css` it scales the 7 `--font-size-*` tokens, which feed only the `.text-*` utilities and one `figcaption` rule | overstated |
| `--radius-factor` | exactly one: `exsa.fluid.css:71` | dead token outside the fluid file |

`data-profile` has no effect without `exsa.fluid.css` — fluid.css's own header says
so. Bonus buglet: `.dash--dense { --radius-factor: .85 }` in `layouts/dashboard.css`
sets the factor on `<body>`, but `--border-radius` resolves it at `:root` — a no-op.

**Status:** the verification step is complete — the table above is the grep result.
Only the decision remains: correct `PHILOSOPHY.md:103` now to state the truth
(`--space-factor` cascades everywhere; the other two drive the fluid tokens +
dashboard), then choose intentionally: wire the factors through components (the
`calc(N * var(--factor, 1))` convention already exists for spacing) or demote them
to fluid-only tokens.

**Done when:** every docs claim about factor reach matches grep results; manifest
notes match; either the factors are consumed by components or the docs say they
aren't.

**Decision (2026-08-26): narrow now, wire later.** `PHILOSOPHY.md:103` and the
manifest factor notes now state exactly what scales; wiring the factors through all
components remains an open option for a future release.

---

## Finding 3 — Guarded Classless™ has a guard asymmetry (root cause of the tree patches)

**Evidence:** commits `babebaf` ("tree: neutralize classless ul li padding") and
`018792b` ("tree: neutralize classless details margin") are reactive patches for the
same root cause. The elements layer guards are inconsistent — `dist/exsa.css:275–296`
(`:where(.exsa ol li)`, `:where(.exsa ul li)`, `:where(.exsa details)`,
`:where(.exsa details summary)`, `:where(.exsa details details)`) lack
`:not([class])`, unlike `p/small/mark/kbd/header/main/footer/nav/table`. So classed
component markup still matches classless rules: tree's bare `<li>` gets the 1.2em
indent and its classed `<details class="tree__node">` gets the details margin — each
neutralized per-component in `components/tree.css`: the `ul li` reset at lines 36–40
(`.tree, .tree li { … }`) and the details margin reset at lines 41–43
(`.tree .tree__node { margin: 0 }`).

**Correction to the original note:** the mechanism is *not* JS-injected markup —
JS output is already classed (`upload.js` sets `li.className='upload__item'`;
`context-menu.js` classes its backdrop). The collisions come from author-authored
markup + the unguarded selectors.

**Recommendation:** fix at the source — add container-level guards
(`:where(.exsa ul:not([class]) li)` etc.) so classed lists/details stop matching
classless rules (prose nested lists stay styled). Then sweep documented component
markup for remaining bare `li`/`details`; tree is the only offender found
(accordion/transfer/upload already classed).

**Done when:** guard audit complete; tree.css neutralizers removed or justified;
`node tools/contract-probe.mjs` + `node tools/validate.mjs --layers --no-legacy
--check-tokens --check-bundles --check-debug` green.

**Status: ✅ done.** Container guards added on the five selectors; `tree.css`
declares the summary weight and drops the dead margin neutralizer; live-verified
nested nodes lose the stray 2px border + 16px padding the unguarded `details details`
rule was adding.

---

## Finding 4 — Token discipline: hardcoded values duplicating tokens

- **Verified:** `dist/exsa.css:752` — `font-size: .88rem` in the classless button is
  an exact `--font-size-base` duplicate → `var(--font-size-base)`. Note the intended
  behavior change: with `exsa.fluid.css` loaded, the button then responds to the
  fluid clamp + `--font-factor`.
- **Table `.84rem`:** exists twice — classless table (`exsa.css:542`) and `.tbl`
  (`components/table.css:16`). It is *not* an exact token duplicate (scale is
  .7/.78/.88/…), so a mechanical swap would change rendering. Either add a
  `--font-size-table` token or leave it with a comment.
- Sweep remaining hardcoded rem font-sizes against the token scale; only swap where
  values match exactly.

**Done when:** `exsa.css:752` uses the token; the `.84rem` question is decided; no
silent value drift.

**Status: ✅ done.** Button now uses `var(--font-size-base)`; `.84rem` marked
"deliberate" in both files. The mass exact-match sweep stays deferred (cheap cleanup).

---

## Finding 5 (low priority) — `--font-size-xs` is nearly unused; don't bump it blind

**Reality:** `--font-size-xs` has exactly one consumer — the `.text-xs` utility.
Badges/timestamps hardcode `.7rem/.68rem/.66rem` and never read the token, so
bumping the token changes almost nothing. Real options: wire badge/timestamp sizes
to the token first, then decide whether .7rem is acceptable; or deprecate the token.

**Done when:** the token is consumed where its name implies, or removed from the
catalog.

**Status: deferred** — flag only; decide when badge/timestamp sizing is next touched.

---

**Priorities:** Finding 1 and Finding 3 first (the two most likely to bite a real
user next); Finding 2's decision is a credibility item; Findings 4 and 5 are cheap
cleanup for the next time those files are touched.

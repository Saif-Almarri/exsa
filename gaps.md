# EXSA Accessibility Audit — Gaps & Future Actions

> **Audit date:** 2026-07-13  
> **Tool:** axe-core 4.10 (automated)  
> **Standard:** WCAG 2.1 AA  
> **Pages tested:** `showcase.html`, `index.html`  
> **Overall score:** ~50% toward WCAG 2.1 AA (after quick-fix ARIA pass)

---

## Summary

| Page | Violations | Affected Elements |
|------|-----------|-------------------|
| showcase.html | 9 | 33 |
| index.html | 3 | 15 |
| **Total unique issues** | **9** | **48** |

---

## Violations by Severity

### 🔴 Critical (3 issues)

#### 1. `aria-allowed-attr` — Illegal ARIA attribute
- **Impact:** Critical
- **Affected:** 1 element (drawer trigger label)
- **Problem:** `aria-expanded` set on a `<label>` element which doesn't support it
- **Fix:** Move `aria-expanded` to the hidden checkbox input, or change `<label>` to `<button>`
- **Location:** Drawer trigger label on showcase

#### 2. `label` — Form inputs without labels
- **Impact:** Critical
- **Affected:** 9 elements
- **Problem:** Range slider, color picker input, date picker input, and other form controls have no accessible label
- **Fix:** Add `<label>` elements, `aria-label`, or `aria-labelledby` to:
  - `#rng1` (range slider)
  - Date picker input
  - Color picker input
  - Search input
  - Other unlabeled form controls

#### 3. `select-name` — Select elements without accessible name
- **Impact:** Critical
- **Affected:** 7 elements
- **Problem:** Theme selector, color mode selector, and other `<select>` elements lack labels
- **Fix:** Add `<label>` or `aria-label` to each select element

---

### 🟠 Serious (2 issues)

#### 4. `color-contrast` — Insufficient contrast ratio
- **Impact:** Serious
- **Affected:** 2 elements (showcase) + 4 elements (index)
- **Problem:** Text/background combos fail WCAG AA 4.5:1 minimum:
  - **Showcase:** Topbar "Join Us" button: white on `#60a5fa` → 2.54:1 (needs ≥4.5:1)
  - **Showcase:** Additional low-contrast element TBD
  - **Index:** 4 elements with insufficient contrast (likely CTA section, muted text)
- **Fix:** 
  - Audit all 13 themes for button text contrast
  - Use darker button text or lighter backgrounds
  - Verify `--color-text-secondary` meets 4.5:1 in every theme

---

### 🟡 Moderate (4 issues)

#### 5. `heading-order` — Skipped heading levels
- **Impact:** Moderate
- **Affected:** 2 elements
- **Problem:** Headings jump from `<h2>` to `<h4>` (skipping `<h3>`) in timeline component
- **Fix:** Change `<h4>` to `<h3>` in timeline items, or restructure heading hierarchy

#### 6. `landmark-unique` — Non-unique landmarks
- **Impact:** Moderate
- **Affected:** 2 `<nav>` elements
- **Problem:** Multiple `<nav>` elements without unique labels — screen readers can't distinguish them
- **Fix:** Add `aria-label` to each `<nav>` (e.g., `aria-label="Sidebar navigation"`, `aria-label="Topbar navigation"`)

#### 7. `page-has-heading-one` — Missing `<h1>`
- **Impact:** Moderate
- **Affected:** 1 page (showcase)
- **Problem:** Showcase page has no `<h1>` — screen reader users can't identify the page purpose
- **Fix:** Add `<h1 class="sr-only">EXSA Component Library</h1>` or convert the logo to `<h1>`

#### 8. `region` — Content outside landmarks
- **Impact:** Moderate
- **Affected:** 6 elements (showcase) + 10 elements (index)
- **Problem:** Content not wrapped in `<main>`, `<nav>`, `<aside>`, or `role="region"` landmarks
- **Fix:** Wrap orphaned content sections in appropriate landmark elements

---

### 🔵 Minor (1 issue)

#### 9. `aria-allowed-role` — Inappropriate role
- **Impact:** Minor
- **Affected:** 3 elements (accordion labels)
- **Problem:** `role="button"` on `<label>` elements — `<label>` already has implicit semantics
- **Fix:** Either remove `role="button"` (label is already clickable) or switch to `<button>` element

---

## Not Detected by axe (Manual Testing Required)

axe-core can only catch ~30% of WCAG criteria. These require manual testing:

| Criterion | What to test |
|-----------|-------------|
| **2.1.1 Keyboard** | Can every interactive element be reached and operated via Tab/Enter/Space? Dropdown items, rating stars, resizer handle |
| **2.4.3 Focus order** | Does Tab follow a logical sequence? Does modal trap focus? |
| **2.5.5 Target size** | Are touch targets ≥44×44px? Icon buttons, close buttons, pagination |
| **3.2.2 On input** | Do checkbox-hack components (accordion, drawer, toggle) announce state changes? |
| **3.3.2 Labels** | Are form inputs properly labeled with visible text (not just placeholder)? |
| **4.1.3 Status messages** | Are toast notifications, loading states announced to screen readers? |
| **Screen reader testing** | Test with NVDA (Windows), VoiceOver (Mac), JAWS — do components make sense? |
| **Touch + mobile** | Test all interactive elements on touch devices |
| **Zoom 200%** | Does content reflow without horizontal scroll? |
| **All 13 themes** | Run contrast audit on every theme variant |

---

## Action Plan

### Phase 1: Quick CSS fixes (~2 hours)
- [x] Add `aria-label` to all `<select>` and unlabeled `<input>` elements
- [x] Add `aria-label` to duplicate `<nav>` landmarks
- [x] Add `<h1>` to showcase page (visually hidden)
- [x] Fix heading hierarchy (h4→h3) in timeline
- [x] Remove `role="button"` from accordion `<label>`
- [x] Add `<main>` landmark + update skip-link on index.html
- [x] Add `.sr-only` utility class to style.css

### Phase 2: Contrast audit (~3 hours)
- [x] Run axe on each of the 13 themes
- [x] Fix all contrast violations in each theme
- [x] Add `--color-button-text` to all 13 themes (was missing in 10)
- [x] Darken link colors in 7 light themes (clinic, coral, console, ledger, prism, steel, volt)
- [x] Fix text-secondary contrast in 4 themes (console dark, night dark, sepia light, volt light)

### Phase 3: Manual testing (~5 hours)
- [ ] Keyboard-only pass through every component
- [ ] Screen reader pass (NVDA) through 10 key components
- [ ] Touch target size audit
- [ ] Focus trap testing (modal, drawer, lightbox)

### Phase 4: Deep fixes (~4 hours)
- [x] Add focus traps to modal, drawer, lightbox, video gallery
- [x] Add focus restoration on close (modal, drawer, lightbox)
- [x] Auto-focus first element on open (close button or first focusable)
- [x] Add `aria-busy` to loading buttons during loading state
- [x] Add reusable `EXSA.trapFocus()` and `EXSA.getFocusable()` utilities
- [x] Toast container already has `aria-live="polite" role="status"`

---

*Generated by axe-core 4.10 on EXSA v1.0. These are automated findings only — manual testing required for full WCAG 2.1 AA compliance.*

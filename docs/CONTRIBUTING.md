# Join EXSA as a Co-Founder

EXSA has three contributor slots, each targeting a co-founder role. These are invite-only — not open applications, not a job board. The founder invites someone into a slot, they know their targets from day one, and they work toward earning co-founder status.

There's no revenue yet. No salary. No guarantees. What there is: a genuinely novel CSS framework, a clear audience (PHP developers who hate build steps), and the chance to be there from day one.

---

## The Deal

| What You Put In | What You Get |
|-----------------|--------------|
| Real work over 12 months | Co-founder equity based on tasks, milestones, and impact |
| Your expertise and time | Your name on the project — permanently |
| Commitment to the vision | A seat at the table when decisions are made |

**Equity split**

| Role | Equity |
|---|---|
| Founder (Saif Almarri) | 28% — inventor, core architecture, IP |
| Technical | 24% — vests on effort against role targets |
| Growth | 24% — vests on effort against role targets |
| Brand & Community | 24% — vests on effort against role targets |

**How vesting works.** Everyone starts as a contributor — only three contributor slots exist, one per role. Each role has defined targets listed above — that's what "done" looks like. The 12-month window is a maximum, not a minimum. If you deliver against your targets and the effort is visible, vesting can happen in as little as a month. There's no waiting period — just results. Once equity vests, you become a co-founder. Equity, title, all permanent.

This is equity, not compensation. Ownership, not employment. We're building a company — together.

---

## Why Join EXSA

Most CSS frameworks are iterations of the same idea. EXSA isn't.

**A genuine technical edge.** Guarded Classless™ — semantic HTML styled automatically via `:where()`, then the framework steps aside on `:not([class])`. A nine-layer `@layer` cascade. 82 tokens driving 53 components. 110 icons. 20 themes. Zero build step. No other framework combines all of this. The CSS features that make it possible — `@layer`, `:where()`, `:not([class])` — only became baseline in 2022. EXSA is the first framework designed for them, not retrofitted.

**A clear, underserved audience.** PHP developers who write `.php` files directly — no Twig, no Blade, no `vite.config.js`. Millions of them. Every existing framework tells them to install Node, learn a templating language, or memorize utility classes. EXSA tells them: two `<link>` tags and you're building.

**No competition on the same axis.** Tailwind is utilities. Bootstrap is components. Pico is classless. EXSA is the only one doing all three — with a guard that defers to the developer. It occupies a category of one.

**Open source, open equity.** Everything is public. The code, the roadmap, the equity terms. Contributors know exactly what they're building toward. No hidden cap table, no surprise dilution.

**Timing.** CSS is having a renaissance — `@layer`, container queries, `:has()`, View Transitions, scroll-driven animations. Developers are rethinking their tooling. EXSA is positioned for that conversation. Being early in a new category is rare. **EXSA isn't just riding the wave — it's shaping how CSS frameworks will be built for the next decade.**

---

## The Three Co-Founder Roles

### 🧩 Technical Co-Founder (Components & Engineering)

You'll own the product:

- Build and maintain the 53-component library
- Improve the Generator, manifest, and tooling
- Review and merge community contributions
- Make architectural decisions about the framework
- Keep EXSA small, fast, and token-driven

**You should be:** A CSS developer who understands design systems at the spec level. You know why `:where()` matters. You've built components before. You care about file size and cascade order.

### 📣 Growth Co-Founder (Marketing)

You'll own the reach. No coding required — your job is visibility, not pull requests.

- Run ads, sponsorships, and paid campaigns
- Create video content: demos, tutorials, launch videos
- Manage social media and public presence
- Build partnerships with platforms, tools, and distribution channels
- Run the EXSA website and showcase (content, not code)

**You should be:** A marketer who understands developers. You know how to get a framework in front of the right people — through ads, video, and distribution. You don't need to write CSS. You need to make sure the people who do, know about EXSA.

### 📢 Brand & Community Co-Founder

You'll own the relationships. Your job is trust, not code.

- Represent EXSA at conferences, podcasts, and meetups
- Write technical articles, case studies, and thought leadership
- Represent EXSA publicly — your reputation becomes the framework's reputation
- Nurture the community: contributors, early adopters, advocates
- Shape the narrative: why EXSA exists, who it's for, why it matters

**You should be:** A well-known figure in the CSS community. People already read your blog, watch your talks, or follow your work. You understand `@layer`, design tokens, and RTL at a deep level. You don't need to ship code — you need to make the industry pay attention.

---

## How It Works

There are only three contributor slots — one per role. No open calls, no public applications.

1. **The founder invites you** into a contributor slot based on your reputation, work, or connection to EXSA's mission. You'll know exactly which co-founder role you're targeting and what the targets are.
2. **You ship against those targets.** No interviews. No formalities. Your work is your path to co-founder.
3. **Vesting happens when the effort meets the targets.** As fast as a month, or up to 12 months. Once vested — co-founder. Equity, title, permanent.

---

## Contribution Guidelines

### For Components — the component-author checklist

Every EXSA component ships a small contract, and `npm test` enforces it:

1. **One CSS file** in `dist/components/` named after the block (`card.css` → `.card`).
   Documented block-name abbreviations (legacy shorthand): `tbl`, `sep`, `pricing`,
   `range`, `ctx-menu`, `ex-cp`, `progress-item`, `media-*`, `dash-*`, `vt-*`, `bg-*`, `ic-*`.
2. **Block-form layer wrapper** — first line `@layer exsa.components {`, last line `}`.
   Mixing blockless `@layer` statements across files silently inverts the cascade in
   Chromium (see CHANGELOG) — the validator rejects anything else.
3. **BEM naming** — `.block__element--modifier`. No bare element selectors, no
   cross-block styling, no `!important` (build fails on any of these).
4. **Declare the markup contract** — if the component has a required skeleton,
   add a `structure` field to its manifest entry:
   `{ "root": ".block", "required": [".block__part"], "optional": ["…"] }`.
   The validator cross-checks it against your CSS (every `__` part must be listed,
   every listed part must exist), `tools/build-debug.mjs` turns `required` into
   `dist/exsa.debug.css` contract-linter rules (enable with `<html data-debug>`),
   and `npm run probe:contract` renders reference snippets + deliberately broken
   markup in a real browser. Never let percent-sized children collapse silently.
4. **Token-driven** — `var(--token)` for every color, spacing, and shadow. New public
   tokens get a `manifest.json → tokens.core` entry; component-scoped tokens get a
   `manifest.json → tokens.components` entry. Never hardcode values.
5. **Behavioral JS (optional)** — one file in `dist/js/` named after the component,
   wrapped in a DOM-ready guard (copy the pattern from any existing file), registered
   under `manifest.json → behaviors` with `requires` edges if it uses `EXSA.*`.
6. **State classes stay on `<body>`** — `has-*` and `layout--*` are page-level state
   only; components never read them.
7. **Run the gate** — `npm test` (manifest refs, layers, tokens, bundles, structure,
   debug css) and `npm run audit` (zero actionable spacing literals). If you touched
   tokens, JS, or structure, regenerate: `npm run build`. Add a demo section to
   `site/showcase.php` so every component is visibly dogfooded.

#### Add a component in six steps

1. Copy a small component as a template (`dist/components/spinner.css`), rename to your
   block, keep the `@layer exsa.components { … }` wrapper and the header comment.
2. Write the BEM classes referencing existing tokens only.
3. Add a `manifest.json → components` entry (id, name, category, css, js?, icons?)
   and a `structure` contract when the component has a required skeleton.
4. If it introduces tokens, catalog them (`manifest.json → tokens`) and run
   `node tools/build-tokens.mjs`.
5. Add a demo section to `site/showcase.php` plus a sidebar link.
6. `npm test` green → open a PR.

### For Content & Marketing

- Write compelling copy — clear, practical, no jargon
- Produce video demos, tutorials, and ad creative
- Target: the PHP developer who writes `.php` files and wants zero build steps
- Publish on [exsa.dev](https://exsa.dev), YouTube, and where developers are

---

## Communication

- **Tasks & progress:** [GitHub Issues](https://github.com/Saif-Almarri/exsa/issues)
- **Ideas & strategy:** [GitHub Discussions](https://github.com/Saif-Almarri/exsa/discussions)
- **Interested in a co-founder role or contributor?** Email [safe@windowslive.com](mailto:safe@windowslive.com)

---

*EXSA has no investors, no runway, and no revenue — yet. What it has is a genuinely new approach to CSS, a clear audience, and room for three people who want to build something that matters. If that's you, let's talk.*

<?php
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; frame-src https:; connect-src 'self'; media-src 'self' https:">
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
  <title>EXSA — Universal CSS. Zero Friction.</title>
  <meta name="description" content="EXSA is a 5-layer CSS framework with Guarded Classless™. 50 components, 20 themes, 61 tokens. Zero build step. Universal. Just PHP and CSS.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://exsa.dev/">
  <meta property="og:title" content="EXSA — Universal CSS. Zero Friction.">
  <meta property="og:description" content="EXSA is a 5-layer CSS framework with Guarded Classless™. 50 components, 20 themes, 61 tokens. Zero build step. Universal. Just PHP and CSS.">
  <meta property="og:image" content="https://exsa.dev/logo.svg">
  <meta property="og:url" content="https://exsa.dev/">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="EXSA — Universal CSS. Zero Friction.">
  <meta name="twitter:description" content="EXSA is a 5-layer CSS framework with Guarded Classless™. 50 components, 20 themes, 61 tokens. Zero build step. Universal. Just PHP and CSS.">
  <meta name="twitter:image" content="https://exsa.dev/logo.svg">
  <link rel="icon" type="image/svg+xml" href="logo.svg">
  <link rel="stylesheet" href="style.css?v=24">
  <link id="theme-stylesheet" rel="stylesheet" href="themes/breeze.css?v=3">
  <?php include 'includes/head.php'; ?>
  <link rel="stylesheet" href="components/buttons.css?v=2">
  <link rel="stylesheet" href="components/badge.css">
  <link rel="stylesheet" href="components/separator.css">
  <link rel="stylesheet" href="components/card.css">
  <link rel="stylesheet" href="components/dropdown.css?v=2">
  <link rel="stylesheet" href="components/avatar.css">
  <link rel="stylesheet" href="components/footer.css">
  <style>
    .ic{display:inline-block;width:16px;height:16px;vertical-align:middle;flex-shrink:0;background-color:currentColor;-webkit-mask-size:contain;-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;mask-size:contain;mask-position:center;mask-repeat:no-repeat}
    .ic-chevdown{-webkit-mask-image:url('components/icons/chevron-down.svg');mask-image:url('components/icons/chevron-down.svg')}
    .ic-menu{-webkit-mask-image:url('components/icons/menu.svg');mask-image:url('components/icons/menu.svg')}
    .ic-lock{-webkit-mask-image:url('components/icons/lock.svg');mask-image:url('components/icons/lock.svg')}
    .ic-check{-webkit-mask-image:url('components/icons/check.svg');mask-image:url('components/icons/check.svg')}
    .ic-settings{-webkit-mask-image:url('components/icons/settings.svg');mask-image:url('components/icons/settings.svg')}
    .ic-eye{-webkit-mask-image:url('components/icons/eye.svg');mask-image:url('components/icons/eye.svg')}
    .ic-archive{-webkit-mask-image:url('components/icons/archive.svg');mask-image:url('components/icons/archive.svg')}
    .ic-send{-webkit-mask-image:url('components/icons/send.svg');mask-image:url('components/icons/send.svg')}

    /* -- Page Layout -- */
    .pg{max-width:1080px;margin:0 auto;padding:60px 20px 80px}

    /* -- Hero -- */
    .hero{text-align:center;padding:0px 0 60px}
    .hero__logo{display:block;margin:0 auto 24px}
    .hero__eyebrow{font-size:.75rem;font-weight:600;padding:5px 16px;border-radius:99px;background:color-mix(in srgb,var(--color-link)10%,transparent);color:var(--color-link);display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;letter-spacing:.01em;border:1px solid color-mix(in srgb,var(--color-link)20%,transparent)}
    .hero__eyebrow::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--color-success);animation:hero-pulse 2s ease-in-out infinite}
    @keyframes hero-pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 color-mix(in srgb,var(--color-success)40%,transparent)}50%{opacity:.6;box-shadow:0 0 0 6px color-mix(in srgb,var(--color-success)0%,transparent)}}
    @media(prefers-reduced-motion:reduce){.hero__eyebrow::before{animation:none}}
    .hero h1{font-size:clamp(2.2rem,5vw,3.4rem);font-weight:800;line-height:1.12;margin:0 0 20px;text-wrap:balance}
    .hero h1 span{background:linear-gradient(135deg,var(--color-link),var(--color-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hero__sub{font-size:1.08rem;color:var(--color-text-secondary);max-width:820px;margin:0 auto 32px;line-height:1.65}
    .hero__actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}

    /* -- Stats Bar -- */
    .stats-bar{display:flex;justify-content:center;gap:64px;flex-wrap:wrap;padding:36px 0;border-top:1px solid var(--color-bg-secondary);border-bottom:1px solid var(--color-bg-secondary);margin:20px 0 60px}
    .stat{text-align:center}
    .stat__num{font-size:3rem;font-weight:800;line-height:1;background:linear-gradient(135deg,var(--color-link),var(--color-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .stat__label{font-size:.78rem;color:var(--color-text-secondary);margin-top:4px}
    .stats-note{text-align:center;font-size:.74rem;color:var(--color-text-secondary);margin-top:-40px;margin-bottom:40px}

    /* -- Sections -- */
    .sec{padding:48px 0}
    .sec--alt{background:var(--color-bg-secondary);margin:0 -20px;padding:48px 20px}
    .sec__label{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--color-link);font-weight:700;margin-bottom:8px}
    .sec h2{font-size:1.8rem;font-weight:700;margin:0 0 8px}
    .sec__sub{color:var(--color-text-secondary);font-size:.95rem;max-width:auto;line-height:1.6;margin:0 0 32px}

    /* -- Architecture Diagram -- */
    .arch{max-width:700px;margin:0 auto;position:relative}
    .arch::before{content:'';position:absolute;inset-inline-start:35px;top:44px;bottom:44px;width:2px;background:var(--color-bg-secondary);z-index:0}
    .arch__layer{display:flex;align-items:center;gap:16px;padding:18px 20px;border-radius:var(--border-radius);position:relative;margin-bottom:6px;background:var(--color-bg);border:1px solid var(--color-bg-secondary);transition:transform .15s,box-shadow .15s}
    .arch__layer:hover{transform:translateX(4px);box-shadow:var(--box-shadow) var(--color-shadow)}
    /* Unlayered — green accent */
    .arch__layer--unlayered{border-inline-start:3px solid var(--color-success);background:color-mix(in srgb,var(--color-success)6%,var(--color-bg))}
    .arch__layer--unlayered .arch__num{background:var(--color-success);box-shadow:0 2px 12px color-mix(in srgb,var(--color-success)40%,transparent)}
    /* Layer 5 — Components: rose */
    .arch__layer--l5{border-inline-start:3px solid #ec4899;background:color-mix(in srgb,#ec4899 5%,var(--color-bg))}
    .arch__layer--l5 .arch__num{background:#ec4899;box-shadow:0 2px 12px rgba(236,72,153,.35)}
    /* Layer 4 — Elements: amber */
    .arch__layer--l4{border-inline-start:3px solid #f59e0b;background:color-mix(in srgb,#f59e0b 5%,var(--color-bg))}
    .arch__layer--l4 .arch__num{background:#f59e0b;box-shadow:0 2px 12px rgba(245,158,11,.35)}
    /* Layer 3 — Layout: violet */
    .arch__layer--l3{border-inline-start:3px solid #8b5cf6;background:color-mix(in srgb,#8b5cf6 5%,var(--color-bg))}
    .arch__layer--l3 .arch__num{background:#8b5cf6;box-shadow:0 2px 12px rgba(139,92,246,.35)}
    /* Layer 2 — Reset: emerald */
    .arch__layer--l2{border-inline-start:3px solid #10b981;background:color-mix(in srgb,#10b981 5%,var(--color-bg))}
    .arch__layer--l2 .arch__num{background:#10b981;box-shadow:0 2px 12px rgba(16,185,129,.35)}
    /* Layer 1 — Tokens: blue */
    .arch__layer--l1{border-inline-start:3px solid #3b82f6;background:color-mix(in srgb,#3b82f6 5%,var(--color-bg))}
    .arch__layer--l1 .arch__num{background:#3b82f6;box-shadow:0 2px 12px rgba(59,130,246,.35)}
    .arch__num{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0;color:#fff;position:relative;z-index:1}
    .arch__info h4{margin:0 0 2px;font-size:.92rem}
    .arch__info p{margin:0;font-size:.78rem;color:var(--color-text-secondary);line-height:1.5}
    .arch__info code{font-size:.7rem;background:var(--color-bg-secondary);padding:1px 6px;border-radius:3px;display:inline-block;margin-top:4px}

    /* -- Comparison Grid -- */
    .cmp{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
    .cmp__card{background:var(--color-bg);border:1px solid var(--color-bg-secondary);border-radius:var(--border-radius);padding:24px}
    .cmp__card h4{font-size:1rem;margin:0 0 6px}
    .cmp__card p{font-size:.82rem;color:var(--color-text-secondary);line-height:1.5;margin:0}

    /* -- Code Block -- */
    .code-blk{background:var(--color-bg);border:1px solid var(--color-bg-secondary);border-radius:var(--border-radius);overflow:hidden;margin:20px 0}
    .code-blk__bar{display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--color-bg-secondary);border-bottom:1px solid var(--color-bg-secondary)}
    .code-blk__dot{width:8px;height:8px;border-radius:50%;background:var(--color-bg-secondary)}
    .code-blk__dot:first-child{background:#ef4444}
    .code-blk__dot:nth-child(2){background:#f59e0b}
    .code-blk__dot:nth-child(3){background:#22c55e}
    .code-blk__title{font-size:.72rem;color:var(--color-text-secondary);margin-left:auto;font-family:monospace}
    .code-blk pre{margin:0;padding:16px 20px;font-size:.78rem;line-height:1.7;color:var(--color-text-secondary);overflow-x:auto}
    .code-blk .tag{color:var(--color-link)}.code-blk .attr{color:var(--color-secondary)}.code-blk .val{color:#16a34a}.code-blk .cmt{color:var(--color-text-secondary);opacity:.5;font-style:italic}

    /* -- Why Grid -- */
    .why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
    .why-item{text-align:center;padding:28px 20px;background:var(--color-bg);border:1px solid var(--color-bg-secondary);border-radius:var(--border-radius)}
    .why-item__icon{width:48px;height:48px;border-radius:var(--border-radius);display:flex;align-items:center;justify-content:center;flex-shrink:0;background:color-mix(in srgb,var(--color-link)10%,transparent);margin:0 auto 14px}
    .why-item__icon .ic{width:22px;height:22px}
    .why-item h4{font-size:.92rem;margin:0 0 6px}
    .why-item p{font-size:.8rem;color:var(--color-text-secondary);line-height:1.5;margin:0}

    /* -- CTA -- */
    .cta{text-align:center;background:linear-gradient(135deg,color-mix(in srgb,var(--color-link)8%,var(--color-bg)),color-mix(in srgb,var(--color-secondary)5%,var(--color-bg)));border:1px solid var(--color-bg-secondary);border-radius:calc(var(--border-radius)*1.5);padding:48px 32px}
    .cta h2{font-size:2rem;margin:0 0 12px}
    .cta p{color:var(--color-text-secondary);max-width:500px;margin:0 auto 24px;line-height:1.6;font-size:.95rem}

    /* -- Benchmark Card -- */
    .bench{display:flex;align-items:center;gap:40px;flex-wrap:wrap;background:var(--color-bg);border:1px solid var(--color-bg-secondary);border-radius:var(--border-radius);padding:40px;margin-bottom:40px}
    .bench__big{flex-shrink:0;text-align:center}
    .bench__pct{font-size:5rem;font-weight:900;line-height:1;background:linear-gradient(135deg,var(--color-link),var(--color-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .bench__pct-label{font-size:.85rem;font-weight:700;color:var(--color-link);text-transform:uppercase;letter-spacing:.06em;margin-top:4px}
    .bench__body{flex:1;min-width:280px}
    .bench__body h3{font-size:1.3rem;margin:0 0 8px}
    .bench__body p{font-size:.88rem;color:var(--color-text-secondary);line-height:1.6;margin:0 0 16px}
    .bench__metrics{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;font-size:.8rem}
    .bench__metrics dt{color:var(--color-text-secondary)}
    .bench__metrics dd{font-weight:700;margin:0 0 6px}
    @media(max-width:600px){.bench{flex-direction:column;text-align:center;padding:28px 20px}.bench__metrics{grid-template-columns:1fr}}

    /* -- Footer -- */
    .pg-footer{display:flex;justify-content:space-between;padding-top:20px;margin-top:40px;border-top:1px solid var(--color-bg-secondary);font-size:.75rem;color:var(--color-text-secondary);flex-wrap:wrap;gap:12px}

    @media(max-width:768px){
      .stats-bar{gap:24px}
      .hero{padding:20px 0 40px}
      .arch::before{display:none}
    }
  </style>
</head>
<body class="exsa has-topbar">

<?php include 'intro-splash.php'; ?>

<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- --------------- TOPBAR --------------- -->
<?php $activePage = 'index.php'; $topbarClass = 'topbar--xl topbar--transparent'; include 'includes/topbar.php'; ?>

<!-- --------------- MAIN --------------- -->
<main class="pg" id="main-content">

  <!-- -- Hero -- -->
  <section class="hero">
    <img src="logo.svg" alt="EXSA" width="120" class="hero__logo" style="border-radius:16px;">
    <div class="hero__eyebrow">v1.0.0-beta.2 — Now Available</div>
    <h1>A framework where <span>tokens</span> do the work, <span>not tools</span></h1>
    <p class="hero__sub">EXSA is built on three original ideas: a <strong>5-layer cascade architecture</strong> where your CSS always wins, <strong>Guarded Classless&trade;</strong> semantic styling that steps aside when you add a class, and a <strong>Fluid Scale + Density Profiles</strong> system where one HTML attribute changes every component's density. Two <code>&lt;link&gt;</code> tags or one <code>npm install</code>. Universal CSS. Zero friction.</p>
    <div class="hero__actions">
      <a href="#quickstart" class="btn btn--outline btn--lg">Quick Start</a>
      <a href="showcase.php" class="btn btn--outline btn--lg">Browse Components</a>
      <a href="#architecture" class="btn btn--outline btn--lg">See How It Works</a>
    </div>
  </section>

  <!-- -- Stats -- -->
  <div class="stats-bar">
    <div class="stat"><div class="stat__num">26<span style="font-size:1rem;">KB</span></div><div class="stat__label">Core Size</div></div>
    <div class="stat"><div class="stat__num">50</div><div class="stat__label">Components</div></div>
    <div class="stat"><div class="stat__num">20</div><div class="stat__label">Themes</div></div>
    <div class="stat"><div class="stat__num">110</div><div class="stat__label">Icons</div></div>
    <div class="stat"><div class="stat__num">0</div><div class="stat__label">Build Steps</div></div>
  </div>

  <!-- --- What Makes It Different --- -->
  <section class="sec sec--alt" id="why">
    <div class="sec__label">The Difference</div>
    <h2>Three inventions. Plus smart design choices.</h2>
    <p class="sec__sub">The first three are original to EXSA. The rest are principles we won't compromise on.</p>

    <div class="why-grid">
      <div class="why-item">
        <div class="why-item__icon" style="background:color-mix(in srgb,var(--color-link)10%,transparent);"><span class="ic ic-lock"></span></div>
        <div>
          <h4>Guarded Classless&trade;</h4>
          <p>Add <code>body class="exsa"</code> to get automatic styling for <code>&lt;nav&gt;</code>, <code>&lt;table&gt;</code>, <code>&lt;form&gt;</code>, <code>&lt;button&gt;</code>, <code>&lt;blockquote&gt;</code>, <code>&lt;dialog&gt;</code>, and more. Add any class to any of those elements — and EXSA steps aside. Zero specificity. No <code>!important</code>. You're in control.</p>
        </div>
      </div>
      <div class="why-item">
        <div class="why-item__icon" style="background:color-mix(in srgb,var(--color-secondary)10%,transparent);"><span class="ic ic-check"></span></div>
        <div>
          <h4>5-Layer Cascade Architecture</h4>
          <p>CSS <code>@layer</code> enforces priority: tokens → reset → layout → elements → components. Your CSS and themes sit <em>outside</em> all layers — unlayered styles always win. Specificity becomes irrelevant.</p>
        </div>
      </div>
      <div class="why-item">
        <div class="why-item__icon" style="background:color-mix(in srgb,var(--color-success)10%,transparent);"><span class="ic ic-layers"></span></div>
        <div>
          <h4>Fluid Scale + Density Profiles</h4>
          <p>Spacing, typography, and shape scale smoothly with viewport width — no breakpoints needed. Add <code>data-profile="compact"</code> or <code>data-profile="spacious"</code> to <code>&lt;html&gt;</code> and every component shifts density. One attribute. One optional file.</p>
        </div>
      </div>

      <!-- divider -->
      <div style="grid-column:1/-1;text-align:center;padding:12px 0 8px;">
        <span style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--color-text-secondary);">And by design</span>
      </div>

      <div class="why-item">
        <div class="why-item__icon" style="background:color-mix(in srgb,var(--color-warning)10%,transparent);"><span class="ic ic-settings"></span></div>
        <div>
          <h4>Runtime Theming via Tokens</h4>
          <p>All 50 components share 61 CSS custom properties. Swap one theme file — every component, every color, every shadow updates instantly. No recompile. No rebuild.</p>
        </div>
      </div>
      <div class="why-item">
        <div class="why-item__icon" style="background:color-mix(in srgb,var(--color-warning)10%,transparent);"><span class="ic ic-eye"></span></div>
        <div>
          <h4>A11y Baked Into the Reset</h4>
          <p><code>forced-colors: active</code> for Windows High Contrast Mode. <code>prefers-reduced-motion</code> disables all animations. <code>prefers-contrast</code> adjusts borders. Skip links. Focus rings. Not an afterthought — layer 2.</p>
        </div>
      </div>
      <div class="why-item">
        <div class="why-item__icon" style="background:color-mix(in srgb,var(--color-danger)10%,transparent);"><span class="ic ic-archive"></span></div>
        <div>
          <h4>Tree-Shakeable by Design</h4>
          <p>Every component is its own CSS file. During development, link what you need. For production, the Generator bundles only your selected components into one file. No dead styles.</p>
        </div>
      </div>
      <div class="why-item">
        <div class="why-item__icon" style="background:color-mix(in srgb,var(--color-link)10%,transparent);"><span class="ic ic-send"></span></div>
        <div>
          <h4>Zero Build Step. Forever.</h4>
          <p>No <code>npm install</code>. No bundler. No config file. No Twig. No Blade. Just <code>&lt;link&gt;</code> tags and you're building. Works with any PHP framework — Laravel, Symfony, CodeIgniter, CakePHP, Slim — or plain <code>.php</code> files with no framework at all. Compatible with any ecosystem.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- -- Code Comparison -- -->
  <section class="sec">
    <div class="sec__label">Side by Side</div>
    <h2>The same card. Two very different philosophies.</h2>
    <p class="sec__sub">EXSA uses <strong>semantic component classes</strong> — you name what it <em>is</em>. Tailwind uses <strong>atomic utilities</strong> — you describe what it <em>looks like</em>. Change one token in EXSA, every card recolors. In Tailwind, you edit every class.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="code-blk">
        <div class="code-blk__bar">
          <div class="code-blk__dot"></div><div class="code-blk__dot"></div><div class="code-blk__dot"></div>
          <span class="code-blk__title">EXSA — 4 classes</span>
        </div>
        <pre><span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="val">"card"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="val">"card__body"</span><span class="tag">&gt;</span>
    <span class="tag">&lt;h3</span> <span class="attr">class</span>=<span class="val">"card__title"</span><span class="tag">&gt;</span>Hello<span class="tag">&lt;/h3&gt;</span>
    <span class="tag">&lt;p</span> <span class="attr">class</span>=<span class="val">"card__text"</span><span class="tag">&gt;</span>Content.<span class="tag">&lt;/p&gt;</span>
  <span class="tag">&lt;/div&gt;</span>
<span class="tag">&lt;/div&gt;</span>

<span class="cmt">Swap theme ? one file. Done.</span></pre>
      </div>
      <div class="code-blk">
        <div class="code-blk__bar">
          <div class="code-blk__dot"></div><div class="code-blk__dot"></div><div class="code-blk__dot"></div>
          <span class="code-blk__title">Tailwind — 12+ classes</span>
        </div>
        <pre><span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="val">"bg-white rounded-lg
 shadow-md p-6 max-w-sm
 border border-gray-200"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;h3</span> <span class="attr">class</span>=<span class="val">"text-lg font-semibold
 text-gray-900 mb-2"</span><span class="tag">&gt;</span>Hello<span class="tag">&lt;/h3&gt;</span>
  <span class="tag">&lt;p</span> <span class="attr">class</span>=<span class="val">"text-sm
 text-gray-600"</span><span class="tag">&gt;</span>Content.<span class="tag">&lt;/p&gt;</span>
<span class="tag">&lt;/div&gt;</span>

<span class="cmt">Swap theme ? edit every class.</span></pre>
      </div>
    </div>
  </section>

  <!-- -- Benchmark: Why Guarded Classless -- -->
  <section class="sec">
    <div class="sec__label">Less Code, More Meaning</div>
    <h2>20–40% less HTML. Classes only when you need them.</h2>
    <div class="bench">
      <div class="bench__big">
        <div class="bench__pct">20–40%</div>
        <div class="bench__pct-label">Less HTML</div>
      </div>
      <div class="bench__body">
        <p>Most CSS approaches force a tradeoff: either you memorize a wall of utility classes, or you annotate every element just to make it stylable. EXSA skips both. Semantic HTML — <code>&lt;nav&gt;</code>, <code>&lt;table&gt;</code>, <code>&lt;aside&gt;</code> — is stylable the moment you write it, no class required. On pages built from meaningful markup, that typically means 20–40% less HTML to write and review, since you're not annotating structure that already exists. You add classes only when you need more than the baseline — the rest of the time, the framework gets out of the way.</p>
      </div>
    </div>
  </section>

  <!-- -- Fluid Scale + Density Profiles -- -->
  <section class="sec sec--alt">
    <div class="sec__label">Invention #3</div>
    <h2>Fluid by default. One attribute changes everything.</h2>
    <p class="sec__sub">Spacing, typography, and border-radius scale smoothly with viewport width via <code>clamp()</code> — no breakpoints, no responsive classes. Then add <code>data-profile="compact"</code> or <code>data-profile="spacious"</code> to <code>&lt;html&gt;</code> and every component shifts density simultaneously. <code>--space-factor</code>, <code>--radius-factor</code>, <code>--font-factor</code>, and <code>--motion-factor</code> cascade through all 50 components. One optional file (<code>exsa.fluid.css</code>). Zero build.</p>

    <div class="code-blk">
      <div class="code-blk__bar">
        <div class="code-blk__dot"></div><div class="code-blk__dot"></div><div class="code-blk__dot"></div>
        <span class="code-blk__title">index.html</span>
      </div>
      <pre><span class="cmt">&lt;!-- Same components. Different feel. One attribute. --&gt;</span>
<span class="tag">&lt;html</span> <span class="attr">lang</span>=<span class="val">"en"</span> <span class="attr">data-profile</span>=<span class="val">"compact"</span><span class="tag">&gt;</span>   <span class="cmt">&lt;!-- dashboard density --&gt;</span>
<span class="tag">&lt;html</span> <span class="attr">lang</span>=<span class="val">"en"</span><span class="tag">&gt;</span>                        <span class="cmt">&lt;!-- comfortable (default) --&gt;</span>
<span class="tag">&lt;html</span> <span class="attr">lang</span>=<span class="val">"en"</span> <span class="attr">data-profile</span>=<span class="val">"spacious"</span><span class="tag">&gt;</span> <span class="cmt">&lt;!-- landing page airiness --&gt;</span></pre>
    </div>
  </section>

  <!-- -- Why 2026 -- -->
  <section class="sec">
    <div class="sec__label">Why Now</div>
    <h2>Three W3C standards made EXSA possible.</h2>
    <p class="sec__sub">Bootstrap launched in 2011. Tailwind in 2017. But <code>:not([class])</code>, <code>:where()</code>, and <code>@layer</code> — the three features that make EXSA's architecture, Guarded Classless&trade;, and Fluid Scale + Density Profiles possible — only became baseline together in 2022. EXSA is the first framework designed after all three.</p>

    <div class="cmp">
      <div class="cmp__card">
        <h4><code>:not([class])</code> — ~2015</h4>
        <p>Detect whether the developer has customized an element. If you add <em>any</em> class, EXSA knows to step aside.</p>
      </div>
      <div class="cmp__card">
        <h4><code>:where()</code> — Chrome 88 (2021)</h4>
        <p>Zero-specificity selectors. Your styles always win — no <code>!important</code>, no specificity wars, no framework conflicts.</p>
      </div>
      <div class="cmp__card">
        <h4><code>@layer</code> — Chrome 99 (2022)</h4>
        <p>Cascade order without specificity. 5 layers, each feeds the next. Themes and your CSS sit outside — they always win.</p>
      </div>
    </div>
  </section>

  <!-- -- Architecture -- -->
  <section class="sec" id="architecture">
    <div class="sec__label">Architecture</div>
    <h2>5 layers. Each with one job.</h2>
    <p class="sec__sub">CSS <code>@layer</code> is the most underused feature in the language. EXSA builds its entire architecture on it — themes and your CSS sit <strong>outside</strong> the cascade, so they always win.</p>

    <div class="arch">
      <div class="arch__layer arch__layer--unlayered">
        <div class="arch__num">?</div>
        <div class="arch__info">
          <h4>Your CSS & Themes</h4>
          <p><strong>Unlayered</strong> — always wins. Themes override tokens. Your styles override everything. No <code>!important</code> needed.</p>
          <code>themes/breeze.css — your-styles.css — style attribute</code>
        </div>
      </div>
      <div class="arch__layer arch__layer--l5">
        <div class="arch__num">5</div>
        <div class="arch__info">
          <h4>Components</h4>
          <p>50 plug-and-play components. Each is one CSS file. Link only what you need. All use <code>:where()</code> for zero specificity.</p>
          <code>accordion — modal — toast — tabs — card — table — dropdown</code>
        </div>
      </div>
      <div class="arch__layer arch__layer--l4">
        <div class="arch__num">4</div>
        <div class="arch__info">
          <h4>Elements</h4>
          <p><strong>Guarded Classless</strong> — semantic HTML works out of the box. Add any class to any element and EXSA instantly steps aside.</p>
          <code>&lt;section&gt; gets cards — &lt;section class="my-app"&gt; doesn't</code>
        </div>
      </div>
      <div class="arch__layer arch__layer--l3">
        <div class="arch__num">3</div>
        <div class="arch__info">
          <h4>Layout</h4>
          <p>72+ flex & grid + 18 typography utilities. No prefix. No breakpoint memorization. Just compose.</p>
          <code>.flex — .grid — .container — .gap-md — .grid-auto-fit</code>
        </div>
      </div>
      <div class="arch__layer arch__layer--l2">
        <div class="arch__num">2</div>
        <div class="arch__info">
          <h4>Reset</h4>
          <p>Box model, focus rings, scrollbars, RTL, reduced motion, forced-colors, skip links.</p>
          <code>box-sizing — :focus-visible — [dir=rtl] — prefers-reduced-motion</code>
        </div>
      </div>
      <div class="arch__layer arch__layer--l1">
        <div class="arch__num">1</div>
        <div class="arch__info">
          <h4>Tokens</h4>
          <p>61 CSS custom properties. Colors, spacing, typography, shadows, breakpoints, behavioral factors. The foundation everything else references.</p>
          <code>--color-link — --gap — --border-radius — --box-shadow</code>
        </div>
      </div>
    </div>
  </section>

  <!-- -- A11y -- -->
  <section class="sec sec--alt">
    <div class="sec__label">Accessibility</div>
    <h2>Accessibility isn't a plugin. It's layer 2.</h2>
    <p class="sec__sub">Most frameworks treat accessibility as a plugin or a checklist. EXSA puts it in the reset — before layout, before components. It's not optional.</p>

    <div class="cmp" style="grid-template-columns:repeat(2,1fr);">
      <div class="cmp__card">
        <h4>Windows High Contrast Mode</h4>
        <p><code>@media (forced-colors: active)</code> switches the focus ring to system colors and reveals screen-reader-only text. Works out of the box — no configuration.</p>
      </div>
      <div class="cmp__card">
        <h4>Reduced Motion</h4>
        <p><code>prefers-reduced-motion: reduce</code> disables all CSS animations, transitions, and smooth scrolling. The <code>:target</code> highlight animation is explicitly disabled.</p>
      </div>
      <div class="cmp__card">
        <h4>Contrast Preferences</h4>
        <p><code>prefers-contrast: high</code> boosts borders to full opacity and thickens link underlines. <code>prefers-contrast: low</code> softens borders — without thinning text.</p>
      </div>
      <div class="cmp__card">
        <h4>Keyboard Navigation</h4>
        <p>Skip-to-content link. Visible focus rings on <code>:focus-visible</code>. No outline on mouse clicks. <code>scroll-behavior: smooth</code> with a reduced-motion fallback.</p>
      </div>
    </div>
  </section>

  <!-- -- Quick Start -- -->
  <section class="sec" id="quickstart">
    <div class="sec__label">Get Started</div>
    <h2>Two lines. That's it.</h2>
    <p class="sec__sub">CDN or npm — your choice. Two <code>&lt;link&gt;</code> tags, or <code>npm install @exsa/exsa</code>. Either way, no build step, no config file, and every semantic HTML element is styled the moment you add it.</p>
    <div class="code-blk">
      <div class="code-blk__bar">
        <div class="code-blk__dot"></div><div class="code-blk__dot"></div><div class="code-blk__dot"></div>
        <span class="code-blk__title">index.html</span>
      </div>
      <pre><span class="tag">&lt;link</span> <span class="attr">rel</span>=<span class="val">"stylesheet"</span> <span class="attr">href</span>=<span class="val">"https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/style.css"</span><span class="tag">&gt;</span>
<span class="tag">&lt;link</span> <span class="attr">rel</span>=<span class="val">"stylesheet"</span> <span class="attr">href</span>=<span class="val">"https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/themes/breeze.css"</span><span class="tag">&gt;</span>

<span class="cmt">&lt;!-- Add any component you need --&gt;</span>
<span class="tag">&lt;link</span> <span class="attr">rel</span>=<span class="val">"stylesheet"</span> <span class="attr">href</span>=<span class="val">"https://cdn.jsdelivr.net/gh/Saif-Almarri/exsa@main/components/buttons.css"</span><span class="tag">&gt;</span>

<span class="tag">&lt;body</span> <span class="attr">class</span>=<span class="val">"exsa"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;nav&gt;</span>...<span class="tag">&lt;/nav&gt;</span>
  <span class="tag">&lt;main&gt;</span>...<span class="tag">&lt;/main&gt;</span>
<span class="tag">&lt;/body&gt;</span></pre>
    </div>

    <p style="margin-top:28px;font-size:.9rem;color:var(--color-text-secondary)">Works with plain <code>.php</code> files — <strong>and any PHP framework</strong>. Laravel, Symfony, CodeIgniter, WordPress. Two <code>&lt;link&gt;</code> tags. Nothing to compile.</p>

    <div class="code-blk">
      <div class="code-blk__bar">
        <div class="code-blk__dot"></div><div class="code-blk__dot"></div><div class="code-blk__dot"></div>
        <span class="code-blk__title">index.php</span>
      </div>
      <pre><span class="cmt">&lt;?php // index.php — your entire app
// No composer.json. No package.json. No vite.config.js.
// No Twig. No Blade. No SASS. No PostCSS.
// Just PHP, HTML, and two &lt;link&gt; tags.
?&gt;</span>
<span class="tag">&lt;!DOCTYPE html&gt;</span>
<span class="tag">&lt;html</span> <span class="attr">lang</span>=<span class="val">"en"</span><span class="tag">&gt;</span>
<span class="tag">&lt;head&gt;</span>
  <span class="tag">&lt;meta</span> <span class="attr">charset</span>=<span class="val">"UTF-8"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;title&gt;</span>My App<span class="tag">&lt;/title&gt;</span>
  <span class="tag">&lt;link</span> <span class="attr">rel</span>=<span class="val">"stylesheet"</span> <span class="attr">href</span>=<span class="val">"exsa/style.css"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;link</span> <span class="attr">rel</span>=<span class="val">"stylesheet"</span> <span class="attr">href</span>=<span class="val">"exsa/themes/breeze.css"</span><span class="tag">&gt;</span>
<span class="tag">&lt;/head&gt;</span>
<span class="tag">&lt;body</span> <span class="attr">class</span>=<span class="val">"exsa"</span><span class="tag">&gt;</span>

  <span class="tag">&lt;nav&gt;</span>
    <span class="tag">&lt;a</span> <span class="attr">href</span>=<span class="val">"/"</span><span class="tag">&gt;</span>Home<span class="tag">&lt;/a&gt;</span>
    <span class="tag">&lt;a</span> <span class="attr">href</span>=<span class="val">"/about"</span><span class="tag">&gt;</span>About<span class="tag">&lt;/a&gt;</span>
  <span class="tag">&lt;/nav&gt;</span>

  <span class="tag">&lt;main&gt;</span>
    <span class="tag">&lt;h1&gt;</span>Welcome<span class="tag">&lt;/h1&gt;</span>

    <span class="tag">&lt;form</span> <span class="attr">method</span>=<span class="val">"post"</span><span class="tag">&gt;</span>
      <span class="tag">&lt;label&gt;</span>Name<span class="tag">&lt;/label&gt;</span>
      <span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="val">"text"</span> <span class="attr">name</span>=<span class="val">"name"</span> <span class="attr">required</span><span class="tag">&gt;</span>
      <span class="tag">&lt;label&gt;</span>Email<span class="tag">&lt;/label&gt;</span>
      <span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="val">"email"</span> <span class="attr">name</span>=<span class="val">"email"</span> <span class="attr">required</span><span class="tag">&gt;</span>
      <span class="tag">&lt;button</span> <span class="attr">type</span>=<span class="val">"submit"</span><span class="tag">&gt;</span>Save<span class="tag">&lt;/button&gt;</span>
    <span class="tag">&lt;/form&gt;</span>

    <span class="tag">&lt;table&gt;</span>
      <span class="tag">&lt;thead&gt;&lt;tr&gt;&lt;th&gt;</span>Name<span class="tag">&lt;/th&gt;&lt;th&gt;</span>Email<span class="tag">&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;</span>
      <span class="tag">&lt;tbody&gt;</span>
        <span class="cmt">&lt;?php foreach ($users as $user): ?&gt;</span>
        <span class="tag">&lt;tr&gt;&lt;td&gt;</span><span class="cmt">&lt;?= $user['name'] ?&gt;</span><span class="tag">&lt;/td&gt;&lt;td&gt;</span><span class="cmt">&lt;?= $user['email'] ?&gt;</span><span class="tag">&lt;/td&gt;&lt;/tr&gt;</span>
        <span class="cmt">&lt;?php endforeach; ?&gt;</span>
      <span class="tag">&lt;/tbody&gt;</span>
    <span class="tag">&lt;/table&gt;</span>
  <span class="tag">&lt;/main&gt;</span>

<span class="tag">&lt;/body&gt;</span>
<span class="tag">&lt;/html&gt;</span></pre>
    </div>
  </section>

  <!-- -- CTA -- -->
  <section class="sec">
    <div class="cta">
      <h2>Ready to let tokens do the work?</h2>
      <p>Browse 50 components, grab the cheatsheet, or use the Generator to build a custom bundle — no build step, no config, just the CSS you need.</p>
      <div class="hero__actions">
        <a href="showcase.php" class="btn btn--outline btn--lg">Component Showcase</a>
        <a href="cheatsheet.php" class="btn btn--outline btn--lg">Cheatsheet</a>
        <a href="generator.php" class="btn btn--outline btn--lg">Generator</a>
      </div>
    </div>
  </section>

</main>
 <footer class="footer" role="contentinfo">
    <div class="footer__inner">
      <div class="footer__grid">
        <!-- Brand -->
        <div class="footer__brand">
          <div class="footer__logo"><img src="logo.svg" alt="EXSA" width="24" style="vertical-align:middle;margin-right:6px;"><span>EXSA</span> CSS Framework</div>
          <p class="footer__tagline">A framework where tokens do the work, not tools. CSS, the way it was meant to work.</p>
        </div>
        <!-- Pages -->
        <div class="footer__links">
          <div class="footer__links-title">Pages</div>
          <a href="docs.php">Documentation</a>
          <a href="showcase.php">Components</a>
          <a href="cheatsheet.php">Cheatsheet</a>
        </div>
        <!-- Resources -->
        <div class="footer__links">
          <div class="footer__links-title">Resources</div>
          <a href="generator.php">Bundle Generator</a>
          <a href="tokens.json">Design Tokens (JSON)</a>
          <a href="https://github.com/Saif-Almarri/exsa/blob/master/PHILOSOPHY.md" target="_blank" rel="noopener">Philosophy</a>
          <a href="https://github.com/Saif-Almarri/exsa" target="_blank" rel="noopener">GitHub ↗</a>
          <a href="mailto:contact@exsa.dev">contact@exsa.dev</a>
        </div>
        <!-- Community -->
        <div class="footer__links">
          <div class="footer__links-title">Community</div>
          <a href="https://github.com/Saif-Almarri/exsa/issues" target="_blank" rel="noopener">Issues</a>
          <a href="https://github.com/Saif-Almarri/exsa/discussions" target="_blank" rel="noopener">Discussions</a>
        </div>
      </div>
      <!-- Bottom -->
      <div class="footer__bottom">
        <span>© 2026 Saif Almarri. Open source under the <a href="LICENSE">MIT License</a>.</span>
        <a href="https://github.com/Saif-Almarri/exsa" target="_blank" rel="noopener">github.com/Saif-Almarri/exsa</a>
      </div>
    </div>
  </footer>
<script src="components.js?v=14"></script>

</body>
</html>
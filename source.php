<?php
$css = file_get_contents(__DIR__ . '/style.css');
$lines = explode("\n", $css);

// Split by @layer boundaries (only 4 have code blocks in style.css;
// layer 5 — exsa.components — is declared but populated by separate component files)
$layerOrder = ['exsa.tokens','exsa.reset','exsa.layout','exsa.elements'];
$layerMeta = [
    'exsa.tokens'   => ['title' => 'Layer 1 — Tokens',     'desc' => '51 CSS custom properties. Colors, spacing, typography, shadows.'],
    'exsa.reset'    => ['title' => 'Layer 2 — Reset',       'desc' => 'Box model, focus rings, a11y, RTL, scrollbars, skip links.'],
    'exsa.layout'   => ['title' => 'Layer 3 — Layout',      'desc' => '85+ flex & grid utilities. Containers, gaps, responsive columns.'],
    'exsa.elements' => ['title' => 'Layer 4 — Elements',    'desc' => 'Guarded Classless™ — semantic HTML styled automatically via :where().'],
];

// Find line numbers where each @layer section starts
$boundaries = [];
foreach ($lines as $i => $line) {
    foreach ($layerOrder as $key) {
        if (strpos($line, '@layer ' . $key . ' {') !== false) {
            $boundaries[$key] = $i;
            break;
        }
    }
}

// Build sections: header (before first @layer), then each layer
$layerKeys = array_keys($boundaries);
$firstLayerLine = $boundaries[$layerKeys[0]];

// Preamble: copyright header lines (always visible, not a layer)
$preamble = array_map(fn($i, $t) => ['n' => $i + 1, 't' => $t], array_keys(array_slice($lines, 0, $firstLayerLine)), array_slice($lines, 0, $firstLayerLine));

// Each of the 4 real layers in style.css + synthetic layer 5 (components live in separate files)
$sections = [];
for ($j = 0; $j < count($layerKeys); $j++) {
    $key = $layerKeys[$j];
    $start = $boundaries[$key];
    $end = ($j + 1 < count($layerKeys)) ? $boundaries[$layerKeys[$j + 1]] : count($lines);
    $slice = array_slice($lines, $start, $end - $start);
    $sections[] = [
        'name'  => $layerMeta[$key]['title'],
        'desc'  => $layerMeta[$key]['desc'],
        'lines' => array_map(fn($i, $t) => ['n' => $start + $i + 1, 't' => $t], array_keys($slice), $slice),
    ];
}

// Layer 5 — Components (separate files, not in style.css)
$componentFiles = glob(__DIR__ . '/components/*.css');
$compList = array_map(fn($f) => basename($f), $componentFiles);
sort($compList);
$compLines = [];
$compLines[] = ['n' => '—', 't' => '/* Layer 5: exsa.components — 50 separate CSS files */'];
$compLines[] = ['n' => '—', 't' => '/* Link what you need. The Generator bundles only selected components. */'];
$compLines[] = ['n' => '—', 't' => ''];
foreach ($compList as $f) {
    $compLines[] = ['n' => '—', 't' => "components/{$f}"];
}
$sections[] = [
    'name'  => 'Layer 5 — Components',
    'desc'  => '50 plug-and-play BEM components. One file each. Link only what you need.',
    'lines' => $compLines,
];

function esc($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
$totalLines = count($lines);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'">
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
  <title>EXSA Source Code — style.css Annotated Framework Source</title>
  <meta name="description" content="View the complete EXSA style.css source code, annotated by @layer. See tokens, reset, layout, elements, and components in one file.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://exsa.dev/source.php">
  <meta property="og:title" content="EXSA Source Code — style.css Annotated Framework Source">
  <meta property="og:description" content="View the complete EXSA style.css source code, annotated by @layer. See tokens, reset, layout, elements, and components in one file.">
  <meta property="og:image" content="https://exsa.dev/logo.png">
  <meta property="og:url" content="https://exsa.dev/source.php">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="EXSA Source Code — style.css Annotated Framework Source">
  <meta name="twitter:description" content="View the complete EXSA style.css source code, annotated by @layer. See tokens, reset, layout, elements, and components in one file.">
  <meta name="twitter:image" content="https://exsa.dev/logo.png">
  <link rel="icon" type="image/png" href="logo.png">
  <link rel="stylesheet" href="style.css?v=24">
  <link id="theme-stylesheet" rel="stylesheet" href="themes/breeze.css?v=3">
  <?php include 'includes/head.php'; ?>
  <link rel="stylesheet" href="components/buttons.css?v=2">
  <link rel="stylesheet" href="components/badge.css">
  <link rel="stylesheet" href="components/footer.css">
  <style>
    *,*::before,*::after{box-sizing:border-box}
    html{scroll-behavior:smooth}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
    html,body{height:auto;overflow:auto;margin:0;padding:0}
    body{font-family:var(--font-family);line-height:var(--line-height);color:var(--color-text);background:var(--color-bg);-webkit-font-smoothing:antialiased}
    main{max-width:1100px;margin:0 auto;padding:24px 20px 60px}

    .src-header{margin-bottom:32px;padding-top:50px}
    .src-header h1{font-size:1.5rem;margin:0 0 4px}
    .src-header p{font-size:.82rem;color:var(--color-text-secondary);margin:0}
    .src-stats{display:flex;gap:24px;margin-top:10px;font-size:.78rem;color:var(--color-text-secondary)}
    .src-stats strong{color:var(--color-link)}

    .src-section{margin-bottom:28px;border:1px solid var(--color-bg-secondary);border-radius:var(--border-radius);overflow:hidden}
    .src-section__head{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:var(--color-bg-secondary);cursor:pointer;user-select:none;gap:12px}
    .src-section__head:hover{filter:brightness(.96)}
    .src-section__title{font-size:.9rem;font-weight:700;margin:0}
    .src-section__desc{font-size:.75rem;color:var(--color-text-secondary);margin:0;flex:1;text-align:end}
    .src-section__toggle{font-size:.75rem;color:var(--color-text-secondary);white-space:nowrap}
    .src-section__body{display:none;overflow-x:auto}

    .src-table{width:100%;border-collapse:collapse;font-family:'SF Mono','Cascadia Code','Fira Code',Consolas,monospace;font-size:.78rem;line-height:1.55}
    .src-table td{padding:1px 0;white-space:pre;vertical-align:top}
    .src-table .ln{width:50px;text-align:end;padding-inline-end:14px;color:var(--color-text-secondary);user-select:none;opacity:.55}
    .src-table .code{color:var(--color-text);padding-inline-start:0}
    .src-table .code .co{color:var(--color-text-secondary);font-style:italic}
    .src-table .code .kw{color:var(--color-secondary)}
    .src-table .code .fn{color:var(--color-link)}
    .src-table .code .va{color:var(--color-success)}
    .src-table .code .st{color:var(--color-warning)}

    /* TOC */
    .src-toc{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
    .src-toc a{font-size:.78rem;color:var(--color-link);text-decoration:none;padding:4px 10px;border-radius:3px;background:var(--color-accent);transition:background .15s}
    .src-toc a:hover{background:color-mix(in srgb,var(--color-link)20%,transparent)}

    @media(max-width:700px){
      main{padding:16px 10px 40px}
      .src-section__head{flex-wrap:wrap}
      .src-section__desc{text-align:start;flex:100%}
      .src-table{font-size:.68rem}
      .src-table .ln{width:36px;padding-inline-end:8px}
    }

    </style>
</head>
<body>

<a href="#main-content" class="skip-link">Skip to main content</a>

<?php $activePage = 'source.php'; $topbarClass = 'topbar--xl topbar--transparent'; include 'includes/topbar.php'; ?>

<main>

<div class="src-header">
  <h1>style.css — Framework Source</h1>
  <p>Complete 5-layer architecture. Layers 1–4 live in style.css; Layer 5 spans 50 component files. Click any section to expand.</p>
  <div class="src-stats">
    <span><strong><?= $totalLines ?></strong> lines</span>
    <span><strong>5</strong> layers</span>
    <span><strong>51</strong> tokens</span>
    <span><strong>24 KB</strong> raw — <strong>~5.6 KB</strong> gzip</span>
  </div>
</div>

<div style="margin-bottom:28px;padding:14px 18px;border:1px solid var(--color-bg-secondary);border-radius:var(--border-radius);background:var(--color-accent);font-size:.78rem;line-height:1.7">
  <strong style="color:var(--color-link)">Cascade order</strong> — unlayered always beats layered:
  <table style="width:100%;margin-top:6px;border-collapse:collapse;font-size:.75rem">
    <tr style="color:var(--color-success)"><td style="padding:2px 8px">Your CSS</td><td style="color:var(--color-text-secondary)">unlayered</td><td style="color:var(--color-text-secondary);text-align:end">strongest</td></tr>
    <tr style="color:var(--color-success)"><td style="padding:2px 8px">Theme files</td><td style="color:var(--color-text-secondary)">unlayered</td><td style="color:var(--color-text-secondary);text-align:end">override tokens</td></tr>
    <tr><td colspan="3" style="padding:2px 8px;color:var(--color-text-secondary)"><hr style="margin:2px 0;border-color:var(--color-bg-secondary)"></td></tr>
    <tr><td style="padding:2px 8px">Layer 5 — Components</td><td style="color:var(--color-text-secondary)">separate files</td><td></td></tr>
    <tr><td style="padding:2px 8px">Layer 4 — Elements</td><td></td><td></td></tr>
    <tr><td style="padding:2px 8px">Layer 3 — Layout</td><td></td><td></td></tr>
    <tr><td style="padding:2px 8px">Layer 2 — Reset</td><td></td><td></td></tr>
    <tr><td style="padding:2px 8px">Layer 1 — Tokens</td><td></td><td style="color:var(--color-text-secondary);text-align:end">weakest</td></tr>
  </table>
</div>

<div class="src-toc">
  <?php foreach ($sections as $idx => $sec): ?>
    <a href="#sec-<?= $idx ?>"><?= esc($sec['name']) ?></a>
  <?php endforeach; ?>
</div>

<!-- Preamble: copyright header (not a layer) -->
<div class="src-section">
  <div class="src-section__head" style="cursor:default;filter:none" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='block'?'none':'block';this.querySelector('.src-section__toggle').textContent=this.nextElementSibling.style.display==='block'?'?':'?'">
    <span class="src-section__title">Preamble</span>
    <span class="src-section__desc">Copyright, @layer declaration, docs pointer — <?= count($preamble) ?> lines</span>
    <span class="src-section__toggle">?</span>
  </div>
  <div class="src-section__body">
    <table class="src-table">
      <?php foreach ($preamble as $l): ?>
      <tr>
        <td class="ln"><?= $l['n'] ?></td>
        <td class="code"><?= esc($l['t']) ?></td>
      </tr>
      <?php endforeach; ?>
    </table>
  </div>
</div>

<!-- 5 layers -->
<?php foreach ($sections as $idx => $sec): ?>
<div class="src-section" id="sec-<?= $idx ?>">
  <div class="src-section__head" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='block'?'none':'block';this.querySelector('.src-section__toggle').textContent=this.nextElementSibling.style.display==='block'?'?':'?'">
    <span class="src-section__title"><?= esc($sec['name']) ?></span>
    <span class="src-section__desc"><?= esc($sec['desc']) ?> — <?= count($sec['lines']) ?> lines</span>
    <span class="src-section__toggle">?</span>
  </div>
  <div class="src-section__body">
    <table class="src-table">
      <?php foreach ($sec['lines'] as $l): ?>
      <tr>
        <td class="ln"><?= $l['n'] ?></td>
        <td class="code"><?= esc($l['t']) ?></td>
      </tr>
      <?php endforeach; ?>
    </table>
  </div>
</div>
<?php endforeach; ?>

</main>

<footer class="footer" role="contentinfo">
  <div class="footer__inner">
    <div class="footer__grid">
      <div class="footer__brand">
        <div class="footer__logo"><img src="logo.png" alt="EXSA" width="24" style="vertical-align:middle;margin-right:6px;"><span>EXSA</span> CSS Framework</div>
        <p class="footer__tagline">A framework where tokens do the work, not tools. CSS, the way it was meant to work.</p>
      </div>
      <div class="footer__links">
        <div class="footer__links-title">Pages</div>
        <a href="docs.php">Documentation</a>
        <a href="showcase.php">Components</a>
        <a href="cheatsheet.php">Cheatsheet</a>
      </div>
      <div class="footer__links">
        <div class="footer__links-title">Resources</div>
        <a href="generator.php">Bundle Generator</a>
        <a href="tokens.json">Design Tokens (JSON)</a>
        <a href="https://github.com/Saif-Almarri/exsa/blob/master/PHILOSOPHY.md" target="_blank" rel="noopener">Philosophy</a>
        <a href="https://github.com/Saif-Almarri/exsa" target="_blank" rel="noopener">GitHub ↗</a>
        <a href="mailto:contact@exsa.dev">contact@exsa.dev</a>
      </div>
      <div class="footer__links">
        <div class="footer__links-title">Community</div>
        <a href="https://github.com/Saif-Almarri/exsa/issues" target="_blank" rel="noopener">Issues</a>
        <a href="https://github.com/Saif-Almarri/exsa/discussions" target="_blank" rel="noopener">Discussions</a>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© 2026 Saif Almarri. Open source under the <a href="LICENSE">MIT License</a>.</span>
      <a href="https://github.com/Saif-Almarri/exsa" target="_blank" rel="noopener">github.com/Saif-Almarri/exsa</a>
    </div>
  </div>
</footer>

<script src="components.js?v=14"></script>
</body>
</html>

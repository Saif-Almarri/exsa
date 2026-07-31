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
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'">
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
  <title>EXSA Icons Library — 101 SVG Mask Icons</title>
  <meta name="description" content="Browse 101 stroke-based SVG icons for EXSA. Searchable gallery with click-to-copy class names. All icons use currentColor — theme-agnostic.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://exsa.dev/icons.php">
  <meta property="og:title" content="EXSA Icons Library — 101 SVG Mask Icons">
  <meta property="og:description" content="Browse 101 stroke-based SVG icons for EXSA. Searchable gallery with click-to-copy class names. All icons use currentColor — theme-agnostic.">
  <meta property="og:image" content="https://exsa.dev/logo.png">
  <meta property="og:url" content="https://exsa.dev/icons.php">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="EXSA Icons Library — 101 SVG Mask Icons">
  <meta name="twitter:description" content="Browse 101 stroke-based SVG icons for EXSA. Searchable gallery with click-to-copy class names. All icons use currentColor — theme-agnostic.">
  <meta name="twitter:image" content="https://exsa.dev/logo.png">
  <link rel="icon" type="image/png" href="logo.png">
  <link rel="stylesheet" href="style.css?v=24">
  <link id="theme-stylesheet" rel="stylesheet" href="themes/breeze.css?v=3">
  <?php include 'includes/head.php'; ?>
  <link rel="stylesheet" href="components/buttons.css?v=2">
  <link rel="stylesheet" href="components/footer.css">
  <style>
    /* Icon base */
    .ic{display:inline-block;width:16px;height:16px;vertical-align:middle;flex-shrink:0;background-color:currentColor;-webkit-mask-size:contain;-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;mask-size:contain;mask-position:center;mask-repeat:no-repeat}
    .ic-chevdown{-webkit-mask-image:url('components/icons/chevron-down.svg');mask-image:url('components/icons/chevron-down.svg')}
    .ic-menu{-webkit-mask-image:url('components/icons/menu.svg');mask-image:url('components/icons/menu.svg')}

    /* -- Page Layout -- */
    .il-page{max-width:1100px;margin:0 auto;padding:100px 20px 60px}

    /* -- Header -- */
    .il-header{text-align:center;margin-bottom:36px}
    .il-header h1{font-size:2rem;margin:0 0 8px}
    .il-header p{color:var(--color-text-secondary);font-size:.95rem;max-width:600px;margin:0 auto}
    .il-header code{font-size:.82rem;background:var(--color-accent);padding:1px 6px;border-radius:3px}

    /* -- Category -- */
    .il-cat{margin-bottom:32px}
    .il-cat__title{font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--color-text-secondary);margin:0 0 12px;padding-bottom:6px;border-bottom:1px solid var(--color-bg-secondary)}

    /* -- Icon Grid -- */
    .il-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:4px}
    .il-card{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--border-radius);border:1px solid transparent;cursor:pointer;transition:border-color .15s,background .15s;font-size:.8rem;font-family:monospace;color:var(--color-text)}
    .il-card:hover{border-color:var(--color-bg-secondary);background:var(--color-bg)}
    .il-card__icon{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;background:var(--color-bg-secondary);flex-shrink:0}
    .il-card__icon .ic{width:20px;height:20px}
    .il-card__name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .il-card__name small{display:block;font-size:.68rem;color:var(--color-text-secondary);font-family:inherit}

    /* -- Copied feedback -- */
    .il-card--copied{border-color:var(--color-link)!important;background:color-mix(in srgb,var(--color-link)8%,transparent)}

    @media(max-width:600px){
      .il-page{padding:90px 12px 40px}
      .il-grid{grid-template-columns:1fr 1fr}
    }
  </style>
</head>
<body class="has-topbar">

<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- --------------- TOPBAR --------------- -->
<?php $activePage = 'icons.php'; $topbarClass = 'topbar--xl topbar--transparent'; include 'includes/topbar.php'; ?>

<!-- --------------- MAIN --------------- -->
<main class="il-page" id="main-content">

  <div class="il-header">
    <h1>Icons Library</h1>
    <p>101 stroke-based SVG icons at 24×24. Uses <code>stroke="currentColor"</code> with <code>stroke-width="2"</code> — inherits color from the parent element. Use with <code>&lt;span class="ic ic-&lt;name&gt;"&gt;&lt;/span&gt;</code>. Click any icon to copy its class name.</p>
  </div>

  <!-- Navigation -->
  <div class="il-cat">
    <div class="il-cat__title">Navigation</div>
    <div class="il-grid" id="grid-nav"></div>
  </div>

  <!-- Actions -->
  <div class="il-cat">
    <div class="il-cat__title">Actions</div>
    <div class="il-grid" id="grid-actions"></div>
  </div>

  <!-- Text Editing -->
  <div class="il-cat">
    <div class="il-cat__title">Text Editing</div>
    <div class="il-grid" id="grid-text"></div>
  </div>

  <!-- Media -->
  <div class="il-cat">
    <div class="il-cat__title">Media &amp; Images</div>
    <div class="il-grid" id="grid-media"></div>
  </div>

  <!-- Account & Security -->
  <div class="il-cat">
    <div class="il-cat__title">Account &amp; Security</div>
    <div class="il-grid" id="grid-account"></div>
  </div>

  <!-- Communication -->
  <div class="il-cat">
    <div class="il-cat__title">Communication</div>
    <div class="il-grid" id="grid-comm"></div>
  </div>

  <!-- Commerce -->
  <div class="il-cat">
    <div class="il-cat__title">Commerce</div>
    <div class="il-grid" id="grid-commerce"></div>
  </div>

  <!-- Developer -->
  <div class="il-cat">
    <div class="il-cat__title">Developer</div>
    <div class="il-grid" id="grid-dev"></div>
  </div>

  <!-- Status -->
  <div class="il-cat">
    <div class="il-cat__title">Status &amp; Feedback</div>
    <div class="il-grid" id="grid-status"></div>
  </div>

  <!-- General -->
  <div class="il-cat">
    <div class="il-cat__title">General</div>
    <div class="il-grid" id="grid-general"></div>
  </div>

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
<script>
/* -- Icon Library -- */
const icons = {
  nav: [
    { name:'menu', file:'menu.svg' },
    { name:'home', file:'home.svg' },
    { name:'search', file:'search.svg' },
    { name:'chevron-up', file:'chevron-up.svg' },
    { name:'chevron-down', file:'chevron-down.svg' },
    { name:'chevron-left', file:'chevron-left.svg' },
    { name:'chevron-right', file:'chevron-right.svg' },
    { name:'arrow-up', file:'arrow-up.svg' },
    { name:'external-link', file:'external-link.svg' },
    { name:'link', file:'link.svg' },
    { name:'map-pin', file:'map-pin.svg' }
  ],
  actions: [
    { name:'plus', file:'plus.svg' },
    { name:'minus', file:'minus.svg' },
    { name:'edit', file:'edit.svg' },
    { name:'copy', file:'copy.svg' },
    { name:'paste', file:'clipboard-paste.svg' },
    { name:'trash', file:'trash.svg' },
    { name:'download', file:'download.svg' },
    { name:'upload', file:'upload.svg' },
    { name:'refresh', file:'refresh.svg' },
    { name:'share', file:'share.svg' },
    { name:'send', file:'send.svg' },
    { name:'sort', file:'sort.svg' },
    { name:'filter', file:'filter.svg' },
    { name:'settings', file:'settings.svg' },
    { name:'sliders', file:'sliders.svg' },
    { name:'archive', file:'archive.svg' },
    { name:'printer', file:'printer.svg' },
    { name:'grip', file:'grip.svg' },
    { name:'more-horizontal', file:'more-horizontal.svg' },
    { name:'more-vertical', file:'more-vertical.svg' }
  ],
  text: [
    { name:'type', file:'type.svg' },
    { name:'bold', file:'bold.svg' },
    { name:'italic', file:'italic.svg' },
    { name:'underline', file:'underline.svg' },
    { name:'align-left', file:'align-left.svg' },
    { name:'align-center', file:'align-center.svg' },
    { name:'align-right', file:'align-right.svg' },
    { name:'list', file:'list.svg' },
    { name:'code', file:'code.svg' },
    { name:'file', file:'file.svg' },
    { name:'folder', file:'folder.svg' }
  ],
  media: [
    { name:'image', file:'image.svg' },
    { name:'play', file:'play.svg' },
    { name:'pause', file:'pause.svg' },
    { name:'volume', file:'volume.svg' },
    { name:'crop', file:'crop.svg' },
    { name:'sun', file:'sun.svg' },
    { name:'moon', file:'moon.svg' },
    { name:'camera', file:'camera.svg' },
    { name:'video', file:'video.svg' },
    { name:'mic', file:'mic.svg' }
  ],
  account: [
    { name:'user', file:'user.svg' },
    { name:'user-circle', file:'user-circle.svg' },
    { name:'user-plus', file:'user-plus.svg' },
    { name:'user-check', file:'user-check.svg' },
    { name:'users', file:'users.svg' },
    { name:'log-in', file:'log-in.svg' },
    { name:'log-out', file:'log-out.svg' },
    { name:'key', file:'key.svg' },
    { name:'shield', file:'shield.svg' },
    { name:'shield-check', file:'shield-check.svg' },
    { name:'lock', file:'lock.svg' },
    { name:'unlock', file:'unlock.svg' },
    { name:'at-sign', file:'at-sign.svg' },
    { name:'bookmark', file:'bookmark.svg' }
  ],
  comm: [
    { name:'mail', file:'mail.svg' },
    { name:'message-circle', file:'message-circle.svg' },
    { name:'phone', file:'phone.svg' },
    { name:'bell', file:'bell.svg' },
    { name:'heart', file:'heart.svg' },
    { name:'star', file:'star.svg' },
    { name:'star-filled', file:'star-filled.svg' }
  ],
  commerce: [
    { name:'cart', file:'cart.svg' },
    { name:'tag', file:'tag.svg' },
    { name:'dashboard', file:'dashboard.svg' },
    { name:'calendar', file:'calendar.svg' },
    { name:'clock', file:'clock.svg' },
    { name:'credit-card', file:'credit-card.svg' },
    { name:'dollar', file:'dollar-sign.svg' },
    { name:'briefcase', file:'briefcase.svg' },
    { name:'gift', file:'gift.svg' },
    { name:'truck', file:'truck.svg' },
    { name:'package', file:'package.svg' }
  ],
  status: [
    { name:'check', file:'check.svg' },
    { name:'info', file:'info.svg' },
    { name:'warning', file:'warning.svg' },
    { name:'x-circle', file:'x-circle.svg' },
    { name:'x', file:'x.svg' },
    { name:'eye', file:'eye.svg' },
    { name:'eye-off', file:'eye-off.svg' },
    { name:'help-circle', file:'help-circle.svg' }
  ],
  dev: [
    { name:'terminal', file:'terminal.svg' },
    { name:'database', file:'database.svg' },
    { name:'cloud', file:'cloud.svg' },
    { name:'wifi', file:'wifi.svg' },
    { name:'layers', file:'layers.svg' },
    { name:'layout', file:'layout.svg' },
    { name:'clipboard', file:'clipboard.svg' },
    { name:'hash', file:'hash.svg' },
    { name:'flag', file:'flag.svg' }
  ],
  general: [
    { name:'bookmark', file:'bookmark.svg' },
    { name:'tag', file:'tag.svg' },
    { name:'grip', file:'grip.svg' },
    { name:'more-horizontal', file:'more-horizontal.svg' },
    { name:'more-vertical', file:'more-vertical.svg' }
  ]
};

// Remove duplicates (items appearing in multiple categories — keep first)
const seen = new Set();
for (const cat of Object.values(icons)) {
  for (let i = cat.length - 1; i >= 0; i--) {
    if (seen.has(cat[i].name)) cat.splice(i, 1);
    else seen.add(cat[i].name);
  }
}

// Build grids
function buildGrid(containerId, iconList) {
  const grid = document.getElementById(containerId);
  if (!grid || !iconList.length) return;
  iconList.forEach(icon => {
    const card = document.createElement('div');
    card.className = 'il-card';
    card.title = 'Click to copy: ic-' + icon.name;
    card.innerHTML = '<div class="il-card__icon"><span class="ic ic-' + icon.name + '"></span></div>'
      + '<span class="il-card__name">ic-' + icon.name + '<small>' + icon.file + '</small></span>';
    card.addEventListener('click', () => {
      navigator.clipboard.writeText('ic-' + icon.name).then(() => {
        card.classList.add('il-card--copied');
        setTimeout(() => card.classList.remove('il-card--copied'), 800);
      });
    });
    grid.appendChild(card);
  });
}

// Load icon CSS dynamically
const iconCSS = document.createElement('style');
let cssRules = '';
for (const cat of Object.values(icons)) {
  for (const icon of cat) {
    cssRules += '.ic-' + icon.name + '{-webkit-mask-image:url(\'components/icons/' + icon.file + '\');mask-image:url(\'components/icons/' + icon.file + '\')}';
  }
}
iconCSS.textContent = cssRules;
document.head.appendChild(iconCSS);

// Build all grids
buildGrid('grid-nav', icons.nav);
buildGrid('grid-actions', icons.actions);
buildGrid('grid-text', icons.text);
buildGrid('grid-media', icons.media);
buildGrid('grid-account', icons.account);
buildGrid('grid-comm', icons.comm);
buildGrid('grid-commerce', icons.commerce);
buildGrid('grid-status', icons.status);
buildGrid('grid-dev', icons.dev);
buildGrid('grid-general', icons.general);
</script>
</body>
</html>

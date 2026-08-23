/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* Copyright © 2026 Saif Almarri. MIT License. See LICENSE.
   Component: CODE BLOCK — copy button + auto syntax highlight
   ════════════════════════════════════════════════════════════
   Enhances every .code-block on the page:
     1. .code-block__copy buttons copy the block's <code> text
        (Clipboard API with execCommand fallback, "Copied!" state)
     2. pre.code-block__body code is syntax-highlighted with the
        component's hl-* classes — unless it already contains
        manual hl-tag/hl-attr/hl-val/hl-cmt spans.
   Requires components/code-block.css (+ icons.css for ic-copy).
   Load AFTER your markup (end of body or defer):
     <script src="js/code-block.js"></script>
   ════════════════════════════════════════════════════════════ */

(function(){
  'use strict';

  /* ── Copy to clipboard ── */
  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.querySelectorAll('.code-block__copy').forEach(function(btn){
    btn.addEventListener('click', function(){
      var box = btn.closest('.code-block');
      var code = box ? box.querySelector('code') : null;
      if (!code) return;
      var text = code.textContent || '';
      var done = function(){
        btn.classList.add('code-block__copy--copied');
        btn.innerHTML = '<span class="ic ic-copy" style="width:13px;height:13px;"></span> Copied!';
        setTimeout(function(){
          btn.classList.remove('code-block__copy--copied');
          btn.innerHTML = '<span class="ic ic-copy" style="width:13px;height:13px;"></span> Copy';
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function(){
          fallbackCopy(text); done();
        });
      } else {
        fallbackCopy(text); done();
      }
    });
  });

  /* ── Syntax highlight (same hl-* classes as the showcase) ── */
  function esc(s){
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function hl(src){
    var s = esc(src);
    s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g, function(m){
      return '<span class="hl-cmt">' + m + '</span>';
    });
    s = s.replace(/(&lt;\/?)(!?[\w-]+)((?:[^&]|&(?!lt;|gt;))*?)(\/?&gt;)/g,
      function(m, open, name, attrs, close){
        attrs = attrs.replace(/([\w-]+)=("(?:[^"]*)"|'[^']*'|[\w-]+)/g,
          '<span class="hl-attr">$1</span>=<span class="hl-val">$2</span>');
        return open + '<span class="hl-tag">' + name + '</span>' + attrs + close;
      });
    return s;
  }
  document.querySelectorAll('pre.code-block__body code').forEach(function(c){
    /* Skip blocks that are already hand-highlighted */
    if (!c.querySelector('.hl-tag, .hl-attr, .hl-val, .hl-cmt')) {
      c.innerHTML = hl(c.textContent);
    }
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

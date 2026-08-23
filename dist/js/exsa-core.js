/* Copyright © 2026 Saif Almarri. MIT License. See LICENSE.
   EXSA Core — shared utilities required by other EXSA JS modules.
   ════════════════════════════════════════════════════════════ */

/* ── Focus Trap Utility ── */
var EXSA=EXSA||{};
(function(){
  var SELECTORS='a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  EXSA.trapFocus=function(container){
    var focusable=Array.from(container.querySelectorAll(SELECTORS)).filter(function(el){return el.offsetParent!==null;});
    if(!focusable.length)return function(){};
    var first=focusable[0],last=focusable[focusable.length-1];

    function handler(e){
      if(e.key!=='Tab')return;
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
    document.addEventListener('keydown',handler);
    return function(){document.removeEventListener('keydown',handler);};
  };

  EXSA.getFocusable=function(container){
    return Array.from(container.querySelectorAll(SELECTORS)).find(function(el){return el.offsetParent!==null;})||null;
  };
})();

/* ── Breakpoint Helpers ── */
(function(){
  var root= getComputedStyle(document.documentElement);

  EXSA.bp={
    up: function(name){
      return window.matchMedia('(min-width:' + root.getPropertyValue('--bp-' + name).trim() + ')');
    },
    down: function(name){
      return window.matchMedia('(max-width:' + root.getPropertyValue('--bp-' + name).trim() + ')');
    },
    val: function(name){
      return root.getPropertyValue('--bp-' + name).trim();
    }
  };
})();

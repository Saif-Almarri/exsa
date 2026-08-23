/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){
  if(!window.EXSA){console.warn('[EXSA] '+location.pathname.split('/').pop()+' needs js/exsa-core.js loaded first — skipping.');return;}

/* EXSA Drawer — ARIA + focus trap */
(function(){
  document.querySelectorAll('.drawer__toggle').forEach(cb=>{
    const label=document.querySelector('label[for="'+cb.id+'"]');
    var trapOff=function(){}, lastFocus=null;

    if(label){label.setAttribute('aria-expanded',cb.checked?'true':'false');}

    /* resolve THIS drawer's panel — not the first .drawer__panel on the page:
       via the drawer's close label, else the backdrop label's next sibling */
    function findPanel(){
      var close=document.querySelector('label.drawer__close[for="'+cb.id+'"]');
      if(close){var p=close.closest('.drawer__panel');if(p)return p;}
      var backdrop=document.querySelector('label.drawer__backdrop[for="'+cb.id+'"]');
      if(backdrop&&backdrop.nextElementSibling&&backdrop.nextElementSibling.classList.contains('drawer__panel'))return backdrop.nextElementSibling;
      return document.querySelector('.drawer__panel');
    }

    function onOpen(){
      lastFocus=document.activeElement;
      var panel=findPanel();
      if(panel){
        trapOff=EXSA.trapFocus(panel);
        var close=panel.querySelector('.drawer__close');
        if(close)close.focus();
        else{var first=EXSA.getFocusable(panel);if(first)first.focus();}
      }
    }
    function onShut(){trapOff();if(lastFocus)lastFocus.focus();}

    cb.addEventListener('change',function(){
      if(this.checked){
        if(label)label.setAttribute('aria-expanded','true');
        onOpen();
      }else{
        if(label)label.setAttribute('aria-expanded','false');
        onShut();
      }
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

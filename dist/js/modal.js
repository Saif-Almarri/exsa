/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){
  if(!window.EXSA){console.warn('[EXSA] '+location.pathname.split('/').pop()+' needs js/exsa-core.js loaded first — skipping.');return;}

/* EXSA Modal — open/close with overlay click, Escape key, focus trap */
(function(){
  document.querySelectorAll('.modal').forEach(modal=>{
    const close=modal.querySelector('.modal__close');
    const cancel=modal.querySelector('.modal__cancel');
    const confirm=modal.querySelector('.modal__confirm');
    var trapOff=function(){}, lastFocus=null;

    function open(){
      lastFocus=document.activeElement;
      modal.classList.add('modal--open');
      modal.setAttribute('aria-modal','true');
      document.body.style.overflow='hidden';
      trapOff=EXSA.trapFocus(modal);
      var first=EXSA.getFocusable(modal);
      if(first)first.focus();
    }
    function shut(){
      modal.classList.remove('modal--open');
      modal.removeAttribute('aria-modal');
      document.body.style.overflow='';
      trapOff();
      if(lastFocus)lastFocus.focus();
    }
    var onKeydown=function(e){if(e.key==='Escape'&&modal.classList.contains('modal--open'))shut();};
    if(close)close.addEventListener('click',shut);
    if(cancel)cancel.addEventListener('click',shut);
    if(confirm)confirm.addEventListener('click',shut);
    modal.addEventListener('click',function(e){if(e.target===modal)shut();});
    document.addEventListener('keydown',onKeydown);
    const id=modal.id;
    if(id){
      document.querySelectorAll('[data-modal-open="'+id+'"]').forEach(btn=>{
        btn.addEventListener('click',open);
      });
    }
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

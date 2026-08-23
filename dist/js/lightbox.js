/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){
  if(!window.EXSA){console.warn('[EXSA] '+location.pathname.split('/').pop()+' needs js/exsa-core.js loaded first — skipping.');return;}

/* EXSA Lightbox — fullscreen image gallery */
(function(){
  document.querySelectorAll('.lightbox-gallery').forEach(gallery=>{
    const overlay=gallery.querySelector('.lightbox-gallery__overlay');
    if(!overlay)return;
    const img=overlay.querySelector('.lightbox-gallery__img');
    const counter=overlay.querySelector('.lightbox-gallery__counter');
    const close=overlay.querySelector('.lightbox-gallery__close');
    const prev=overlay.querySelector('.lightbox-gallery__prev');
    const next=overlay.querySelector('.lightbox-gallery__next');
    let thumbs=[],idx=0;

    const thumbImgs=gallery.querySelectorAll('.lightbox-gallery__thumb img');
    thumbs=Array.from(thumbImgs);
    thumbs.forEach((t,i)=>{t.parentElement.addEventListener('click',()=>open(i));});

    var trapOff=function(){}, lastFocus=null;

    function open(i){
      lastFocus=document.activeElement;idx=i;
      if(img)img.src=thumbs[idx].src;
      if(counter)counter.textContent=(idx+1)+' / '+thumbs.length;
      overlay.classList.add('lightbox--open');
      overlay.setAttribute('aria-modal','true');
      document.body.style.overflow='hidden';
      trapOff=EXSA.trapFocus(overlay);
      if(close)close.focus();
    }
    function shut(){
      overlay.classList.remove('lightbox--open');
      overlay.removeAttribute('aria-modal');
      document.body.style.overflow='';
      trapOff();
      if(lastFocus)lastFocus.focus();
    }
    function go(dir){
      idx=(idx+dir+thumbs.length)%thumbs.length;
      if(img)img.src=thumbs[idx].src;
      if(counter)counter.textContent=(idx+1)+' / '+thumbs.length;
    }
    var onKeydown=function(e){
      if(!overlay.classList.contains('lightbox--open'))return;
      if(e.key==='Escape')shut();
      if(e.key==='ArrowLeft')go(-1);
      if(e.key==='ArrowRight')go(1);
    };
    if(close)close.addEventListener('click',shut);
    if(prev)prev.addEventListener('click',()=>go(-1));
    if(next)next.addEventListener('click',()=>go(1));
    overlay.addEventListener('click',function(e){if(e.target===overlay)shut();});
    document.addEventListener('keydown',onKeydown);
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

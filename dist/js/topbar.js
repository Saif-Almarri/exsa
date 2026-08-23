/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Topbar — scroll transparency + mobile menu + dropdowns */
(function(){
  document.querySelectorAll('.topbar').forEach(topbar=>{
    const scroller=document.querySelector('.doc-main,[data-spy-scroller]');

    function onScroll(){
      /* Read whichever container actually scrolls */
      const y=(scroller&&scroller.scrollTop)?scroller.scrollTop:(window.scrollY||document.documentElement.scrollTop||0);
      topbar.classList.toggle('topbar--scrolled',y>20);
    }
    window.addEventListener('scroll',onScroll,true);
    onScroll();

    function closeAllDD(){
      topbar.querySelectorAll('.topbar__dropdown--open').forEach(d=>{
        d.classList.remove('topbar__dropdown--open');
        var t=d.querySelector('.topbar__dd-trigger');
        if(t)t.setAttribute('aria-expanded','false');
      });
    }
    window.addEventListener('resize',closeAllDD);

    const toggle=topbar.querySelector('.topbar__toggle');
    if(toggle){
      toggle.setAttribute('aria-expanded','false');
      toggle.addEventListener('click',function(e){
        e.stopPropagation();
        const isOpen=!topbar.classList.contains('topbar--open');
        topbar.classList.toggle('topbar--open');
        toggle.setAttribute('aria-expanded',isOpen?'true':'false');
        closeAllDD();
      });
    }

    topbar.querySelectorAll('.topbar__dd-trigger').forEach(trigger=>{
      trigger.setAttribute('aria-expanded','false');
      trigger.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        const dd=this.closest('.topbar__dropdown');
        const wasOpen=dd.classList.contains('topbar__dropdown--open');
        closeAllDD();
        if(!wasOpen){dd.classList.add('topbar__dropdown--open');this.setAttribute('aria-expanded','true');}
        else{this.setAttribute('aria-expanded','false');}
      });
    });

    document.addEventListener('click',function(e){
      if(!topbar.contains(e.target)){
        topbar.classList.remove('topbar--open');
        if(toggle)toggle.setAttribute('aria-expanded','false');
        closeAllDD();
      }
    });

    topbar.querySelectorAll('.topbar__nav a:not(.topbar__dd-trigger), .topbar__dd-item').forEach(link=>{
      link.addEventListener('click',()=>{
        topbar.classList.remove('topbar--open');
        closeAllDD();
      });
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

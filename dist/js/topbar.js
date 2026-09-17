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

    /* Dropdown portal — on ≥768px the menus move to <body> (fixed, positioned
       under their trigger) so their backdrop frost can sample the page: a
       frosted topbar is the backdrop root for its descendants, which would
       clip the menu's blur to the bar's bounds. Mobile keeps the in-flow
       accordion. Mirrors the sidebar tray portal. */
    const mq=matchMedia('(min-width: 768px)');
    const menus=[...topbar.querySelectorAll('.topbar__dd-menu')];
    let portaled=false;
    menus.forEach(m=>{ m.__exsaDD=m.parentElement; });

    function portalMenus(){
      if(portaled)return;
      menus.forEach(m=>{ document.body.appendChild(m); m.classList.add('topbar__dd-menu--fixed'); });
      portaled=true;
    }
    function unportalMenus(){
      if(!portaled)return;
      menus.forEach(m=>{
        m.classList.remove('topbar__dd-menu--fixed','topbar__dd-menu--open');
        if(m.__exsaDD)m.__exsaDD.appendChild(m);
      });
      portaled=false;
    }
    function syncPortal(){ mq.matches?portalMenus():unportalMenus(); }
    syncPortal();

    function closeAllDD(){
      topbar.querySelectorAll('.topbar__dropdown--open').forEach(d=>{
        d.classList.remove('topbar__dropdown--open');
        var t=d.querySelector('.topbar__dd-trigger');
        if(t)t.setAttribute('aria-expanded','false');
      });
      menus.forEach(m=>m.classList.remove('topbar__dd-menu--open'));
    }
    window.addEventListener('resize',closeAllDD);
    mq.addEventListener('change',function(){ closeAllDD(); syncPortal(); });

    function positionMenu(menu){
      const dd=menu.__exsaDD;
      if(!dd||!mq.matches)return;
      const tr=dd.querySelector('.topbar__dd-trigger').getBoundingClientRect();
      menu.style.display='block';
      const mw=menu.offsetWidth||180;
      const rtl=getComputedStyle(dd).direction==='rtl';
      let x=rtl?tr.right-mw:tr.left;
      x=Math.max(8,Math.min(x,window.innerWidth-mw-8));
      menu.style.left=x+'px';
      menu.style.top=(tr.bottom+10)+'px';
    }

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
        if(!wasOpen){
          dd.classList.add('topbar__dropdown--open');
          this.setAttribute('aria-expanded','true');
          const menu=menus.find(m=>m.__exsaDD===dd);
          if(menu){ positionMenu(menu); menu.classList.add('topbar__dd-menu--open'); }
        }
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

    topbar.querySelectorAll('.topbar__nav a:not(.topbar__dd-trigger)').forEach(link=>{
      link.addEventListener('click',()=>{
        topbar.classList.remove('topbar--open');
        closeAllDD();
      });
    });
    menus.forEach(menu=>menu.addEventListener('click',()=>{
      topbar.classList.remove('topbar--open');
      closeAllDD();
    }));
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

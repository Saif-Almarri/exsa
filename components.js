/* Copyright © 2026 Saif Almarri. MIT License. See LICENSE.
   EXSA Behaviors — LEGACY BUNDLE (deprecated)
   ════════════════════════════════════════════════════════════
   Each component now has its own JS file in js/.
   Load only what you need:
     <script src="js/exsa-core.js"></script>
     <script src="js/tabs.js"></script>
     <script src="js/modal.js"></script>
   This file is kept for backward compatibility.
   ════════════════════════════════════════════════════════════ */

/* ── Focus Trap Utility ── */
var EXSA=EXSA||{};
(function(){
  var SELECTORS='a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* Trap focus inside a container. Returns an off() function. */
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

  /* Get first focusable element in a container */
  EXSA.getFocusable=function(container){
    return Array.from(container.querySelectorAll(SELECTORS)).find(function(el){return el.offsetParent!==null;})||null;
  };
})();

/* ── Breakpoint Helpers ──
   Reads --bp-* tokens from :root. Use with matchMedia for JS-driven
   responsive logic. Tokens are the single source of truth — change
   --bp-md in a theme file and both CSS & JS respond. */
(function(){
  var root= getComputedStyle(document.documentElement);

  EXSA.bp={
    /* min-width match — e.g. EXSA.bp.up('md').matches */
    up: function(name){
      return window.matchMedia('(min-width:' + root.getPropertyValue('--bp-' + name).trim() + ')');
    },
    /* max-width match — e.g. EXSA.bp.down('sm').matches */
    down: function(name){
      return window.matchMedia('(max-width:' + root.getPropertyValue('--bp-' + name).trim() + ')');
    },
    /* raw pixel value — e.g. EXSA.bp.val('lg') → "1024px" */
    val: function(name){
      return root.getPropertyValue('--bp-' + name).trim();
    }
  };
})();

/* ── Dropdown Menu ── */
(function(){
  document.querySelectorAll('.dropdown').forEach(dd=>{
    const trigger=dd.querySelector('.dropdown__trigger');
    const menu=dd.querySelector('.dropdown__menu');
    if(!trigger)return;
    function open(){dd.classList.add('dropdown--open');if(trigger)trigger.setAttribute('aria-expanded','true');}
    function close(){dd.classList.remove('dropdown--open');if(trigger)trigger.setAttribute('aria-expanded','false');}
    function getItems(){return menu?menu.querySelectorAll('.dropdown__item:not([disabled])'):[];}
    trigger.addEventListener('click',function(e){
      e.stopPropagation();
      dd.parentElement.querySelectorAll('.dropdown--open').forEach(d=>{if(d!==dd)d.classList.remove('dropdown--open');});
      dd.classList.toggle('dropdown--open');
    });
    dd.addEventListener('keydown',function(e){
      var items=getItems();var idx=Array.from(items).indexOf(document.activeElement);
      if(e.key==='Enter'||e.key===' '){if(document.activeElement===trigger){e.preventDefault();open();var first=items[0];if(first)first.focus();}else{close();trigger.focus();}}
      else if(e.key==='Escape'){close();trigger.focus();}
      else if(e.key==='ArrowDown'){e.preventDefault();if(idx<0){if(items[0])items[0].focus();}else{if(items[idx+1])items[idx+1].focus();}}
      else if(e.key==='ArrowUp'){e.preventDefault();if(idx>0)items[idx-1].focus();else trigger.focus();}
    });
  });
  document.addEventListener('click',function(e){
    document.querySelectorAll('.dropdown--open').forEach(d=>{
      if(!d.contains(e.target))d.classList.remove('dropdown--open');
    });
  });
})();

/* ── Theme Switcher ── */
(function(){
  const sel=document.getElementById('theme-select'),link=document.getElementById('theme-stylesheet');
  if(!sel||!link)return;
  function apply(n){link.href='themes/'+n+'.css';localStorage.setItem('cc-theme',n);}
  sel.addEventListener('change',function(){apply(this.value);});
  const s=localStorage.getItem('cc-theme');
  if(s&&s!=='breeze'){sel.value=s;apply(s);}
})();

/* ── Slideshow ── */
(function(){
  document.querySelectorAll('.slideshow').forEach(root=>{
    const track=root.querySelector('.slideshow__track');
    const dots=root.querySelector('.slideshow__dots');
    if(!track||!dots)return;
    let idx=0,timer;
    for(let i=0;i<track.children.length;i++){
      const d=document.createElement('button');
      d.className='slideshow__dot';d.setAttribute('aria-label','Go to slide '+(i+1));
      d.addEventListener('click',()=>go(i));dots.appendChild(d);
    }
    const dotEls=dots.children;
    function go(i){idx=(i+track.children.length)%track.children.length;track.style.transform='translateX(-'+(idx*100)+'%)';Array.from(dotEls).forEach((d,n)=>d.classList.toggle('slideshow__dot--active',n===idx));}
    function adv(){clearTimeout(timer);go(idx+1);timer=setTimeout(adv,4200);}
    const prev=root.querySelector('.slideshow__arrow--prev');
    const next=root.querySelector('.slideshow__arrow--next');
    if(prev)prev.addEventListener('click',()=>{go(idx-1);clearTimeout(timer);timer=setTimeout(adv,5000);});
    if(next)next.addEventListener('click',()=>{go(idx+1);clearTimeout(timer);timer=setTimeout(adv,5000);});
    var prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    go(0);if(!prefersReduced)timer=setTimeout(adv,4200);
    root.addEventListener('keydown',function(e){
      if(e.key==='ArrowLeft'){go(idx-1);clearTimeout(timer);timer=setTimeout(adv,5000);e.preventDefault();}
      if(e.key==='ArrowRight'){go(idx+1);clearTimeout(timer);timer=setTimeout(adv,5000);e.preventDefault();}
    });
    root.setAttribute('tabindex','0');
    var obs=new MutationObserver(function(){if(!document.contains(root)){clearTimeout(timer);obs.disconnect();}});
    obs.observe(root.parentNode,{childList:true});
  });
})();

/* ── Music Player ── */
(function(){
  document.querySelectorAll('.music-player').forEach(player=>{
    const playBtn=player.querySelector('.music-player__play');
    const overlay=player.querySelector('.music-player__overlay-play');
    const currEl=player.querySelector('.music-player__current');
    if(!playBtn)return;
    let playing=false,current=0;
    const dur=parseInt(player.dataset.duration)||242;
    const playSpan=playBtn.querySelector('.ic');
    const overlaySpan=overlay?overlay.querySelector('.ic'):null;
    function fmt(s){return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');}
    function updateIcon(isPlay){
      [playSpan,overlaySpan].forEach(s=>{if(s){s.classList.toggle('ic-play',isPlay);s.classList.toggle('ic-pause',!isPlay);}});
    }
    function tick(){if(!playing)return;if(current>=dur){playing=false;updateIcon(true);current=0;if(currEl)currEl.textContent=fmt(current);return;}current+=1;if(currEl)currEl.textContent=fmt(current);tickTimer=setTimeout(tick,1000);}
    function toggle(){playing=!playing;updateIcon(!playing);if(playing){clearTimeout(tickTimer);tick();}}
    var tickTimer;
    playBtn.addEventListener('click',toggle);
    if(overlay)overlay.addEventListener('click',toggle);
    if(currEl)currEl.textContent=fmt(current);
    var obs=new MutationObserver(function(){if(!document.contains(player)){playing=false;clearTimeout(tickTimer);obs.disconnect();}});
    obs.observe(player.parentNode,{childList:true});
  });
})();

/* ── Tabs ── */
(function(){
  document.querySelectorAll('.tabs').forEach(tabs=>{
    var tabsList=tabs.querySelectorAll('.tabs__tab');
    if(!tabsList.length)return;
    tabsList.forEach(function(t){t.setAttribute('tabindex','-1');t.setAttribute('aria-selected','false');});
    var activeTab=tabs.querySelector('.tabs__tab--active')||tabsList[0];
    activeTab.setAttribute('tabindex','0');activeTab.setAttribute('aria-selected','true');
    var panelContainer=tabs.nextElementSibling||document.getElementById(tabs.dataset.target);
    function activate(tab){
      tabsList.forEach(function(t){t.classList.remove('tabs__tab--active');t.setAttribute('tabindex','-1');t.setAttribute('aria-selected','false');});
      tab.classList.add('tabs__tab--active');tab.setAttribute('tabindex','0');tab.setAttribute('aria-selected','true');tab.focus();
      if(panelContainer){
        panelContainer.querySelectorAll('.tabs__panel').forEach(function(p){p.classList.remove('tabs__panel--active');});
        var panel=document.getElementById('panel-'+tab.dataset.panel);
        if(panel)panel.classList.add('tabs__panel--active');
      }
    }
    tabsList.forEach(function(tab){
      tab.addEventListener('click',function(){activate(tab);});
    });
    tabs.addEventListener('keydown',function(e){
      var items=Array.from(tabsList);
      var idx=items.indexOf(document.activeElement);
      if(idx<0)return;
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
        e.preventDefault();
        var dir=e.key==='ArrowRight'?1:-1;
        var next=(idx+dir+items.length)%items.length;
        activate(items[next]);
      }else if(e.key==='Home'){e.preventDefault();activate(items[0]);}
      else if(e.key==='End'){e.preventDefault();activate(items[items.length-1]);}
    });
  });
})();

/* ── Rating ── */
(function(){
  document.querySelectorAll('.rating').forEach(rating=>{
    const stars=rating.querySelectorAll('.rating__star');
    // .rating__value may be inside .rating or a sibling element after it
    var valEl=rating.querySelector('.rating__value');
    if(!valEl){var n=rating.nextElementSibling;if(n&&n.classList.contains('rating__value'))valEl=n;}
    // Default: 3 stars active (or data-default attribute)
    var defaultVal=parseInt(rating.dataset.default)||3;
    stars.forEach((s,i)=>{if(i>=(5-defaultVal)){s.classList.add('rating__star--active');s.setAttribute('aria-checked','true');}});
    if(valEl)valEl.textContent=defaultVal+' / 5';
    stars.forEach((s,i)=>{
      s.addEventListener('click',function(){
        stars.forEach((st,j)=>{var act=j>=i;st.classList.toggle('rating__star--active',act);st.setAttribute('aria-checked',act?'true':'false');});
        if(valEl)valEl.textContent=(5-i)+' / 5';
      });
    });
    rating.addEventListener('mouseleave',function(){
      if(valEl)valEl.textContent=rating.querySelectorAll('.rating__star--active').length+' / 5';
    });
  });
})();

/* ── Toast ── */
(function(){
  const container=document.getElementById('toast-container')||document.querySelector('.toast-container');
  if(!container)return;
  function dismiss(el){if(el.classList.contains('toast--leaving'))return;el.classList.add('toast--leaving');setTimeout(()=>{if(el.parentNode)el.remove();},260);}
  document.querySelectorAll('[data-msg],[data-toast]').forEach(btn=>{
    btn.addEventListener('click',function(){
      const m=this.dataset.msg||this.dataset.toast,t=this.dataset.type||'info',icCls=t==='success'?'ic-check':t==='error'?'ic-error':'ic-info';
      const toast=document.createElement('div');
      toast.className='toast toast--'+t;
      const icon=document.createElement('span');icon.className='toast__icon';
      icon.innerHTML='<span class="a-icon '+icCls+'"></span>';
      const msg=document.createElement('span');msg.className='toast__msg';msg.textContent=m;
      const close=document.createElement('button');close.className='toast__close';
      close.innerHTML='<span class="a-icon ic-close"></span>';
      toast.appendChild(icon);toast.appendChild(msg);toast.appendChild(close);
      container.appendChild(toast);
      toast.querySelector('.toast__close').addEventListener('click',()=>dismiss(toast));
      if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)setTimeout(()=>dismiss(toast),3500);
    });
  });
})();

/* ── Scroll Spy ── */
(function(){
  document.querySelectorAll('[data-scroll-spy]').forEach(nav=>{
    const links=nav.querySelectorAll('a[href^="#"]');
    const sections=[...document.querySelectorAll('.doc-section,[data-spy-section]')];
    const scroller=document.querySelector('.doc-main,[data-spy-scroller]')||window;

    function updateActive(){
      let current='';
      sections.forEach(sec=>{
        const top=sec.getBoundingClientRect().top;
        if(top<200)current=sec.id;
      });
      links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+current));
    }
    const scrollTarget=scroller===window?document:scroller;
    scrollTarget.addEventListener('scroll',updateActive);

    links.forEach(a=>{
      a.addEventListener('click',function(e){
        e.preventDefault();
        const target=document.getElementById(this.getAttribute('href').slice(1));
        if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
    updateActive();
  });
})();

/* ── Video Gallery Modal ── */
(function(){
  document.querySelectorAll('.video-gallery').forEach(gallery=>{
    const modal=gallery.querySelector('.video-gallery__modal');
    if(!modal)return;
    const frame=modal.querySelector('.video-gallery__frame');
    const close=modal.querySelector('.video-gallery__close');
    var trapOff=function(){};

    function open(url){
      if(frame){
        frame.innerHTML='';
        var iframe=document.createElement('iframe');
        iframe.src=url+'?autoplay=1';
        iframe.allow='autoplay;encrypted-media';
        iframe.allowFullscreen=true;
        iframe.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;border:none';
        frame.appendChild(iframe);
      }
      modal.classList.add('video-modal--open');
      modal.setAttribute('aria-modal','true');
      document.body.style.overflow='hidden';
      trapOff=EXSA.trapFocus(modal);
      if(close)close.focus();
    }
    var onKeydown=function(e){if(e.key==='Escape'&&modal.classList.contains('video-modal--open'))shut();};
    function shut(){
      modal.classList.remove('video-modal--open');
      modal.removeAttribute('aria-modal');
      setTimeout(()=>{if(frame)frame.innerHTML='';},300);
      document.body.style.overflow='';
      trapOff();
    }
    gallery.querySelectorAll('.video-gallery__card').forEach(card=>{
      card.addEventListener('click',function(){
        const url=this.dataset.video;
        if(url)open(url);
      });
    });
    if(close)close.addEventListener('click',shut);
    modal.addEventListener('click',function(e){if(e.target===modal)shut();});
    document.addEventListener('keydown',onKeydown);
  });
})();

/* ── Modal Window ── */
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
      // Focus first focusable element (close button)
      var first=EXSA.getFocusable(modal);
      if(first)first.focus();
    }
    function shut(){
      modal.classList.remove('modal--open');
      modal.removeAttribute('aria-modal');
      document.body.style.overflow='';
      trapOff();
      // Restore focus to trigger
      if(lastFocus)lastFocus.focus();
    }
    var onKeydown=function(e){if(e.key==='Escape'&&modal.classList.contains('modal--open'))shut();};
    if(close)close.addEventListener('click',shut);
    if(cancel)cancel.addEventListener('click',shut);
    if(confirm)confirm.addEventListener('click',shut);
    modal.addEventListener('click',function(e){if(e.target===modal)shut();});
    document.addEventListener('keydown',onKeydown);
    // Wire trigger buttons: any [data-modal-open="modalId"] opens it
    const id=modal.id;
    if(id){
      document.querySelectorAll('[data-modal-open="'+id+'"]').forEach(btn=>{
        btn.addEventListener('click',open);
      });
    }
  });
})();

/* ── Lightbox Gallery ── */
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
      lastFocus=document.activeElement;
      idx=i;
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

/* ── Cookie Consent Bar ── */
(function(){
  document.querySelectorAll('.cookie-bar').forEach(bar=>{
    function hide(){bar.classList.remove('cookie-bar--visible');localStorage.setItem('cc-cookies','accepted');}
    if(!localStorage.getItem('cc-cookies')){setTimeout(()=>bar.classList.add('cookie-bar--visible'),600);}
    const accept=bar.querySelector('.cookie-bar__accept');
    const dismiss=bar.querySelector('.cookie-bar__dismiss');
    if(accept)accept.addEventListener('click',hide);
    if(dismiss)dismiss.addEventListener('click',hide);
    // Trigger buttons (for demo): any [data-cookie-reset]
    document.querySelectorAll('[data-cookie-reset]').forEach(btn=>{
      btn.addEventListener('click',function(){
        localStorage.removeItem('cc-cookies');
        bar.classList.add('cookie-bar--visible');
      });
    });
  });
})();

/* ── Range Slider Value Display ── */
(function(){
  document.querySelectorAll('.range__input').forEach(input=>{
    const valEl=document.getElementById(input.id+'-val');
    if(!valEl)return;
    valEl.id=input.id+'-val';
    input.setAttribute('aria-describedby',valEl.id);
    input.addEventListener('input',()=>{valEl.textContent=input.value;});
  });
})();

/* ── Password Input Toggle ── */
(function(){
  // SVG mirrors components/icons/eye.svg and eye-off.svg — keep in sync
  var eyeOpen='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  var eyeOff='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  document.querySelectorAll('.password-input').forEach(wrapper=>{
    const field=wrapper.querySelector('input');
    const toggle=wrapper.querySelector('.password-input__toggle');
    if(!field||!toggle)return;
    toggle.addEventListener('click',function(){
      const isPass=field.type==='password';
      field.type=isPass?'text':'password';
      toggle.innerHTML=isPass?eyeOff:eyeOpen;
      toggle.setAttribute('aria-pressed',isPass?'true':'false');
    });
    toggle.setAttribute('aria-pressed','false');
  });
})();

/* ── Loading Button Demo ── */
(function(){
  document.querySelectorAll('.btn-loading').forEach(btn=>{
    btn.setAttribute('aria-live','polite');
    btn.addEventListener('click',function(){
      if(this.classList.contains('btn-loading--busy'))return;
      this.classList.add('btn-loading--busy');
      this.setAttribute('aria-busy','true');
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        this.classList.remove('btn-loading--busy');
        this.removeAttribute('aria-busy');
      }else{
        setTimeout(()=>{
          this.classList.remove('btn-loading--busy');
          this.removeAttribute('aria-busy');
        },1800);
      }
    });
  });
})();

/* ── Back to Top ── */
(function(){
  const btn=document.getElementById('back-top-btn')||document.getElementById('back-top');
  if(!btn)return;
  // Use .doc-main if present (showcase mode), otherwise window
  const scroller=document.querySelector('.doc-main')||window;
  scroller.addEventListener('scroll',function(){
    const y=scroller===window?window.scrollY:scroller.scrollTop;
    btn.classList.toggle('back-top--visible',y>300);
  });
  btn.addEventListener('click',function(){
    if(scroller===window){
      window.scrollTo({top:0,behavior:'smooth'});
    }else{
      scroller.scrollTo({top:0,behavior:'smooth'});
    }
  });
})();

/* ── Resizer (drag handle for panels) ── */
(function(){
  document.querySelectorAll('.resizer').forEach(handle=>{
    let startX, startY, startW, startH;
    const target=handle.closest('.resizer__target')||handle.parentElement;
    const dir=handle.classList.contains('resizer--bottom')?'v':'h';

    function onStart(e){
      e.preventDefault();
      handle.classList.add('resizer--active');
      document.body.style.cursor=dir==='v'?'ns-resize':'ew-resize';
      document.body.style.userSelect='none';
      const pt=e.touches?e.touches[0]:e;
      startX=pt.clientX;startY=pt.clientY;
      startW=target.offsetWidth;startH=target.offsetHeight;

      function onMove(e2){
        const pt2=e2.touches?e2.touches[0]:e2;
        if(dir==='v'){target.style.height=(startH+pt2.clientY-startY)+'px';}
        else{const dx=handle.classList.contains('resizer--left')?startX-pt2.clientX:pt2.clientX-startX;target.style.width=(startW+dx)+'px';}
      }
      function onEnd(){
        handle.classList.remove('resizer--active');
        document.body.style.cursor='';document.body.style.userSelect='';
        document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onEnd);
        document.removeEventListener('touchmove',onMove);document.removeEventListener('touchend',onEnd);
      }
      document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onEnd);
      document.addEventListener('touchmove',onMove,{passive:false});document.addEventListener('touchend',onEnd);
    }

    handle.addEventListener('mousedown',onStart);
    handle.addEventListener('touchstart',onStart,{passive:false});
  });
})();

/* ── Topbar (scroll transparency + mobile menu + dropdowns) ── */
(function(){
  document.querySelectorAll('.topbar').forEach(topbar=>{
    const scroller=document.querySelector('.doc-main')||window;

    function onScroll(){
      const y=scroller===window?window.scrollY:scroller.scrollTop;
      topbar.classList.toggle('topbar--scrolled',y>20);
    }
    scroller.addEventListener('scroll',onScroll);
    onScroll();

    // Close all dropdowns helper
    function closeAllDD(){
      topbar.querySelectorAll('.topbar__dropdown--open').forEach(d=>{
        d.classList.remove('topbar__dropdown--open');
        var t=d.querySelector('.topbar__dd-trigger');
        if(t)t.setAttribute('aria-expanded','false');
      });
    }

    // Close dropdowns on window resize (prevents stuck-open state)
    window.addEventListener('resize',closeAllDD);

    // Mobile menu toggle
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

    // Dropdown toggles
    topbar.querySelectorAll('.topbar__dd-trigger').forEach(trigger=>{
      trigger.setAttribute('aria-expanded','false');
      trigger.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        const dd=this.closest('.topbar__dropdown');
        const wasOpen=dd.classList.contains('topbar__dropdown--open');
        closeAllDD();
        if(!wasOpen){dd.classList.add('topbar__dropdown--open');this.setAttribute('aria-expanded','true');}
        else{this.setAttribute('aria-expanded','false');}
      });
    });

    // Close on outside click
    document.addEventListener('click',function(e){
      if(!topbar.contains(e.target)){
        topbar.classList.remove('topbar--open');
        if(toggle)toggle.setAttribute('aria-expanded','false');
        closeAllDD();
      }
    });

    // Close on nav link click
    topbar.querySelectorAll('.topbar__nav a, .topbar__dd-item').forEach(link=>{
      link.addEventListener('click',()=>{
        topbar.classList.remove('topbar--open');
        closeAllDD();
      });
    });
  });
})();

/* ── Date Picker ── */
(function(){
  document.querySelectorAll('.date-picker__wrapper').forEach(wrapper=>{
    const input=wrapper.querySelector('.date-picker__input');
    const cal=wrapper.querySelector('.date-picker');
    if(!input||!cal)return;

    const headerDate=cal.querySelector('.date-picker__header-date');
    const prevBtn=cal.querySelector('.date-picker__nav--prev');
    const nextBtn=cal.querySelector('.date-picker__nav--next');
    const datesEl=cal.querySelector('.date-picker__dates');

    let currentMonth, currentYear, selectedDate=null;
    const months=['January','February','March','April','May','June','July','August','September','October','November','December'];

    function render(month,year){
      datesEl.innerHTML='';
      headerDate.textContent=months[month]+' '+year;
      currentMonth=month; currentYear=year;

      const firstDay=new Date(year,month,1).getDay();
      const daysInMonth=new Date(year,month+1,0).getDate();
      const daysInPrevMonth=new Date(year,month,0).getDate();
      const today=new Date();

      for(let i=firstDay-1;i>=0;i--){
        const btn=document.createElement('button');
        btn.className='date-picker__day date-picker__day--outside';
        btn.textContent=daysInPrevMonth-i;
        btn.addEventListener('click',()=>{prev();});
        datesEl.appendChild(btn);
      }
      for(let d=1;d<=daysInMonth;d++){
        const btn=document.createElement('button');
        btn.className='date-picker__day'; btn.textContent=d;
        const dateLabel=new Date(year,month,d).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
        btn.setAttribute('aria-label',dateLabel);
        const isToday=today.getFullYear()===year&&today.getMonth()===month&&today.getDate()===d;
        const isSelected=selectedDate&&selectedDate.getFullYear()===year&&selectedDate.getMonth()===month&&selectedDate.getDate()===d;
        if(isToday)btn.classList.add('date-picker__day--today');
        if(isSelected)btn.classList.add('date-picker__day--selected');
        btn.addEventListener('click',()=>{
          selectedDate=new Date(year,month,d);
          input.value=selectedDate.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
          render(month,year);
          wrapper.classList.remove('date-picker__wrapper--open');
        });
        datesEl.appendChild(btn);
      }
      const totalCells=firstDay+daysInMonth;
      const remaining=totalCells%7===0?0:7-(totalCells%7);
      for(let d=1;d<=remaining;d++){
        const btn=document.createElement('button');
        btn.className='date-picker__day date-picker__day--outside';
        btn.textContent=d;
        btn.addEventListener('click',()=>{next();});
        datesEl.appendChild(btn);
      }
    }
    function prev(){let m=currentMonth-1,y=currentYear;if(m<0){m=11;y--;}render(m,y);}
    function next(){let m=currentMonth+1,y=currentYear;if(m>11){m=0;y++;}render(m,y);}

    prevBtn.addEventListener('click',prev);
    nextBtn.addEventListener('click',next);

    input.addEventListener('click',(e)=>{
      e.stopPropagation();
      const now=new Date();
      render(now.getMonth(),now.getFullYear());
      wrapper.classList.toggle('date-picker__wrapper--open');
    });
    document.addEventListener('click',(e)=>{
      if(!wrapper.contains(e.target))wrapper.classList.remove('date-picker__wrapper--open');
    });
  });
})();

/* ── Color Picker ── */
(function(){
  document.querySelectorAll('.color-picker').forEach(cp=>{
    const input=cp.querySelector('.color-picker__input');
    const swatch=cp.querySelector('.color-picker__swatch');
    const valueEl=cp.querySelector('.color-picker__value');
    if(!input||!swatch)return;

    input.addEventListener('input',()=>{
      const hex=input.value;
      swatch.style.setProperty('--cp-color',hex);
      if(valueEl)valueEl.textContent=hex;
    });
    swatch.style.setProperty('--cp-color',input.value||'#118bee');
    if(valueEl)valueEl.textContent=input.value||'#118bee';
  });
})();

/* ── Advanced Color Picker ── */
(function(){
  document.querySelectorAll('.ex-cp').forEach(cp=>{
    const trigger=cp.querySelector('.ex-cp__trigger');
    const drop=cp.querySelector('.ex-cp__drop');
    const canvas=cp.querySelector('.ex-cp__canvas');
    const dot=cp.querySelector('.ex-cp__dot');
    const hueSlider=cp.querySelector('.ex-cp__slider--hue');
    const lightSlider=cp.querySelector('.ex-cp__slider--light');
    const alphaSlider=cp.querySelector('.ex-cp__slider--alpha');
    const swatch=cp.querySelector('.ex-cp__hex-swatch');
    const hexInput=cp.querySelector('.ex-cp__hex-input');
    if(!trigger||!drop||!canvas)return;

    let s={h:217,s:91,l:60,a:1},open=false,down=false;

    function hslToRgb(h,s,l){
      h=((h%360)+360)%360;s/=100;l/=100;
      const c=(1-Math.abs(2*l-1))*s,hp=h/60,x=c*(1-Math.abs(hp%2-1)),m=l-c/2;
      let r=0,g=0,b=0;
      if(hp<1){r=c;g=x}else if(hp<2){r=x;g=c}else if(hp<3){g=c;b=x}else if(hp<4){g=x;b=c}else if(hp<5){r=x;b=c}else{r=c;b=x}
      return[Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)];
    }
    function rgbToHex(r,g,b){return'#'+[r,g,b].map(c=>c.toString(16).padStart(2,'0')).join('');}

    function renderCanvas(){
      const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,img=ctx.createImageData(w,h),d=img.data;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const[r,g,b]=hslToRgb(s.h,x/w*100,(1-y/h)*100),i=(y*w+x)*4;
        d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;
      }
      ctx.putImageData(img,0,0);
      dot.style.left=s.s/100*w+'px';dot.style.top=(1-s.l/100)*h+'px';
      const[r,g,b]=hslToRgb(s.h,s.s,s.l);
      if(alphaSlider)alphaSlider.style.setProperty('--ex-cp-accent',`rgb(${r},${g},${b})`);
    }
    function updateUI(){
      const[r,g,b]=hslToRgb(s.h,s.s,s.l),c=`rgba(${r},${g},${b},${s.a})`,h=rgbToHex(r,g,b);
      trigger.style.backgroundImage=`linear-gradient(${c},${c}),linear-gradient(45deg,#ddd 25%,transparent 25%),linear-gradient(-45deg,#ddd 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ddd 75%),linear-gradient(-45deg,transparent 75%,#ddd 75%)`;
      trigger.style.backgroundSize=`100% 100%,8px 8px,8px 8px,8px 8px,8px 8px`;
      trigger.style.backgroundPosition=`0 0,0 0,0 4px,4px -4px,-4px 0`;
      if(swatch)swatch.style.setProperty('--swatch-color',c);
      if(hexInput)hexInput.value=s.a<1?h+Math.round(s.a*255).toString(16).padStart(2,'0'):h;
      dot.style.left=s.s/100*canvas.width+'px';dot.style.top=(1-s.l/100)*canvas.height+'px';
      if(alphaSlider)alphaSlider.style.setProperty('--ex-cp-accent',`rgb(${r},${g},${b})`);
    }
    function toggle(){
      open=!open;drop.classList.toggle('is-open',open);
      if(open){renderCanvas();updateUI();
        const r=cp.getBoundingClientRect(),spaceBelow=window.innerHeight-r.bottom,spaceAbove=r.top;
        drop.classList.toggle('is-down',spaceBelow>230||spaceBelow>spaceAbove);
        drop.classList.toggle('is-up',!(spaceBelow>230||spaceBelow>spaceAbove));
      }
    }
    trigger.addEventListener('click',e=>{e.stopPropagation();toggle();});
    document.addEventListener('click',e=>{if(open&&!cp.contains(e.target))toggle();});

    function pick(e){
      const r=canvas.getBoundingClientRect();
      s.s=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100));
      s.l=Math.max(0,Math.min(100,(1-(e.clientY-r.top)/r.height)*100));
      if(hueSlider)hueSlider.value=Math.round(s.h);
      if(lightSlider)lightSlider.value=Math.round(s.l);
      updateUI();
    }
    canvas.addEventListener('mousedown',e=>{down=true;pick(e);});
    canvas.addEventListener('touchstart',e=>{down=true;e.preventDefault();pick(e.touches[0]);},{passive:false});
    document.addEventListener('mouseup',()=>down=false);
    document.addEventListener('touchend',()=>down=false);
    document.addEventListener('mousemove',e=>{if(down)pick(e);});
    document.addEventListener('touchmove',e=>{if(down){e.preventDefault();pick(e.touches[0]);}},{passive:false});

    if(hueSlider)hueSlider.addEventListener('input',()=>{s.h=+hueSlider.value;renderCanvas();updateUI();});
    if(lightSlider)lightSlider.addEventListener('input',()=>{s.l=+lightSlider.value;renderCanvas();updateUI();});
    if(alphaSlider)alphaSlider.addEventListener('input',()=>{s.a=+alphaSlider.value/100;updateUI();});

    function applyHex(){
      if(!hexInput)return;
      const v=hexInput.value.trim();
      if(!/^#/.test(v))hexInput.value='#'+v;
      const m=hexInput.value.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
      if(!m)return;
      let h=m[1];if(h.length===3)h=h.split('').map(c=>c+c).join('');if(h.length===6)h+='ff';
      const r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16),a=parseInt(h.substr(6,2)||'ff',16)/255;
      const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;
      s.l=(mx+mn)/2/255*100;
      s.s=d?((s.l>50?d/(510-mx-mn):d/(mx+mn)))*100:0;
      s.h=d?(mx===r?((g-b)/d+(g<b?6:0))*60:mx===g?((b-r)/d+2)*60:((r-g)/d+4)*60):0;
      s.a=a;s.h=((s.h%360)+360)%360;
      if(hueSlider)hueSlider.value=Math.round(s.h);
      if(lightSlider)lightSlider.value=Math.round(s.l);
      if(alphaSlider)alphaSlider.value=Math.round(s.a*100);
      renderCanvas();updateUI();
    }
    if(hexInput){
      hexInput.addEventListener('keydown',e=>{if(e.key==='Enter')applyHex();});
      hexInput.addEventListener('blur',applyHex);
    }
    updateUI();
  });
})();

/* ── Sidebar Navigation ── */
(function(){
  document.querySelectorAll('.sidebar__sub > .sidebar__link').forEach(trigger=>{
    trigger.addEventListener('click',function(e){
      e.preventDefault();
      const parent=this.parentElement;
      const wasOpen=parent.classList.contains('sidebar__sub--open');
      parent.parentElement.querySelectorAll('.sidebar__sub--open').forEach(s=>s.classList.remove('sidebar__sub--open'));
      if(!wasOpen)parent.classList.add('sidebar__sub--open');
    });
  });
})();

/* ── Accordion ARIA ── */
(function(){
  document.querySelectorAll('.accordion__trigger').forEach(cb=>{
    const label=cb.nextElementSibling;
    if(label&&label.classList.contains('accordion__label')){
      label.setAttribute('aria-expanded',cb.checked?'true':'false');
      cb.addEventListener('change',function(){
        label.setAttribute('aria-expanded',this.checked?'true':'false');
      });
    }
  });
})();

/* ── Toggle Switch ARIA ── */
(function(){
  document.querySelectorAll('.toggle input[type="checkbox"]').forEach(cb=>{
    cb.setAttribute('role','switch');
    cb.setAttribute('aria-checked',cb.checked?'true':'false');
    cb.addEventListener('change',function(){
      this.setAttribute('aria-checked',this.checked?'true':'false');
    });
  });
})();

/* ── Drawer ARIA + Focus Trap ── */
(function(){
  document.querySelectorAll('.drawer__toggle').forEach(cb=>{
    const label=document.querySelector('label[for="'+cb.id+'"]');
    var trapOff=function(){}, lastFocus=null;

    if(label){
      label.setAttribute('aria-expanded',cb.checked?'true':'false');
    }

    function onOpen(){
      lastFocus=document.activeElement;
      // Focus the close button or first focusable in panel
      var panel=document.querySelector('.drawer__panel');
      if(panel){
        trapOff=EXSA.trapFocus(panel);
        var close=panel.querySelector('.drawer__close');
        if(close)close.focus();
        else{var first=EXSA.getFocusable(panel);if(first)first.focus();}
      }
    }
    function onShut(){
      trapOff();
      if(lastFocus)lastFocus.focus();
    }

    cb.addEventListener('change',function(){
      if(this.checked){
        if(label)label.setAttribute('aria-expanded','true');
        onOpen();
      }else{
        if(label)label.setAttribute('aria-expanded','false');
        onShut();
      }
    });
    // Also close on backdrop click (clicking the backdrop label toggles the checkbox)
    var backdrop=document.querySelector('.drawer__backdrop');
    if(backdrop){
      backdrop.addEventListener('click',function(){
        // The checkbox change event fires naturally from the label click
      });
    }
  });
})();

/* ── Topbar Toggles (RTL) ── */
(function(){
  const rtlBtn=document.getElementById('rtl-toggle-btn');
  if(rtlBtn){
    function setRTL(on){
      document.documentElement.setAttribute('dir',on?'rtl':'ltr');
      localStorage.setItem('exsa-rtl',on?'1':'0');
      rtlBtn.style.background=on?'var(--color-link)':'';
      rtlBtn.style.color=on?'#fff':'';
    }
    rtlBtn.addEventListener('click',function(){
      setRTL(document.documentElement.getAttribute('dir')!=='rtl');
    });
    if(localStorage.getItem('exsa-rtl')==='1')setRTL(true);
  }
})();

/* ── Popover ── */
(function(){
  document.querySelectorAll('.popover').forEach(pop=>{
    const trigger=pop.querySelector('.popover__trigger');
    const content=pop.querySelector('.popover__content');
    if(!trigger||!content)return;
    let open=false;

    // Create backdrop for outside-click dismiss
    const backdrop=document.createElement('div');
    backdrop.className='popover__backdrop';
    pop.appendChild(backdrop);

    function show(){
      // Close other popovers
      document.querySelectorAll('.popover--open').forEach(p=>{if(p!==pop)p.classList.remove('popover--open');});
      pop.classList.add('popover--open');
      open=true;
    }
    function hide(){pop.classList.remove('popover--open');open=false;}

    trigger.addEventListener('click',function(e){e.stopPropagation();open?hide():show();});
    backdrop.addEventListener('click',hide);
    document.addEventListener('click',function(e){if(open&&!pop.contains(e.target))hide();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)hide();});
  });
})();

/* ── Context Menu ── */
(function(){
  document.querySelectorAll('[data-ctx-menu]').forEach(wrapper=>{
    const menu=wrapper.querySelector('.ctx-menu');
    if(!menu)return;

    // Create backdrop for outside-click dismiss
    const backdrop=document.createElement('div');
    backdrop.className='ctx-backdrop';
    document.body.appendChild(backdrop);

    let open=false;

    function show(x,y){
      // Measure menu first
      menu.style.visibility='hidden';
      menu.classList.add('ctx-menu--open');
      const rect=menu.getBoundingClientRect();
      menu.classList.remove('ctx-menu--open');
      menu.style.visibility='';

      // Clamp to viewport
      const vw=window.innerWidth,vh=window.innerHeight;
      if(x+rect.width>vw)x=vw-rect.width-8;
      if(y+rect.height>vh)y=vh-rect.height-8;
      if(x<8)x=8;if(y<8)y=8;

      menu.style.setProperty('--ctx-origin',x<vw/2?'top left':'top right');
      menu.style.left=x+'px';
      menu.style.top=y+'px';
      menu.classList.add('ctx-menu--open');
      backdrop.classList.add('ctx-backdrop--show');
      open=true;
    }

    function hide(){
      menu.classList.remove('ctx-menu--open');
      backdrop.classList.remove('ctx-backdrop--show');
      open=false;
    }

    // Right-click on wrapper or [data-ctx-trigger]
    const trigger=wrapper.querySelector('[data-ctx-trigger]')||wrapper;
    trigger.addEventListener('contextmenu',function(e){
      e.preventDefault();
      // Close any other open menus first
      document.querySelectorAll('.ctx-menu--open').forEach(m=>{
        if(m!==menu){m.classList.remove('ctx-menu--open');}
      });
      show(e.clientX,e.clientY);
    });

    // Click item → hide
    menu.querySelectorAll('.ctx-menu__item').forEach(item=>{
      item.addEventListener('click',function(){
        hide();
      });
    });

    // Outside click → hide
    backdrop.addEventListener('click',hide);
    document.addEventListener('click',function(e){
      if(open&&!wrapper.contains(e.target))hide();
    });

    // Escape key → hide
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&open)hide();
    });

    // Resize → hide (menu may go offscreen)
    window.addEventListener('resize',function(){
      if(open)hide();
    });
  });
})();

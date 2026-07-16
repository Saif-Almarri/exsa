/*!
 * EXSA JS Bundle | Generated 2026-07-15 18:29:56
 * Behaviors: modal, sidebar, topbar, back-top, context-menu, lightbox, music, video-gallery, slideshow, range-slider, color-picker, date-picker, dropdown, password, popover, rating, tabs, resizer, cookie-bar, toast, accordion-aria, drawer-aria, focus-trap, scroll-spy, toggle-aria
 */

(function(){
"use strict";

  /* modal */
  (function(){
    document.querySelectorAll('.modal').forEach(modal=>{
      const close=modal.querySelector('.modal__close');
      const cancel=modal.querySelector('.modal__cancel');
      const confirm=modal.querySelector('.modal__confirm');
      var trapOff=function(){}, lastFocus=null;
  
      function open(){
        lastFocus=document.activeElement;
        modal.classList.add('modal--open');
        document.body.style.overflow='hidden';
        trapOff=EXSA.trapFocus(modal);
        // Focus first focusable element (close button)
        var first=EXSA.getFocusable(modal);
        if(first)first.focus();
      }
      function shut(){
        modal.classList.remove('modal--open');
        document.body.style.overflow='';
        trapOff();
        // Restore focus to trigger
        if(lastFocus)lastFocus.focus();
      }
      if(close)close.addEventListener('click',shut);
      if(cancel)cancel.addEventListener('click',shut);
      if(confirm)confirm.addEventListener('click',shut);
      modal.addEventListener('click',function(e){if(e.target===modal)shut();});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('modal--open'))shut();});
      // Wire trigger buttons: any [data-modal-open="modalId"] opens it
      const id=modal.id;
      if(id){
        document.querySelectorAll('[data-modal-open="'+id+'"]').forEach(btn=>{
          btn.addEventListener('click',open);
        });
      }
    });
  })();

  /* sidebar */
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

  /* topbar */
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
        topbar.querySelectorAll('.topbar__dropdown--open').forEach(d=>d.classList.remove('topbar__dropdown--open'));
      }
  
      // Close dropdowns on window resize (prevents stuck-open state)
      window.addEventListener('resize',closeAllDD);
  
      // Mobile menu toggle
      const toggle=topbar.querySelector('.topbar__toggle');
      if(toggle){
        toggle.addEventListener('click',function(e){
          e.stopPropagation();
          topbar.classList.toggle('topbar--open');
          closeAllDD();
        });
      }
  
      // Dropdown toggles
      topbar.querySelectorAll('.topbar__dd-trigger').forEach(trigger=>{
        trigger.addEventListener('click',function(e){
          e.preventDefault();
          e.stopPropagation();
          const dd=this.closest('.topbar__dropdown');
          const wasOpen=dd.classList.contains('topbar__dropdown--open');
          closeAllDD();
          if(!wasOpen)dd.classList.add('topbar__dropdown--open');
        });
      });
  
      // Close on outside click
      document.addEventListener('click',function(e){
        if(!topbar.contains(e.target)){
          topbar.classList.remove('topbar--open');
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

  /* back-top */
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

  /* context-menu */
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

  /* lightbox */
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
        document.body.style.overflow='hidden';
        trapOff=EXSA.trapFocus(overlay);
        if(close)close.focus();
      }
      function shut(){
        overlay.classList.remove('lightbox--open');
        document.body.style.overflow='';
        trapOff();
        if(lastFocus)lastFocus.focus();
      }
      function go(dir){
        idx=(idx+dir+thumbs.length)%thumbs.length;
        if(img)img.src=thumbs[idx].src;
        if(counter)counter.textContent=(idx+1)+' / '+thumbs.length;
      }
      if(close)close.addEventListener('click',shut);
      if(prev)prev.addEventListener('click',()=>go(-1));
      if(next)next.addEventListener('click',()=>go(1));
      overlay.addEventListener('click',function(e){if(e.target===overlay)shut();});
      document.addEventListener('keydown',function(e){
        if(!overlay.classList.contains('lightbox--open'))return;
        if(e.key==='Escape')shut();
        if(e.key==='ArrowLeft')go(-1);
        if(e.key==='ArrowRight')go(1);
      });
    });
  })();

  /* music */
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
      function tick(){if(!playing)return;if(current>=dur){playing=false;updateIcon(true);current=0;if(currEl)currEl.textContent=fmt(current);return;}current+=1;if(currEl)currEl.textContent=fmt(current);setTimeout(tick,1000);}
      function toggle(){playing=!playing;updateIcon(!playing);if(playing)tick();}
      playBtn.addEventListener('click',toggle);
      if(overlay)overlay.addEventListener('click',toggle);
      if(currEl)currEl.textContent=fmt(current);
    });
  })();

  /* video-gallery */
  (function(){
    document.querySelectorAll('.video-gallery').forEach(gallery=>{
      const modal=gallery.querySelector('.video-gallery__modal');
      if(!modal)return;
      const frame=modal.querySelector('.video-gallery__frame');
      const close=modal.querySelector('.video-gallery__close');
      var trapOff=function(){};
  
      function open(url){
        if(frame)frame.innerHTML='<iframe src="'+url+'?autoplay=1" allow="autoplay;encrypted-media" allowfullscreen></iframe>';
        modal.classList.add('video-modal--open');
        document.body.style.overflow='hidden';
        trapOff=EXSA.trapFocus(modal);
        if(close)close.focus();
      }
      function shut(){
        modal.classList.remove('video-modal--open');
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
      document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('video-modal--open'))shut();});
    });
  })();

  /* slideshow */
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
      go(0);timer=setTimeout(adv,4200);
      root.addEventListener('keydown',function(e){
        if(e.key==='ArrowLeft'){go(idx-1);clearTimeout(timer);timer=setTimeout(adv,5000);e.preventDefault();}
        if(e.key==='ArrowRight'){go(idx+1);clearTimeout(timer);timer=setTimeout(adv,5000);e.preventDefault();}
      });
      root.setAttribute('tabindex','0');
    });
  })();

  /* range-slider */
  (function(){
    document.querySelectorAll('.range__input').forEach(input=>{
      const valEl=document.getElementById(input.id+'-val');
      if(!valEl)return;
      input.addEventListener('input',()=>{valEl.textContent=input.value;});
    });
  })();

  /* color-picker */
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

  /* date-picker */
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

  /* dropdown */
  (function(){
    document.querySelectorAll('.dropdown').forEach(dd=>{
      const trigger=dd.querySelector('.dropdown__trigger');
      if(!trigger)return;
      trigger.addEventListener('click',function(e){
        e.stopPropagation();
        // Close sibling dropdowns
        dd.parentElement.querySelectorAll('.dropdown--open').forEach(d=>{if(d!==dd)d.classList.remove('dropdown--open');});
        dd.classList.toggle('dropdown--open');
      });
    });
    document.addEventListener('click',function(e){
      document.querySelectorAll('.dropdown--open').forEach(d=>{
        if(!d.contains(e.target))d.classList.remove('dropdown--open');
      });
    });
  })();

  /* password */
  (function(){
    const eyeOpen='<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    const eyeOff='<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    document.querySelectorAll('.password-input').forEach(wrapper=>{
      const field=wrapper.querySelector('input');
      const toggle=wrapper.querySelector('.password-input__toggle');
      if(!field||!toggle)return;
      toggle.addEventListener('click',function(){
        const isPass=field.type==='password';
        field.type=isPass?'text':'password';
        toggle.innerHTML=isPass?eyeOff:eyeOpen;
      });
    });
  })();

  /* popover */
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

  /* rating */
  (function(){
    document.querySelectorAll('.rating').forEach(rating=>{
      const stars=rating.querySelectorAll('.rating__star');
      const valEl=rating.querySelector('.rating__value');
      // Default: 3 stars active
      stars.forEach((s,i)=>{if(i>=2)s.classList.add('rating__star--active');});
      stars.forEach((s,i)=>{
        s.addEventListener('click',function(){
          stars.forEach((st,j)=>st.classList.toggle('rating__star--active',j>=i));
          if(valEl)valEl.textContent=(5-i)+' / 5';
        });
      });
      rating.addEventListener('mouseleave',function(){
        if(valEl)valEl.textContent=rating.querySelectorAll('.rating__star--active').length+' / 5';
      });
    });
  })();

  /* tabs */
  (function(){
    document.querySelectorAll('.tabs').forEach(tabs=>{
      // Find the associated panel container (next sibling or via data-target)
      const panelContainer=tabs.nextElementSibling||document.getElementById(tabs.dataset.target);
      if(!panelContainer)return;
      tabs.querySelectorAll('.tabs__tab').forEach(tab=>{
        tab.addEventListener('click',function(){
          tabs.querySelectorAll('.tabs__tab').forEach(t=>t.classList.remove('tabs__tab--active'));
          this.classList.add('tabs__tab--active');
          panelContainer.querySelectorAll('.tabs__panel').forEach(p=>p.classList.remove('tabs__panel--active'));
          const panel=document.getElementById('panel-'+this.dataset.panel);
          if(panel)panel.classList.add('tabs__panel--active');
        });
      });
    });
  })();

  /* resizer */
  (function(){
    document.querySelectorAll('.resizer').forEach(handle=>{
      let startX, startY, startW, startH;
      const target=handle.closest('.resizer__target')||handle.parentElement;
      const dir=handle.classList.contains('resizer--bottom')?'v':'h';
  
      handle.addEventListener('mousedown',function(e){
        e.preventDefault();
        handle.classList.add('resizer--active');
        document.body.style.cursor=dir==='v'?'ns-resize':'ew-resize';
        document.body.style.userSelect='none';
        startX=e.clientX;
        startY=e.clientY;
        startW=target.offsetWidth;
        startH=target.offsetHeight;
  
        function onMove(e){
          if(dir==='v'){
            const dy=e.clientY-startY;
            target.style.height=(startH+dy)+'px';
          }else{
            const dx=handle.classList.contains('resizer--left')
              ?startX-e.clientX
              :e.clientX-startX;
            target.style.width=(startW+dx)+'px';
          }
        }
        function onUp(){
          handle.classList.remove('resizer--active');
          document.body.style.cursor='';
          document.body.style.userSelect='';
          document.removeEventListener('mousemove',onMove);
          document.removeEventListener('mouseup',onUp);
        }
        document.addEventListener('mousemove',onMove);
        document.addEventListener('mouseup',onUp);
      });
    });
  })();

  /* cookie-bar */
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

  /* toast */
  (function(){
    const container=document.getElementById('toast-container')||document.querySelector('.toast-container');
    if(!container)return;
    function dismiss(el){if(el.classList.contains('toast--leaving'))return;el.classList.add('toast--leaving');setTimeout(()=>{if(el.parentNode)el.remove();},260);}
    document.querySelectorAll('[data-msg],[data-toast]').forEach(btn=>{
      btn.addEventListener('click',function(){
        const m=this.dataset.msg||this.dataset.toast,t=this.dataset.type||'info',icCls=t==='success'?'ic-check':t==='error'?'ic-error':'ic-info';
        const toast=document.createElement('div');
        toast.className='toast toast--'+t;
        toast.innerHTML='<span class="toast__icon"><span class="a-icon '+icCls+'"></span></span><span class="toast__msg">'+m+'</span><button class="toast__close"><span class="a-icon ic-close"></span></button>';
        container.appendChild(toast);
        toast.querySelector('.toast__close').addEventListener('click',()=>dismiss(toast));
        setTimeout(()=>dismiss(toast),3500);
      });
    });
  })();

  /* accordion-aria */
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

  /* drawer-aria */
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

  /* focus-trap */
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

  /* scroll-spy */
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

  /* toggle-aria */
  (function(){
    document.querySelectorAll('.toggle input[type="checkbox"]').forEach(cb=>{
      cb.setAttribute('role','switch');
      cb.setAttribute('aria-checked',cb.checked?'true':'false');
      cb.addEventListener('change',function(){
        this.setAttribute('aria-checked',this.checked?'true':'false');
      });
    });
  })();

})();
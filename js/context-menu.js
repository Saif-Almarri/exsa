/* EXSA Context Menu — right-click popup */
(function(){
  document.querySelectorAll('[data-ctx-menu]').forEach(wrapper=>{
    const menu=wrapper.querySelector('.ctx-menu');
    if(!menu)return;

    const backdrop=document.createElement('div');
    backdrop.className='ctx-backdrop';
    document.body.appendChild(backdrop);

    let open=false;

    function show(x,y){
      menu.style.visibility='hidden';
      menu.classList.add('ctx-menu--open');
      const rect=menu.getBoundingClientRect();
      menu.classList.remove('ctx-menu--open');
      menu.style.visibility='';

      const vw=window.innerWidth,vh=window.innerHeight;
      if(x+rect.width>vw)x=vw-rect.width-8;
      if(y+rect.height>vh)y=vh-rect.height-8;
      if(x<8)x=8;if(y<8)y=8;

      menu.style.setProperty('--ctx-origin',x<vw/2?'top left':'top right');
      menu.style.left=x+'px';menu.style.top=y+'px';
      menu.classList.add('ctx-menu--open');
      backdrop.classList.add('ctx-backdrop--show');
      open=true;
    }

    function hide(){
      menu.classList.remove('ctx-menu--open');
      backdrop.classList.remove('ctx-backdrop--show');
      open=false;
    }

    const trigger=wrapper.querySelector('[data-ctx-trigger]')||wrapper;
    trigger.addEventListener('contextmenu',function(e){
      e.preventDefault();
      document.querySelectorAll('.ctx-menu--open').forEach(m=>{if(m!==menu){m.classList.remove('ctx-menu--open');}});
      show(e.clientX,e.clientY);
    });

    menu.querySelectorAll('.ctx-menu__item').forEach(item=>{item.addEventListener('click',()=>{hide();});});

    backdrop.addEventListener('click',hide);
    document.addEventListener('click',function(e){if(open&&!wrapper.contains(e.target))hide();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)hide();});
    window.addEventListener('resize',function(){if(open)hide();});
  });
})();

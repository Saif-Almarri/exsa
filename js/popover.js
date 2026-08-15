/* EXSA Popover — click-triggered floating card */
(function(){
  document.querySelectorAll('.popover').forEach(pop=>{
    const trigger=pop.querySelector('.popover__trigger');
    const content=pop.querySelector('.popover__content');
    if(!trigger||!content)return;
    let open=false;

    const backdrop=document.createElement('div');
    backdrop.className='popover__backdrop';
    pop.appendChild(backdrop);

    function show(){
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

/* EXSA Cookie Bar — consent banner */
(function(){
  document.querySelectorAll('.cookie-bar').forEach(bar=>{
    function hide(){bar.classList.remove('cookie-bar--visible');localStorage.setItem('cc-cookies','accepted');}
    if(!localStorage.getItem('cc-cookies')){setTimeout(()=>bar.classList.add('cookie-bar--visible'),600);}
    const accept=bar.querySelector('.cookie-bar__accept');
    const dismiss=bar.querySelector('.cookie-bar__dismiss');
    if(accept)accept.addEventListener('click',hide);
    if(dismiss)dismiss.addEventListener('click',hide);
    document.querySelectorAll('[data-cookie-reset]').forEach(btn=>{
      btn.addEventListener('click',function(){localStorage.removeItem('cc-cookies');bar.classList.add('cookie-bar--visible');});
    });
  });
})();

/* EXSA RTL Toggle */
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

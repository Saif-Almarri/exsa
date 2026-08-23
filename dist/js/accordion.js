/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Accordion — ARIA sync */
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
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

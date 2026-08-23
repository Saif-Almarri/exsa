/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Toggle — ARIA role + checked sync */
(function(){
  document.querySelectorAll('.toggle input[type="checkbox"]').forEach(cb=>{
    cb.setAttribute('role','switch');
    cb.setAttribute('aria-checked',cb.checked?'true':'false');
    cb.addEventListener('change',function(){
      this.setAttribute('aria-checked',this.checked?'true':'false');
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

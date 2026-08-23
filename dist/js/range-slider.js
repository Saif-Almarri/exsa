/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Range Slider — live value display */
(function(){
  document.querySelectorAll('.range__input').forEach(input=>{
    const valEl=document.getElementById(input.id+'-val');
    if(!valEl)return;
    valEl.id=input.id+'-val';
    input.setAttribute('aria-describedby',valEl.id);
    input.addEventListener('input',()=>{valEl.textContent=input.value;});
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

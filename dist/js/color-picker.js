/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Color Picker — native input swatch sync */
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
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

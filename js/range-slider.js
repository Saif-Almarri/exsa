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

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

/* EXSA Theme Switcher — dynamic CSS swap */
(function(){
  const sel=document.getElementById('theme-select'),link=document.getElementById('theme-stylesheet');
  if(!sel||!link)return;
  function apply(n){link.href='themes/'+n+'.css';localStorage.setItem('cc-theme',n);}
  sel.addEventListener('change',function(){apply(this.value);});
  const s=localStorage.getItem('cc-theme');
  if(s&&s!=='breeze'){sel.value=s;apply(s);}
})();

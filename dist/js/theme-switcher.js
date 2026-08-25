/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Theme Switcher — dynamic CSS swap */
(function(){
  const sel=document.getElementById('theme-select'),link=document.getElementById('theme-stylesheet');
  if(!sel||!link)return;
  /* Resolve the theme file next to the CURRENT stylesheet href — works at any
     page depth (site/*, root, CDN) and preserves the existing cache buster. */
  function apply(n){
    const cur=link.getAttribute('href')||'';
    const q=(cur.match(/[?#].*$/)||[''])[0];
    const base=cur.replace(/[^/?#]*[?#].*$/, '').replace(/[^/?#]*$/, '');
    link.href=base+n+'.css'+q;
    localStorage.setItem('exsa-theme',n);
  }
  sel.addEventListener('change',function(){apply(this.value);});
  /* exsa-theme is the canonical key; cc-theme is read once for migration from older versions */
  const s=localStorage.getItem('exsa-theme')||localStorage.getItem('cc-theme');
  if(s&&s!=='breeze'){sel.value=s;apply(s);}
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

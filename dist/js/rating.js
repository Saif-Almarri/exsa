/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Rating — interactive 5-star widget */
(function(){
  document.querySelectorAll('.rating').forEach(rating=>{
    const stars=rating.querySelectorAll('.rating__star');
    var valEl=rating.querySelector('.rating__value');
    if(!valEl){var n=rating.nextElementSibling;if(n&&n.classList.contains('rating__value'))valEl=n;}
    var defaultVal=parseInt(rating.dataset.default)||3;
    stars.forEach((s,i)=>{if(i>=(5-defaultVal)){s.classList.add('rating__star--active');s.setAttribute('aria-checked','true');}});
    if(valEl)valEl.textContent=defaultVal+' / 5';
    stars.forEach((s,i)=>{
      s.addEventListener('click',function(){
        stars.forEach((st,j)=>{var act=j>=i;st.classList.toggle('rating__star--active',act);st.setAttribute('aria-checked',act?'true':'false');});
        if(valEl)valEl.textContent=(5-i)+' / 5';
      });
    });
    rating.addEventListener('mouseleave',function(){
      if(valEl)valEl.textContent=rating.querySelectorAll('.rating__star--active').length+' / 5';
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

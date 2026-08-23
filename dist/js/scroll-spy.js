/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Scroll Spy — active nav link tracking */
(function(){
  document.querySelectorAll('[data-scroll-spy]').forEach(nav=>{
    const links=nav.querySelectorAll('a[href^="#"]');
    const sections=[...document.querySelectorAll('.doc-section,[data-spy-section]')];
    const scroller=document.querySelector('.doc-main,[data-spy-scroller]')||window;

    function updateActive(){
      let current='';
      sections.forEach(sec=>{const top=sec.getBoundingClientRect().top;if(top<200)current=sec.id;});
      links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+current));
    }
    /* Catch scroll events from ANY scroller (document or nested container) */
    window.addEventListener('scroll',updateActive,true);

    links.forEach(a=>{a.addEventListener('click',function(e){
      e.preventDefault();
      links.forEach(l=>l.classList.remove('active'));
      a.classList.add('active');          /* highlight the clicked link immediately */
      const target=document.getElementById(this.getAttribute('href').slice(1));
      if(target)target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    });});
    updateActive();
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

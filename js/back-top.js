/* EXSA Back to Top — scroll-to-top button */
(function(){
  const btn=document.getElementById('back-top-btn')||document.getElementById('back-top');
  if(!btn)return;
  const scroller=document.querySelector('.doc-main,[data-spy-scroller]');
  window.addEventListener('scroll',function(){
    /* Read whichever container actually scrolls */
    const y=(scroller&&scroller.scrollTop)?scroller.scrollTop:(window.scrollY||document.documentElement.scrollTop||0);
    btn.classList.toggle('back-top--visible',y>300);
  },true);
  btn.addEventListener('click',function(){
    if(scroller&&scroller.scrollTop){scroller.scrollTo({top:0,behavior:'smooth'});}
    else{window.scrollTo({top:0,behavior:'smooth'});}
  });
})();

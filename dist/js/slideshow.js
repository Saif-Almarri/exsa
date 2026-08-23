/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Slideshow — auto-play carousel with dots + arrows + keyboard */
(function(){
  document.querySelectorAll('.slideshow').forEach(root=>{
    const track=root.querySelector('.slideshow__track');
    const dots=root.querySelector('.slideshow__dots');
    if(!track||!dots)return;
    let idx=0,timer;
    for(let i=0;i<track.children.length;i++){
      const d=document.createElement('button');
      d.className='slideshow__dot';d.setAttribute('aria-label','Go to slide '+(i+1));
      d.addEventListener('click',()=>go(i));dots.appendChild(d);
    }
    const dotEls=dots.children;
    function go(i){idx=(i+track.children.length)%track.children.length;track.style.transform='translateX(-'+(idx*100)+'%)';Array.from(dotEls).forEach((d,n)=>d.classList.toggle('slideshow__dot--active',n===idx));}
    function adv(){clearTimeout(timer);go(idx+1);timer=setTimeout(adv,4200);}
    const prev=root.querySelector('.slideshow__arrow--prev');
    const next=root.querySelector('.slideshow__arrow--next');
    if(prev)prev.addEventListener('click',()=>{go(idx-1);clearTimeout(timer);timer=setTimeout(adv,5000);});
    if(next)next.addEventListener('click',()=>{go(idx+1);clearTimeout(timer);timer=setTimeout(adv,5000);});
    var prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    go(0);if(!prefersReduced)timer=setTimeout(adv,4200);
    root.addEventListener('keydown',function(e){
      if(e.key==='ArrowLeft'){go(idx-1);clearTimeout(timer);timer=setTimeout(adv,5000);e.preventDefault();}
      if(e.key==='ArrowRight'){go(idx+1);clearTimeout(timer);timer=setTimeout(adv,5000);e.preventDefault();}
    });
    root.setAttribute('tabindex','0');
    var obs=new MutationObserver(function(){if(!document.contains(root)){clearTimeout(timer);obs.disconnect();}});
    obs.observe(root.parentNode,{childList:true});
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

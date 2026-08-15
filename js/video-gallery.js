/* EXSA Video Gallery — click-to-play modal */
(function(){
  document.querySelectorAll('.video-gallery').forEach(gallery=>{
    const modal=gallery.querySelector('.video-gallery__modal');
    if(!modal)return;
    const frame=modal.querySelector('.video-gallery__frame');
    const close=modal.querySelector('.video-gallery__close');
    var trapOff=function(){};

    function open(url){
      if(frame){
        frame.innerHTML='';
        var iframe=document.createElement('iframe');
        iframe.src=url+'?autoplay=1';
        iframe.allow='autoplay;encrypted-media';
        iframe.allowFullscreen=true;
        iframe.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;border:none';
        frame.appendChild(iframe);
      }
      modal.classList.add('video-modal--open');
      modal.setAttribute('aria-modal','true');
      document.body.style.overflow='hidden';
      trapOff=EXSA.trapFocus(modal);
      if(close)close.focus();
    }
    var onKeydown=function(e){if(e.key==='Escape'&&modal.classList.contains('video-modal--open'))shut();};
    function shut(){
      modal.classList.remove('video-modal--open');
      modal.removeAttribute('aria-modal');
      setTimeout(()=>{if(frame)frame.innerHTML='';},300);
      document.body.style.overflow='';
      trapOff();
    }
    gallery.querySelectorAll('.video-gallery__card').forEach(card=>{
      card.addEventListener('click',function(){
        const url=this.dataset.video;
        if(url)open(url);
      });
    });
    if(close)close.addEventListener('click',shut);
    modal.addEventListener('click',function(e){if(e.target===modal)shut();});
    document.addEventListener('keydown',onKeydown);
  });
})();

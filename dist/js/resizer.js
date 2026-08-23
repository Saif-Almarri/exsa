/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Resizer — drag-to-resize panel handle */
(function(){
  document.querySelectorAll('.resizer').forEach(handle=>{
    let startX, startY, startW, startH;
    const target=handle.closest('.resizer__target')||handle.parentElement;
    const dir=handle.classList.contains('resizer--bottom')?'v':'h';

    function onStart(e){
      e.preventDefault();
      handle.classList.add('resizer--active');
      document.body.style.cursor=dir==='v'?'ns-resize':'ew-resize';
      document.body.style.userSelect='none';
      const pt=e.touches?e.touches[0]:e;
      startX=pt.clientX;startY=pt.clientY;
      startW=target.offsetWidth;startH=target.offsetHeight;

      function onMove(e2){
        const pt2=e2.touches?e2.touches[0]:e2;
        if(dir==='v'){target.style.height=(startH+pt2.clientY-startY)+'px';}
        else{const dx=handle.classList.contains('resizer--left')?startX-pt2.clientX:pt2.clientX-startX;target.style.width=(startW+dx)+'px';}
      }
      function onEnd(){
        handle.classList.remove('resizer--active');
        document.body.style.cursor='';document.body.style.userSelect='';
        document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onEnd);
        document.removeEventListener('touchmove',onMove);document.removeEventListener('touchend',onEnd);
      }
      document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onEnd);
      document.addEventListener('touchmove',onMove,{passive:false});document.addEventListener('touchend',onEnd);
    }
    handle.addEventListener('mousedown',onStart);
    handle.addEventListener('touchstart',onStart,{passive:false});
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

/* EXSA Drawer — ARIA + focus trap */
(function(){
  document.querySelectorAll('.drawer__toggle').forEach(cb=>{
    const label=document.querySelector('label[for="'+cb.id+'"]');
    var trapOff=function(){}, lastFocus=null;

    if(label){label.setAttribute('aria-expanded',cb.checked?'true':'false');}

    function onOpen(){
      lastFocus=document.activeElement;
      var panel=document.querySelector('.drawer__panel');
      if(panel){
        trapOff=EXSA.trapFocus(panel);
        var close=panel.querySelector('.drawer__close');
        if(close)close.focus();
        else{var first=EXSA.getFocusable(panel);if(first)first.focus();}
      }
    }
    function onShut(){trapOff();if(lastFocus)lastFocus.focus();}

    cb.addEventListener('change',function(){
      if(this.checked){
        if(label)label.setAttribute('aria-expanded','true');
        onOpen();
      }else{
        if(label)label.setAttribute('aria-expanded','false');
        onShut();
      }
    });
  });
})();

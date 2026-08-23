/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Dropdown — click toggle + keyboard nav + outside click dismiss */
(function(){
  document.querySelectorAll('.dropdown').forEach(dd=>{
    const trigger=dd.querySelector('.dropdown__trigger');
    const menu=dd.querySelector('.dropdown__menu');
    if(!trigger)return;
    function open(){dd.classList.add('dropdown--open');if(trigger)trigger.setAttribute('aria-expanded','true');}
    function close(){dd.classList.remove('dropdown--open');if(trigger)trigger.setAttribute('aria-expanded','false');}
    function getItems(){return menu?menu.querySelectorAll('.dropdown__item:not([disabled])'):[];}
    trigger.addEventListener('click',function(e){
      e.stopPropagation();
      dd.parentElement.querySelectorAll('.dropdown--open').forEach(d=>{if(d!==dd)d.classList.remove('dropdown--open');});
      dd.classList.toggle('dropdown--open');
    });
    dd.addEventListener('keydown',function(e){
      var items=getItems();var idx=Array.from(items).indexOf(document.activeElement);
      if(e.key==='Enter'||e.key===' '){if(document.activeElement===trigger){e.preventDefault();open();var first=items[0];if(first)first.focus();}else{close();trigger.focus();}}
      else if(e.key==='Escape'){close();trigger.focus();}
      else if(e.key==='ArrowDown'){e.preventDefault();if(idx<0){if(items[0])items[0].focus();}else{if(items[idx+1])items[idx+1].focus();}}
      else if(e.key==='ArrowUp'){e.preventDefault();if(idx>0)items[idx-1].focus();else trigger.focus();}
    });
  });
  document.addEventListener('click',function(e){
    document.querySelectorAll('.dropdown--open').forEach(d=>{
      if(!d.contains(e.target))d.classList.remove('dropdown--open');
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

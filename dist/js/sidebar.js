/* EXSA Sidebar — collapsible sub-menu accordion + icon-rail tray */
/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

(function(){
  var OPEN='sidebar__sub--open';
  var tray=null,current=null;

  function buildTray(){
    var el=document.createElement('div');
    el.className='sidebar__tray';
    var title=document.createElement('div');
    title.className='sidebar__tray-title';
    var menu=document.createElement('ul');
    menu.className='sidebar__sub-menu';
    el.appendChild(title);
    el.appendChild(menu);
    document.body.appendChild(el);
    tray={el:el,title:title,menu:menu};
    tray.el.addEventListener('click',function(e){
      if(e.target.closest('.sidebar__link'))closeTray();
    });
  }

  /* Icon-only rail = the label exists and is hidden (--collapsed,
     --fluid at rail width, or the ≤767px auto rail). Without a
     .sidebar__label span the accordion stays in charge. */
  function isRail(trigger){
    var label=trigger.querySelector('.sidebar__label');
    return label && getComputedStyle(label).display==='none';
  }

  function positionTray(trigger,el){
    var r=trigger.getBoundingClientRect();
    var rtl=getComputedStyle(trigger).direction==='rtl';
    el.style.top='0';
    el.style.left='0';
    var w=el.offsetWidth,h=el.offsetHeight;
    var vw=document.documentElement.clientWidth;
    var vh=document.documentElement.clientHeight;
    var x=rtl?r.left-w-4:r.right+4;
    if(rtl&&x<8)x=r.right+4;
    if(!rtl&&x+w>vw-8)x=r.left-w-4;
    var y=r.top;
    if(y+h>vh-8)y=Math.max(8,vh-h-8);
    el.style.left=x+'px';
    el.style.top=y+'px';
  }

  function openTray(trigger,sub,evt){
    if(!tray)buildTray();
    var label=trigger.querySelector('.sidebar__label');
    tray.title.textContent=label?label.textContent.trim():'';
    tray.menu.innerHTML=sub.innerHTML;
    tray.el.classList.toggle('sidebar__tray--dark',!!trigger.closest('.sidebar--dark'));
    tray.el.classList.add('sidebar__tray--open');
    positionTray(trigger,tray.el);
    current=trigger;
    trigger.setAttribute('aria-expanded','true');
    trigger.parentElement.classList.add(OPEN);
    if(evt&&evt.detail===0){
      var first=tray.menu.querySelector('.sidebar__link');
      if(first)first.focus();
    }
  }

  function closeTray(){
    if(!current)return;
    if(tray)tray.el.classList.remove('sidebar__tray--open');
    current.setAttribute('aria-expanded','false');
    current.parentElement.classList.remove(OPEN);
    current=null;
  }

  document.addEventListener('click',function(e){
    if(!current)return;
    if(e.target.closest('.sidebar__sub > .sidebar__link'))return; /* triggers toggle themselves */
    if(tray&&tray.el.contains(e.target))return;
    closeTray();
  });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape'||!current)return;
    var trigger=current;
    closeTray();
    trigger.focus();
  });
  /* Scroll keeps the tray docked to its item; it closes only when the
     item itself leaves the viewport (capture catches the sidebar's own
     scroll as well as the page's). One delayed re-dock after the last
     scroll event covers smooth-scroll settle and chrome that resizes
     mid-scroll (e.g. a topbar that solidifies). */
  var settleTimer=null;
  function onViewportChange(){
    if(!current)return;
    var r=current.getBoundingClientRect();
    var vh=document.documentElement.clientHeight;
    if(r.bottom<0||r.top>vh)closeTray();
    else positionTray(current,tray.el);
    clearTimeout(settleTimer);
    settleTimer=setTimeout(function(){
      if(!current)return;
      var r2=current.getBoundingClientRect();
      if(r2.bottom<0||r2.top>document.documentElement.clientHeight)closeTray();
      else positionTray(current,tray.el);
    },180);
  }
  window.addEventListener('scroll',onViewportChange,true);
  window.addEventListener('resize',onViewportChange,true);

  document.querySelectorAll('.sidebar__sub > .sidebar__link').forEach(function(trigger){
    trigger.setAttribute('aria-expanded',trigger.parentElement.classList.contains(OPEN)?'true':'false');
    trigger.addEventListener('click',function(e){
      e.preventDefault();
      var parent=this.parentElement;
      var sub=parent.querySelector('.sidebar__sub-menu');
      if(isRail(this)){
        if(!sub)return;
        var same=current===this;
        closeTray();
        if(!same)openTray(this,sub,e);
        return;
      }
      closeTray();
      var wasOpen=parent.classList.contains(OPEN);
      parent.parentElement.querySelectorAll('.'+OPEN).forEach(function(s){
        s.classList.remove(OPEN);
        var t=s.querySelector('.sidebar__link');
        if(t)t.setAttribute('aria-expanded','false');
      });
      if(!wasOpen)parent.classList.add(OPEN);
      this.setAttribute('aria-expanded',wasOpen?'false':'true');
    });
    /* Space activates links in native HTML only when it scrolls — make it click. */
    trigger.addEventListener('keydown',function(e){
      if(e.key===' '){e.preventDefault();this.click();}
    });
  });
})();

}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Tabs — keyboard nav + panel switching */
(function(){
  document.querySelectorAll('.tabs').forEach(tabs=>{
    var tabsList=tabs.querySelectorAll('.tabs__tab');
    if(!tabsList.length)return;
    tabsList.forEach(function(t){t.setAttribute('tabindex','-1');t.setAttribute('aria-selected','false');});
    var activeTab=tabs.querySelector('.tabs__tab--active')||tabsList[0];
    activeTab.setAttribute('tabindex','0');activeTab.setAttribute('aria-selected','true');
    var panelContainer=tabs.nextElementSibling||document.getElementById(tabs.dataset.target);
    function activate(tab){
      tabsList.forEach(function(t){t.classList.remove('tabs__tab--active');t.setAttribute('tabindex','-1');t.setAttribute('aria-selected','false');});
      tab.classList.add('tabs__tab--active');tab.setAttribute('tabindex','0');tab.setAttribute('aria-selected','true');tab.focus();
      if(panelContainer){
        panelContainer.querySelectorAll('.tabs__panel').forEach(function(p){p.classList.remove('tabs__panel--active');});
        var panel=document.getElementById('panel-'+tab.dataset.panel);
        if(panel)panel.classList.add('tabs__panel--active');
      }
    }
    tabsList.forEach(function(tab){tab.addEventListener('click',function(){activate(tab);});});
    tabs.addEventListener('keydown',function(e){
      var items=Array.from(tabsList);var idx=items.indexOf(document.activeElement);
      if(idx<0)return;
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
        e.preventDefault();
        var dir=e.key==='ArrowRight'?1:-1;
        var next=(idx+dir+items.length)%items.length;
        activate(items[next]);
      }else if(e.key==='Home'){e.preventDefault();activate(items[0]);}
      else if(e.key==='End'){e.preventDefault();activate(items[items.length-1]);}
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

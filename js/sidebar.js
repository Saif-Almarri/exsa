/* EXSA Sidebar — collapsible sub-menu accordion */
(function(){
  document.querySelectorAll('.sidebar__sub > .sidebar__link').forEach(trigger=>{
    trigger.addEventListener('click',function(e){
      e.preventDefault();
      const parent=this.parentElement;
      const wasOpen=parent.classList.contains('sidebar__sub--open');
      parent.parentElement.querySelectorAll('.sidebar__sub--open').forEach(s=>s.classList.remove('sidebar__sub--open'));
      if(!wasOpen)parent.classList.add('sidebar__sub--open');
    });
  });
})();

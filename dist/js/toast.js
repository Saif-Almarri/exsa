/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Toast — auto-dismiss notifications */
(function(){
  const container=document.getElementById('toast-container')||document.querySelector('.toast-container');
  if(!container)return;
  function dismiss(el){if(el.classList.contains('toast--leaving'))return;el.classList.add('toast--leaving');setTimeout(()=>{if(el.parentNode)el.remove();},260);}
  document.querySelectorAll('[data-msg],[data-toast]').forEach(btn=>{
    btn.addEventListener('click',function(){
      const m=this.dataset.msg||this.dataset.toast,t=this.dataset.type||'info',icCls=t==='success'?'ic-check':t==='error'?'ic-error':'ic-info';
      const toast=document.createElement('div');
      toast.className='toast toast--'+t;
      const icon=document.createElement('span');icon.className='toast__icon';
      icon.innerHTML='<span class="ic '+icCls+'"></span>';
      const msg=document.createElement('span');msg.className='toast__msg';msg.textContent=m;
      const close=document.createElement('button');close.className='toast__close';
      close.innerHTML='<span class="ic ic-close"></span>';
      toast.appendChild(icon);toast.appendChild(msg);toast.appendChild(close);
      container.appendChild(toast);
      toast.querySelector('.toast__close').addEventListener('click',()=>dismiss(toast));
      if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)setTimeout(()=>dismiss(toast),3500);
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

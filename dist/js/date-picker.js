/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Date Picker — calendar popup */
(function(){
  document.querySelectorAll('.date-picker__wrapper').forEach(wrapper=>{
    const input=wrapper.querySelector('.date-picker__input');
    const cal=wrapper.querySelector('.date-picker');
    if(!input||!cal)return;

    const headerDate=cal.querySelector('.date-picker__header-date');
    const prevBtn=cal.querySelector('.date-picker__nav--prev');
    const nextBtn=cal.querySelector('.date-picker__nav--next');
    const datesEl=cal.querySelector('.date-picker__dates');

    let currentMonth, currentYear, selectedDate=null;
    const months=['January','February','March','April','May','June','July','August','September','October','November','December'];

    function render(month,year){
      datesEl.innerHTML='';
      headerDate.textContent=months[month]+' '+year;
      currentMonth=month; currentYear=year;

      const firstDay=new Date(year,month,1).getDay();
      const daysInMonth=new Date(year,month+1,0).getDate();
      const daysInPrevMonth=new Date(year,month,0).getDate();
      const today=new Date();

      for(let i=firstDay-1;i>=0;i--){
        const btn=document.createElement('button');
        btn.className='date-picker__day date-picker__day--outside';
        btn.textContent=daysInPrevMonth-i;
        btn.addEventListener('click',()=>{prev();});
        datesEl.appendChild(btn);
      }
      for(let d=1;d<=daysInMonth;d++){
        const btn=document.createElement('button');
        btn.className='date-picker__day'; btn.textContent=d;
        btn.setAttribute('aria-label',new Date(year,month,d).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}));
        const isToday=today.getFullYear()===year&&today.getMonth()===month&&today.getDate()===d;
        const isSelected=selectedDate&&selectedDate.getFullYear()===year&&selectedDate.getMonth()===month&&selectedDate.getDate()===d;
        if(isToday)btn.classList.add('date-picker__day--today');
        if(isSelected)btn.classList.add('date-picker__day--selected');
        btn.addEventListener('click',()=>{
          selectedDate=new Date(year,month,d);
          input.value=selectedDate.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
          render(month,year);
          wrapper.classList.remove('date-picker__wrapper--open');
        });
        datesEl.appendChild(btn);
      }
      const totalCells=firstDay+daysInMonth;
      const remaining=totalCells%7===0?0:7-(totalCells%7);
      for(let d=1;d<=remaining;d++){
        const btn=document.createElement('button');
        btn.className='date-picker__day date-picker__day--outside';
        btn.textContent=d;btn.addEventListener('click',()=>{next();});
        datesEl.appendChild(btn);
      }
    }
    function prev(){let m=currentMonth-1,y=currentYear;if(m<0){m=11;y--;}render(m,y);}
    function next(){let m=currentMonth+1,y=currentYear;if(m>11){m=0;y++;}render(m,y);}

    prevBtn.addEventListener('click',prev);
    nextBtn.addEventListener('click',next);

    input.addEventListener('click',(e)=>{
      e.stopPropagation();const now=new Date();
      render(now.getMonth(),now.getFullYear());
      wrapper.classList.toggle('date-picker__wrapper--open');
    });
    document.addEventListener('click',(e)=>{
      if(!wrapper.contains(e.target))wrapper.classList.remove('date-picker__wrapper--open');
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

/* EXSA Music Player — play/pause with elapsed time */
(function(){
  document.querySelectorAll('.music-player').forEach(player=>{
    const playBtn=player.querySelector('.music-player__play');
    const overlay=player.querySelector('.music-player__overlay-play');
    const currEl=player.querySelector('.music-player__current');
    if(!playBtn)return;
    let playing=false,current=0;
    const dur=parseInt(player.dataset.duration)||242;
    const playSpan=playBtn.querySelector('.ic');
    const overlaySpan=overlay?overlay.querySelector('.ic'):null;
    function fmt(s){return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');}
    function updateIcon(isPlay){
      [playSpan,overlaySpan].forEach(s=>{if(s){s.classList.toggle('ic-play',isPlay);s.classList.toggle('ic-pause',!isPlay);}});
    }
    function tick(){if(!playing)return;if(current>=dur){playing=false;updateIcon(true);current=0;if(currEl)currEl.textContent=fmt(current);return;}current+=1;if(currEl)currEl.textContent=fmt(current);tickTimer=setTimeout(tick,1000);}
    function toggle(){playing=!playing;updateIcon(!playing);if(playing){clearTimeout(tickTimer);tick();}}
    var tickTimer;
    playBtn.addEventListener('click',toggle);
    if(overlay)overlay.addEventListener('click',toggle);
    if(currEl)currEl.textContent=fmt(current);
    var obs=new MutationObserver(function(){if(!document.contains(player)){playing=false;clearTimeout(tickTimer);obs.disconnect();}});
    obs.observe(player.parentNode,{childList:true});
  });
})();

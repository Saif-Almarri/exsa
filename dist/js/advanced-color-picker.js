/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Advanced Color Picker — HSL+Alpha canvas */
(function(){
  document.querySelectorAll('.ex-cp').forEach(cp=>{
    const trigger=cp.querySelector('.ex-cp__trigger');
    const drop=cp.querySelector('.ex-cp__drop');
    const canvas=cp.querySelector('.ex-cp__canvas');
    const dot=cp.querySelector('.ex-cp__dot');
    const hueSlider=cp.querySelector('.ex-cp__slider--hue');
    const lightSlider=cp.querySelector('.ex-cp__slider--light');
    const alphaSlider=cp.querySelector('.ex-cp__slider--alpha');
    const swatch=cp.querySelector('.ex-cp__hex-swatch');
    const hexInput=cp.querySelector('.ex-cp__hex-input');
    if(!trigger||!drop||!canvas)return;

    let s={h:217,s:91,l:60,a:1},open=false,down=false;

    function hslToRgb(h,s,l){
      h=((h%360)+360)%360;s/=100;l/=100;
      const c=(1-Math.abs(2*l-1))*s,hp=h/60,x=c*(1-Math.abs(hp%2-1)),m=l-c/2;
      let r=0,g=0,b=0;
      if(hp<1){r=c;g=x}else if(hp<2){r=x;g=c}else if(hp<3){g=c;b=x}else if(hp<4){g=x;b=c}else if(hp<5){r=x;b=c}else{r=c;b=x}
      return[Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)];
    }
    function rgbToHex(r,g,b){return'#'+[r,g,b].map(c=>c.toString(16).padStart(2,'0')).join('');}

    function renderCanvas(){
      const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,img=ctx.createImageData(w,h),d=img.data;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const[r,g,b]=hslToRgb(s.h,x/w*100,(1-y/h)*100),i=(y*w+x)*4;
        d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;
      }
      ctx.putImageData(img,0,0);
      dot.style.left=s.s/100*w+'px';dot.style.top=(1-s.l/100)*h+'px';
      const[r,g,b]=hslToRgb(s.h,s.s,s.l);
      if(alphaSlider)alphaSlider.style.setProperty('--ex-cp-accent',`rgb(${r},${g},${b})`);
    }
    function updateUI(){
      const[r,g,b]=hslToRgb(s.h,s.s,s.l),c=`rgba(${r},${g},${b},${s.a})`,h=rgbToHex(r,g,b);
      trigger.style.backgroundImage=`linear-gradient(${c},${c}),linear-gradient(45deg,#ddd 25%,transparent 25%),linear-gradient(-45deg,#ddd 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ddd 75%),linear-gradient(-45deg,transparent 75%,#ddd 75%)`;
      trigger.style.backgroundSize=`100% 100%,8px 8px,8px 8px,8px 8px,8px 8px`;
      trigger.style.backgroundPosition=`0 0,0 0,0 4px,4px -4px,-4px 0`;
      if(swatch)swatch.style.setProperty('--swatch-color',c);
      if(hexInput)hexInput.value=s.a<1?h+Math.round(s.a*255).toString(16).padStart(2,'0'):h;
      dot.style.left=s.s/100*canvas.width+'px';dot.style.top=(1-s.l/100)*canvas.height+'px';
      if(alphaSlider)alphaSlider.style.setProperty('--ex-cp-accent',`rgb(${r},${g},${b})`);
    }
    function toggle(){
      open=!open;drop.classList.toggle('is-open',open);
      if(open){renderCanvas();updateUI();
        const r=cp.getBoundingClientRect(),spaceBelow=window.innerHeight-r.bottom,spaceAbove=r.top;
        drop.classList.toggle('is-down',spaceBelow>230||spaceBelow>spaceAbove);
        drop.classList.toggle('is-up',!(spaceBelow>230||spaceBelow>spaceAbove));
      }
    }
    trigger.addEventListener('click',e=>{e.stopPropagation();toggle();});
    document.addEventListener('click',e=>{if(open&&!cp.contains(e.target))toggle();});

    function pick(e){
      const r=canvas.getBoundingClientRect();
      s.s=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100));
      s.l=Math.max(0,Math.min(100,(1-(e.clientY-r.top)/r.height)*100));
      if(hueSlider)hueSlider.value=Math.round(s.h);if(lightSlider)lightSlider.value=Math.round(s.l);
      updateUI();
    }
    canvas.addEventListener('mousedown',e=>{down=true;pick(e);});
    canvas.addEventListener('touchstart',e=>{down=true;e.preventDefault();pick(e.touches[0]);},{passive:false});
    document.addEventListener('mouseup',()=>down=false);
    document.addEventListener('touchend',()=>down=false);
    document.addEventListener('mousemove',e=>{if(down)pick(e);});
    document.addEventListener('touchmove',e=>{if(down){e.preventDefault();pick(e.touches[0]);}},{passive:false});

    if(hueSlider)hueSlider.addEventListener('input',()=>{s.h=+hueSlider.value;renderCanvas();updateUI();});
    if(lightSlider)lightSlider.addEventListener('input',()=>{s.l=+lightSlider.value;renderCanvas();updateUI();});
    if(alphaSlider)alphaSlider.addEventListener('input',()=>{s.a=+alphaSlider.value/100;updateUI();});

    function applyHex(){
      if(!hexInput)return;
      const v=hexInput.value.trim();if(!/^#/.test(v))hexInput.value='#'+v;
      const m=hexInput.value.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
      if(!m)return;
      let h=m[1];if(h.length===3)h=h.split('').map(c=>c+c).join('');if(h.length===6)h+='ff';
      const r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16),a=parseInt(h.substr(6,2)||'ff',16)/255;
      const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;
      s.l=(mx+mn)/2/255*100;
      s.s=d?((s.l>50?d/(510-mx-mn):d/(mx+mn)))*100:0;
      s.h=d?(mx===r?((g-b)/d+(g<b?6:0))*60:mx===g?((b-r)/d+2)*60:((r-g)/d+4)*60):0;
      s.a=a;s.h=((s.h%360)+360)%360;
      if(hueSlider)hueSlider.value=Math.round(s.h);
      if(lightSlider)lightSlider.value=Math.round(s.l);
      if(alphaSlider)alphaSlider.value=Math.round(s.a*100);
      renderCanvas();updateUI();
    }
    if(hexInput){
      hexInput.addEventListener('keydown',e=>{if(e.key==='Enter')applyHex();});
      hexInput.addEventListener('blur',applyHex);
    }
    /* Eyedropper — pick a color from anywhere on screen (EyeDropper API) */
    const eyedrop=cp.querySelector('.ex-cp__eyedrop');
    if(eyedrop){
      if(window.EyeDropper){
        const eyeDropper=new EyeDropper();
        let picking=false;
        eyedrop.addEventListener('click',async()=>{
          if(picking)return;           /* guard: one magnifier session at a time */
          picking=true;
          let picked=false;
          try{
            const res=await eyeDropper.open();
            if(res&&res.sRGBHex&&hexInput){
              hexInput.value=res.sRGBHex;
              applyHex();
              picked=true;
            }
          }catch(e){/* cancelled (Escape) or already in use */}
          picking=false;
          if(picked&&open)toggle();    /* stop — close the dropdown after a successful pick */
        });
      }else{
        eyedrop.style.display='none';
      }
    }
    updateUI();
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();

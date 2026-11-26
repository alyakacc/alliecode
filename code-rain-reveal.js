/* Hero code rain: isolated, dependency-free canvas effect. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero-v2');
  const photo = hero?.querySelector('.hero-photo');
  const card = photo?.querySelector('.ph-card');
  const img = card?.querySelector('img');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!hero || !photo || !card || !img || motion.matches) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.className = 'code-rain-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const matrix = document.createElement('canvas');
  const mx = matrix.getContext('2d');
  if (!mx) return;
  matrix.className = 'code-rain-matrix';
  matrix.setAttribute('aria-hidden','true');
  const style = document.createElement('style');
  style.textContent = '.hero-v2>.code-rain-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}.hero-v2.code-rain-active .hero-text,.hero-v2.code-rain-active .hero-photo{z-index:1}.hero-v2.code-rain-active .hero-text{position:relative}.hero-v2.code-rain-active .hero-photo{animation:none!important;opacity:1!important;translate:none!important;transform:none!important}.hero-v2.code-rain-active .ph-card{animation:none!important}.hero-v2 .code-rain-matrix{position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;pointer-events:none;z-index:3}.hero-v2.code-rain-revealing .ph-card{opacity:var(--code-rain-card,0)}.hero-v2.code-rain-revealing .ph-card>img{opacity:var(--code-rain-image,0);mask-image:linear-gradient(to bottom,#000 0%,#000 var(--code-rain-edge,0%),transparent var(--code-rain-clip,0%),transparent 100%)}.hero-v2.code-rain-revealing .photo-emoji-badge,.hero-v2.code-rain-revealing .ph-cap,.hero-v2.code-rain-revealing .ph-glow{opacity:var(--code-rain-detail,0)}';
  const glyphs = ['0','1','{','}','</>','=>','*','#','const','return',';'];
  const colors = ['#F5EBD6','#E13B5A','#ffffff'];
  const rand = (a,b) => a + Math.random()*(b-a);
  const glyph = () => glyphs[Math.floor(Math.random()*glyphs.length)];
  let w=0,h=0,columns=[],drift=[],frame=0,start=0,last=0,stopped=false,visible=true,observer,bitmap=null;
  const sample = () => {
    if (!img.complete || !img.naturalWidth) return;
    try {
      const off = document.createElement('canvas');
      off.width=48; off.height=64;
      const c=off.getContext('2d',{willReadFrequently:true});
      if (!c) return;
      const ratio=Math.max(48/img.naturalWidth,64/img.naturalHeight);
      const sw=img.naturalWidth*ratio,sh=img.naturalHeight*ratio;
      c.drawImage(img,(48-sw)*.5,(64-sh)*.22,sw,sh);
      bitmap=c.getImageData(0,0,48,64).data;
    } catch (_) { bitmap=null; }
  };
  function resize(){
    w=hero.clientWidth; h=hero.clientHeight;
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.round(w*dpr)); canvas.height=Math.max(1,Math.round(h*dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const mobile=innerWidth<=640, gap=mobile?38:25;
    columns=Array.from({length:Math.ceil(w/gap)},(_,i)=>({x:i*gap+rand(0,8),y:rand(-h,0),speed:rand(250,800),size:rand(11,14),alpha:rand(.12,.35),color:colors[i%3],chars:Array.from({length:mobile?5:8},glyph)}));
    drift=Array.from({length:mobile?18:25},(_,i)=>({x:rand(0,w),y:rand(0,h),speed:rand(12,27),alpha:i%9===0?.35:rand(.18,.28),char:glyph(),color:colors[Math.floor(rand(0,3))]}));
    matrix.width=Math.max(1,Math.round(card.clientWidth*dpr));matrix.height=Math.max(1,Math.round(card.clientHeight*dpr));mx.setTransform(dpr,0,0,dpr,0,0);
  }
  function finish(){
    hero.classList.remove('code-rain-revealing');
    hero.style.removeProperty('--code-rain-clip');
    hero.style.removeProperty('--code-rain-detail');
    hero.style.removeProperty('--code-rain-card');hero.style.removeProperty('--code-rain-image');hero.style.removeProperty('--code-rain-edge');matrix.remove();
  }
  function cleanup(){
    stopped=true; cancelAnimationFrame(frame); finish();
    hero.classList.remove('code-rain-active'); canvas.remove(); style.remove();
    removeEventListener('resize',resize); removeEventListener('pagehide',cleanup);
    document.removeEventListener('visibilitychange',visibility);
    motion.removeEventListener?.('change',changeMotion);
    img.removeEventListener('load',sample); observer?.disconnect();
  }
  function changeMotion(e){if(e.matches)cleanup();}
  function visibility(){last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();}
  function schedule(){if(!stopped&&!frame&&!document.hidden&&visible)frame=requestAnimationFrame(draw);}
  function draw(now){
    frame=0;
    if(stopped||!hero.isConnected){cleanup();return;}
    if(!start)start=now;
    const t=(now-start)/1000,dt=last?Math.min((now-last)/1000,.05):0;last=now;
    ctx.clearRect(0,0,w,h);
    ctx.textBaseline='top';
    const fade=Math.max(0,Math.min(1,(1.8-t)/1.2));
    const idle=Math.max(0,Math.min(1,(t-1.2)/.6));
    ctx.font='12px monospace';
    for(const d of drift){d.y+=d.speed*dt;if(d.y>h+16)d.y=-16;ctx.globalAlpha=d.alpha*idle;ctx.fillStyle=d.color;ctx.fillText(d.char,d.x,d.y);}
    if(t<1.8){
      for(const col of columns){
        col.y+=col.speed*dt;if(col.y>h+150)col.y=-rand(40,180);
        ctx.font=col.size+'px monospace';ctx.fillStyle=col.color;
        col.chars.forEach((ch,j)=>{ctx.globalAlpha=col.alpha*fade*(1-j/col.chars.length);ctx.fillText(ch,col.x,col.y-j*18);});
      }
      const p=Math.max(0,Math.min(1,(t-.4)/1.4));
      const x=0,y=0,cw=card.clientWidth,ch=card.clientHeight;
      mx.clearRect(0,0,cw,ch);
      hero.style.setProperty('--code-rain-card',String(Math.min(1,p*4)));
      hero.style.setProperty('--code-rain-image',String(Math.min(1,p*5)));
      hero.style.setProperty('--code-rain-edge',Math.max(0,Math.min(100,p*112-12))+'%');
      hero.style.setProperty('--code-rain-clip',Math.min(100,p*112)+'%');
      hero.style.setProperty('--code-rain-detail',String(Math.max(0,(p-.7)/.3)));
      if(t>=.4&&cw>0&&ch>0){
        mx.save();mx.beginPath();mx.rect(x,y,cw,ch);mx.clip();
        const step=innerWidth<=640?13:11;
        mx.font='11px monospace';
        for(let yy=Math.floor(ch*p/step)*step;yy<ch;yy+=step){
          for(let xx=0;xx<cw;xx+=step){
            const ix=Math.min(47,Math.floor(xx/cw*48)),iy=Math.min(63,Math.floor(yy/ch*64)),i=(iy*48+ix)*4;
            const lum=bitmap?(bitmap[i]*.2126+bitmap[i+1]*.7152+bitmap[i+2]*.0722)/255:.4;
            mx.globalAlpha=(.10+lum*.65)*Math.min(1,(t-.4)*4)*fade;
            mx.fillStyle=lum>.55?colors[0]:colors[1];
            mx.fillText(glyphs[(ix*7+iy*3)%glyphs.length],x+xx,y+yy);
          }
        }
        const sy=y+ch*p,grad=mx.createLinearGradient(0,sy-18,0,sy+18);
        grad.addColorStop(0,'transparent');grad.addColorStop(.5,'rgba(225,59,90,.7)');grad.addColorStop(1,'transparent');
        mx.globalAlpha=fade;mx.fillStyle=grad;mx.fillRect(x,sy-18,cw,36);mx.restore();
      }
    }else{
      if(hero.classList.contains('code-rain-revealing'))finish();
    }
    ctx.globalAlpha=1;schedule();
  }
  photo.classList.remove('hb-rise');
  document.head.append(style);hero.prepend(canvas);card.append(matrix);
  hero.classList.add('code-rain-active','code-rain-revealing');
  sample();img.addEventListener('load',sample,{once:true});
  resize();addEventListener('resize',resize,{passive:true});
  addEventListener('pagehide',cleanup,{once:true});
  document.addEventListener('visibilitychange',visibility);
  motion.addEventListener?.('change',changeMotion);
  if('IntersectionObserver' in window){observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;last=0;if(!visible){cancelAnimationFrame(frame);frame=0;}else schedule();});observer.observe(hero);}
  schedule();
})();

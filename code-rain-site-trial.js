/* Experimental site-wide ambient code rain; hero remains independent. */
(() => {
  'use strict';
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches)return;
  const hero=document.querySelector('.hero-v2');
  const layer=document.createElement('canvas');
  const ctx=layer.getContext('2d');
  if(!ctx)return;
  layer.setAttribute('aria-hidden','true');
  layer.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0';
  document.body.prepend(layer);
  const glyphs=['0','1','{','}','</>','=>','*','#','const','return',';'];
  const colors=['#F5EBD6','#E13B5A','#ffffff'];
  const rand=(a,b)=>a+Math.random()*(b-a);
  let w,h,particles=[],frame=0,last=0,stopped=false;
  function resize(){
    w=innerWidth;h=innerHeight;
    const dpr=Math.min(devicePixelRatio||1,1.5);
    layer.width=Math.round(w*dpr);layer.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    particles=Array.from({length:w<=640?18:32},(_,i)=>({
      x:rand(0,Math.max(1,w-40)),y:rand(0,h),speed:rand(12,27),
      alpha:i%9===0?.26:rand(.12,.22),
      char:glyphs[Math.floor(rand(0,glyphs.length))],color:colors[i%3]
    }));
  }
  function schedule(){if(!stopped&&!frame&&!document.hidden)frame=requestAnimationFrame(draw);}
  function draw(now){
    frame=0;
    const dt=last?Math.min((now-last)/1000,.05):0;last=now;
    ctx.clearRect(0,0,w,h);
    const top=Math.max(0,Math.min(h,hero?.getBoundingClientRect().bottom||0));
    ctx.save();ctx.beginPath();ctx.rect(0,top,w,h-top);ctx.clip();
    ctx.font='12px monospace';ctx.textBaseline='top';
    for(const p of particles){
      p.y+=p.speed*dt;if(p.y>h+16){p.y=-16;p.x=rand(0,Math.max(1,w-40));}
      ctx.globalAlpha=p.alpha;ctx.fillStyle=p.color;ctx.fillText(p.char,p.x,p.y);
    }
    ctx.restore();schedule();
  }
  function visibility(){last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();}
  function cleanup(){stopped=true;cancelAnimationFrame(frame);layer.remove();removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);motion.removeEventListener?.('change',changeMotion);}
  function changeMotion(e){if(e.matches)cleanup();}
  resize();addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',visibility);
  motion.addEventListener?.('change',changeMotion);
  addEventListener('pagehide',cleanup,{once:true});schedule();
})();

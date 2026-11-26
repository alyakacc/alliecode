/* Experimental scroll-triggered code reveal for existing cards. */
(() => {
  'use strict';
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches||!('IntersectionObserver' in window))return;
  const selector='.hero-rows .hr,.route,.fact,.step,.faq-list details,.quiz-cta,.quiz-box,.q-card,.ab-ava,.final-card,.rv,.page,.cert,.guar li';
  const glyphs=['0','1','{','}','</>','=>','*','#','const','return',';'];
  const active=new Map(),seen=new WeakSet();
  let raf=0,stopped=false;
  const style=document.createElement('style');
  style.textContent='.code-card-reveal{position:relative}.code-card-reveal>.code-card-canvas{position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;pointer-events:none;z-index:8}.code-card-reveal.code-card-running{animation:none!important;transition:none!important;opacity:var(--code-card-opacity,1)!important}.code-card-reveal.code-card-running.rv-up{transform:none!important}.code-card-reveal.code-card-running.hb-rise{translate:none!important}';
  document.head.append(style);
  function finish(el){
    const a=active.get(el);if(!a)return;
    a.canvas.remove();el.classList.remove('code-card-running','code-card-reveal');el.style.removeProperty('--code-card-opacity');active.delete(el);
  }
  function draw(now){
    raf=0;
    for(const [el,a] of active){
      if(!el.isConnected||!el.getClientRects().length){finish(el);continue;}
      const p=Math.min(1,(now-a.start)/a.duration);
      if(p>=1){finish(el);continue;}
      const ease=p*p*(3-2*p),ctx=a.ctx;
      if(!a.hero){
        el.style.setProperty('--code-card-opacity',String(.55+.45*ease));
        ctx.clearRect(0,0,a.w,a.h);
        const edge=a.h*ease, band=Math.max(45,a.h*.35);
        const glass=ctx.createLinearGradient(0,edge-band,0,edge+band);
        glass.addColorStop(0,'rgba(245,235,214,0)');glass.addColorStop(.38,'rgba(245,235,214,.035)');glass.addColorStop(.5,'rgba(255,255,255,.17)');glass.addColorStop(.62,'rgba(225,59,90,.065)');glass.addColorStop(1,'rgba(245,235,214,0)');
        ctx.globalAlpha=Math.sin(Math.PI*p);ctx.fillStyle=glass;ctx.fillRect(0,0,a.w,a.h);ctx.globalAlpha=1;
        continue;
      }
      el.style.setProperty('--code-card-opacity',String(.32+.68*ease));
      ctx.clearRect(0,0,a.w,a.h);
      const edge=a.h*ease;
      ctx.fillStyle='rgba(14,2,8,'+(.72*(1-ease))+')';ctx.fillRect(0,edge,a.w,a.h-edge);
      ctx.font='12px monospace';ctx.textBaseline='top';
      for(const c of a.cells){
        if(c.y+14<edge)continue;
        ctx.globalAlpha=c.alpha*(1-ease);
        ctx.fillStyle=c.color;ctx.fillText(glyphs[(c.i+Math.floor(p*9))%glyphs.length],c.x,c.y);
      }
      const g=ctx.createLinearGradient(0,edge-12,0,edge+12);
      g.addColorStop(0,'transparent');g.addColorStop(.5,'rgba(225,59,90,.48)');g.addColorStop(1,'transparent');
      ctx.globalAlpha=1-ease;ctx.fillStyle=g;ctx.fillRect(0,edge-12,a.w,24);ctx.globalAlpha=1;
    }
    if(active.size&&!stopped)raf=requestAnimationFrame(draw);
  }
  function begin(el){
    if(seen.has(el)||stopped)return;
    const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
    seen.add(el);observer.unobserve(el);
    if(!el.closest('.hero-v2')||el.matches('.hero-rows .hr')){
      if(el.classList.contains('rv-up'))el.classList.add('in');
      const delay=Array.from(el.parentElement.children).filter(n=>n.matches(selector)).indexOf(el)%3*70+80;
      if(typeof el.animate==='function'){
        const animation=el.animate([{opacity:0,translate:'0 22px'},{opacity:1,translate:'0 0px'}],{duration:650,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
        const stop=()=>animation.cancel();
        motion.addEventListener?.('change',stop,{once:true});
        animation.finished.catch(()=>{}).finally(()=>motion.removeEventListener?.('change',stop));
      }
      return;
    }
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
    const dpr=Math.min(devicePixelRatio||1,2),step=innerWidth<=640?30:23;
    canvas.width=Math.ceil(w*dpr);canvas.height=Math.ceil(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    canvas.className='code-card-canvas';canvas.setAttribute('aria-hidden','true');
    const hero=!!el.closest('.hero-v2');
    const cells=[];
    if(hero)for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step)cells.push({x:x+Math.random()*5,y,i:Math.floor(Math.random()*glyphs.length),alpha:.25+Math.random()*.45,color:Math.random()<.3?'#E13B5A':'#F5EBD6'});
    el.classList.remove('hb-rise');if(el.classList.contains('rv-up'))el.classList.add('in');
    el.classList.add('code-card-reveal','code-card-running');el.style.setProperty('--code-card-opacity',hero?'.32':'.55');el.append(canvas);
    active.set(el,{canvas,ctx,w,h,cells,hero,start:performance.now(),duration:hero?850:780});
    if(!raf)raf=requestAnimationFrame(draw);
  }
  const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)begin(e.target);},{threshold:0,rootMargin:'0px 0px -24px 0px'});
  function scan(){document.querySelectorAll(selector).forEach(el=>{if(!seen.has(el)&&!el.closest('[hidden]'))observer.observe(el);});}
  const mutations=new MutationObserver(records=>{if(records.some(r=>r.type==='attributes'||Array.from(r.addedNodes).some(n=>n.nodeType===1&&!n.classList.contains('code-card-canvas'))))scan();});
  function clear(){cancelAnimationFrame(raf);raf=0;for(const el of active.keys())finish(el);}
  function cleanup(){stopped=true;clear();observer.disconnect();mutations.disconnect();style.remove();removeEventListener('resize',clear);removeEventListener('pagehide',cleanup);motion.removeEventListener?.('change',change);}
  function change(e){if(e.matches)cleanup();}
  scan();mutations.observe(document.querySelector('main')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  addEventListener('resize',clear,{passive:true});addEventListener('pagehide',cleanup,{once:true});motion.addEventListener?.('change',change);
})();

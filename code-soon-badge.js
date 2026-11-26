/* Static code-matrix SOON badge, revealed once per card. */
(() => {
  'use strict';
  const ns='http://www.w3.org/2000/svg';
  const letters=[
    ['11111','10000','10000','11111','00001','00001','11111'],
    ['01110','10001','10001','10001','10001','10001','01110'],
    ['01110','10001','10001','10001','10001','10001','01110'],
    ['10001','11001','11001','10101','10011','10011','10001']
  ];
  const glyphs=['0','1','{','}','</>','=>','*','#','const',';'];
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const style=document.createElement('style');
  style.textContent=`
    #r-app .body,#r-pr .body{position:relative;min-height:300px;display:flex;flex-direction:column}
    #r-app .soon-stage,#r-pr .soon-stage{position:relative;display:grid;place-items:center;flex:1 1 auto;min-height:220px;order:-1}
    #r-app .body .foot,#r-pr .body .foot{position:relative;z-index:2}
    .code-soon-badge{inset:auto;transform:none;width:104px;height:100%;max-height:254px;position:relative;display:block;pointer-events:none;z-index:1;overflow:visible}
    .code-soon-badge text{font-family:monospace;font-weight:800;text-anchor:middle;dominant-baseline:central;filter:drop-shadow(0 0 1px currentColor)}
    .code-soon-badge .soon-code{opacity:0}
    .code-soon-badge .soon-letter{font-family:var(--serif);font-weight:300;font-style:italic;font-size:60px;fill:rgba(255,255,255,.12);filter:none;opacity:1}
    .code-soon-badge.is-pending text{opacity:0}
    .code-soon-badge.is-revealing .soon-code{animation:codeSoonIn 560ms ease-in-out both;animation-delay:var(--soon-delay)}
    .code-soon-badge.is-revealing .soon-letter{animation:soonLetterIn 480ms ease-out both;animation-delay:var(--soon-delay)}
    @keyframes soonLetterIn{from{opacity:0}to{opacity:1}}
    @keyframes codeSoonIn{0%,100%{opacity:0}35%,55%{opacity:1}}
    @media(max-width:640px){.code-soon-badge{width:96px;height:72%}#r-app .body,#r-pr .body{min-height:280px}}
    @media(prefers-reduced-motion:reduce){.code-soon-badge .soon-letter{animation:none!important;opacity:1!important}.code-soon-badge .soon-code{animation:none!important;opacity:0!important}}
  `;
  document.head.append(style);
  const observer=!motion.matches&&'IntersectionObserver' in window?new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      const svg=entry.target;
      observer.unobserve(svg);
      svg.classList.remove('is-pending');
      svg.classList.add('is-revealing');
      svg.addEventListener('animationend',event=>{
        if(event.target===svg.lastElementChild)svg.classList.remove('is-revealing');
      });
    }
  },{threshold:.1}):null;
  function mount(cover){
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 70 254');
    svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    svg.setAttribute('role','img');
    svg.setAttribute('aria-label','SOON — скоро');
    svg.classList.add('code-soon-badge');
    let i=0;
    letters.forEach((letter,k)=>letter.forEach((row,y)=>Array.from(row).forEach((cell,x)=>{
      if(cell!=='1')return;
      const t=document.createElementNS(ns,'text');
      const glyph=glyphs[i%glyphs.length];
      const yy=7+k*64+y*8;
      t.setAttribute('x',String(9+x*13));
      t.setAttribute('y',String(yy));
      t.setAttribute('font-size',glyph.length>2?'6':glyph.length===2?'8':'11');
      t.setAttribute('fill',i%6===0?'#E13B5A':'#F5EBD6');
      t.style.setProperty('--soon-delay',Math.round(yy/254*520)+'ms');
      t.classList.add('soon-code');t.textContent=glyph;
      svg.append(t);i++;
    })));
    Array.from('SOON').forEach((letter,k)=>{
      const t=document.createElementNS(ns,'text');
      t.classList.add('soon-letter');
      t.setAttribute('x','35');
      t.setAttribute('y',String(31+k*64));
      t.style.setProperty('--soon-delay',String(360+k*120)+'ms');
      t.textContent=letter;
      svg.append(t);
    });
    if(observer)svg.classList.add('is-pending');
    const stage=document.createElement("div");
    stage.className="soon-stage";
    stage.append(svg);
    cover.prepend(stage);
    if(observer)observer.observe(svg);
  }
  document.querySelectorAll('#r-app .body,#r-pr .body').forEach(mount);
})();

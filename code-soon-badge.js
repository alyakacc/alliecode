/* SOON silk shimmer, restricted to two portfolio cards. */
(() => {
  'use strict';
  const ns='http://www.w3.org/2000/svg';
  const style=document.createElement('style');
  style.textContent=`
    #r-app .body,#r-pr .body{position:relative;min-height:300px;display:flex;flex-direction:column}
    #r-app .soon-stage,#r-pr .soon-stage{position:relative;display:grid;place-items:center;flex:1 1 auto;min-height:220px;order:-1}
    #r-app .body .foot,#r-pr .body .foot{position:relative;z-index:2}
    .code-soon-badge{inset:auto;transform:none;width:104px;height:100%;max-height:254px;position:relative;display:block;pointer-events:none;z-index:1;overflow:visible}
    .code-soon-badge text{font-family:monospace;font-weight:800;text-anchor:middle;dominant-baseline:central;filter:drop-shadow(0 0 1px currentColor)}
    .code-soon-badge .soon-letter{font-family:var(--serif);font-weight:300;font-style:italic;font-size:60px;fill:rgba(255,255,255,.12);filter:none;opacity:1;animation:soonSilk 5.6s ease-in-out infinite;animation-delay:var(--soon-delay)}
    @keyframes soonSilk{0%,18%,48%,100%{fill:rgba(255,255,255,.12)}30%{fill:rgba(255,238,225,.32)}}
    @media(max-width:640px){.code-soon-badge{width:96px;height:72%}#r-app .body,#r-pr .body{min-height:280px}}
    @media(prefers-reduced-motion:reduce){.code-soon-badge .soon-letter{animation:none!important;opacity:1!important}.code-soon-badge .soon-code{animation:none!important;opacity:0!important}}
  `;
  document.head.append(style);
  const isItalian = document.documentElement.lang === 'it';
  const label = isItalian ? 'A BREVE' : 'SOON';
  const letters = label.replace(' ', '');
  function mount(cover){
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 70 254');
    svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    svg.setAttribute('role','img');
    svg.setAttribute('aria-label', isItalian ? label : 'SOON — скоро');
    svg.classList.add('code-soon-badge');
    Array.from(letters).forEach((letter,k)=>{
      const t=document.createElementNS(ns,'text');
      t.classList.add('soon-letter');
      t.setAttribute('x','35');
      t.setAttribute('y',String(isItalian ? 23 + k * 42 : 31 + k * 64));
      t.style.setProperty('--soon-delay',String((cover.closest('#r-pr')?1400:0)+k*180)+'ms');
      if (isItalian) t.style.fontSize = '42px';
      t.textContent=letter;
      svg.append(t);
    });
    const stage=document.createElement("div");
    stage.className="soon-stage";
    stage.append(svg);
    cover.prepend(stage);
  }
  document.querySelectorAll('#r-app .body,#r-pr .body').forEach(mount);
})();

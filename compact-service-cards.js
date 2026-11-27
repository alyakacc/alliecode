/* Shared service card disclosure, all locales. */
(()=>{
'use strict';
const selector='.service-group[data-group="format"] .route,.service-group[data-group="site"] .route,.service-group[data-group="care"] .route';
const labels={ru:['Подробнее','Свернуть'],en:['More details','Show less'],it:['Scopri di più','Mostra meno']};
const words=()=>labels[document.documentElement.lang.split('-')[0]]||labels.en;
const style=document.createElement('style');
style.textContent=`
.service-group .route.ac-compact .ac-detail{display:grid;grid-template-rows:0fr;opacity:0;overflow:hidden;transition:grid-template-rows .65s cubic-bezier(.22,.75,.25,1),opacity .4s ease}
.service-group .route.ac-compact.ac-expanded .ac-detail{grid-template-rows:1fr;opacity:1}
.ac-detail-inner{min-height:0;overflow:hidden}
.ac-detail-inner li{opacity:0;transform:translateY(10px);transition:opacity .35s ease,transform .35s ease;transition-delay:0s}
.ac-expanded .ac-detail-inner li{opacity:1;transform:translateY(0);transition-delay:var(--ac-delay,0s)}
.service-group .route .ac-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;background:transparent;color:inherit;border:0;border-bottom:1px solid rgba(244,230,200,.25);padding:8px 0;margin:0 0 12px;font:inherit;font-size:14px;text-align:start;cursor:pointer}
.ac-toggle:focus-visible{outline:2px solid #f4e6c8;outline-offset:3px}
.ac-toggle::after{content:'';width:8px;height:8px;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(45deg);transition:transform .3s}
.ac-expanded .ac-toggle::after{transform:rotate(225deg)}
@media(prefers-reduced-motion:reduce){.ac-detail,.ac-detail-inner li,.ac-toggle::after{transition:none!important;transform:none!important}}
`;
document.head.append(style);
const states=new Map();
function set(s,open){s.card.classList.toggle('ac-expanded',open);s.button.setAttribute('aria-expanded',String(open));s.button.textContent=words()[+open];s.panel.inert=!open;}
function init(card,i){
 const body=card.querySelector(':scope > .body'),list=body?.querySelector(':scope > .service-list');
 if(!list){states.set(card,{card,done:false});return;}
 const heading=list.previousElementSibling;
 if(!heading||heading.tagName!=='P')return;
 const panel=document.createElement('div'),inner=document.createElement('div'),button=document.createElement('button');
 panel.className='ac-detail';inner.className='ac-detail-inner';panel.id='ac-detail-'+(card.id||i);
 button.className='ac-toggle';button.type='button';button.setAttribute('aria-controls',panel.id);
 heading.before(button,panel);panel.append(inner);inner.append(heading,list);
 [...list.children].forEach((li,j)=>li.style.setProperty('--ac-delay',Math.min(.32,.06+j*.035)+'s'));
 const s={card,panel,button,done:false,timer:0};states.set(card,s);card.classList.add('ac-compact');set(s,false);
 button.addEventListener('click',()=>{clearTimeout(s.timer);s.done=true;const row=card.closest('.ac-story-row');if(row)row.dataset.manual='true';set(s,!card.classList.contains('ac-expanded'));});
}
document.querySelectorAll(selector).forEach(init);
const visible=card=>card.getClientRects().length&&!card.closest('[hidden]');

const grids=[...document.querySelectorAll('.service-group > .routes')];
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const extra=document.createElement('style');
extra.textContent=`
.service-group > .routes.ac-story-grid{display:block!important;max-width:none!important}
.ac-story-row{position:relative;margin-bottom:var(--s6,24px)}
.ac-story-row:last-child{margin-bottom:0}
.ac-story-track{display:grid;grid-template-columns:repeat(var(--ac-cols,3),minmax(0,1fr));gap:var(--s6,24px);align-items:start}
.ac-story-row.ac-pin .ac-story-track{position:sticky;top:var(--ac-top,100px)}
.service-group .ac-story-track > .route:not(.hide){position:relative!important;top:auto!important;margin:0!important;align-self:start!important;transform:none!important;transition:opacity .35s ease,box-shadow .3s}
.ac-story-track > .route > .rshade{display:none}
.ac-story-track.ac-focus > .route:not(.ac-current){opacity:.65}
.ac-story-track > .route:focus-within{opacity:1!important}
@media(max-width:767px){.ac-story-track{grid-template-columns:1fr}.ac-story-row{height:auto!important}.ac-story-row.ac-pin .ac-story-track{position:relative;top:auto}}
@media(prefers-reduced-motion:reduce){.ac-story-track > .route{transition:none!important}}
`;
document.head.append(extra);
let rows=[],frame=0,lastWidth=0;
function reset(row){row.track.classList.remove('ac-focus');row.cards.forEach(s=>{s.card.classList.remove('ac-current');if(s.button)set(s,false)});row.active=-1}
function rebuild(){
 rows=[];const cols=innerWidth<768?1:innerWidth<=1024?2:3;
 for(const grid of grids){
  const cards=[...grid.querySelectorAll('.route')];cards.forEach(card=>grid.append(card));grid.querySelectorAll('.ac-story-row').forEach(el=>el.remove());grid.classList.add('ac-story-grid');
  const shown=cards.filter(visible);const hidden=cards.filter(card=>!visible(card));
  for(let i=0;i<shown.length;i+=cols){
   const el=document.createElement('div'),track=document.createElement('div');el.className='ac-story-row';track.className='ac-story-track';track.style.setProperty('--ac-cols',cols);el.append(track);grid.append(el);
   const group=shown.slice(i,i+cols).map(card=>states.get(card)).filter(Boolean);group.forEach(s=>track.append(s.card));
   const row={el,track,cards:group,active:-1,steps:group.filter(s=>s.button),base:0,travel:0};rows.push(row);
  }
  hidden.forEach(card=>grid.append(card));
 }
 lastWidth=innerWidth;measure();request();
}
function measure(){
 for(const row of rows){
  const {el,track,steps}=row;const can=innerWidth>=768&&!motion.matches&&steps.length>0&&visible(track);
  el.classList.toggle('ac-pin',false);el.style.height='';
  if(!can){row.travel=0;continue}
  // Intrinsic content is measured even while collapsed; no language-specific heights.
  const max=Math.max(...row.cards.map(s=>{const expanded=s.card.classList.contains('ac-expanded');return s.card.offsetHeight+(s.panel&&!expanded?s.panel.firstElementChild.scrollHeight:0)}));
  const available=innerHeight-110;
  // Long content must remain readable: use normal scroll when it cannot fit.
  if(max>available){row.travel=0;continue}
  row.base=max;row.travel=Math.max(220,innerHeight*.48)*(steps.length+1);
  el.style.height=(max+row.travel)+'px';el.style.setProperty('--ac-top',Math.max(80,(innerHeight-max)/2)+'px');el.classList.add('ac-pin');
 }
}
function update(){
 frame=0;
 for(const row of rows){
  if(!visible(row.el)||row.el.dataset.manual==='true')continue;
  const rect=row.el.getBoundingClientRect();
  if(row.travel){
   const top=parseFloat(row.el.style.getPropertyValue('--ac-top'));
   const p=top-rect.top;const idx=p<0||p>=row.travel?-1:Math.min(row.steps.length-1,Math.floor(p/(row.travel/(row.steps.length+1)))-1);
   if(idx===row.active)continue;
   row.active=idx;row.track.classList.toggle('ac-focus',idx>=0);
   row.cards.forEach(s=>{const active=row.steps[idx]===s;s.card.classList.toggle('ac-current',active);if(s.button)set(s,active)});
  }else if(!motion.matches){
   for(const s of row.steps){const b=s.card.getBoundingClientRect();if(!s.done&&b.top<innerHeight*.6&&b.bottom>innerHeight*.4){s.done=true;set(s,true)}}
  }
 }
}
function request(){if(!frame)frame=requestAnimationFrame(update)}
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(lastWidth!==innerWidth)rebuild();else{measure();request()}},120)},{passive:true});
addEventListener('scroll',request,{passive:true});
motion.addEventListener?.('change',()=>{measure();request()});
document.fonts?.ready.then(()=>{measure();request()});
new MutationObserver(()=>{states.forEach(s=>{if(s.button)s.button.textContent=words()[+s.card.classList.contains('ac-expanded')]});measure();request()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(rebuild)));
rebuild();
})();

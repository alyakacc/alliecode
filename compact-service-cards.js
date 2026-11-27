/* Shared horizontal service tracks: EN / RU / IT. */
(()=>{
'use strict';
const mq=matchMedia('(min-width:768px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
const labels={ru:['Назад','Вперёд','Карточки услуг'],en:['Previous','Next','Service cards'],it:['Indietro','Avanti','Schede dei servizi']};
const words=()=>labels[document.documentElement.lang.split('-')[0]]||labels.en;
const css=document.createElement('style');
css.textContent=`
#services .service-group.ac-horizontal{position:relative;overflow:visible}
#services .ac-h-pin{position:relative;min-width:0}
#services .ac-h-sticky .ac-h-pin{position:sticky;top:var(--ac-h-top,90px)}
#services .ac-h-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}
#services .ac-h-head h3{margin:0}
.ac-h-nav{display:flex;gap:8px;flex:none}
.ac-h-nav button{width:40px;height:40px;border:1px solid rgba(244,230,200,.35);border-radius:50%;background:transparent;color:inherit;font-size:22px;cursor:pointer}
.ac-h-nav button:disabled{opacity:.3;cursor:default}
.ac-h-nav button:focus-visible,.ac-h-window:focus-visible{outline:2px solid #e13b5a;outline-offset:3px}
#services .ac-h-window{overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:none;padding:8px 0 14px;touch-action:pan-x pan-y}
#services .ac-h-window::-webkit-scrollbar{display:none}
#services .ac-h-window > .routes{display:flex!important;flex-wrap:nowrap;align-items:flex-start;gap:20px;width:max-content;max-width:none;margin:0!important;transform:translate3d(0,0,0)}
#services .ac-h-window .route:not(.hide){position:relative!important;top:auto!important;display:flex;flex-direction:column;flex:0 0 var(--ac-h-width,420px);width:var(--ac-h-width,420px);max-width:none;min-width:0;height:auto!important;margin:0!important;scroll-snap-align:start;transform:none;transition:translate .25s ease,box-shadow .25s ease,border-color .25s ease}
#services .ac-h-window .route.hide{display:none!important}
#services .ac-h-window .route .body{overflow:visible;flex:1 1 auto}
#services .ac-h-window .route .cover{flex:none;height:auto}
#services .ac-h-window .route .foot{margin-top:0!important;padding-top:12px}
#services .ac-h-window .route .rshade{display:none}
#services .ac-h-sticky .ac-h-window{overflow:hidden;scroll-snap-type:none;cursor:grab}
#services .ac-h-window.ac-drag{cursor:grabbing;user-select:none;scroll-snap-type:none}
.ac-h-progress{height:2px;background:rgba(244,230,200,.16);margin-top:8px;border-radius:2px;overflow:hidden}
.ac-h-progress span{display:block;height:100%;width:100%;background:linear-gradient(90deg,#a92b50,#ef6682);transform-origin:left;transform:scaleX(0)}
@media(hover:hover){#services .ac-h-window .route:not(.hide):hover{translate:0 -3px;border-color:rgba(244,230,200,.25);box-shadow:0 4px 14px rgba(0,0,0,.18)}}
@media(max-width:767px){#services .ac-h-window .route:not(.hide){flex-basis:min(82vw,420px);width:min(82vw,420px)}#services .ac-h-head{gap:8px}.ac-h-nav button{width:34px;height:34px}}
@media(prefers-reduced-motion:reduce){#services .ac-h-window .route{transition:none!important}}
`;
document.head.append(css);

// Compact cards with explicit, localized disclosure; original text remains in DOM.
const disclosureCSS=document.createElement('style');
disclosureCSS.textContent=`
#services .ac-h-window .route .ac-details{display:grid;grid-template-rows:1fr;opacity:1;transition:height .38s cubic-bezier(.22,1,.36,1);overflow:hidden}
#services .ac-h-window .route.ac-open .ac-details{grid-template-rows:1fr;opacity:1}
#services .ac-details-inner{min-height:0;overflow:hidden}
#services .ac-details-inner .service-list{margin-bottom:12px}
#services .ac-detail-toggle{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;padding:8px 0;margin:0;background:none;border:0;color:inherit;font:inherit;font-size:.9em;text-align:left;cursor:pointer;opacity:.8}
#services .ac-detail-toggle[hidden]{display:none!important}
#services .ac-detail-toggle::after{content:'';width:7px;height:7px;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(45deg);transition:transform .3s}
#services .ac-open .ac-detail-toggle::after{transform:rotate(225deg)}
#services .ac-detail-toggle:focus-visible{outline:1px solid currentColor;outline-offset:3px}
#services .ac-h-window .route .cover{min-height:0}
@media(prefers-reduced-motion:reduce){#services .ac-details,#services .ac-detail-toggle::after{transition:none!important}}
`;
document.head.append(disclosureCSS);
const collapseLabels={ru:'Свернуть',en:'Show less',it:'Mostra meno'};
document.querySelectorAll('#services .service-group .route').forEach((card,i)=>{
 const list=card.querySelector('.body > .service-list');if(!list)return;
 const heading=list.previousElementSibling;if(!heading||heading.tagName!=='P')return;
 const label=heading.textContent.trim(),button=document.createElement('button'),panel=document.createElement('div'),inner=document.createElement('div');
 button.type='button';button.className='ac-detail-toggle';button.textContent=label;button.setAttribute('aria-expanded','false');
 panel.className='ac-details';panel.id='ac-service-details-'+i;button.setAttribute('aria-controls',panel.id);inner.className='ac-details-inner';
 heading.after(panel,button);panel.append(inner);inner.append(list);const more={ru:'Показать ещё',en:'Show more',it:'Mostra altro'};const moreLabel=()=>more[document.documentElement.lang.split('-')[0]]||more.en;button.textContent=moreLabel();button.hidden=list.querySelectorAll('li').length<=3;
 button.addEventListener('click',()=>{const open=card.classList.toggle('ac-open');button.setAttribute('aria-expanded',String(open));button.textContent=open?(collapseLabels[document.documentElement.lang.split('-')[0]]||collapseLabels.en):moreLabel();fitPreviews();});
});

const tracks=[];
const previewStyle=document.createElement('style');
previewStyle.textContent=`
#services .ac-h-window .route .ac-details{display:block;flex:none;height:var(--ac-preview,0px)}
#services .ac-h-window .route.ac-open .ac-details{height:var(--ac-full,0px)}
#services .ac-details-inner .service-list{margin-top:0}
#services .ac-details-inner li.ac-preview-hidden{visibility:hidden}
#services .ac-open .ac-details-inner li.ac-preview-hidden{visibility:visible}
#services .ac-h-window .route .body{display:flex;flex-direction:column;flex:0 0 auto!important;gap:10px!important}
#services .ac-h-window .route .body > p{flex:none!important;margin:0!important}
#services .ac-h-window .route:not(.hide){align-self:flex-start!important;min-height:0!important}
#services .ac-h-window .route .ac-detail-toggle{padding:4px 0;margin:0!important;flex:none}
#services .ac-h-window .route .ac-details-inner{height:auto;min-height:0}
#services .ac-h-window .route .ac-details-inner .service-list{margin-bottom:0}
`;
document.head.append(previewStyle);
function fitPreviews(){
 for(const s of tracks){
  const cards=[...s.grid.querySelectorAll('.route:not(.hide)')];
  const entries=cards.map(card=>{const panel=card.querySelector('.ac-details');return {card,panel,inner:panel?.firstElementChild,base:card.getBoundingClientRect().height-(panel?.getBoundingClientRect().height||0)}});
  // Use intrinsic compact content, not the stretched row height.
  for(const e of entries){const body=e.card.querySelector('.body'),cover=e.card.querySelector('.cover');if(!body||!cover)continue;const cs=getComputedStyle(body);const children=[...body.children].filter(n=>n!==e.panel&&getComputedStyle(n).display!=='none');e.base=cover.offsetHeight+children.reduce((sum,n)=>{const st=getComputedStyle(n);return sum+n.offsetHeight+(parseFloat(st.marginTop)||0)+(n.classList.contains('foot')?0:parseFloat(st.marginBottom)||0)},0)+(parseFloat(cs.paddingTop)||0)+(parseFloat(cs.paddingBottom)||0)+(parseFloat(cs.rowGap)||0)*Math.max(0,children.length-1)+2;}
  const target=Math.max(...entries.map(e=>e.base),0)+48;
  for(const e of entries){if(!e.panel)continue;const items=[...e.inner.querySelectorAll('li')];const rect=e.inner.getBoundingClientRect();const budget=Math.max(0,target-e.base);let height=0;for(const [index,li] of items.entries()){const bottom=li.getBoundingClientRect().bottom-rect.top;const show=index<3;li.classList.toggle('ac-preview-hidden',!show);if(show)height=Math.max(height,bottom);}e.panel.style.setProperty('--ac-preview',Math.ceil(height)+'px');e.panel.style.setProperty('--ac-full',e.inner.scrollHeight+'px');}
 }
}

for(const section of document.querySelectorAll('.service-group[data-group="format"],.service-group[data-group="site"],.service-group[data-group="care"]')){
 const grid=section.querySelector(':scope > .routes'),heading=section.querySelector(':scope > h3');if(!grid||!heading)continue;
 const pin=document.createElement('div'),head=document.createElement('div'),nav=document.createElement('div'),win=document.createElement('div'),progress=document.createElement('div'),bar=document.createElement('span');
 pin.className='ac-h-pin';head.className='ac-h-head';nav.className='ac-h-nav';win.className='ac-h-window';progress.className='ac-h-progress';progress.setAttribute('aria-hidden','true');progress.append(bar);
 const buttons=['←','→'].map((symbol,i)=>{const b=document.createElement('button');b.type='button';b.textContent=symbol;b.setAttribute('aria-label',words()[i]);nav.append(b);return b});
 win.tabIndex=0;win.setAttribute('role','region');win.setAttribute('aria-label',heading.textContent+' — '+words()[2]);
 section.insertBefore(pin,heading);head.append(heading,nav);win.append(grid);pin.append(head,win);section.classList.add('ac-horizontal');grid.classList.remove('stack');
 const s={section,pin,grid,win,bar,buttons,max:0,x:0,sticky:false,top:90,drag:null};tracks.push(s);
 buttons.forEach((b,i)=>b.addEventListener('click',()=>move(s,s.x+(i?1:-1)*step(s),true)));
 win.addEventListener('scroll',()=>{if(!s.sticky){s.x=win.scrollLeft;paint(s)}},{passive:true});
 win.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(s,s.x+(e.key==='ArrowRight'?1:-1)*step(s),true)}});
 win.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('a,button,input'))return;s.drag={id:e.pointerId,start:e.clientX,x:s.x,moved:false};});
 win.addEventListener('pointermove',e=>{const d=s.drag;if(!d||d.id!==e.pointerId)return;const delta=d.start-e.clientX;if(!d.moved&&Math.abs(delta)<6)return;if(!d.moved){d.moved=true;win.setPointerCapture(e.pointerId);win.classList.add('ac-drag')}e.preventDefault();move(s,d.x+delta,false)});
 const end=()=>{s.drag=null;win.classList.remove('ac-drag')};win.addEventListener('pointerup',end);win.addEventListener('pointercancel',end);win.addEventListener('lostpointercapture',end);
}
const clamp=(x,max)=>Math.max(0,Math.min(max,x));
function step(s){return (s.grid.querySelector('.route:not(.hide)')?.offsetWidth||400)+20}
function paint(s){s.bar.style.transform='scaleX('+(s.max?s.x/s.max:1)+')';s.buttons[0].disabled=s.x<=1;s.buttons[1].disabled=s.x>=s.max-1}
function move(s,x,smooth){x=clamp(x,s.max);if(s.sticky){const y=scrollY+s.section.getBoundingClientRect().top-s.top+x;window.scrollTo({top:y,behavior:smooth?'smooth':'instant'});s.x=x;s.grid.style.transform='translate3d('+(-x)+'px,0,0)';paint(s)}else{s.win.scrollTo({left:x,behavior:smooth&&!matchMedia('(prefers-reduced-motion:reduce)').matches?'smooth':'instant'})}}
let frame=0;
function update(){frame=0;for(const s of tracks){if(!s.sticky||!s.section.getClientRects().length)continue;const x=clamp(s.top-s.section.getBoundingClientRect().top,s.max);if(x!==s.x){s.x=x;s.grid.style.transform='translate3d('+(-x)+'px,0,0)';paint(s)}}}
function request(){if(!frame)frame=requestAnimationFrame(update)}
function measure(){for(const s of tracks){if(!s.section.getClientRects().length)continue;const old=s.x;s.section.classList.remove('ac-h-sticky');s.section.style.height='';s.grid.style.transform='';s.grid.style.setProperty('--ac-h-width',Math.min(400,Math.max(280,(s.win.clientWidth-40)/3))+'px');s.max=Math.max(0,s.grid.scrollWidth-s.win.clientWidth);const h=s.pin.offsetHeight;const header=document.querySelector('#top .nav');const clearance=Math.max(80,header?.getBoundingClientRect().height||0)+12;s.top=Math.max(clearance,(innerHeight-h)/2);s.sticky=false;s.section.classList.toggle('ac-h-sticky',s.sticky);if(s.sticky){s.win.scrollLeft=0;s.section.style.setProperty('--ac-h-top',s.top+'px');s.section.style.height=(h+s.max)+'px';s.x=-1}else{s.x=clamp(old,s.max);s.win.scrollLeft=s.x;paint(s)}}fitPreviews();request()}
let timer;function schedule(){clearTimeout(timer);timer=setTimeout(measure,100)}
addEventListener('scroll',request,{passive:true});addEventListener('resize',schedule,{passive:true});mq.addEventListener?.('change',schedule);document.fonts?.ready.then(schedule);
if('ResizeObserver'in window){const ro=new ResizeObserver(schedule);tracks.forEach(s=>ro.observe(s.pin))}
new MutationObserver(()=>{tracks.forEach(s=>{s.buttons.forEach((b,i)=>b.setAttribute('aria-label',words()[i]));});schedule()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',schedule));
measure();
})();

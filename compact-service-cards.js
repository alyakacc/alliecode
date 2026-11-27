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
 if(!list)return;
 const heading=list.previousElementSibling;
 if(!heading||heading.tagName!=='P')return;
 const panel=document.createElement('div'),inner=document.createElement('div'),button=document.createElement('button');
 panel.className='ac-detail';inner.className='ac-detail-inner';panel.id='ac-detail-'+(card.id||i);
 button.className='ac-toggle';button.type='button';button.setAttribute('aria-controls',panel.id);
 heading.before(button,panel);panel.append(inner);inner.append(heading,list);
 [...list.children].forEach((li,j)=>li.style.setProperty('--ac-delay',Math.min(.32,.06+j*.035)+'s'));
 const s={card,panel,button,done:false,timer:0};states.set(card,s);card.classList.add('ac-compact');set(s,false);
 button.addEventListener('click',()=>{clearTimeout(s.timer);s.done=true;set(s,!card.classList.contains('ac-expanded'));});
}
document.querySelectorAll(selector).forEach(init);
const visible=card=>card.getClientRects().length&&!card.closest('[hidden]');
function trigger(card){
 const first=states.get(card);if(!first||first.done||!visible(card))return;
 const top=card.offsetTop;
 const row=[...states.values()].filter(s=>s.card.parentElement===card.parentElement&&visible(s.card)&&Math.abs(s.card.offsetTop-top)<8).sort((a,b)=>a.card.offsetLeft-b.card.offsetLeft);
 row.forEach((s,i)=>{if(s.done)return;s.done=true;s.timer=setTimeout(()=>{if(visible(s.card))set(s,true);else s.done=false;},i*120);});
}
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=.35)trigger(e.target)}),{threshold:[.35]});
 states.forEach(s=>io.observe(s.card));
}
new MutationObserver(()=>states.forEach(s=>s.button.textContent=words()[+s.card.classList.contains('ac-expanded')])).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

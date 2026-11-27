/* Shared hover disclosure for EN, RU, IT service cards. */
(()=>{
'use strict';
const labels={ru:['Подробнее','Свернуть'],en:['More details','Show less'],it:['Scopri di più','Mostra meno']};
const words=()=>labels[document.documentElement.lang.split('-')[0]]||labels.en;
const desktop=matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine)');
const css=document.createElement('style');
css.textContent=`
#services .service-group > .routes{align-items:stretch;overflow:visible}
#services .service-group,#services{overflow:visible}
#services .route.ac-compact{position:relative;overflow:visible;isolation:auto}
#services .route.ac-compact > .cover{border-radius:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;overflow:hidden}
#services .route.ac-compact > .body{overflow:visible}
#services .route .ac-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;background:transparent;color:inherit;border:0;border-bottom:1px solid rgba(244,230,200,.25);padding:5px 0;font:inherit;font-size:13px;text-align:start;cursor:pointer}
.ac-toggle:focus-visible{outline:2px solid #f4e6c8;outline-offset:3px}
.ac-toggle::after{content:'';width:8px;height:8px;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(45deg);transition:transform .38s cubic-bezier(.22,1,.36,1)}
.ac-expanded .ac-toggle::after{transform:rotate(225deg)}
#services .ac-detail{display:grid;grid-template-rows:0fr;opacity:0;overflow:hidden;pointer-events:none;transition:grid-template-rows .38s cubic-bezier(.22,1,.36,1),opacity .38s cubic-bezier(.22,1,.36,1)}
#services .ac-expanded .ac-detail{grid-template-rows:1fr;opacity:1;pointer-events:auto}
.ac-detail-inner{min-height:0;overflow:hidden}
#services .ac-detail-inner > p{margin-top:0}
#services .ac-detail-inner > ul{margin-bottom:0}
@media(min-width:1024px) and (hover:hover) and (pointer:fine){
 #services .route.ac-compact .ac-detail{position:absolute;top:calc(100% - 1px);left:-1px;right:-1px;z-index:5;background:#260b19;border:1px solid transparent;border-top:0;border-radius:0 0 var(--r,18px) var(--r,18px);box-shadow:none}
 #services .route.ac-compact .ac-detail-inner > p{margin:16px 22px 10px}
 #services .route.ac-compact .ac-detail-inner > ul{margin:0 22px 22px;padding-left:1.2em}
 #services .route.ac-expanded{z-index:100;border-color:rgba(244,230,200,.48);box-shadow:0 12px 35px rgba(0,0,0,.42);border-bottom-left-radius:0;border-bottom-right-radius:0}
 #services .route.ac-expanded .ac-detail{border-color:rgba(244,230,200,.48);box-shadow:0 24px 40px rgba(0,0,0,.48)}
 #services .route.ac-dim{opacity:.75}
 #services .route.ac-compact{transition:opacity .38s,box-shadow .38s,border-color .38s}
 #services .route.ac-compact > .body{gap:10px}
}
@media(max-width:1023px),(hover:none),(pointer:coarse){
 #services .route.ac-compact .ac-detail{position:static}
 #services .route.ac-compact:not(.ac-expanded) .ac-detail{margin-top:-16px}
}
@media(max-width:767px){#services .service-group > .routes{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){#services .ac-detail,#services .route.ac-compact,.ac-toggle::after{transition:none!important}}
`;
document.head.append(css);
const states=[];
function dim(s,on){const top=s.card.offsetTop;for(const other of states){if(other!==s&&other.card.parentElement===s.card.parentElement&&Math.abs(other.card.offsetTop-top)<8)other.card.classList.toggle('ac-dim',on)}}
function set(s,open){clearTimeout(s.timer);if(open&&desktop.matches){for(const other of states)if(other!==s&&other.open)set(other,false)}s.open=open;s.card.classList.toggle('ac-expanded',open);s.button.setAttribute('aria-expanded',String(open));s.button.textContent=words()[+open];s.panel.style.pointerEvents=open?'':'none';if(desktop.matches)dim(s,open)}
document.querySelectorAll('.service-group[data-group="format"] .route,.service-group[data-group="site"] .route,.service-group[data-group="care"] .route').forEach((card,i)=>{
 const list=card.querySelector('.body > .service-list');if(!list)return;
 const heading=list.previousElementSibling;if(!heading||heading.tagName!=='P')return;
 const panel=document.createElement('div'),inner=document.createElement('div'),button=document.createElement('button');
 panel.className='ac-detail';inner.className='ac-detail-inner';panel.id='ac-detail-'+(card.id||i);button.className='ac-toggle';button.type='button';button.setAttribute('aria-controls',panel.id);
 heading.before(button,panel);panel.append(inner);inner.append(heading,list);
 const s={card,panel,button,open:false,timer:0};states.push(s);card.classList.add('ac-compact');set(s,false);
 card.addEventListener('pointerenter',e=>{if(desktop.matches&&e.pointerType==='mouse')set(s,true)});
 card.addEventListener('pointerleave',()=>{if(desktop.matches)s.timer=setTimeout(()=>{if(!card.matches(':hover')&&!card.contains(document.activeElement))set(s,false)},130)});
 button.addEventListener('click',()=>set(s,!s.open));
 card.addEventListener('focusout',()=>{if(desktop.matches)s.timer=setTimeout(()=>{if(!card.matches(':hover')&&!card.contains(document.activeElement))set(s,false)},130)});
 card.addEventListener('keydown',e=>{if(e.key==='Escape'&&s.open){set(s,false);button.focus()}});
});
desktop.addEventListener?.('change',()=>states.forEach(s=>{set(s,false);s.card.classList.remove('ac-dim')}));
new MutationObserver(()=>states.forEach(s=>s.button.textContent=words()[+s.open])).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

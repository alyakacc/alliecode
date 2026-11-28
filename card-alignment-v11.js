(()=>{
'use strict';
const mobile=matchMedia('(max-width:640px)');
const cards=[...document.querySelectorAll('#services .service-group .route')];
const groups=[...document.querySelectorAll('#services .service-group .routes')];
const lang=document.documentElement.lang.split('-')[0];
const labels={en:['Show more','Show less'],ru:['Показать ещё','Свернуть'],it:['Mostra altro','Mostra meno']}[lang]||['Show more','Show less'];
cards.forEach((card,i)=>{
 const body=card.querySelector('.body'),list=body?.querySelector(':scope > .service-list');
 if(!list)return;
 const heading=list.previousElementSibling,desc=heading?.previousElementSibling;
 if(heading?.tagName==='P')heading.classList.add('ac-align-includes');
 if(desc?.tagName==='P')desc.classList.add('ac-align-description');
 const items=[...list.children];if(items.length<=3)return;
 const btn=document.createElement('button');btn.type='button';btn.className='ac-align-toggle';btn.textContent=labels[0];btn.setAttribute('aria-expanded','false');list.id=list.id||'ac-aligned-list-'+i;btn.setAttribute('aria-controls',list.id);
 const set=open=>{items.slice(3).forEach(li=>li.hidden=!open);btn.textContent=labels[open?1:0];btn.setAttribute('aria-expanded',String(open));card.classList.toggle('ac-aligned-open',open);};
 set(false);list.after(btn);btn.addEventListener('click',()=>{set(btn.getAttribute('aria-expanded')!=='true');schedule()});
});
let frame=0;
function schedule(){if(!frame)frame=requestAnimationFrame(align)}
function align(){
 frame=0;
 cards.forEach(c=>{for(const el of c.querySelectorAll('.cover,.cover h3,.ac-align-description,.ac-align-includes'))el.style.removeProperty('--ac-align-min');});
 if(mobile.matches)return;
 for(const grid of groups){
 const rows=[];
 for(const card of grid.querySelectorAll(':scope > .route:not(.hide)')){
 if(!card.getClientRects().length)continue;
 const y=card.offsetTop;let row=rows.find(r=>Math.abs(r.y-y)<4);if(!row){row={y,cards:[]};rows.push(row)}row.cards.push(card);
 }
 for(const row of rows){
 if(row.cards.length<2)continue;
 for(const selector of ['.cover h3','.cover','.ac-align-description','.ac-align-includes']){
 const nodes=row.cards.map(c=>c.querySelector(selector)).filter(Boolean);
 const max=Math.max(0,...nodes.map(n=>n.getBoundingClientRect().height));
 nodes.forEach(n=>n.style.setProperty('--ac-align-min',Math.ceil(max)+'px'));
 }
 }
 }
}
window.addEventListener('resize',schedule,{passive:true});window.addEventListener('load',schedule);document.fonts?.ready.then(schedule);
const observer=new MutationObserver(schedule);groups.forEach(g=>observer.observe(g,{subtree:true,attributes:true,attributeFilter:['class','hidden'],childList:true}));
schedule();
})();
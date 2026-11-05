import {APPS} from './apps.js';
export function buildDock(launch){
  const d=document.createElement('div');d.className='dock';
  d.innerHTML=`<div class="avatar"></div><div class="status"><span class="clk"></span><span class="net">📶</span><span class="bat"></span></div>
  <button class="ico bell">🔔<i>2</i></button><span class="sep"></span>
  ${APPS.filter(a=>a.fav).map(a=>`<button class="ico" data-launch="${a.id}" style="background:${a.g}">${a.icon}</button>`).join('')}
  <span class="sep"></span><button class="ico grid" data-launch="library">⠿</button>`;
  const clk=d.querySelector('.clk'),bat=d.querySelector('.bat'),net=d.querySelector('.net');
  const tick=()=>{clk.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});net.textContent=navigator.onLine?'📶':'⛔';};
  tick();setInterval(tick,5000);
  navigator.getBattery?.().then(b=>{const u=()=>bat.textContent='🔋'+Math.round(b.level*100)+'%';u();b.onlevelchange=u;});
  d.addEventListener('click',e=>{const b=e.target.closest('[data-launch]');if(b)launch(b.dataset.launch);});
  return d;
}

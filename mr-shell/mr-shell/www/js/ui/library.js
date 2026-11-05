import {APPS} from './apps.js';
const recent=JSON.parse(localStorage.getItem('mr_recent')||'{}');
export function buildLibrary(launch){
  const st={view:'apps',cat:'Todos',sort:'Recentes',q:''};
  const cats=['Todos',...new Set(APPS.filter(a=>a.id!=='library').map(a=>a.cat))];
  const d=document.createElement('div');
  d.innerHTML=`<div class="lib"><aside><label class="side"><span>🔍</span><input placeholder="Buscar"></label>
   <div class="side on" data-v="apps">▦ Aplicativos</div><div class="side" data-v="favs">★ Favoritos</div><div class="side" data-v="worlds">📍 Mundos</div></aside>
   <main><div class="head"><span class="ttl">Aplicativos</span><span><button class="pill" data-cat></button><button class="pill" data-sort></button></span></div><div class="grid"></div></main></div>`;
  const root=d.firstElementChild,grid=root.querySelector('.grid');
  const render=()=>{
    let l=APPS.filter(a=>a.id!=='library');
    if(st.view==='favs')l=l.filter(a=>a.fav);
    if(st.cat!=='Todos')l=l.filter(a=>a.cat===st.cat);
    if(st.q)l=l.filter(a=>a.name.toLowerCase().includes(st.q));
    l=st.sort==='A–Z'?[...l].sort((a,b)=>a.name.localeCompare(b.name)):[...l].sort((a,b)=>(recent[b.id]||0)-(recent[a.id]||0));
    grid.innerHTML=st.view==='worlds'?'<div class="empty">Mundos: em breve</div>'
      :l.map(a=>`<div class="card" data-id="${a.id}"><div class="cover" style="background:${a.g}">${a.icon}<b class="star" data-fav>${a.fav?'★':'☆'}</b></div><div class="nm">${a.name}</div></div>`).join('');
    root.querySelector('[data-cat]').textContent=`${st.cat} (${l.length}) ▾`;
    root.querySelector('[data-sort]').textContent=`${st.sort} ▾`;
    root.querySelector('.ttl').textContent={apps:'Aplicativos',favs:'Favoritos',worlds:'Mundos'}[st.view];
    root.querySelectorAll('[data-v]').forEach(n=>n.classList.toggle('on',n.dataset.v===st.view));
  };
  root.addEventListener('click',e=>{
    const t=e.target;
    if(t.closest('[data-fav]')){const a=APPS.find(x=>x.id===t.closest('.card').dataset.id);a.fav=a.fav?0:1;return render();}
    const c=t.closest('.card');if(c){recent[c.dataset.id]=Date.now();localStorage.setItem('mr_recent',JSON.stringify(recent));return launch(c.dataset.id);}
    const v=t.closest('[data-v]');if(v){st.view=v.dataset.v;return render();}
    if(t.closest('[data-cat]')){st.cat=cats[(cats.indexOf(st.cat)+1)%cats.length];render();}
    if(t.closest('[data-sort]')){st.sort=st.sort==='Recentes'?'A–Z':'Recentes';render();}
  });
  root.querySelector('input').oninput=e=>{st.q=e.target.value.toLowerCase();render();};
  let y=0; // rolagem por pinça arrastada
  grid.addEventListener('pointerdown',e=>{y=e.clientY;});
  grid.addEventListener('pointermove',e=>{if(!e.isTrusted&&e.buttons){grid.scrollTop-=e.clientY-y;y=e.clientY;}});
  render();return root;
}

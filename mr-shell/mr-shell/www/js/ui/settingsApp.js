import {settings,save,reset} from '../core/settings.js';
const ROWS=[['offsetX','Offset lateral',.1,-2,2],['offsetY','Offset eixo dos dedos',.1,-2,2],['offsetZ','Distância da palma',.1,-1,3],
 ['uiScale','Escala da UI',.1,.5,3],['pinchOn','Sensibilidade da pinça',.02,.1,.6],['smooth','Suavização (1 = nenhuma)',.05,.1,1],['holdMs','Tempo do gesto (ms)',50,0,1500]];
export function buildSettings(){
  const root=document.createElement('div');root.className='set';
  const draw=()=>{root.innerHTML=ROWS.map(([k,l])=>`<div class="row"><span>${l}</span><span><button class="pill" data-k="${k}" data-d="-1">−</button><b>${(+settings[k]).toFixed(2)}</b><button class="pill" data-k="${k}" data-d="1">+</button></span></div>`).join('')
    +`<div class="row"><span>Contorno das mãos</span><button class="pill" data-o>${settings.outline?'Ligado':'Desligado'}</button></div><div class="row"><button class="pill" data-r>Restaurar padrão</button></div>`;};
  root.onclick=e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.k){const r=ROWS.find(x=>x[0]===b.dataset.k);settings[r[0]]=Math.min(r[4],Math.max(r[3],+(settings[r[0]]+r[2]*b.dataset.d).toFixed(3)));}
    else if('o' in b.dataset)settings.outline=!settings.outline;else if('r' in b.dataset)reset();
    save();draw();};
  draw();return root;
}

// Hand UI: painel preso à mão com a transformação 3D completa (posição + quaternion)
import {quatToMat} from '../core/math.js';
import {settings} from '../core/settings.js';
import {pop,out} from '../core/animation.js';
export class HandUI{
  visible=false;key=null;lostAt=0;
  constructor(root,dock){
    this.root=root;this.panel=document.createElement('div');this.panel.className='panel';
    this.panel.append(dock);const g=document.createElement('div');g.className='grab';this.panel.append(g);
    root.append(this.panel);root.classList.add('hidden');
  }
  show(h){this.key=h.key;this.lostAt=0;if(!this.visible){this.visible=true;this.root.classList.remove('hidden');this.place(h);pop(this.panel);}}
  hide(){if(!this.visible)return;this.visible=false;out(this.panel,()=>{if(!this.visible)this.root.classList.add('hidden');});}
  update(hands,now){
    if(!this.visible)return;
    const h=hands.find(x=>x.key===this.key);
    if(!h){if(!this.lostAt)this.lostAt=now;if(now-this.lostAt>1200)this.hide();return;}
    this.lostAt=0;this.place(h);
  }
  place(h){
    const [ex,ey,ez]=quatToMat(h.q),u=h.size,s=ez[2]>=0?1:-1;
    const o=[settings.offsetX,settings.offsetY,settings.offsetZ*s];
    const t=[0,1,2].map(i=>(ex[i]*o[0]+ey[i]*o[1]+ez[i]*o[2])*u); // offset no referencial da mão
    const k=settings.uiScale*2.4*u/380;
    const m=[...ex.map(v=>v*k),0,...ey.map(v=>v*k),0,...ez.map(v=>v*k),0,h.pos.x+t[0],h.pos.y+t[1],t[2],1];
    this.panel.style.transform=`matrix3d(${m.join(',')}) translate(-50%,-50%)`;
  }
}

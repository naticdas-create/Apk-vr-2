import {pop,out} from '../core/animation.js';
export class WindowManager{
  wins=new Map();z=10;
  constructor(root){this.root=root;}
  open(id,{title,w=520,h=340,content}){
    if(this.wins.has(id))return this.front(id);
    w=Math.min(w,innerWidth*.8);h=Math.min(h,innerHeight*.78);const n=this.wins.size;
    const el=document.createElement('div');el.className='win';
    el.innerHTML=`<div class="bar"><span>${title}</span><span class="ctl"><button data-act="max">⤢</button><button data-act="close">✕</button></span></div><div class="body"></div><div class="grip" data-resize></div>`;
    el.querySelector('.body').append(content);
    Object.assign(el.style,{width:w+'px',height:h+'px',left:(innerWidth-w)/2+n*26+'px',top:(innerHeight-h)/2-18+n*18+'px'});
    this.root.append(el);this.wins.set(id,el);this.front(id);this.tilt(el);pop(el);this.bind(id,el);
  }
  front(id){const e=this.wins.get(id);if(e)e.style.zIndex=++this.z;}
  close(id){const e=this.wins.get(id);if(!e)return;this.wins.delete(id);out(e,()=>e.remove());}
  tilt(el){const cx=el.offsetLeft+el.offsetWidth/2;el.style.transform=`rotateY(${(-(cx-innerWidth/2)/innerWidth*26).toFixed(2)}deg)`;} // profundidade espacial
  bind(id,el){
    let big=null;
    el.addEventListener('pointerdown',e=>{
      this.front(id);const t=e.target;
      const mode=t.closest('[data-resize]')?'r':(t.closest('.bar')&&!t.closest('button'))?'m':null;if(!mode)return;
      const s={x:e.clientX,y:e.clientY,l:el.offsetLeft,t:el.offsetTop,w:el.offsetWidth,h:el.offsetHeight};
      const mv=v=>{const dx=v.clientX-s.x,dy=v.clientY-s.y;
        if(mode==='m'){el.style.left=s.l+dx+'px';el.style.top=s.t+dy+'px';}
        else{el.style.width=Math.max(300,s.w+dx)+'px';el.style.height=Math.max(200,s.h+dy)+'px';}this.tilt(el);};
      const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);};
      document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);
    });
    el.querySelector('[data-act=close]').onclick=()=>this.close(id);
    el.querySelector('[data-act=max]').onclick=()=>{
      if(big){Object.assign(el.style,big);big=null;}
      else{big={left:el.style.left,top:el.style.top,width:el.style.width,height:el.style.height};
        Object.assign(el.style,{left:innerWidth*.06+'px',top:innerHeight*.06+'px',width:innerWidth*.88+'px',height:innerHeight*.8+'px'});}
      this.tilt(el);};
  }
}

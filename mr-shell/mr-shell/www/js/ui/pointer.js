// Pinça -> eventos de ponteiro reais sobre a UI (selecionar, arrastar, soltar)
const HOV='button,.card,.side,.bar,.pill,.ico,.grip';
export class Pointer{
  hands=[];down=null;key=null;hov=null;
  constructor(gm,menuKey,cur){
    this.menuKey=menuKey;this.cur=cur;
    gm.addEventListener('pinchStart',e=>this.start(e.detail));
    gm.addEventListener('pinchEnd',e=>this.end(e.detail));
  }
  pt(h){const a=h.pts[4],b=h.pts[8];return{x:(a.x+b.x)/2,y:(a.y+b.y)/2};}
  fire(el,type,p){(el.isConnected?el:document.body).dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,clientX:p.x,clientY:p.y,pointerId:7,pointerType:'touch',isPrimary:true,buttons:type==='pointerup'?0:1}));}
  start(h){
    const mk=this.menuKey();if(mk&&h.key===mk&&this.hands.length>1)return; // mão do menu não aponta
    const p=this.pt(h),el=document.elementFromPoint(p.x,p.y)||document.body;
    this.key=h.key;this.down={el,x:p.x,y:p.y};el.closest(HOV)?.classList.add('press');
    this.fire(el,'pointerdown',p);this.cur.classList.add('on');
  }
  end(h){
    if(!this.down||h.key!==this.key)return;
    const p=this.pt(h),{el,x,y}=this.down;this.fire(el,'pointerup',p);
    document.querySelectorAll('.press').forEach(n=>n.classList.remove('press'));
    const t=document.elementFromPoint(p.x,p.y);
    if(Math.hypot(p.x-x,p.y-y)<28&&t&&(el.contains(t)||t.contains(el))){t.focus?.();t.click();}
    this.down=null;this.cur.classList.remove('on');
  }
  update(hands){
    this.hands=hands;const mk=this.menuKey();
    const h=this.down?hands.find(x=>x.key===this.key):(hands.filter(x=>x.key!==mk)[0]||hands[0]);
    if(!h){this.cur.style.opacity=0;return;}
    const p=this.down?this.pt(h):h.pts[8];
    this.cur.style.opacity=1;this.cur.style.transform=`translate(${p.x}px,${p.y}px) translate(-50%,-50%)`;
    const el=document.elementFromPoint(p.x,p.y),t=el&&el.closest(HOV);
    if(t!==this.hov){this.hov?.classList.remove('hov');t?.classList.add('hov');this.hov=t;}
    if(this.down)this.fire(this.down.el,'pointermove',p);
  }
}

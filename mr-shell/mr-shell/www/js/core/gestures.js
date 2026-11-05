// Sistema modular: register(nome, detector, {holdMs, graceMs}) -> eventos nomeStart / nomeMove / nomeEnd
const ext=(h,t,p)=>h.D(t,0)>h.D(p,0)*1.12;
export const fingers=h=>[[8,6],[12,10],[16,14],[20,18]].map(([t,p])=>ext(h,t,p));
export const pinchRatio=h=>h.D(4,8)/h.wsize;
export const detectors={
  // pinça com histerese (evita "tremer" no limiar)
  pinch:(h,mem,cfg)=>{const r=pinchRatio(h);return mem.on=mem.on?r<cfg.pinchOn+.12:r<cfg.pinchOn;},
  // mão aberta levantada
  openPalm:h=>fingers(h).every(Boolean)&&pinchRatio(h)>.5&&h.pos.y<innerHeight*.8&&h.size>50,
  fist:h=>!fingers(h).some(Boolean)&&pinchRatio(h)>.4,
};
export class GestureManager extends EventTarget{
  defs=[];st=new Map();
  constructor(cfg){super();this.cfg=cfg;}
  register(name,detect,{holdMs=0,graceMs=150}={}){this.defs.push({name,detect,holdMs,graceMs});}
  emit(t,h){this.dispatchEvent(new CustomEvent(t,{detail:h}));}
  update(hands,now){
    for(const h of hands)for(const d of this.defs){
      const k=h.key+d.name;let s=this.st.get(k);
      if(!s)this.st.set(k,s={d,since:0,lost:0,active:false,mem:{},last:h});
      s.last=h;s.seen=now;
      const hm=typeof d.holdMs==='function'?d.holdMs():d.holdMs;
      if(d.detect(h,s.mem,this.cfg)){
        s.lost=0;if(!s.since)s.since=now;
        if(!s.active&&now-s.since>=hm){s.active=true;this.emit(d.name+'Start',h);}
        if(s.active)this.emit(d.name+'Move',h);
      }else{
        if(!s.lost)s.lost=now;
        if(now-s.lost>=d.graceMs){if(s.active)this.emit(d.name+'End',h);s.active=false;s.since=0;}
      }
    }
    for(const s of this.st.values())if(s.active&&now-s.seen>s.d.graceMs){this.emit(s.d.name+'End',s.last);s.active=false;s.since=0;}
  }
}

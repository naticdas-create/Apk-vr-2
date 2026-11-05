import {HandLandmarker,FilesetResolver} from '../../vendor/tasks-vision/vision_bundle.mjs';
import {handBasis,matToQuat,nlerp} from './math.js';
import {settings} from './settings.js';
export const CONN=HandLandmarker.HAND_CONNECTIONS;
export class HandTracker{
  state={};
  async init(){
    const fs=await FilesetResolver.forVisionTasks('./vendor/tasks-vision/wasm');
    const mk=d=>HandLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:'./models/hand_landmarker.task',delegate:d},
      runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.5,minTrackingConfidence:.5});
    try{this.hl=await mk('GPU');}catch{this.hl=await mk('CPU');}
  }
  detect(video,t,view,mirror){
    const r=this.hl.detectForVideo(video,t),m=mirror?-1:1,hands=[],used=new Set();
    r.landmarks.forEach((lm,i)=>{
      const wl=r.worldLandmarks[i];let key=r.handedness[i][0].categoryName;
      if(used.has(key))key+='2';used.add(key);
      const pts=lm.map(p=>({x:view.x+(mirror?1-p.x:p.x)*view.w,y:view.y+p.y*view.h}));
      const d=(a,b)=>Math.hypot((lm[a].x-lm[b].x)*view.w,(lm[a].y-lm[b].y)*view.h,(lm[a].z-lm[b].z)*view.w);
      const size=d(0,9);
      const pos={x:[0,5,9,13,17].reduce((s,k)=>s+pts[k].x,0)/5,y:[0,5,9,13,17].reduce((s,k)=>s+pts[k].y,0)/5};
      const q=matToQuat(handBasis(wl,m));
      let s=this.state[key];
      if(!s)s=this.state[key]={pos:{...pos},q};
      else{ // suavização adaptativa: quase nenhuma em movimento rápido
        const a=Math.min(1,settings.smooth+Math.hypot(pos.x-s.pos.x,pos.y-s.pos.y)/60);
        s.pos={x:s.pos.x+(pos.x-s.pos.x)*a,y:s.pos.y+(pos.y-s.pos.y)*a};s.q=nlerp(s.q,q,a);
      }
      const D=(a,b)=>Math.hypot(wl[a].x-wl[b].x,wl[a].y-wl[b].y,wl[a].z-wl[b].z);
      hands.push({key,label:key[0]==='L'?'Left':'Right',pts,wl,pos:s.pos,q:s.q,size,wsize:D(0,9),D});
    });
    return hands;
  }
}

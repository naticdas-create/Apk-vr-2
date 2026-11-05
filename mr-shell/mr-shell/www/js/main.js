import {startCamera,coverView} from './core/camera.js';
import {HandTracker} from './core/handTracking.js';
import {GestureManager,detectors} from './core/gestures.js';
import {settings} from './core/settings.js';
import {WindowManager} from './ui/windowManager.js';
import {buildDock} from './ui/dock.js';
import {HandUI} from './ui/handUI.js';
import {Pointer} from './ui/pointer.js';
import {buildLibrary} from './ui/library.js';
import {buildSettings} from './ui/settingsApp.js';
import {APPS} from './ui/apps.js';
import {Silhouette} from './ui/silhouette.js';
const $=s=>document.querySelector(s);
$('#go').onclick=async()=>{
  const msg=$('#msg');
  try{
    msg.textContent='Abrindo câmera…';const {mirror}=await startCamera($('#cam'));
    msg.textContent='Carregando modelo de mãos…';const tracker=new HandTracker();await tracker.init();
    $('#start').remove();run(tracker,mirror);
  }catch(e){msg.textContent='Erro: '+(e.message||e);}
};
function run(tracker,mirror){
  const video=$('#cam'),cv=$('#skel'),ctx=cv.getContext('2d'),wm=new WindowManager($('#space'));
  const launch=id=>{
    const a=APPS.find(x=>x.id===id);
    if(id==='library')wm.open(id,{title:'Biblioteca',w:600,h:380,content:buildLibrary(launch)});
    else if(id==='settings')wm.open(id,{title:'Configurações',w:420,h:380,content:buildSettings()});
    else{const c=document.createElement('div');c.className='stub';c.innerHTML=`<div class="cover big" style="background:${a.g}">${a.icon}</div><p>${a.name}<br><small>Sem implementação ainda</small></p>`;wm.open(id,{title:a.name,w:340,h:210,content:c});}
  };
  const handUI=new HandUI($('#handui'),buildDock(launch));
  const gm=new GestureManager(settings);
  gm.register('pinch',detectors.pinch,{graceMs:80});
  gm.register('openPalm',detectors.openPalm,{holdMs:()=>settings.holdMs,graceMs:200}); // hold evita ativação acidental
  gm.register('fist',detectors.fist,{holdMs:700,graceMs:200});
  gm.addEventListener('openPalmStart',e=>handUI.show(e.detail));
  gm.addEventListener('fistStart',()=>handUI.hide());
  const pointer=new Pointer(gm,()=>handUI.visible?handUI.key:null,$('#cursor'));
  const sil=new Silhouette(ctx);
  let last=-1;
  const loop=()=>{
    requestAnimationFrame(loop);
    if(video.readyState<2||video.currentTime===last)return;last=video.currentTime;
    if(cv.width!==innerWidth){cv.width=innerWidth;cv.height=innerHeight;}
    const now=performance.now(),hands=tracker.detect(video,now,coverView(video),mirror);
    gm.update(hands,now);handUI.update(hands,now);pointer.update(hands);
    ctx.clearRect(0,0,cv.width,cv.height);
    if(settings.outline)sil.draw(hands);
  };
  loop();
}

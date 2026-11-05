// Passthrough: câmera traseira em tempo real como fundo
export async function startCamera(video){
  const base={width:{ideal:1280},height:{ideal:720},frameRate:{ideal:60}};
  let stream,mirror=false;
  try{stream=await navigator.mediaDevices.getUserMedia({video:{...base,facingMode:{exact:'environment'}},audio:false});}
  catch{stream=await navigator.mediaDevices.getUserMedia({video:{...base,facingMode:'user'},audio:false});
    mirror=true;video.classList.add('mirror');}
  video.srcObject=stream;await video.play();return{mirror};
}
export function coverView(v){
  const W=innerWidth,H=innerHeight,s=Math.max(W/v.videoWidth,H/v.videoHeight);
  const w=v.videoWidth*s,h=v.videoHeight*s;return{x:(W-w)/2,y:(H-h)/2,w,h};
}

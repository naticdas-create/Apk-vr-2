// Silhueta da mão: contorno branco com brilho azulado ao redor da forma inteira da mão
const FING=[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]];
export class Silhouette{
  constructor(main){this.main=main;this.c=document.createElement('canvas');this.x=this.c.getContext('2d');}
  // desenha a forma da mão (dedos como cápsulas + palma + pulso); grow aumenta a espessura = contorno
  shape(x,h,grow){
    const u=h.size,p=h.pts;x.lineCap=x.lineJoin='round';
    const line=(a,b,w)=>{x.lineWidth=w+grow;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();};
    FING.forEach((f,fi)=>{const base=fi===0?.27:.2;for(let i=0;i<3;i++)line(p[f[i]],p[f[i+1]],u*base*(1-i*.08));});
    x.lineWidth=u*.22+grow;x.beginPath();x.moveTo(p[0].x,p[0].y);[1,5,9,13,17].forEach(k=>x.lineTo(p[k].x,p[k].y));x.closePath();x.stroke();x.fill();
    line(p[0],{x:p[0].x*1.6-p[9].x*.6,y:p[0].y*1.6-p[9].y*.6},u*.42); // antebraço/pulso
  }
  draw(hands){
    const {c,x,main}=this,W=main.canvas.width,H=main.canvas.height;
    if(c.width!==W||c.height!==H){c.width=W;c.height=H;}
    x.clearRect(0,0,W,H);
    for(const h of hands){
      x.globalCompositeOperation='source-over';x.strokeStyle=x.fillStyle='#fff';
      x.shadowColor='rgba(130,175,255,.95)';x.shadowBlur=9;this.shape(x,h,7);  // forma expandida
      x.shadowBlur=0;x.globalCompositeOperation='destination-out';this.shape(x,h,0); // recorta o miolo
    }
    main.drawImage(c,0,0);
  }
}

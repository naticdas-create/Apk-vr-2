export const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
export const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const norm=a=>{const l=Math.hypot(...a)||1;return a.map(v=>v/l);};
// ponto MediaPipe (x dir, y baixo, z longe) -> frame CSS (z em direção ao observador)
const P=(p,m)=>[p.x*m,p.y,-p.z];
// Base 3D da mão: x = índice→mindinho, y = pulso→dedo médio, z = normal da palma
export function handBasis(wl,m){
  const ex=norm(sub(P(wl[17],m),P(wl[5],m)));
  let ey=sub(P(wl[9],m),P(wl[0],m));
  ey=norm(sub(ey,ex.map(v=>v*dot(ey,ex))));
  return [ex,ey,cross(ex,ey)]; // colunas
}
export function matToQuat([ex,ey,ez]){
  const m00=ex[0],m10=ex[1],m20=ex[2],m01=ey[0],m11=ey[1],m21=ey[2],m02=ez[0],m12=ez[1],m22=ez[2];
  const t=m00+m11+m22;let w,x,y,z,s;
  if(t>0){s=Math.sqrt(t+1)*2;w=s/4;x=(m21-m12)/s;y=(m02-m20)/s;z=(m10-m01)/s;}
  else if(m00>m11&&m00>m22){s=Math.sqrt(1+m00-m11-m22)*2;w=(m21-m12)/s;x=s/4;y=(m01+m10)/s;z=(m02+m20)/s;}
  else if(m11>m22){s=Math.sqrt(1+m11-m00-m22)*2;w=(m02-m20)/s;x=(m01+m10)/s;y=s/4;z=(m12+m21)/s;}
  else{s=Math.sqrt(1+m22-m00-m11)*2;w=(m10-m01)/s;x=(m02+m20)/s;y=(m12+m21)/s;z=s/4;}
  return [w,x,y,z];
}
export function nlerp(a,b,t){
  if(a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]<0)b=b.map(v=>-v);
  const r=a.map((v,i)=>v+(b[i]-v)*t),l=Math.hypot(...r);return r.map(v=>v/l);
}
export function quatToMat([w,x,y,z]){ // retorna colunas
  return [[1-2*(y*y+z*z),2*(x*y+w*z),2*(x*z-w*y)],
          [2*(x*y-w*z),1-2*(x*x+z*z),2*(y*z+w*x)],
          [2*(x*z+w*y),2*(y*z-w*x),1-2*(x*x+y*y)]];
}

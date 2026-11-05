const DEF={offsetX:0,offsetY:0.1,offsetZ:0.5,uiScale:1,pinchOn:0.28,smooth:0.5,holdMs:450,outline:true};
export const settings={...DEF,...JSON.parse(localStorage.getItem('mrs')||'{}')};
export const save=()=>localStorage.setItem('mrs',JSON.stringify(settings));
export const reset=()=>{Object.assign(settings,DEF);save();};

export const ease='cubic-bezier(.2,.8,.2,1)';
export const pop=el=>el.animate({scale:[.9,1],opacity:[0,1]},{duration:300,easing:ease});
export const out=(el,done)=>{el.animate({scale:[1,.92],opacity:[1,0]},{duration:200,easing:ease}).onfinish=done;};

export function mount(root, meta){
  const wrap=document.createElement('div'); wrap.className='scene macro';
  wrap.innerHTML=`<div style="position:absolute;inset:0;background:linear-gradient(135deg,#0b1220,#131d2b)"></div>
  <svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%">
    <defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#3a4b66'/><stop offset='1' stop-color='#ffb347'/></linearGradient></defs>
    <circle cx='280' cy='360' r='120' fill='none' stroke='url(#g)' stroke-width='2' opacity='.4'/>
    <circle cx='640' cy='360' r='120' fill='none' stroke='url(#g)' stroke-width='2' opacity='.4'/>
    <circle cx='1000' cy='360' r='120' fill='none' stroke='url(#g)' stroke-width='2' opacity='.4'/>
    <path id='p1' d='M400 360 H520' stroke='#ffb347' stroke-width='3' fill='none'/>
    <path id='p2' d='M760 360 H880' stroke='#ffb347' stroke-width='3' fill='none'/>
  </svg>
  <div style="position:relative;display:flex;gap:24px;align-items:center">
    <div class='n' style="opacity:0;padding:18px 20px;border:1px solid rgba(255,255,255,.2);border-radius:14px;color:#fff">능력</div>
    <div class='n' style="opacity:0;padding:18px 20px;border:1px solid rgba(255,255,255,.2);border-radius:14px;color:#fff">구조</div>
    <div class='n' style="opacity:0;padding:18px 20px;border:1px solid rgba(255,255,255,.2);border-radius:14px;color:#fff">속도</div>
  </div>
  <div id='caption' style="position:absolute;bottom:14%;font:700 34px Inter;color:#eef2f7;opacity:0">의외로 진짜 잘하는 일잘러는 <span style='color:#ffb347'>구조</span>를 먼저 만든다</div>`;
  root.appendChild(wrap);
  const nodes=[...wrap.querySelectorAll('.n')];
  nodes.forEach((el,i)=>el.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:340,delay:180+i*180,fill:'forwards'}));
  ['#p1','#p2'].forEach((id,i)=>{const p=wrap.querySelector(id);const len=p.getTotalLength();p.style.strokeDasharray=len;p.style.strokeDashoffset=len;p.animate([{strokeDashoffset:len},{strokeDashoffset:0}],{duration:420,delay:700+i*220,fill:'forwards'});});
  wrap.querySelector('#caption').animate([{opacity:0},{opacity:1}],{duration:360,delay:1250,fill:'forwards'});
  return ()=>wrap.remove();
}

export function mount(root, meta){
  const wrap=document.createElement('div'); wrap.className='scene micro';
  wrap.innerHTML=`<div style="position:absolute;inset:0;background:#0b111a"></div>
  <div style="position:relative;display:grid;place-items:center;width:100%;height:100%">
    <div id='badge' style="font:800 92px/1 Inter,system-ui;color:#ffb347;letter-spacing:.02em;opacity:0">단순하게</div>
    <div id='sub' style="position:absolute;top:62%;font:500 22px/1.3 Inter;color:#e6edf7;opacity:0">핵심만 남기고, 판단을 줄인다</div>
  </div>`;
  root.appendChild(wrap);
  const b=wrap.querySelector('#badge'); const s=wrap.querySelector('#sub');
  b.animate([{opacity:0,transform:'scale(.7)'},{opacity:1,transform:'scale(1.06)'},{opacity:1,transform:'scale(1)'}],{duration:520,fill:'forwards'});
  s.animate([{opacity:0},{opacity:.9}],{duration:260,delay:420,fill:'forwards'});
  const pulse=b.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:520,delay:900,fill:'forwards'});
  return ()=>{pulse.cancel();wrap.remove();};
}

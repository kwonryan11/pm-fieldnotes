export function mount(root, meta){
  const wrap=document.createElement('div'); wrap.className='scene micro';
  wrap.innerHTML=`<div style="position:absolute;inset:0;background:#0d131e"></div>
  <div style="position:relative;display:grid;grid-template-columns:1fr 1fr;gap:22px;width:min(920px,86vw)">
    <div id='left' style="padding:24px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.2);color:#9db0c7">복잡하게</div>
    <div id='right' style="padding:24px;border-radius:14px;background:rgba(255,179,71,.12);border:1px solid rgba(255,179,71,.6);color:#ffcf8d">단순하게</div>
  </div>
  <div id='arrow' style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font:800 40px Inter;color:#ffb347;opacity:0">→</div>`;
  root.appendChild(wrap);
  const l=wrap.querySelector('#left'), r=wrap.querySelector('#right'), a=wrap.querySelector('#arrow');
  l.animate([{opacity:.2},{opacity:.7}],{duration:260,fill:'forwards'});
  r.animate([{opacity:0,transform:'scale(.9)'},{opacity:1,transform:'scale(1)'}],{duration:360,delay:160,fill:'forwards'});
  a.animate([{opacity:0,transform:'translate(-50%,-50%) scale(.6)'},{opacity:1,transform:'translate(-50%,-50%) scale(1.1)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)'}],{duration:520,delay:280,fill:'forwards'});
  return ()=>wrap.remove();
}

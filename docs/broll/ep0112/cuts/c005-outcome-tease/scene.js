export function mount(root, meta){
  const wrap=document.createElement('div'); wrap.className='scene macro';
  wrap.innerHTML=`<div style="position:absolute;inset:0;background:linear-gradient(180deg,#111a28,#0a1119)"></div>
  <div style="position:relative;width:min(980px,88vw)">
    <div id='before' style="display:flex;gap:10px;flex-wrap:wrap;opacity:.9"></div>
    <div id='after' style="margin-top:18px;padding:18px;border-radius:14px;border:1px solid rgba(255,179,71,.55);background:rgba(255,179,71,.08);opacity:0;color:#eef2f7;font:700 32px Inter">☕ 퇴근 전 커피 마실 시간 확보</div>
  </div>`;
  root.appendChild(wrap);
  const before=wrap.querySelector('#before');
  for(let i=0;i<14;i++){
    const chip=document.createElement('div');
    chip.textContent=['메일','회의','보고','요청'][i%4];
    chip.style.cssText='padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.08);color:#cdd7e5;border:1px solid rgba(255,255,255,.18);font:600 14px Inter;opacity:0';
    before.appendChild(chip);
    chip.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,delay:50*i,fill:'forwards'});
    chip.animate([{opacity:1},{opacity:0}],{duration:260,delay:950+40*i,fill:'forwards'});
  }
  wrap.querySelector('#after').animate([{opacity:0,transform:'translateY(10px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:420,delay:1450,fill:'forwards'});
  return ()=>wrap.remove();
}

export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;display:flex;align-items:center;justify-content:center;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(255,179,71,.14), transparent 48%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 34%, transparent 84%)"></div>

    <div id="card" style="position:relative;max-width:min(980px,84vw);padding:26px 30px;border-radius:18px;border:1px solid rgba(255,255,255,.20);background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));backdrop-filter:blur(4px);font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7;opacity:0;transform:translateY(14px)">
      <div style="display:flex;align-items:center;gap:10px;opacity:.85">
        <div style="font-size:22px">🎬</div>
        <div style="letter-spacing:.16em;font-size:13px;color:#ffb347;font-weight:900">CORE START</div>
      </div>
      <div style="margin-top:14px;font-size:min(50px,5.6vw);font-weight:950;line-height:1.10">이제 코어 3단계
        <br/>들어갑니다</div>

      <div id="chips" style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;opacity:0">
        <div class="chip">1) 차단</div>
        <div class="chip">2) Top3</div>
        <div class="chip">3) 착수</div>
      </div>
    </div>

    <style>
      .chip{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.06);color:#cfe0f4;font:13px/1.1 Inter,system-ui,sans-serif}
    </style>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;
  root.appendChild(wrap);

  const card=wrap.querySelector('#card');
  const chips=wrap.querySelector('#chips');
  const a1=card.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=chips.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:340,delay:520,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const pulse=card.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 34px rgba(255,179,71,.20)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:800,delay:900,fill:'forwards'});
  return ()=>{ for(const a of [a1,a2,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

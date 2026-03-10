export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(255,179,71,.14), transparent 48%), radial-gradient(circle at 22% 82%, rgba(122,183,255,.12), transparent 56%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:16%;font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7">
      <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:900">PROMISE</div>
      <div id="t" style="margin-top:12px;font-size:min(56px,5.7vw);font-weight:950;line-height:1.10;opacity:0;transform:translateY(14px)">
        내 상황에서도<br/>굴러가게
      </div>
      <div id="s" style="margin-top:14px;color:#c9d6e6;opacity:0;font-size:18px">이상적인 루틴 말고, 현실형 루틴으로</div>
    </div>

    <div id="frame" style="position:absolute;left:7%;right:7%;top:56%;border-radius:18px;border:1px solid rgba(255,179,71,.26);background:linear-gradient(180deg,rgba(255,179,71,.10),rgba(255,255,255,.02));backdrop-filter:blur(4px);padding:16px 18px;opacity:0;transform:translateY(10px);font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div style="font-weight:950">규칙:</div>
        <div style="color:#ffb347;font-weight:950">순서만 고정</div>
      </div>
      <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
        <div class="chip">20분</div>
        <div class="chip">40분</div>
        <div class="chip">60분</div>
      </div>
      <div style="margin-top:12px;color:#c9d6e6;opacity:.86;font-size:13px">다음: 코어 3단계부터 실제로 들어갑니다.</div>
    </div>

    <style>
      .chip{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.06);color:#cfe0f4;font:13px/1.1 Inter,system-ui,sans-serif}
    </style>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const t=wrap.querySelector('#t');
  const s=wrap.querySelector('#s');
  const frame=wrap.querySelector('#frame');

  const a1=t.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=s.animate([{opacity:0},{opacity:1}],{duration:420,delay:560,fill:'forwards'});
  const a3=frame.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:900,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const pulse=frame.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 34px rgba(255,179,71,.20)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:900,delay:1500,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(255,179,71,.14), transparent 48%), radial-gradient(circle at 22% 80%, rgba(122,183,255,.12), transparent 56%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:16%;font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7">
      <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:900">PRINCIPLE</div>
      <div id="t" style="margin-top:12px;font-size:min(56px,5.7vw);font-weight:950;line-height:1.10;opacity:0;transform:translateY(14px)">
        순서는 고정,<br/>시간은 유동
      </div>
      <div id="s" style="margin-top:14px;color:#c9d6e6;opacity:0;font-size:18px">순서만 지키면 20분도 효과가 난다</div>
    </div>

    <div style="position:absolute;left:7%;right:7%;top:54%;display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch">
      <div id="order" style="border:1px solid rgba(255,179,71,.26);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,179,71,.10),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:22px">🧭</div><div style="font-weight:950">고정: 순서</div></div>
        <div style="margin-top:10px;color:#c9d6e6;opacity:.86">1) 차단 → 2) Top3 → 3) 착수</div>
      </div>
      <div id="time" style="border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:22px">⏱️</div><div style="font-weight:950">유동: 시간</div></div>
        <div style="margin-top:10px;color:#c9d6e6;opacity:.86">20분 / 40분 / 60분</div>
      </div>
    </div>

    <div style="position:absolute;left:7%;right:7%;bottom:22%;font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7;opacity:.0" id="chips">
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <div class="chip">라이트 20분</div>
        <div class="chip">베이직 40분</div>
        <div class="chip">풀 60분</div>
      </div>
    </div>

    <style>
      .chip{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.06);color:#cfe0f4;font:13px/1.1 Inter,system-ui,sans-serif}
    </style>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const t=wrap.querySelector('#t');
  const s=wrap.querySelector('#s');
  const order=wrap.querySelector('#order');
  const time=wrap.querySelector('#time');
  const chips=wrap.querySelector('#chips');

  const a1=t.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=s.animate([{opacity:0},{opacity:1}],{duration:420,delay:560,fill:'forwards'});
  const a3=order.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:860,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a4=time.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:1040,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a5=chips.animate([{opacity:0,transform:'translateY(8px)'},{opacity:.95,transform:'translateY(0)'}],{duration:420,delay:1320,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  const pulse=order.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 34px rgba(255,179,71,.18)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:900,delay:1700,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,a4,a5,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

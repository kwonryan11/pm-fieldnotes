export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(255,179,71,.14), transparent 48%), radial-gradient(circle at 22% 82%, rgba(122,183,255,.12), transparent 56%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:14%;font-family:Inter,system-ui,sans-serif;color:#eef2f7">
      <div id="badge" style="display:inline-flex;gap:10px;align-items:center;opacity:0;transform:translateY(10px)">
        <div style="font-size:26px">🏁</div>
        <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:900">STEP 3</div>
      </div>
      <div id="t" style="margin-top:12px;font-size:min(54px,5.6vw);font-weight:950;line-height:1.08;opacity:0;transform:translateY(14px)">
        첫 승리 만들기
        <br/><span style="color:#c9d6e6;font-weight:850">(착수 흔적)</span>
      </div>
      <div id="s" style="margin-top:14px;color:#c9d6e6;opacity:0;font-size:18px">완성이 아니라 “시작”이 불안을 없앱니다.</div>
    </div>

    <div style="position:absolute;left:7%;right:7%;top:52%;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:stretch">
      <div id="e1" class="ex"></div>
      <div id="e2" class="ex"></div>
      <div id="e3" class="ex"></div>
    </div>

    <div id="flow" style="position:absolute;left:7%;right:7%;bottom:24%;height:56px;border-radius:16px;border:1px solid rgba(255,179,71,.26);background:linear-gradient(180deg,rgba(255,179,71,.10),rgba(255,255,255,.02));backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:space-between;padding:0 18px;font-family:Inter,system-ui,sans-serif;color:#eef2f7;opacity:0;transform:translateY(10px)">
      <div style="display:flex;align-items:center;gap:10px"><div style="font-size:18px">😰</div><div style="font-weight:950">“어디서부터 하지?”</div></div>
      <div style="color:#ffb347;font-weight:950">→</div>
      <div style="display:flex;align-items:center;gap:10px"><div style="font-size:18px">🎯</div><div style="font-weight:950">“일단 시작”</div></div>
    </div>

    <style>
      .ex{border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(14px)}
      .k{letter-spacing:.16em;font-size:12px;color:#c9d6e6;opacity:.9}
      .t{margin-top:8px;font-weight:950}
      .s{margin-top:6px;color:#c9d6e6;opacity:.86;font-size:13px;line-height:1.25}
    </style>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const badge=wrap.querySelector('#badge');
  const t=wrap.querySelector('#t');
  const s=wrap.querySelector('#s');
  const e1=wrap.querySelector('#e1');
  const e2=wrap.querySelector('#e2');
  const e3=wrap.querySelector('#e3');
  const flow=wrap.querySelector('#flow');

  e1.innerHTML=`<div class="k">EXAMPLE</div><div class="t">목차 3줄</div><div class="s">기획서 · 보고서</div>`;
  e2.innerHTML=`<div class="k">EXAMPLE</div><div class="t">첫 문단 5줄</div><div class="s">보고서 · 메일</div>`;
  e3.innerHTML=`<div class="k">EXAMPLE</div><div class="t">링크 3개</div><div class="s">자료 수집</div>`;

  const a1=badge.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=t.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:120,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3=s.animate([{opacity:0},{opacity:1}],{duration:420,delay:720,fill:'forwards'});

  const a4=e1.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:980,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a5=e2.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:1120,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a6=e3.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:1260,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  const a7=flow.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:1560,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const pulse=flow.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 34px rgba(255,179,71,.18)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:900,delay:1900,fill:'forwards'});

  return ()=>{ for(const an of [a1,a2,a3,a4,a5,a6,a7,pulse]){try{an.cancel()}catch{}} wrap.remove(); };
}

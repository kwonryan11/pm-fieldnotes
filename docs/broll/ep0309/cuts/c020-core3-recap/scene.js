export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;display:flex;align-items:center;justify-content:center;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(255,179,71,.14), transparent 48%), radial-gradient(circle at 22% 82%, rgba(122,183,255,.12), transparent 56%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 34%, transparent 84%)"></div>

    <div id="card" style="position:relative;max-width:min(980px,84vw);padding:26px 30px;border-radius:18px;border:1px solid rgba(255,255,255,.20);background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));backdrop-filter:blur(4px);font-family:Inter,system-ui,sans-serif;color:#eef2f7;opacity:0;transform:translateY(14px)">
      <div style="display:flex;align-items:center;gap:10px;opacity:.85">
        <div style="font-size:22px">✅</div>
        <div style="letter-spacing:.16em;font-size:13px;color:#ffb347;font-weight:900">CORE 3 RECAP</div>
      </div>
      <div style="margin-top:14px;font-size:min(44px,5.2vw);font-weight:950;line-height:1.12">코어 3개만 기억하세요</div>

      <div style="margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px" id="grid">
        <div class="it" id="i1"><div class="n">1</div><div class="t">차단</div><div class="s">폰/알림</div></div>
        <div class="it" id="i2"><div class="n">2</div><div class="t">Top3</div><div class="s">+ Not-to-do</div></div>
        <div class="it" id="i3"><div class="n">3</div><div class="t">착수</div><div class="s">첫 10분</div></div>
      </div>
    </div>

    <style>
      .it{border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:14px 14px;background:rgba(255,255,255,.05);opacity:0;transform:translateY(10px)}
      .n{width:26px;height:26px;border-radius:10px;background:rgba(255,179,71,.16);border:1px solid rgba(255,179,71,.40);display:flex;align-items:center;justify-content:center;color:#ffb347;font-weight:950}
      .t{margin-top:8px;font-weight:950}
      .s{margin-top:4px;color:#c9d6e6;opacity:.86;font-size:13px}
    </style>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const card=wrap.querySelector('#card');
  const i1=wrap.querySelector('#i1');
  const i2=wrap.querySelector('#i2');
  const i3=wrap.querySelector('#i3');

  const a1=card.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=i1.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,delay:520,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3=i2.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,delay:660,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a4=i3.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,delay:800,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const pulse=i2.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 30px rgba(255,179,71,.18)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:820,delay:1200,fill:'forwards'});
  return ()=>{ for(const a of [a1,a2,a3,a4,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

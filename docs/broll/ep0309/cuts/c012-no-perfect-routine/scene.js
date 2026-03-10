export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 68% 18%, rgba(255,179,71,.14), transparent 48%), radial-gradient(circle at 24% 78%, rgba(122,183,255,.12), transparent 56%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:16%;font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7">
      <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:900">RULE</div>
      <div id="t" style="margin-top:12px;font-size:min(54px,5.6vw);font-weight:950;line-height:1.10;opacity:0;transform:translateY(14px)">
        완벽한 루틴 말고<br/>안 무너지는 루틴
      </div>
    </div>

    <div style="position:absolute;left:7%;right:7%;top:54%;display:grid;grid-template-columns:1fr 120px 1fr;gap:14px;align-items:stretch">
      <div id="x" style="border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:22px">❌</div><div style="font-weight:950">완벽</div></div>
        <div style="margin-top:10px;color:#c9d6e6;opacity:.86">매일 60분 · 매일 100점</div>
      </div>

      <div id="arrow" style="display:flex;align-items:center;justify-content:center;opacity:0;transform:translateY(10px);font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#ffb347;font-weight:950;font-size:28px">→</div>

      <div id="o" style="border:1px solid rgba(255,179,71,.26);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,179,71,.10),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:22px">✅</div><div style="font-weight:950">지속</div></div>
        <div style="margin-top:10px;color:#c9d6e6;opacity:.86">20분이어도 굴러가게</div>
      </div>
    </div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const t=wrap.querySelector('#t');
  const x=wrap.querySelector('#x');
  const o=wrap.querySelector('#o');
  const arrow=wrap.querySelector('#arrow');

  const a1=t.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=x.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:700,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3=arrow.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,delay:860,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a4=o.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:1000,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  const pulse=o.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 34px rgba(255,179,71,.22)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:900,delay:1500,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,a4,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;display:flex;align-items:center;justify-content:center;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 65% 18%, rgba(255,179,71,.12), transparent 45%), radial-gradient(circle at 25% 78%, rgba(122,183,255,.12), transparent 52%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 36%, transparent 86%)"></div>

    <div id="card" style="position:relative;max-width:min(980px,84vw);padding:24px 28px;border-radius:18px;border:1px solid rgba(255,255,255,.18);background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));backdrop-filter:blur(4px);font-family:Inter,system-ui,sans-serif;color:#eef2f7;opacity:0;transform:translateY(14px)">
      <div style="display:flex;align-items:center;gap:10px;opacity:.85">
        <div style="font-size:22px">🍼</div>
        <div style="letter-spacing:.16em;font-size:13px;color:#c9d6e6">LIFE SHIFT</div>
      </div>

      <div style="margin-top:14px;font-size:min(46px,5.1vw);font-weight:950;line-height:1.12">육아 시작하고<br/>밤이 끝났습니다</div>
      <div style="margin-top:10px;color:#c9d6e6;opacity:.86;font-size:18px">아이 재우고 나면, 저는 방전이더라고요.</div>

      <div style="margin-top:18px;display:flex;gap:14px;align-items:center">
        <div style="flex:1">
          <div style="font-size:12px;letter-spacing:.16em;color:#c9d6e6;opacity:.9">ENERGY</div>
          <div style="margin-top:8px;height:10px;border-radius:999px;background:rgba(255,255,255,.10);overflow:hidden">
            <div id="bar" style="height:100%;width:78%;background:linear-gradient(90deg,#7ab7ff,rgba(122,183,255,.18));border-radius:999px"></div>
          </div>
        </div>
        <div id="label" style="min-width:140px;text-align:right;font-weight:900;color:#ffb347;opacity:0">밤엔 0%…</div>
      </div>
    </div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const card=wrap.querySelector('#card');
  const bar=wrap.querySelector('#bar');
  const label=wrap.querySelector('#label');

  const a1=card.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=bar.animate([{width:'78%'},{width:'8%'}],{duration:1200,delay:420,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3=label.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,delay:980,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  const pulse=label.animate([{textShadow:'0 0 0 rgba(255,179,71,0)'},{textShadow:'0 0 22px rgba(255,179,71,.42)'},{textShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:720,delay:1400,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

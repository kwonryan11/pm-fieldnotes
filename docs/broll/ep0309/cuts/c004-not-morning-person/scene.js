export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;display:flex;align-items:center;justify-content:center;';
  wrap.innerHTML=`
    <div id="bg" style="position:absolute;inset:0;background:radial-gradient(circle at 70% 25%, rgba(122,183,255,.10), transparent 48%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 36%, transparent 86%)"></div>

    <div id="panel" style="position:relative;max-width:min(980px,84vw);padding:26px 30px;border-radius:18px;border:1px solid rgba(255,255,255,.18);background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));backdrop-filter:blur(4px);font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7;opacity:0;transform:translateY(10px)">
      <div style="display:flex;align-items:center;gap:10px;opacity:.85">
        <div style="font-size:22px">🚫</div>
        <div style="letter-spacing:.16em;font-size:13px;color:#c9d6e6">RESET EXPECTATION</div>
      </div>

      <div style="margin-top:14px;font-size:min(44px,4.9vw);font-weight:900;line-height:1.12">아침형 인간 얘기<br/>아닙니다.</div>
      <div style="margin-top:14px;color:#c9d6e6;opacity:.86;font-size:18px">[강조] 동기부여 말고, 순서(구조)입니다.</div>

      <div id="stamp" style="position:absolute;right:22px;top:18px;border:2px solid rgba(255,179,71,.65);color:#ffb347;border-radius:12px;padding:10px 12px;font-weight:950;letter-spacing:.12em;transform:rotate(-10deg) scale(.85);opacity:0;">
        NOT
      </div>

      <div id="focus" style="position:absolute;left:18px;right:18px;bottom:16px;height:58px;border-radius:14px;border:1px solid rgba(255,179,71,.55);box-shadow:0 0 0 rgba(255,179,71,0);opacity:0"></div>
    </div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;
  root.appendChild(wrap);

  const panel=wrap.querySelector('#panel');
  const stamp=wrap.querySelector('#stamp');
  const focus=wrap.querySelector('#focus');
  const bg=wrap.querySelector('#bg');

  const a1 = panel.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:340,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  const a2 = stamp.animate([
    {opacity:0, transform:'rotate(-12deg) scale(.75)'},
    {opacity:1, transform:'rotate(-10deg) scale(1)'},
    {opacity:1, transform:'rotate(-10deg) scale(.98)'}
  ],{duration:380,delay:240,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  // dim background briefly to create contrast
  const a3 = bg.animate([{filter:'brightness(1)'},{filter:'brightness(.85)'}],{duration:520,delay:520,fill:'forwards'});

  const a4 = focus.animate([{opacity:0},{opacity:1}],{duration:260,delay:820,fill:'forwards'});
  const a5 = focus.animate([
    {boxShadow:'0 0 0 rgba(255,179,71,0)'},
    {boxShadow:'0 0 34px rgba(255,179,71,.22)'},
    {boxShadow:'0 0 0 rgba(255,179,71,0)'}
  ],{duration:900,delay:980,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,a4,a5]){try{a.cancel()}catch{}} wrap.remove(); };
}

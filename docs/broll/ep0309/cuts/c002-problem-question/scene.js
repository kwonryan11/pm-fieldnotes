export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;display:flex;align-items:center;justify-content:center;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 35%, rgba(255,179,71,.12), transparent 45%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 85%)"></div>

    <div id="card" style="position:relative;max-width:min(980px,82vw);padding:26px 30px;border-radius:18px;border:1px solid rgba(255,255,255,.20);background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));backdrop-filter:blur(4px);color:#eef2f7;font-family:Inter,system-ui,sans-serif;opacity:0;transform:translateY(14px)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;opacity:.85">
        <div style="font-size:22px">⚠️</div>
        <div style="letter-spacing:.16em;font-size:13px;color:#ffb347;font-weight:800">THE QUESTION</div>
      </div>
      <div style="font-size:min(46px,5.2vw);font-weight:850;line-height:1.12">그래서 아침에 뭘 해야,<br/>진짜 하루가 달라지는데?</div>
      <div style="margin-top:16px;color:#c9d6e6;opacity:.82;font-size:18px">오늘 영상은 “동기부여” 말고 “순서”입니다.</div>

      <div style="position:relative;height:14px;margin-top:18px">
        <div id="ul" style="position:absolute;left:0;right:42%;top:6px;height:2px;background:linear-gradient(90deg,#ffb347,rgba(255,179,71,.15));border-radius:999px;transform:scaleX(0);transform-origin:left"></div>
        <div id="dot" style="position:absolute;right:42%;top:0;width:14px;height:14px;border-radius:999px;background:#ffb347;opacity:0;transform:scale(.6)"></div>
      </div>
    </div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;
  root.appendChild(wrap);

  const card=wrap.querySelector('#card');
  const ul=wrap.querySelector('#ul');
  const dot=wrap.querySelector('#dot');

  const a1 = card.animate([
    {opacity:0, transform:'translateY(14px)'},
    {opacity:1, transform:'translateY(0)'}
  ],{duration:380, fill:'forwards', easing:'cubic-bezier(.2,.8,.2,1)'});

  const a2 = ul.animate([
    {transform:'scaleX(0)'},
    {transform:'scaleX(1)'}
  ],{duration:650, delay:360, fill:'forwards', easing:'cubic-bezier(.2,.8,.2,1)'});

  const a3 = dot.animate([
    {opacity:0, transform:'scale(.6)'},
    {opacity:1, transform:'scale(1)'},
    {opacity:1, transform:'scale(.96)'},
  ],{duration:520, delay:880, fill:'forwards', easing:'cubic-bezier(.2,.8,.2,1)'});

  const pulse = dot.animate([
    {boxShadow:'0 0 0 rgba(255,179,71,0)'},
    {boxShadow:'0 0 26px rgba(255,179,71,.55)'},
    {boxShadow:'0 0 0 rgba(255,179,71,0)'}
  ],{duration:820, delay:1300, fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

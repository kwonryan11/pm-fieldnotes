export function mount(root){
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML = `
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(255,179,71,.22), transparent 40%), radial-gradient(circle at 20% 80%, rgba(84,156,255,.14), transparent 46%), linear-gradient(180deg,#0b1020,#070b14);"></div>
    <div style="position:absolute;inset:0;opacity:.12;background-image:linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px);background-size:52px 52px;mask-image:radial-gradient(circle at 50% 45%, black 42%, transparent 86%)"></div>

    <div style="position:absolute;left:8%;right:8%;top:18%;height:1px;background:linear-gradient(90deg,transparent,#ffb347,transparent);opacity:.7"></div>

    <div style="position:absolute;left:8%;top:22%;right:8%;font-family:Inter,system-ui,sans-serif;color:#eef2f7">
      <div id="badge" style="display:inline-flex;gap:10px;align-items:center;opacity:0;transform:translateY(10px)">
        <div style="font-size:28px">🌅</div>
        <div style="font-size:14px;letter-spacing:.18em;color:#ffb347;font-weight:800">MORNING SYSTEM</div>
      </div>

      <div id="title" style="margin-top:14px;font-size:min(64px,6.2vw);font-weight:850;line-height:1.06;opacity:0;transform:translateY(14px)">
        좋은 아침이<br/>좋은 하루를 만든다
      </div>

      <div id="sub" style="margin-top:18px;font-size:20px;opacity:0;color:#c9d6e6">직장인 아침 루틴 · 코어 3개</div>
    </div>

    <div style="position:absolute;right:9%;top:26%;width:min(220px,22vw);height:min(220px,22vw);">
      <svg id="ring" viewBox="0 0 120 120" style="width:100%;height:100%;opacity:0">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffb347" stop-opacity=".95"/>
            <stop offset="1" stop-color="#7ab7ff" stop-opacity=".65"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="44" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.15)" stroke-width="8"/>
        <circle id="prog" cx="60" cy="60" r="44" fill="none" stroke="url(#g)" stroke-width="8" stroke-linecap="round" stroke-dasharray="276" stroke-dashoffset="276"/>
        <text x="60" y="66" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="16" fill="#eef2f7" opacity=".9">START</text>
      </svg>
    </div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);

  const badge = wrap.querySelector('#badge');
  const title = wrap.querySelector('#title');
  const sub = wrap.querySelector('#sub');
  const ring = wrap.querySelector('#ring');
  const prog = wrap.querySelector('#prog');

  const a1 = badge.animate([
    {opacity:0, transform:'translateY(10px)'},
    {opacity:1, transform:'translateY(0)'}
  ], {duration:360, fill:'forwards', easing:'cubic-bezier(.2,.8,.2,1)'});

  const a2 = title.animate([
    {opacity:0, transform:'translateY(14px) scale(.99)'},
    {opacity:1, transform:'translateY(0) scale(1)'}
  ], {duration:520, delay:160, fill:'forwards', easing:'cubic-bezier(.2,.8,.2,1)'});

  const a3 = sub.animate([{opacity:0},{opacity:1}], {duration:420, delay:760, fill:'forwards'});

  const a4 = ring.animate([{opacity:0, transform:'scale(.98)'},{opacity:1, transform:'scale(1)'}], {duration:420, delay:380, fill:'forwards'});

  // ring progress draw
  const total = 276;
  const a5 = prog.animate([
    {strokeDashoffset: total},
    {strokeDashoffset: total * 0.38},
  ], {duration:1400, delay:520, fill:'forwards', easing:'cubic-bezier(.2,.8,.2,1)'});

  const pulse = title.animate([
    {textShadow:'0 0 0 rgba(255,179,71,0)'},
    {textShadow:'0 0 30px rgba(255,179,71,.38)'},
    {textShadow:'0 0 0 rgba(255,179,71,0)'}
  ], {duration:820, delay:1800, fill:'forwards'});

  return ()=>{
    for (const a of [a1,a2,a3,a4,a5,pulse]) { try{ a.cancel(); }catch{} }
    wrap.remove();
  };
}

export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 65% 25%, rgba(255,179,71,.10), transparent 48%), radial-gradient(circle at 25% 70%, rgba(122,183,255,.10), transparent 52%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:54px 54px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:18%;font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7">
      <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:800;opacity:.9">MORNING CHAOS</div>
      <div style="margin-top:10px;font-size:min(44px,4.8vw);font-weight:850;line-height:1.12">알림이 시작을 잡아먹는다</div>
      <div style="margin-top:8px;color:#c9d6e6;opacity:.85">메일 · 메신저 · 캘린더… (반응형 루틴)</div>
    </div>

    <div id="stack" style="position:absolute;left:7%;right:7%;top:44%;display:grid;grid-template-columns:repeat(3,1fr);gap:14px"></div>

    <div style="position:absolute;left:7%;right:7%;bottom:22%;font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7">
      <div style="display:flex;align-items:center;justify-content:space-between;opacity:.85">
        <div style="letter-spacing:.16em;font-size:12px;color:#c9d6e6">CHAOS METER</div>
        <div id="pct" style="font-size:12px;color:#ffb347;font-weight:800;opacity:0">0%</div>
      </div>
      <div style="margin-top:8px;height:10px;border-radius:999px;background:rgba(255,255,255,.10);overflow:hidden">
        <div id="bar" style="height:100%;width:0%;background:linear-gradient(90deg,#ffb347,rgba(255,179,71,.18));border-radius:999px"></div>
      </div>
    </div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);

  const stack=wrap.querySelector('#stack');
  const bar=wrap.querySelector('#bar');
  const pct=wrap.querySelector('#pct');

  const cards = [
    {icon:'⏰', title:'알람', sub:'snooze → snooze'},
    {icon:'📩', title:'메일', sub:'읽음/답장/재확인'},
    {icon:'💬', title:'메신저', sub:'즉시 반응 압박'}
  ].map((c,idx)=>{
    const el=document.createElement('div');
    el.style.cssText='border:1px solid rgba(255,255,255,.18);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(14px)';
    el.innerHTML=`<div style="font-size:26px">${c.icon}</div><div style="margin-top:8px;font-weight:850;font-size:18px;color:#eef2f7">${c.title}</div><div style="margin-top:4px;color:#c9d6e6;opacity:.85;font-size:13px">${c.sub}</div>`;
    stack.appendChild(el);
    const anim = el.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:idx*120,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
    return {el, anim};
  });

  const barAnim = bar.animate([{width:'0%'},{width:'74%'}],{duration:1200,delay:520,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const pctAnim = pct.animate([{opacity:0},{opacity:1}],{duration:220,delay:520,fill:'forwards'});

  // counter
  let raf=0; let start=0;
  function tick(ts){
    if(!start) start=ts;
    const t=Math.min(1,(ts-start)/1200);
    pct.textContent = `${Math.round(74*t)}%`;
    if(t<1) raf=requestAnimationFrame(tick);
  }
  raf=requestAnimationFrame(tick);

  // stabilize: dim chaos slightly to imply control
  const stabilize = wrap.animate([{filter:'saturate(1)'},{filter:'saturate(.92)'}],{duration:420,delay:2100,fill:'forwards'});

  return ()=>{
    for(const c of cards){ try{c.anim.cancel();}catch{} }
    for(const a of [barAnim,pctAnim,stabilize]){ try{a.cancel()}catch{} }
    if(raf) cancelAnimationFrame(raf);
    wrap.remove();
  };
}

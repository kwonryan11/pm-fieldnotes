export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;display:flex;align-items:center;justify-content:center;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 22%, rgba(255,179,71,.14), transparent 46%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 36%, transparent 86%)"></div>

    <div style="position:relative;max-width:min(980px,84vw);padding:24px 28px;border-radius:18px;border:1px solid rgba(255,255,255,.18);background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));backdrop-filter:blur(4px);font-family:Inter,system-ui,sans-serif;color:#eef2f7">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:14px">
        <div>
          <div style="letter-spacing:.16em;font-size:13px;color:#c9d6e6;opacity:.9">REALITY CHECK</div>
          <div style="margin-top:10px;font-size:min(48px,5.2vw);font-weight:950;line-height:1.12">배터리 1%로는<br/>안 됩니다</div>
          <div style="margin-top:10px;color:#c9d6e6;opacity:.86;font-size:18px">[강조] 의지 얘기 전에, 구조를 바꿔야 해요.</div>
        </div>

        <div style="width:min(280px,28vw);min-width:210px">
          <div id="bat" style="position:relative;height:56px;border-radius:16px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);overflow:hidden">
            <div id="fill" style="position:absolute;inset:0;width:7%;background:linear-gradient(90deg,#ffb347,rgba(255,179,71,.20));"></div>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:950;letter-spacing:.08em">1%</div>
          </div>
          <div id="warn" style="margin-top:10px;color:#ffb347;font-weight:900;opacity:0">LOW POWER</div>
        </div>
      </div>

      <div id="pulseLine" style="margin-top:18px;height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,#ffb347,transparent);opacity:0"></div>
    </div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;
  root.appendChild(wrap);

  const fill=wrap.querySelector('#fill');
  const warn=wrap.querySelector('#warn');
  const pulseLine=wrap.querySelector('#pulseLine');

  const a1 = wrap.firstElementChild.animate([{opacity:0},{opacity:1}],{duration:1,fill:'forwards'});
  const a2 = fill.animate([{width:'7%'},{width:'1%'}],{duration:1000,delay:320,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3 = warn.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,delay:800,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a4 = pulseLine.animate([{opacity:0},{opacity:1},{opacity:0}],{duration:900,delay:1200,fill:'forwards'});

  const shake = warn.animate([
    {transform:'translateX(0)'},
    {transform:'translateX(-2px)'},
    {transform:'translateX(2px)'},
    {transform:'translateX(0)'}
  ],{duration:260,delay:900,iterations:2});

  return ()=>{ for(const a of [a1,a2,a3,a4,shake]){try{a.cancel()}catch{}} wrap.remove(); };
}

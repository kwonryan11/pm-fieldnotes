export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 65% 18%, rgba(255,179,71,.18), transparent 44%), radial-gradient(circle at 28% 72%, rgba(122,183,255,.12), transparent 55%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:54px 54px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:16%;font-family:Inter,system-ui,sans-serif;color:#eef2f7">
      <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:800;opacity:.95">CORE 3</div>
      <div style="margin-top:10px;font-size:min(46px,5.0vw);font-weight:900;line-height:1.12">내일 아침, 딱 이것만</div>
      <div style="margin-top:8px;color:#c9d6e6;opacity:.86">순서는 고정 · 시간은 유동</div>
    </div>

    <div style="position:absolute;left:7%;right:7%;top:40%;display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
      <div id="c1" class="card"></div>
      <div id="c2" class="card"></div>
      <div id="c3" class="card"></div>
    </div>

    <svg id="conn" viewBox="0 0 1000 140" preserveAspectRatio="none" style="position:absolute;left:7%;right:7%;top:56%;height:120px;opacity:0">
      <path id="p" d="M130,70 C260,70 260,70 390,70 C520,70 520,70 650,70 C780,70 780,70 910,70" fill="none" stroke="rgba(255,179,71,.65)" stroke-width="3" stroke-linecap="round" stroke-dasharray="12 10"/>
    </svg>

    <style>
      .card{border:1px solid rgba(255,255,255,.18);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(14px)}
      .n{display:flex;gap:10px;align-items:center}
      .num{width:28px;height:28px;border-radius:10px;background:rgba(255,179,71,.16);border:1px solid rgba(255,179,71,.45);display:flex;align-items:center;justify-content:center;color:#ffb347;font-weight:900}
      .t{font-weight:900;font-size:18px;color:#eef2f7}
      .s{margin-top:6px;color:#c9d6e6;opacity:.86;font-size:13px;line-height:1.25}
    </style>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);

  const c1=wrap.querySelector('#c1');
  const c2=wrap.querySelector('#c2');
  const c3=wrap.querySelector('#c3');
  const conn=wrap.querySelector('#conn');
  const p=wrap.querySelector('#p');

  c1.innerHTML=`<div class="n"><div class="num">1</div><div><div class="t">폰/알림 차단</div><div class="s">무반응 10분</div></div></div>`;
  c2.innerHTML=`<div class="n"><div class="num">2</div><div><div class="t">할 일 3개</div><div class="s">+ 안 할 일 1개</div></div></div>`;
  c3.innerHTML=`<div class="n"><div class="num">3</div><div><div class="t">10분 착수</div><div class="s">완성 말고 ‘흔적’</div></div></div>`;

  const a1 = c1.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:120,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2 = c2.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:380,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3 = c3.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:640,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  // connector appear + dash drift
  const a4 = conn.animate([{opacity:0},{opacity:1}],{duration:260,delay:720,fill:'forwards'});
  const drift = p.animate([{strokeDashoffset:0},{strokeDashoffset:-44}],{duration:1400,delay:900,iterations:2});

  // highlight sweep across cards
  const glow = wrap.animate([{filter:'brightness(1)'},{filter:'brightness(1.05)'},{filter:'brightness(1)'}],{duration:700,delay:1700,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,a4,drift,glow]){try{a.cancel()}catch{}} wrap.remove(); };
}

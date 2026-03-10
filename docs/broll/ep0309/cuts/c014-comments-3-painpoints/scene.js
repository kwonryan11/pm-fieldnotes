export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(122,183,255,.12), transparent 52%), radial-gradient(circle at 26% 82%, rgba(255,179,71,.10), transparent 56%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:16%;font-family:Inter,system-ui,sans-serif;color:#eef2f7">
      <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:900">SITUATION PICK</div>
      <div style="margin-top:12px;font-size:min(52px,5.4vw);font-weight:950;line-height:1.10">내 상황에 맞춰
        <br/>고르면 됩니다</div>
      <div style="margin-top:14px;color:#c9d6e6;opacity:.86;font-size:18px">시간이 다르면, ‘버전’만 바꾸면 돼요</div>
    </div>

    <div style="position:absolute;left:7%;right:7%;top:54%;display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
      <div id="i1" class="item"></div>
      <div id="i2" class="item"></div>
      <div id="i3" class="item"></div>
    </div>

    <style>
      .item{border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(14px)}
      .n{display:flex;gap:10px;align-items:center}
      .b{width:28px;height:28px;border-radius:10px;background:rgba(122,183,255,.12);border:1px solid rgba(122,183,255,.30);display:flex;align-items:center;justify-content:center;color:#cfe0f4;font-weight:900}
      .t{font-weight:950;font-size:16px;color:#eef2f7;line-height:1.2}
      .s{margin-top:6px;color:#c9d6e6;opacity:.86;font-size:13px;line-height:1.25}
    </style>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const i1=wrap.querySelector('#i1');
  const i2=wrap.querySelector('#i2');
  const i3=wrap.querySelector('#i3');

  i1.innerHTML=`<div class="n"><div class="b">1</div><div><div class="t">오늘은<br/>20분밖에 없다</div><div class="s">라이트 버전으로 ‘순서만’</div></div></div>`;
  i2.innerHTML=`<div class="n"><div class="b">2</div><div><div class="t">늦퇴/육아로<br/>아침이 흔들린다</div><div class="s">시간 줄이고 코어만 고정</div></div></div>`;
  i3.innerHTML=`<div class="n"><div class="b">3</div><div><div class="t">작심삼일이<br/>반복된다</div><div class="s">기억 말고 체크리스트로</div></div></div>`;

  const a1=i1.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:140,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=i2.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:360,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3=i3.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:580,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  const pulse=i2.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 34px rgba(255,179,71,.16)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:900,delay:1350,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

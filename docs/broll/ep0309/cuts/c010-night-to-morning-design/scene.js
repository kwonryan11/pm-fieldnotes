export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(255,179,71,.14), transparent 46%), radial-gradient(circle at 26% 78%, rgba(122,183,255,.12), transparent 56%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:16%;font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7">
      <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:900">DIRECTION CHANGE</div>
      <div id="t" style="margin-top:12px;font-size:min(56px,5.7vw);font-weight:950;line-height:1.10;opacity:0;transform:translateY(14px)">
        밤에 버티기 말고<br/>아침을 설계
      </div>
      <div id="s" style="margin-top:14px;color:#c9d6e6;opacity:0;font-size:18px">버티는 시간 → 주도권 잡는 시간</div>
    </div>

    <div style="position:absolute;left:7%;right:7%;top:54%;display:grid;grid-template-columns:1fr 120px 1fr;gap:14px;align-items:stretch">
      <div id="night" style="border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:22px">🌙</div><div style="font-weight:950">밤</div></div>
        <div style="margin-top:10px;color:#c9d6e6;opacity:.86">피로 누적</div>
        <div style="margin-top:8px;height:10px;border-radius:999px;background:rgba(255,255,255,.10);overflow:hidden"><div style="height:100%;width:22%;background:linear-gradient(90deg,rgba(255,255,255,.35),rgba(255,255,255,.08))"></div></div>
      </div>

      <div id="switch" style="display:flex;align-items:center;justify-content:center;opacity:0;transform:translateY(10px)">
        <div style="width:58px;height:58px;border-radius:16px;border:1px solid rgba(255,179,71,.35);background:rgba(255,179,71,.10);display:flex;align-items:center;justify-content:center;color:#ffb347;font-weight:950;font-size:20px">↻</div>
      </div>

      <div id="morning" style="border:1px solid rgba(255,179,71,.26);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,179,71,.10),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:22px">🌅</div><div style="font-weight:950">아침</div></div>
        <div style="margin-top:10px;color:#c9d6e6;opacity:.86">주도권 확보</div>
        <div style="margin-top:8px;height:10px;border-radius:999px;background:rgba(255,255,255,.10);overflow:hidden"><div id="fill" style="height:100%;width:0%;background:linear-gradient(90deg,#ffb347,rgba(255,179,71,.18))"></div></div>
      </div>
    </div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);

  const t=wrap.querySelector('#t');
  const s=wrap.querySelector('#s');
  const night=wrap.querySelector('#night');
  const morning=wrap.querySelector('#morning');
  const sw=wrap.querySelector('#switch');
  const fill=wrap.querySelector('#fill');

  const a1=t.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=s.animate([{opacity:0},{opacity:1}],{duration:420,delay:560,fill:'forwards'});

  const a3=night.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:820,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a4=sw.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,delay:980,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a5=morning.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:1120,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a6=fill.animate([{width:'0%'},{width:'78%'}],{duration:1200,delay:1320,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  const rotate=sw.firstElementChild.animate([{transform:'rotate(0deg)'},{transform:'rotate(180deg)'}],{duration:680,delay:1200,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const pulse=morning.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 34px rgba(255,179,71,.22)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:900,delay:2100,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,a4,a5,a6,rotate,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

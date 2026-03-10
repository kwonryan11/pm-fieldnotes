export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(255,179,71,.14), transparent 48%), radial-gradient(circle at 22% 82%, rgba(122,183,255,.12), transparent 56%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:14%;font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7">
      <div id="badge" style="display:inline-flex;gap:10px;align-items:center;opacity:0;transform:translateY(10px)">
        <div style="font-size:26px">📵</div>
        <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:900">STEP 1</div>
      </div>
      <div id="t" style="margin-top:12px;font-size:min(56px,5.8vw);font-weight:950;line-height:1.08;opacity:0;transform:translateY(14px)">
        폰/알림 차단
        <br/><span style="color:#c9d6e6;font-weight:850">(무반응 10분)</span>
      </div>
      <div id="s" style="margin-top:14px;color:#c9d6e6;opacity:0;font-size:18px">눈 뜨자마자 열면, 하루가 ‘요청 처리’로 시작합니다.</div>
    </div>

    <div style="position:absolute;left:7%;right:7%;top:54%;display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch">
      <div id="dont" style="border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:20px">🚫</div><div style="font-weight:950">하지 않기</div></div>
        <div style="margin-top:10px;color:#c9d6e6;opacity:.86">메일 · 메신저 · SNS</div>
      </div>
      <div id="do" style="border:1px solid rgba(255,179,71,.26);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,179,71,.10),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:20px">✅</div><div style="font-weight:950">딱 2개</div></div>
        <div style="margin-top:10px;color:#c9d6e6;opacity:.86">물 한 잔 + 컨디션 체크</div>
      </div>
    </div>

    <div id="line" style="position:absolute;left:7%;right:7%;bottom:22%;height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,#ffb347,transparent);opacity:0"></div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const badge=wrap.querySelector('#badge');
  const t=wrap.querySelector('#t');
  const s=wrap.querySelector('#s');
  const dont=wrap.querySelector('#dont');
  const doo=wrap.querySelector('#do');
  const line=wrap.querySelector('#line');

  const a1=badge.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=t.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:120,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3=s.animate([{opacity:0},{opacity:1}],{duration:420,delay:720,fill:'forwards'});

  const a4=dont.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:980,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a5=doo.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:1140,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  const a6=line.animate([{opacity:0},{opacity:1},{opacity:0}],{duration:900,delay:1700,fill:'forwards'});
  const pulse=doo.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 34px rgba(255,179,71,.18)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:900,delay:1700,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,a4,a5,a6,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

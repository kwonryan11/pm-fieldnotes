export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 18%, rgba(255,179,71,.14), transparent 48%), radial-gradient(circle at 22% 82%, rgba(122,183,255,.12), transparent 56%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 38%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:14%;font-family:Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif;color:#eef2f7">
      <div id="badge" style="display:inline-flex;gap:10px;align-items:center;opacity:0;transform:translateY(10px)">
        <div style="font-size:26px">📝</div>
        <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:900">STEP 2</div>
      </div>
      <div id="t" style="margin-top:12px;font-size:min(54px,5.6vw);font-weight:950;line-height:1.08;opacity:0;transform:translateY(14px)">
        할 일 3개
        <span style="color:#c9d6e6;font-weight:850">+ 안 할 일 1개</span>
      </div>
      <div id="s" style="margin-top:14px;color:#c9d6e6;opacity:0;font-size:18px">성과는 “더 해서”가 아니라 “덜 흔들려서” 나옵니다.</div>
    </div>

    <div style="position:absolute;left:7%;right:7%;top:52%;display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch">
      <div id="top3" style="border:1px solid rgba(255,179,71,.26);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,179,71,.10),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:20px">✅</div><div style="font-weight:950">Top 3</div></div>
        <div style="margin-top:10px" class="list">
          <div class="li" id="a">A. 핵심 업무</div>
          <div class="li" id="b">B. 마감 처리</div>
          <div class="li" id="c">C. 공유/보고</div>
        </div>
      </div>
      <div id="ntd" style="border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(4px);opacity:0;transform:translateY(10px)">
        <div style="display:flex;gap:10px;align-items:center"><div style="font-size:20px">🚫</div><div style="font-weight:950">Not-to-do</div></div>
        <div style="margin-top:10px;color:#c9d6e6;opacity:.90">예: 오전 11시 전<br/>메신저 상시 확인 금지</div>
        <div id="tag" style="margin-top:12px;display:inline-block;border:1px solid rgba(255,179,71,.35);color:#ffb347;border-radius:999px;padding:7px 10px;font-size:12px;letter-spacing:.08em;opacity:0">BOUNDARY</div>
      </div>
    </div>

    <style>
      .li{margin-top:8px;color:#cfe0f4;opacity:.92}
    </style>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const badge=wrap.querySelector('#badge');
  const t=wrap.querySelector('#t');
  const s=wrap.querySelector('#s');
  const top3=wrap.querySelector('#top3');
  const ntd=wrap.querySelector('#ntd');
  const tag=wrap.querySelector('#tag');
  const a=wrap.querySelector('#a');
  const b=wrap.querySelector('#b');
  const c=wrap.querySelector('#c');

  const a1=badge.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=t.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:120,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3=s.animate([{opacity:0},{opacity:1}],{duration:420,delay:720,fill:'forwards'});

  const a4=top3.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:980,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a5=ntd.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:1140,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});

  // stagger highlight list items
  const h1=a.animate([{opacity:.72},{opacity:1}],{duration:260,delay:1300,fill:'forwards'});
  const h2=b.animate([{opacity:.72},{opacity:1}],{duration:260,delay:1420,fill:'forwards'});
  const h3=c.animate([{opacity:.72},{opacity:1}],{duration:260,delay:1540,fill:'forwards'});

  const a6=tag.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,delay:1600,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const pulse=tag.animate([{boxShadow:'0 0 0 rgba(255,179,71,0)'},{boxShadow:'0 0 26px rgba(255,179,71,.22)'},{boxShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:820,delay:1760,fill:'forwards'});

  return ()=>{ for(const an of [a1,a2,a3,a4,a5,h1,h2,h3,a6,pulse]){try{an.cancel()}catch{}} wrap.remove(); };
}

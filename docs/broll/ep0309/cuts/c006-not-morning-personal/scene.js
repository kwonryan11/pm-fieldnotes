export function mount(root){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100vw;height:100vh;overflow:hidden;background:#0b1020;';
  wrap.innerHTML=`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 72% 20%, rgba(122,183,255,.14), transparent 44%), radial-gradient(circle at 26% 80%, rgba(255,179,71,.10), transparent 50%), linear-gradient(180deg,#0b1020,#070b14)"></div>
    <div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(circle at 50% 45%, black 40%, transparent 88%)"></div>

    <div style="position:absolute;left:7%;top:16%;font-family:Inter,system-ui,sans-serif;color:#eef2f7">
      <div id="badge" style="display:inline-flex;gap:10px;align-items:center;opacity:0;transform:translateY(10px)">
        <div style="font-size:26px">🦉</div>
        <div style="letter-spacing:.18em;font-size:13px;color:#ffb347;font-weight:900">PERSONAL NOTE</div>
      </div>
      <div id="t" style="margin-top:12px;font-size:min(54px,5.6vw);font-weight:900;line-height:1.10;opacity:0;transform:translateY(14px)">
        저도 원래<br/>아침형 아니었어요
      </div>
      <div id="s" style="margin-top:14px;color:#c9d6e6;opacity:0;font-size:18px">완전 올빼미형. 밤이 제 시간이었죠.</div>
    </div>

    <div id="timeline" style="position:absolute;left:7%;right:7%;top:54%;opacity:0;transform:translateY(10px)">
      <div style="display:flex;gap:16px;align-items:center;justify-content:space-between;font-family:Inter,system-ui,sans-serif;color:#eef2f7">
        <div style="flex:1;border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:14px 16px;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));">
          <div style="font-size:12px;letter-spacing:.16em;color:#c9d6e6">PAST</div>
          <div style="margin-top:6px;font-weight:900">밤에 몰아서</div>
          <div style="margin-top:4px;font-size:13px;color:#c9d6e6;opacity:.85">집중은 밤에만 된다</div>
        </div>
        <div style="width:46px;opacity:.75;text-align:center;font-size:20px">→</div>
        <div style="flex:1;border:1px solid rgba(255,179,71,.26);border-radius:16px;padding:14px 16px;background:linear-gradient(180deg,rgba(255,179,71,.10),rgba(255,255,255,.02));">
          <div style="font-size:12px;letter-spacing:.16em;color:#ffb347">NOW</div>
          <div style="margin-top:6px;font-weight:900">아침으로 이동</div>
          <div style="margin-top:4px;font-size:13px;color:#c9d6e6;opacity:.85">주도권을 먼저 잡기</div>
        </div>
      </div>
    </div>

    <div style="position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.35));"></div>
  `;

  root.appendChild(wrap);
  const badge=wrap.querySelector('#badge');
  const t=wrap.querySelector('#t');
  const s=wrap.querySelector('#s');
  const timeline=wrap.querySelector('#timeline');

  const a1=badge.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a2=t.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:140,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const a3=s.animate([{opacity:0},{opacity:1}],{duration:420,delay:720,fill:'forwards'});
  const a4=timeline.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:1050,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  const pulse=t.animate([{textShadow:'0 0 0 rgba(255,179,71,0)'},{textShadow:'0 0 26px rgba(255,179,71,.34)'},{textShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:800,delay:1500,fill:'forwards'});

  return ()=>{ for(const a of [a1,a2,a3,a4,pulse]){try{a.cancel()}catch{}} wrap.remove(); };
}

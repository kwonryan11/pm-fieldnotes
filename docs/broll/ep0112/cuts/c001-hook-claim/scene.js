export function mount(root, meta){
  const wrap=document.createElement('div'); wrap.className='scene macro';
  wrap.innerHTML=`<div style="position:absolute;inset:0;background:radial-gradient(circle at 75% 20%, rgba(255,179,71,.18), transparent 42%),linear-gradient(180deg,#0d1420,#0a1019)"></div>
  <div style="position:absolute;left:8%;right:8%;top:20%;height:1px;background:linear-gradient(90deg,transparent,#ffb347,transparent);opacity:.7"></div>
  <div style="position:relative;max-width:78vw;text-align:left;font-family:Inter,system-ui,sans-serif;color:#eef2f7">
    <div id='k' style="font-size:22px;color:#ffb347;letter-spacing:.08em;opacity:0">KEY MESSAGE</div>
    <div id='t' style="font-size:62px;font-weight:800;line-height:1.05;margin-top:10px;opacity:0">일 잘하는 사람은<br/>단순하게 합니다</div>
    <div id='u' style="margin-top:22px;font-size:20px;opacity:0;color:#cbd6e4">복잡한 실행이 아니라, 판단 순간을 줄이는 설계</div>
  </div>`;
  root.appendChild(wrap);
  const k=wrap.querySelector('#k'), t=wrap.querySelector('#t'), u=wrap.querySelector('#u');
  k.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,fill:'forwards'});
  t.animate([{opacity:0,transform:'translateY(14px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:520,delay:220,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  u.animate([{opacity:0},{opacity:1}],{duration:380,delay:760,fill:'forwards'});
  const emph=t.animate([{textShadow:'0 0 0 rgba(255,179,71,0)'},{textShadow:'0 0 28px rgba(255,179,71,.45)'},{textShadow:'0 0 0 rgba(255,179,71,0)'}],{duration:700,delay:1300,fill:'forwards'});
  return ()=>{emph.cancel();wrap.remove();};
}

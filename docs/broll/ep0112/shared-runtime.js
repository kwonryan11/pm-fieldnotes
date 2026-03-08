const href = new URL('./shared/tokens.json', import.meta.url);
fetch(href).then(r=>r.json()).then(t=>{const r=document.documentElement;Object.entries(t).forEach(([k,v])=>r.style.setProperty('--'+k,v));}).catch(()=>{});

export function buildScene(root, meta){
  const wrap=document.createElement('div');
  wrap.className='scene '+(meta.layer||'macro');
  const grid=document.createElement('div'); grid.className='grid';
  const card=document.createElement('div'); card.className='card';
  const t=meta.title||'Cut';
  card.innerHTML = `<span class="k">${(meta.layer||'').toUpperCase()}</span><br>${t}`;
  const sub=document.createElement('div'); sub.className='sub'; sub.textContent=meta.notes||'';
  wrap.append(grid,card,sub); root.appendChild(wrap);
  const anim=card.animate([{transform:'translateY(12px) scale(.985)',opacity:0},{transform:'translateY(0) scale(1)',opacity:1}],{duration:420,fill:'forwards',easing:'cubic-bezier(.16,.84,.44,1)'});
  return ()=>{anim.cancel();wrap.remove();};
}

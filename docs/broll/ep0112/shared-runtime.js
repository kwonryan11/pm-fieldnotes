const href = new URL('./shared/tokens.json', import.meta.url);
fetch(href).then(r=>r.json()).then(t=>{const r=document.documentElement;Object.entries(t).forEach(([k,v])=>r.style.setProperty('--'+k,v));}).catch(()=>{});

function svgFor(type='flow'){
  if(type==='bar') return `<svg class="diagram" viewBox="0 0 360 120"><rect x="40" y="65" width="40" height="35" rx="4"/><rect x="100" y="50" width="40" height="50" rx="4"/><rect x="160" y="38" width="40" height="62" rx="4"/><rect x="220" y="25" width="40" height="75" rx="4"/><rect x="280" y="45" width="40" height="55" rx="4"/></svg>`;
  if(type==='matrix') return `<svg class="diagram" viewBox="0 0 360 120"><rect x="40" y="20" width="280" height="80" rx="8"/><path d="M133 20 V100 M227 20 V100 M40 60 H320"/></svg>`;
  if(type==='ring') return `<svg class="diagram" viewBox="0 0 360 120"><circle cx="180" cy="60" r="36" fill="none" stroke-width="10"/><circle class="accent-stroke" cx="180" cy="60" r="36" fill="none" stroke-width="10" stroke-dasharray="226" stroke-dashoffset="226"/></svg>`;
  if(type==='split') return `<svg class="diagram" viewBox="0 0 360 120"><rect x="30" y="30" width="130" height="60" rx="8"/><rect x="200" y="30" width="130" height="60" rx="8"/><path d="M170 60 H190"/></svg>`;
  return `<svg class="diagram" viewBox="0 0 360 120"><rect x="20" y="40" width="90" height="40" rx="8"/><rect x="135" y="40" width="90" height="40" rx="8"/><rect x="250" y="40" width="90" height="40" rx="8"/><path d="M110 60 H135 M225 60 H250"/></svg>`;
}

export function buildScene(root, meta){
  const wrap=document.createElement('div');
  wrap.className='scene '+(meta.layer||'macro');
  const grid=document.createElement('div'); grid.className='grid';
  const card=document.createElement('div'); card.className='card';
  const em=meta.emoji||'🧠';
  const t=meta.title||'Cut';
  const dg=meta.diagramType||'flow';
  card.innerHTML = `<div class="emoji">${em}</div><span class="k">${(meta.layer||'').toUpperCase()}</span><br>${t}${svgFor(dg)}`;
  const sub=document.createElement('div'); sub.className='sub'; sub.textContent=meta.notes||'';
  wrap.append(grid,card,sub); root.appendChild(wrap);

  const inAnim=card.animate([{transform:'translateY(14px) scale(.98)',opacity:0},{transform:'translateY(0) scale(1)',opacity:1}],{duration:420,fill:'forwards',easing:'cubic-bezier(.16,.84,.44,1)'});
  const pulse=card.animate([{transform:'translateY(0) scale(1)'},{transform:'translateY(0) scale(1.012)'},{transform:'translateY(0) scale(1)'}],{duration:1800,iterations:Infinity,easing:'ease-in-out'});
  const drift=grid.animate([{transform:'translateX(0px)'},{transform:'translateX(-24px)'}],{duration:7000,iterations:Infinity,direction:'alternate',easing:'ease-in-out'});

  card.querySelectorAll('path').forEach((p,i)=>{
    const len = p.getTotalLength?.() || 100;
    p.style.strokeDasharray=len; p.style.strokeDashoffset=len;
    p.animate([{strokeDashoffset:len},{strokeDashoffset:0}],{duration:520+140*i,fill:'forwards',easing:'ease'});
  });
  card.querySelectorAll('rect').forEach((r,i)=>{
    r.animate([{opacity:.35},{opacity:.9},{opacity:.55}],{duration:900+100*i,delay:i*80,fill:'forwards'});
  });
  const accent=card.querySelector('.accent-stroke');
  if(accent){
    accent.animate([{strokeDashoffset:226},{strokeDashoffset:60}],{duration:900,fill:'forwards',easing:'ease-out'});
  }

  return ()=>{inAnim.cancel();pulse.cancel();drift.cancel();wrap.remove();};
}

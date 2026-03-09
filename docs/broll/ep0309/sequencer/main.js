const app = document.getElementById('app');
const hud = document.getElementById('hud');
const manifest = await (await fetch('./manifest.json')).json();

let index = 0;
let paused = false;
let stopRequested = false;
let currentUnmount = null;

function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }

function updateHud(){
  const cut = manifest[index] || {};
  hud.textContent = `${index+1}/${manifest.length} · ${cut.id || '-'} · ${cut.title || '-'} ${paused ? '⏸' : '▶'}`;
}

async function showCut(i){
  if (currentUnmount) { try { currentUnmount(); } catch {} currentUnmount = null; }
  index = clamp(i, 0, manifest.length - 1);
  const cut = manifest[index];
  const mod = await import(cut.path);
  currentUnmount = mod.mount(app, cut);
  updateHud();
}

async function run(){
  await showCut(index);
  while(!stopRequested){
    const cut = manifest[index];
    let elapsed = 0;
    while (elapsed < cut.durationSec * 1000){
      if (!paused) elapsed += 100;
      await wait(100);
      if (stopRequested) return;
      if (manifest[index] !== cut) break;
    }
    if (!paused && manifest[index] === cut){
      if (index < manifest.length - 1) await showCut(index + 1);
      else { paused = true; updateHud(); }
    }
  }
}

window.addEventListener('keydown', async (e)=>{
  if (e.code === 'Space') { e.preventDefault(); paused = !paused; updateHud(); }
  if (e.key === 'ArrowRight') { e.preventDefault(); paused = true; await showCut(index + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); paused = true; await showCut(index - 1); }
});

run();

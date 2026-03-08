const app = document.getElementById('app');
const manifest = await (await fetch('./manifest.json')).json();

async function loadMods(){
  const mods = new Map();
  await Promise.all(manifest.map(async c=>{ mods.set(c.id, await import(c.path)); }));
  return mods;
}

function fade(el, from, to, ms){
  return el.animate([{opacity:from},{opacity:to}],{duration:ms,fill:'forwards',easing:'ease'}).finished;
}

async function play(){
  const mods = await loadMods();
  for (const cut of manifest){
    const mod = mods.get(cut.id);
    const unmount = mod.mount(app, cut);
    await fade(app,0,1,180);
    await new Promise(r=>setTimeout(r, Math.max(300, cut.durationSec*1000-220)));
    await fade(app,1,0,180);
    unmount && unmount();
  }
  app.style.opacity='1';
}
play();

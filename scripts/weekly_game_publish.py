#!/usr/bin/env python3
"""Weekly mini webgame publisher for PM Fieldnotes.

Creates:
- games/<slug>/index.html (a tiny game)
- posts/<slug>.md (a short post that links to the game)
- rebuilds docs via scripts/generate.py
- commits + pushes via deploy key (same mechanism as daily_publish.py)

Goal: fully automated, no API keys, minimal dependencies.

Usage:
  python3 scripts/weekly_game_publish.py \
    --slug 2026-ww08-kpi-sprint \
    --title "KPI Sprint — 병목을 깎는 30초" \
    --summary "30초 동안 병목을 깎아 KPI 포인트를 얻는 미니게임" \
    --game "kpi_sprint"
"""

from __future__ import annotations

import argparse
import datetime as dt
import os
import shutil
import subprocess
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parents[1]
KEY_PATH = Path("/home/node/.openclaw/keys/pm-fieldnotes_deploy_key")
KNOWN_HOSTS = Path("/home/node/.openclaw/ssh/known_hosts")


def run(cmd: list[str], *, check: bool = True) -> None:
    subprocess.run(cmd, cwd=str(REPO_DIR), check=check)


def iso_week_slug(today: dt.date | None = None) -> str:
    today = today or dt.date.today()
    y, w, _ = today.isocalendar()
    return f"{y}-ww{w:02d}"


def game_kpi_sprint_html(*, title: str) -> str:
    # Keep this fully self-contained (no external assets).
    return f"""<!doctype html>
<html lang=\"ko\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>{title}</title>
  <style>
    :root{{--bg:#0b0f19;--panel:#0f172a;--text:#e5e7eb;--muted:#9ca3af;--brand:#22d3ee;--brand2:#7c3aed;}}
    body{{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,\"Noto Sans KR\",sans-serif;background:var(--bg);color:var(--text);}}
    .wrap{{max-width:920px;margin:0 auto;padding:20px;}}
    .card{{background:rgba(15,23,42,.82);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px;}}
    .top{{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:12px}}
    a{{color:var(--brand)}}
    h1{{font-size:18px;margin:0}}
    .meta{{color:var(--muted);font-size:13px}}
    canvas{{width:100%;max-width:720px;height:auto;border-radius:12px;background:#050814;display:block;margin:12px auto;touch-action:manipulation;}}
    .row{{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}}
    button{{border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.2);color:var(--text);padding:10px 12px;border-radius:12px;font-weight:700}}
    button:focus{{outline:2px solid rgba(34,211,238,.35);outline-offset:2px}}
    .hint{{color:var(--muted);font-size:14px;line-height:1.5}}
    @media (prefers-reduced-motion: reduce){{*{{scroll-behavior:auto;animation:none;transition:none}}}}
  </style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"card\">
      <div class=\"top\">
        <div>
          <h1>{title}</h1>
          <div class=\"meta\">조작: <b>Space</b> / <b>Tap</b> · <span id=\"status\">Ready</span></div>
        </div>
        <div class=\"meta\"><a href=\"../../index.html\">← 블로그 홈</a> · <a href=\"../index.html\">게임 목록</a></div>
      </div>

      <p class=\"hint\">30초 동안 눌러서 <b>병목(Bottleneck)</b>을 제거하고 <b>KPI 포인트</b>를 얻으세요.</p>

      <canvas id=\"c\" width=\"720\" height=\"480\" aria-label=\"게임 캔버스\"></canvas>

      <div class=\"row\">
        <button id=\"btnStart\">Start</button>
        <button id=\"btnRestart\">Restart</button>
      </div>

      <p class=\"hint\">정책: 자동 사운드 없음 · 키보드/터치 지원 · 에셋 0개</p>
    </div>
  </div>

<script>
(() => {{
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('status');
  const btnStart = document.getElementById('btnStart');
  const btnRestart = document.getElementById('btnRestart');

  let running = false;
  let tLeft = 30.0;
  let score = 0;
  let bottleneck = 1.0;
  let best = Number(localStorage.getItem('kpi_sprint_best') || 0);

  function setStatus(s){{ statusEl.textContent = s; }}

  function reset(){{
    running = false;
    tLeft = 30.0;
    score = 0;
    bottleneck = 1.0;
    lastTs = 0;
    setStatus('Ready');
    draw();
  }}

  function start(){{
    if (running) return;
    running = true;
    setStatus('Running');
    requestAnimationFrame(loop);
  }}

  let lastTapAt = 0;
  function action(){{
    const now = performance.now();
    if (!running && tLeft <= 0){{ reset(); start(); return; }}
    if (!running) start();
    if (now - lastTapAt < 60) return;
    lastTapAt = now;

    bottleneck = Math.max(0, bottleneck - 0.18);
    if (bottleneck <= 0){{
      score += Math.max(1, Math.ceil(10 * (tLeft/30)));
      bottleneck = 0.65 + Math.random()*0.35;
    }}
  }}

  function draw(){{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const pad = 18;
    const x = pad, y = 88, w = canvas.width - pad*2, h = canvas.height - 120;

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '800 22px system-ui';
    ctx.fillText('{title}', 22, 40);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px system-ui';
    ctx.fillText('Space/Tap으로 병목을 깎기', 22, 64);

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '700 16px system-ui';
    ctx.fillText('TIME', x, y-14);
    ctx.fillText(String(Math.max(0, Math.ceil(tLeft))), x+76, y-14);
    ctx.fillText('SCORE', x+160, y-14);
    ctx.fillText(String(score), x+240, y-14);

    ctx.fillStyle = '#9ca3af';
    ctx.fillText('BEST', x+320, y-14);
    ctx.fillText(String(best), x+372, y-14);

    ctx.fillStyle = 'rgba(0,0,0,.20)';
    ctx.fillRect(x, y, w, h);

    const meterW = Math.min(520, w-40);
    const mx = x + (w-meterW)/2;
    const my = y + h/2 - 18;
    const mh = 36;

    ctx.fillStyle = 'rgba(255,255,255,.08)';
    ctx.fillRect(mx, my, meterW, mh);

    const fill = Math.max(0, Math.min(1, bottleneck));
    const good = 1 - fill;
    const r = Math.floor(124 + 50*good);
    const g = Math.floor(58 + 155*good);
    const b = Math.floor(237 - 40*good);
    ctx.fillStyle = `rgb(${{r}},${{g}},${{b}})`;
    ctx.fillRect(mx, my, meterW*fill, mh);

    ctx.strokeStyle = 'rgba(34,211,238,.35)';
    ctx.strokeRect(mx, my, meterW, mh);

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '700 14px system-ui';
    ctx.fillText('BOTTLENECK', mx, my-8);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px system-ui';
    if (!running && tLeft > 0){{
      ctx.fillText('Space 또는 Tap으로 시작', mx, my+mh+28);
    }} else if (tLeft > 0){{
      ctx.fillText('병목을 0으로 만들면 점수 획득!', mx, my+mh+28);
    }}

    if (!running && tLeft <= 0){{
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '900 28px system-ui';
      ctx.fillText('DONE', x+22, y+50);
      ctx.font = '700 18px system-ui';
      ctx.fillText(`Score: ${{score}}  (Best: ${{best}})`, x+22, y+82);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px system-ui';
      ctx.fillText('Restart 또는 Space로 다시 시작', x+22, y+110);
    }}
  }}

  let lastTs = 0;
  function loop(ts){{
    if (!running) return;
    const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0);
    lastTs = ts;

    tLeft -= dt;
    bottleneck = Math.min(1.0, bottleneck + dt * 0.06);

    if (tLeft <= 0){{
      tLeft = 0;
      running = false;
      setStatus('Done');
      if (score > best){{
        best = score;
        try{{ localStorage.setItem('kpi_sprint_best', String(best)); }}catch(_e){{}}
      }}
      draw();
      return;
    }}

    draw();
    requestAnimationFrame(loop);
  }}

  // events
  btnStart.addEventListener('click', start);
  btnRestart.addEventListener('click', () => {{ reset(); start(); }});

  window.addEventListener('keydown', (e) => {{
    if (e.code === 'Space' || e.code === 'Enter'){{ e.preventDefault(); action(); }}
  }});
  canvas.addEventListener('pointerdown', (e) => {{ e.preventDefault(); action(); }});

  reset();
}})();
</script>
</body>
</html>
"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--slug', default='', help='folder/post slug; default is <iso-week>-kpi-sprint')
    ap.add_argument('--title', default='', help='game title (also post title)')
    ap.add_argument('--summary', default='', help='one-liner for the post')
    ap.add_argument('--game', default='kpi_sprint', choices=['kpi_sprint'])
    args = ap.parse_args()

    week = iso_week_slug()
    slug = (args.slug or f"{week}-kpi-sprint").strip()
    title = (args.title or "KPI Sprint — 병목을 깎는 30초").strip()
    summary = (args.summary or "30초 동안 병목을 깎아 KPI 포인트를 얻는 미니게임").strip()

    games_dir = REPO_DIR / 'games'
    posts_dir = REPO_DIR / 'posts'
    games_dir.mkdir(parents=True, exist_ok=True)
    posts_dir.mkdir(parents=True, exist_ok=True)

    game_path = games_dir / slug
    if game_path.exists():
        raise SystemExit(f"game already exists: {game_path}")

    # Create game folder
    game_path.mkdir(parents=True)
    (game_path / 'index.html').write_text(game_kpi_sprint_html(title=title), encoding='utf-8')
    (game_path / 'LICENSES.md').write_text(
        "# LICENSES.md\n\n## Code\n- License: MIT (repo root LICENSE를 따름)\n\n## Assets\n- This game uses **no external assets**.\n",
        encoding='utf-8'
    )

    # Create a post that links to the game
    post_md = f"""# {title}\n\n{summary}\n\n- 플레이: /games/{slug}/\n- 조작: Space 또는 Tap\n\n## 왜 이 게임을 만들었나\n‘병목을 얼마나 빨리 발견하고 깎아내리느냐’가 운영 KPI를 좌우한다는 느낌을 30초짜리로 압축했다.\n\n## 다음 버전 아이디어\n- 난이도(병목 회복속도) 선택\n- KPI 타입 선택(리드타임/결품률/SLA)\n"""

    post_path = posts_dir / f"{slug}.md"
    if post_path.exists():
        raise SystemExit(f"post already exists: {post_path}")
    post_path.write_text(post_md, encoding='utf-8')

    # render site
    run(['python3', 'scripts/generate.py'])

    # git commit/push
    run(['git', 'add', '-A'])
    run(['git', 'config', 'user.email', 'openclaw-bot@local'])
    run(['git', 'config', 'user.name', 'OpenClaw'])
    run(['git', 'commit', '-m', f'game: {slug}'])

    env = os.environ.copy()
    env['GIT_SSH_COMMAND'] = (
        f"ssh -i {KEY_PATH} -o IdentitiesOnly=yes -o UserKnownHostsFile={KNOWN_HOSTS} -o StrictHostKeyChecking=yes"
    )
    subprocess.run(['git', 'push', 'origin', 'main'], cwd=str(REPO_DIR), check=True, env=env)

    print(f"published game {slug}")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

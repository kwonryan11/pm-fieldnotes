#!/usr/bin/env python3
import os, json, glob
from pathlib import Path

def load_cfg():
    return json.load(open('site/config.json','r',encoding='utf-8'))

def md_title(md: str) -> str:
    for line in md.splitlines():
        if line.startswith('# '):
            return line[2:].strip()
    return 'Untitled'

def md_excerpt(md: str, n=180) -> str:
    txt=[]
    for line in md.splitlines():
        if line.startswith('#'): continue
        if line.strip():
            txt.append(line.strip())
        if len(' '.join(txt))>=n: break
    ex=' '.join(txt)
    return ex[:n]

def _theme_css() -> str:
    # "쌈뽕" = bold but readable. Neon accents, clean typography.
    return """
:root{
  --bg:#0b0f19;
  --panel:#0f172a;
  --text:#e5e7eb;
  --muted:#9ca3af;
  --brand:#7c3aed;
  --brand2:#22d3ee;
  --ring:rgba(124,58,237,.35);
  --shadow:0 10px 30px rgba(0,0,0,.35);
  --radius:16px;
  --max:860px;
  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Arial, "Apple SD Gothic Neo", sans-serif;
  background: radial-gradient(1200px 600px at 15% 10%, rgba(124,58,237,.25), transparent 60%),
              radial-gradient(900px 500px at 80% 20%, rgba(34,211,238,.18), transparent 55%),
              var(--bg);
  color:var(--text);
  line-height:1.7;
}
a{color:var(--brand2); text-decoration:none}
a:hover{text-decoration:underline}
.wrap{max-width:var(--max); margin:0 auto; padding:28px 18px 80px}
.nav{
  display:flex; align-items:center; justify-content:space-between;
  gap:14px; padding:14px 16px; border-radius:var(--radius);
  background: rgba(15, 23, 42, .75);
  backdrop-filter: blur(10px);
  border:1px solid rgba(255,255,255,.06);
  box-shadow:var(--shadow);
}
.brand{display:flex; align-items:center; gap:10px; font-weight:800; letter-spacing:.2px}
.logo{
  width:34px; height:34px; border-radius:12px;
  background: linear-gradient(135deg, var(--brand), var(--brand2));
  box-shadow: 0 0 0 6px rgba(124,58,237,.08);
}
.tagline{color:var(--muted); font-size:14px}
.card{
  margin-top:18px;
  padding:22px 20px;
  border-radius:var(--radius);
  background: rgba(15,23,42,.72);
  border:1px solid rgba(255,255,255,.06);
  box-shadow:var(--shadow);
}
.h1{font-size:34px; line-height:1.15; margin:4px 0 12px}
.h2{font-size:18px; color:var(--muted); margin:0 0 8px}
.meta{color:var(--muted); font-size:13px}
hr{border:none; border-top:1px solid rgba(255,255,255,.08); margin:18px 0}
ul{padding-left:18px}
li{margin:10px 0}
small{color:var(--muted)}
.post p{margin:10px 0}
.post h2{margin:26px 0 10px; font-size:20px}
.kbd{font-family:var(--mono); font-size:12px; padding:2px 8px; border-radius:999px; border:1px solid rgba(255,255,255,.10); background: rgba(0,0,0,.2)}
.footer{margin-top:18px; color:var(--muted); font-size:13px}
""".strip()


def render_post(md_path: str, cfg: dict) -> str:
    md=open(md_path,'r',encoding='utf-8').read()
    title=md_title(md)
    excerpt=md_excerpt(md)

    # basic markdown-ish rendering
    paras=[]
    for line in md.splitlines():
        if line.startswith('# '):
            continue
        if line.startswith('## '):
            paras.append(f"<h2>{line[3:].strip()}</h2>")
            continue
        if line.startswith('- '):
            paras.append(f"<p>• {line[2:].strip()}</p>")
            continue
        if line.strip():
            paras.append(f"<p>{line.strip()}</p>")
    body='\n'.join(paras)

    return f"""<!doctype html>
<html lang=\"{cfg['language']}\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>{title} | {cfg['title']}</title>
<meta name=\"description\" content=\"{excerpt}\">
<meta property=\"og:title\" content=\"{title}\">
<meta property=\"og:description\" content=\"{excerpt}\">
<style>{_theme_css()}</style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"nav\">
      <div class=\"brand\"><div class=\"logo\"></div><div>
        <div>{cfg['title']}</div>
        <div class=\"tagline\">{cfg['description']}</div>
      </div></div>
      <div class=\"meta\"><span class=\"kbd\">PM • Ops • Metrics • Automation</span></div>
    </div>

    <div class=\"card post\">
      <div class=\"meta\"><a href=\"../index.html\">← 홈으로</a></div>
      <h1 class=\"h1\">{title}</h1>
      {body}
      <div class=\"footer\">© {cfg['title']} — built with OpenClaw</div>
    </div>
  </div>
</body>
</html>"""

def main():
    cfg=load_cfg()
    out=Path('docs')
    (out/'posts').mkdir(parents=True, exist_ok=True)

    posts=sorted(glob.glob('posts/*.md'))[::-1]
    items=[]
    for p in posts:
        slug=os.path.splitext(os.path.basename(p))[0]
        html=render_post(p,cfg)
        (out/'posts'/f'{slug}.html').write_text(html,encoding='utf-8')
        md=open(p,'r',encoding='utf-8').read()
        items.append((slug, md_title(md), md_excerpt(md)))

    index_items='\n'.join([
        f"<li><a href=\"posts/{slug}.html\">{title}</a><br><small>{ex}</small></li>" for slug,title,ex in items
    ])

    index=f"""<!doctype html>
<html lang=\"{cfg['language']}\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>{cfg['title']}</title>
<meta name=\"description\" content=\"{cfg['description']}\">
<meta property=\"og:title\" content=\"{cfg['title']}\">
<meta property=\"og:description\" content=\"{cfg['description']}\">
<style>{_theme_css()}</style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"nav\">
      <div class=\"brand\"><div class=\"logo\"></div><div>
        <div>{cfg['title']}</div>
        <div class=\"tagline\">{cfg['description']}</div>
      </div></div>
      <div class=\"meta\"><span class=\"kbd\">매일 발행</span></div>
    </div>

    <div class=\"card\">
      <div class=\"h2\">최근 글</div>
      <ul>{index_items}</ul>
      <div class=\"footer\">© {cfg['title']} — built with OpenClaw</div>
    </div>
  </div>
</body>
</html>"""

    (out/'index.html').write_text(index,encoding='utf-8')

if __name__=='__main__':
    main()

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

def render_post(md_path: str, cfg: dict) -> str:
    md=open(md_path,'r',encoding='utf-8').read()
    title=md_title(md)
    paras=[]
    for line in md.splitlines():
        if line.startswith('# '):
            continue
        if line.startswith('## '):
            paras.append(f"<h2>{line[3:].strip()}</h2>")
            continue
        if line.startswith('- '):
            # naive list support: emit as paragraph bullet
            paras.append(f"<p>• {line[2:].strip()}</p>")
            continue
        if line.strip():
            paras.append(f"<p>{line.strip()}</p>")
    body='\n'.join(paras)
    return f"""<!doctype html>
<html lang=\"{cfg['language']}\"><head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>{title} | {cfg['title']}</title>
<meta name=\"description\" content=\"{md_excerpt(md)}\">
</head><body>
<header>
  <a href=\"../index.html\">← Home</a>
</header>
<main>
  <h1>{title}</h1>
  {body}
</main>
</body></html>"""

def main():
    cfg=load_cfg()
    out=Path('public')
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
<html lang=\"{cfg['language']}\"><head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>{cfg['title']}</title>
<meta name=\"description\" content=\"{cfg['description']}\">
</head><body>
<main>
  <h1>{cfg['title']}</h1>
  <p>{cfg['description']}</p>
  <ul>{index_items}</ul>
</main>
</body></html>"""

    (out/'index.html').write_text(index,encoding='utf-8')

if __name__=='__main__':
    main()

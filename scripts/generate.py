#!/usr/bin/env python3
import os, json, glob, re
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


def render_post(md_path: str, cfg: dict, *, slug: str) -> str:
    import html as _html
    import re as _re

    md = open(md_path, 'r', encoding='utf-8').read()
    title = md_title(md)
    excerpt = md_excerpt(md)

    base = (cfg.get('base_url') or '').rstrip('/')
    canonical = f"{base}/posts/{slug}.html" if base else f"posts/{slug}.html"

    def _inline_md(s: str) -> str:
        """Very small markdown-ish inline renderer (no external deps).

        Supports:
        - **bold**
        - *italic*
        - `code`
        - [text](url)
        - footnote refs like [^1]
        """
        s = _html.escape(s, quote=True)

        # links
        s = _re.sub(r"\[([^\]]+?)\]\((https?://[^\s\)]+)\)", r"<a href=\"\2\">\1</a>", s)

        # code
        s = _re.sub(r"`([^`]+?)`", r"<code>\1</code>", s)

        # bold then italic
        s = _re.sub(r"\*\*([^*]+?)\*\*", r"<strong>\1</strong>", s)
        s = _re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<em>\1</em>", s)

        # footnote refs
        s = _re.sub(r"\[\^(\d+)\]", r"<sup class=\"fn\">[\1]</sup>", s)
        return s

    def _fix_img_src(tag: str) -> str:
        # Posts are under /posts/*.html, assets are under /assets/.
        # If Commons helper produced src="assets/...", rewrite to "../assets/...".
        return tag.replace('src="assets/', 'src="../assets/')

    # basic block rendering with list support
    blocks: list[str] = []
    in_list: list[str] | None = None

    def flush_list() -> None:
        nonlocal in_list
        if in_list is None:
            return
        items = "\n".join([f"<li>{_inline_md(x)}</li>" for x in in_list])
        blocks.append(f"<ul>\n{items}\n</ul>")
        in_list = None

    for raw in md.splitlines():
        line = raw.rstrip("\n")
        s = line.strip()

        if not s:
            flush_list()
            continue

        if s.startswith('# '):
            # H1 is rendered separately
            flush_list()
            continue

        if s.startswith('## '):
            flush_list()
            blocks.append(f"<h2>{_inline_md(s[3:].strip())}</h2>")
            continue

        if s in ('---', '***'):
            flush_list()
            blocks.append('<hr>')
            continue

        if s.startswith('- '):
            if in_list is None:
                in_list = []
            in_list.append(s[2:].strip())
            continue

        if s.startswith('[^') and ']: ' in s:
            # footnote definition
            flush_list()
            m = _re.match(r"\[\^(\d+)\]:\s*(.*)$", s)
            if m:
                n, rest = m.group(1), m.group(2)
                blocks.append(f"<p class=\"footnote\"><sup class=\"fn\">[{n}]</sup> {_inline_md(rest)}</p>")
            else:
                blocks.append(f"<p>{_inline_md(s)}</p>")
            continue

        if s.startswith('<img '):
            flush_list()
            blocks.append(_fix_img_src(s))
            continue

        blocks.append(f"<p>{_inline_md(s)}</p>")

    flush_list()
    body = "\n".join(blocks)

    # escape meta fields safely (avoid breaking attributes)
    meta_title = _html.escape(title, quote=True)
    meta_site = _html.escape(cfg['title'], quote=True)
    meta_desc = _html.escape(excerpt, quote=True)

    return f"""<!doctype html>
<html lang=\"{cfg['language']}\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>{meta_title} | {meta_site}</title>
<meta name=\"description\" content=\"{meta_desc}\">
<link rel=\"canonical\" href=\"{canonical}\">
<meta property=\"og:type\" content=\"article\">
<meta property=\"og:title\" content=\"{meta_title}\">
<meta property=\"og:description\" content=\"{meta_desc}\">
<meta property=\"og:url\" content=\"{canonical}\">
<meta name=\"twitter:card\" content=\"summary\">
<style>{_theme_css()}</style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"nav\">
      <div class=\"brand\"><div class=\"logo\"></div><div>
        <div>{meta_site}</div>
        <div class=\"tagline\">{_html.escape(cfg['description'], quote=True)}</div>
      </div></div>
      <div class=\"meta\"><span class=\"kbd\">PM • Ops • Metrics • Automation</span></div>
    </div>

    <div class=\"card post\">
      <div class=\"meta\"><a href=\"../index.html\">← 홈으로</a></div>
      <h1 class=\"h1\">{meta_title}</h1>
      {body}
      <hr>
      <div class=\"footer\">© {meta_site} — built with OpenClaw</div>
    </div>
  </div>
</body>
</html>"""

def _brief_text_to_html(text: str) -> str:
    """Convert plain-text brief to HTML.

    Rules:
    - Lines starting with [ ... ] become <h2>
    - URLs are auto-linked
    - Newlines are preserved via <br> within paragraphs
    - Empty lines create paragraph breaks
    """
    import html as _html

    url_re = re.compile(r'(https?://[^\s<>\)]+)')

    lines_out = []
    for line in text.splitlines():
        s = line.strip()

        # Section headers: lines like "[ KR ]" or "[산업 구조]"
        m = re.match(r'^\[([^\]]+)\]\s*$', s)
        if m:
            lines_out.append(f'<h2>{_html.escape(m.group(1).strip())}</h2>')
            continue

        if not s:
            lines_out.append('<br>')
            continue

        escaped = _html.escape(s)
        # Auto-link URLs
        escaped = url_re.sub(r'<a href="\1" target="_blank">\1</a>', escaped)
        lines_out.append(escaped + '<br>')

    return '\n'.join(lines_out)


def render_brief(text: str, cfg: dict, *, title: str, date_str: str,
                 back_href: str = '../../briefs/index.html') -> str:
    """Render a plain-text brief into a full HTML page."""
    import html as _html

    body = _brief_text_to_html(text)
    meta_title = _html.escape(title, quote=True)
    meta_site = _html.escape(cfg['title'], quote=True)

    return f"""<!doctype html>
<html lang="{cfg['language']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{meta_title} | {meta_site}</title>
<style>{_theme_css()}
.brief-body h2{{margin:26px 0 10px; font-size:20px; color:var(--brand2)}}
.brief-body a{{word-break:break-all}}
</style>
</head>
<body>
  <div class="wrap">
    <div class="nav">
      <div class="brand"><div class="logo"></div><div>
        <div>{meta_site}</div>
        <div class="tagline">{_html.escape(cfg['description'], quote=True)}</div>
      </div></div>
      <div class="meta"><a href="{back_href}">← 브리프 목록</a></div>
    </div>

    <div class="card post brief-body">
      <div class="meta">{_html.escape(date_str)}</div>
      <h1 class="h1">{meta_title}</h1>
      {body}
      <hr>
      <div class="footer">© {meta_site} — built with OpenClaw</div>
    </div>
  </div>
</body>
</html>"""


def build_briefs(cfg: dict, out: Path) -> list:
    """Scan brief directories, render individual pages, return list of entries
    for the index. Each entry: (date_str, kind_label, kind_slug, html_path)."""
    import html as _html

    # Where to look for briefs (outside the blog repo)
    BRIEF_SOURCES = [
        {
            'label': '통합 브리핑',
            'slug': 'morning',
            'base': Path(os.path.expanduser('~/.openclaw/workspace/memory/briefing')),
            'filename': 'final_briefing_ko.txt',
        },
        {
            'label': 'InvestAnalyst 데일리 브리프',
            'slug': 'invest',
            'base': Path(os.path.expanduser('~/.openclaw/workspace/memory/investanalyst')),
            'filename': 'daily_brief_ko.txt',
        },
    ]

    entries = []

    for src in BRIEF_SOURCES:
        base_dir = src['base']
        if not base_dir.exists():
            continue
        dest_dir = out / 'briefs' / src['slug']
        dest_dir.mkdir(parents=True, exist_ok=True)

        for date_dir in sorted(base_dir.iterdir(), reverse=True):
            if not date_dir.is_dir():
                continue
            # Expect YYYY-MM-DD directory names
            date_str = date_dir.name
            if not re.match(r'^\d{4}-\d{2}-\d{2}$', date_str):
                continue
            fpath = date_dir / src['filename']
            if not fpath.exists():
                continue

            text = fpath.read_text(encoding='utf-8')
            html = render_brief(
                text, cfg,
                title=f"{src['label']} — {date_str}",
                date_str=date_str,
            )
            html_file = dest_dir / f'{date_str}.html'
            html_file.write_text(html, encoding='utf-8')

            rel_path = f"briefs/{src['slug']}/{date_str}.html"
            entries.append((date_str, src['label'], src['slug'], rel_path))

    return entries


def render_briefs_index(entries: list, cfg: dict) -> str:
    """Render the briefs listing page."""
    import html as _html

    # Group by date (reverse chronological)
    from collections import OrderedDict
    by_date: dict[str, list] = {}
    for date_str, label, slug, rel_path in entries:
        by_date.setdefault(date_str, []).append((label, slug, rel_path))

    body_parts = []
    for date_str in sorted(by_date.keys(), reverse=True):
        items = by_date[date_str]
        links = ' · '.join([
            f'<a href="{_html.escape(rp)}">{_html.escape(lbl)}</a>'
            for lbl, _slug, rp in items
        ])
        body_parts.append(
            f'<li><strong>{_html.escape(date_str)}</strong><br>{links}</li>'
        )

    items_html = '\n'.join(body_parts) or '<li><small>아직 브리프가 없습니다.</small></li>'
    meta_site = _html.escape(cfg['title'], quote=True)

    return f"""<!doctype html>
<html lang="{cfg['language']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Briefs | {meta_site}</title>
<meta name="description" content="데일리 브리프 아카이브">
<style>{_theme_css()}</style>
</head>
<body>
  <div class="wrap">
    <div class="nav">
      <div class="brand"><div class="logo"></div><div>
        <div>{meta_site}</div>
        <div class="tagline">{_html.escape(cfg['description'], quote=True)}</div>
      </div></div>
      <div class="meta"><a href="../index.html">← 홈</a> · <a href="../games/index.html">Games</a> · <a href="../catalog/index.html">Catalog</a></div>
    </div>

    <div class="card">
      <div class="h2">데일리 브리프</div>
      <ul>{items_html}</ul>
      <div class="footer">© {meta_site} — built with OpenClaw</div>
    </div>
  </div>
</body>
</html>"""


def main():
    cfg=load_cfg()
    out=Path('docs')
    (out/'posts').mkdir(parents=True, exist_ok=True)
    (out/'games').mkdir(parents=True, exist_ok=True)

    posts=sorted(glob.glob('posts/*.md'))[::-1]
    items=[]
    for p in posts:
        slug=os.path.splitext(os.path.basename(p))[0]
        html=render_post(p,cfg,slug=slug)
        (out/'posts'/f'{slug}.html').write_text(html,encoding='utf-8')
        md=open(p,'r',encoding='utf-8').read()
        items.append((slug, md_title(md), md_excerpt(md)))

    # games: copy static directories into docs/games
    game_dirs = []
    for d in sorted(glob.glob('games/*')):
        base = os.path.basename(d)
        if base.startswith('_'):
            continue
        if not os.path.isdir(d):
            continue
        if os.path.exists(os.path.join(d, 'index.html')):
            game_dirs.append(base)

    # naive copy (clean then copy) to keep docs in sync
    import shutil
    for gd in game_dirs:
        src = Path('games')/gd
        dst = out/'games'/gd
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)

    # games index
    games_list = "\n".join([
        f"<li><a href=\"{gd}/index.html\">{gd}</a></li>" for gd in game_dirs
    ]) or "<li><small>아직 게임이 없습니다.</small></li>"

    games_index = f"""<!doctype html>
<html lang=\"{cfg['language']}\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>Games | {cfg['title']}</title>
<meta name=\"description\" content=\"PM Fieldnotes 미니 웹게임 아카이브\">
<style>{_theme_css()}</style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"nav\">
      <div class=\"brand\"><div class=\"logo\"></div><div>
        <div>{cfg['title']}</div>
        <div class=\"tagline\">{cfg['description']}</div>
      </div></div>
      <div class=\"meta\"><a href=\"../index.html\">← 홈</a> · <a href=\"../catalog/index.html\">Catalog</a></div>
    </div>

    <div class=\"card\">
      <div class=\"h2\">게임 목록</div>
      <ul>{games_list}</ul>
      <div class=\"footer\">© {cfg['title']} — built with OpenClaw</div>
    </div>
  </div>
</body>
</html>"""

    (out/'games'/'index.html').write_text(games_index, encoding='utf-8')

    # catalog: copy catalog directory into docs/catalog
    catalog_src = Path('catalog')
    catalog_dst = out/'catalog'
    if catalog_src.exists():
        if catalog_dst.exists():
            shutil.rmtree(catalog_dst)
        shutil.copytree(catalog_src, catalog_dst)

    # catalog html (reads catalog/index.json)
    cat_items = []
    try:
        import json as _json
        idx = _json.load(open(catalog_src/'index.json','r',encoding='utf-8'))
        cat_items = (idx.get('items') or [])
    except Exception:
        cat_items = []

    def _esc(s: str) -> str:
        return (s or '').replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

    lis = []
    for it in cat_items[:200]:
        title = _esc(it.get('title') or it.get('name') or 'Untitled')
        src = _esc(it.get('source_name') or it.get('source') or '')
        axis = ','.join(it.get('market_axis') or it.get('axis') or [])
        url = it.get('url') or ''
        summary = _esc(it.get('summary') or '')
        link = f"<a href=\"{_esc(url)}\">원문</a>" if url else ""
        lis.append(f"<li><b>{title}</b><br><small>{src} • {axis}</small><br><small>{summary}</small><br>{link}</li>")

    cat_list = '\n'.join(lis) or '<li><small>아직 카탈로그 아이템이 없습니다.</small></li>'

    catalog_html = f"""<!doctype html>
<html lang=\"{cfg['language']}\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>Catalog | {cfg['title']}</title>
<meta name=\"description\" content=\"InvestAnalyst research catalog (metadata only)\">
<style>{_theme_css()}</style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"nav\">
      <div class=\"brand\"><div class=\"logo\"></div><div>
        <div>{cfg['title']}</div>
        <div class=\"tagline\">{cfg['description']}</div>
      </div></div>
      <div class=\"meta\"><a href=\"../index.html\">← 홈</a> · <a href=\"../games/index.html\">Games</a></div>
    </div>

    <div class=\"card\">
      <div class=\"h2\">Research Catalog (metadata)</div>
      <div class=\"meta\">index.json: <a href=\"index.json\">download</a></div>
      <hr>
      <ul>{cat_list}</ul>
      <div class=\"footer\">© {cfg['title']} — built with OpenClaw</div>
    </div>
  </div>
</body>
</html>"""

    (out/'catalog'/'index.html').write_text(catalog_html, encoding='utf-8')

    # briefs: scan external brief directories and render pages + index
    brief_entries = build_briefs(cfg, out)
    briefs_idx_dir = out / 'briefs'
    briefs_idx_dir.mkdir(parents=True, exist_ok=True)
    (briefs_idx_dir / 'index.html').write_text(
        render_briefs_index(brief_entries, cfg), encoding='utf-8')

    index_items='\n'.join([
        f"<li><a href=\"posts/{slug}.html\">{title}</a><br><small>{ex}</small></li>" for slug,title,ex in items
    ])

    base = (cfg.get('base_url') or '').rstrip('/')
    canonical = f"{base}/" if base else "index.html"

    index=f"""<!doctype html>
<html lang=\"{cfg['language']}\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>{cfg['title']}</title>
<meta name=\"description\" content=\"{cfg['description']}\">
<link rel=\"canonical\" href=\"{canonical}\">
<meta property=\"og:type\" content=\"website\">
<meta property=\"og:title\" content=\"{cfg['title']}\">
<meta property=\"og:description\" content=\"{cfg['description']}\">
<meta property=\"og:url\" content=\"{canonical}\">
<meta name=\"twitter:card\" content=\"summary\">
<link rel=\"alternate\" type=\"application/rss+xml\" title=\"{cfg['title']} RSS\" href=\"{base}/rss.xml\" />
<style>{_theme_css()}</style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"nav\">
      <div class=\"brand\"><div class=\"logo\"></div><div>
        <div>{cfg['title']}</div>
        <div class=\"tagline\">{cfg['description']}</div>
      </div></div>
      <div class=\"meta\"><span class=\"kbd\">매일 발행</span> · <a href=\"briefs/index.html\">Briefs</a> · <a href=\"games/index.html\">Games</a> · <a href=\"catalog/index.html\">Catalog</a></div>
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

    # robots.txt + sitemap.xml + rss.xml for SEO
    base = (cfg.get('base_url') or '').rstrip('/')

    robots = "\n".join([
        "User-agent: *",
        "Allow: /",
        f"Sitemap: {base}/sitemap.xml" if base else "",
        "",
    ]).strip() + "\n"
    (out/'robots.txt').write_text(robots, encoding='utf-8')

    # sitemap
    urls = []
    if base:
        urls.append(f"{base}/")
        urls.append(f"{base}/briefs/index.html")
        urls.append(f"{base}/games/index.html")
        urls.append(f"{base}/catalog/index.html")
        for slug, _t, _ex in items:
            urls.append(f"{base}/posts/{slug}.html")
        for gd in game_dirs:
            urls.append(f"{base}/games/{gd}/index.html")
        for _d, _l, _s, rp in brief_entries:
            urls.append(f"{base}/{rp}")
        # catalog items are not enumerated in sitemap (metadata is in index.json)

    sitemap_items = "\n".join([f"  <url><loc>{u}</loc></url>" for u in urls])
    sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" \
              "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" \
              f"{sitemap_items}\n" \
              "</urlset>\n"
    (out/'sitemap.xml').write_text(sitemap, encoding='utf-8')

    # rss
    def xml_escape(s: str) -> str:
        return (s or "").replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

    rss_items = []
    for slug, t, ex in items[:20]:
        link = f"{base}/posts/{slug}.html" if base else f"posts/{slug}.html"
        rss_items.append(
            "<item>"
            f"<title>{xml_escape(t)}</title>"
            f"<link>{xml_escape(link)}</link>"
            f"<guid>{xml_escape(link)}</guid>"
            f"<description>{xml_escape(ex)}</description>"
            "</item>"
        )

    rss = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" \
          "<rss version=\"2.0\"><channel>" \
          f"<title>{xml_escape(cfg['title'])}</title>" \
          f"<link>{xml_escape(base + '/') if base else ''}</link>" \
          f"<description>{xml_escape(cfg['description'])}</description>" \
          + "".join(rss_items) + \
          "</channel></rss>\n"

    (out/'rss.xml').write_text(rss, encoding='utf-8')

if __name__=='__main__':
    main()

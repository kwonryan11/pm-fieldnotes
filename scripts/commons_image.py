#!/usr/bin/env python3
"""Fetch a suitable image from Wikimedia Commons without an API key.

Given keywords, searches Commons, picks the first usable file, downloads it
into docs/assets/images/<slug>.<ext>, and returns a markdown/HTML snippet plus credit.

Usage:
  python3 scripts/commons_image.py --slug <slug> --keywords "k1,k2,k3"

Outputs JSON to stdout:
  {"local_path":"docs/assets/images/...","img_html":"<img ...>","credit":"...","source_url":"...","license":"..."}
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "assets" / "images"

WIKI_API = "https://commons.wikimedia.org/w/api.php"


def http_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "openclaw-pm-fieldnotes/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def sanitize_filename(name: str) -> str:
    name = re.sub(r"[^a-zA-Z0-9._-]+", "-", name).strip("-")
    return name or "image"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--keywords", required=True, help="comma-separated")
    args = ap.parse_args()

    keywords = [k.strip() for k in args.keywords.split(",") if k.strip()]
    if not keywords:
        raise SystemExit("no keywords")

    query = " ".join(keywords)

    # Search for files
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",  # File:
        "gsrlimit": "5",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata",
        # Avoid thumbnail generation (Commons can rate-limit thumb requests).
    }
    url = WIKI_API + "?" + urllib.parse.urlencode(params)
    data = http_json(url)

    pages = (data.get("query") or {}).get("pages") or {}
    if not pages:
        raise SystemExit("no results")

    # Pick first page with a downloadable image URL
    picked = None
    for _pid, page in pages.items():
        iis = page.get("imageinfo") or []
        if not iis:
            continue
        ii = iis[0]
        img_url = ii.get("thumburl") or ii.get("url")
        if not img_url:
            continue
        picked = (page, ii)
        break

    if not picked:
        raise SystemExit("no usable image")

    page, ii = picked

    extmeta = (ii.get("extmetadata") or {})
    artist = (extmeta.get("Artist") or {}).get("value") or "Unknown"
    license_short = (extmeta.get("LicenseShortName") or {}).get("value") or "Unknown"
    license_url = (extmeta.get("LicenseUrl") or {}).get("value") or ""
    credit = (extmeta.get("Credit") or {}).get("value") or ""

    # source page URL
    title = page.get("title") or ""
    # title like "File:Something.jpg"
    source_url = "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"))

    # Prefer original file URL to avoid thumbnail rate-limits.
    img_url = ii.get("url")
    if not img_url:
        raise SystemExit("missing image url")

    # Determine extension from URL
    parsed = urllib.parse.urlparse(img_url)
    ext = os.path.splitext(parsed.path)[1].lower()
    if ext not in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        ext = ".jpg"

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    local_name = sanitize_filename(args.slug) + ext
    local_path = OUT_DIR / local_name

    # Download (be gentle with rate limits)
    req = urllib.request.Request(img_url, headers={"User-Agent": "openclaw-pm-fieldnotes/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            local_path.write_bytes(r.read())
    except Exception as e:
        # If Commons rate-limits, skip image instead of failing publish.
        raise SystemExit(f"download failed: {e}")

    rel_path = f"assets/images/{local_name}"

    # Build snippets
    img_html = f"<img src=\"{rel_path}\" alt=\"{query}\" loading=\"lazy\" style=\"width:100%;height:auto;border-radius:16px;margin:16px 0;\">"
    credit_line = f"Image credit: {artist} — Wikimedia Commons ({license_short})"
    if license_url:
        credit_line += f" · {license_url}"
    credit_line += f" · {source_url}"
    if credit:
        # keep it short: strip tags crudely
        credit_clean = re.sub(r"<[^>]+>", "", credit).strip()
        if credit_clean and credit_clean.lower() not in ("unknown",):
            credit_line += f" · {credit_clean}"

    out = {
        "local_path": str(local_path),
        "img_html": img_html,
        "credit": credit_line,
        "source_url": source_url,
        "license": license_short,
    }
    sys.stdout.write(json.dumps(out, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Daily auto-publisher for pm-fieldnotes.

- Generates a new Korean PM post (LLM is expected to provide content; this script only handles filesystem+git).
- Renders static HTML into /docs
- Commits + pushes to GitHub via deploy key.

This script is designed to be called from an OpenClaw cron agentTurn that supplies the markdown content.

Usage:
  python3 scripts/daily_publish.py --slug 2026-02-20-some-title --title "..." --body-path /tmp/body.md

It writes: posts/<slug>.md and rebuilds docs.
"""

from __future__ import annotations

import argparse
import os
import subprocess
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parents[1]
KEY_PATH = Path("/home/node/.openclaw/keys/pm-fieldnotes_deploy_key")
KNOWN_HOSTS = Path("/home/node/.openclaw/ssh/known_hosts")


def run(cmd: list[str], *, check: bool = True) -> None:
    subprocess.run(cmd, cwd=str(REPO_DIR), check=check)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True, help="filename slug without extension")
    ap.add_argument("--title", required=True)
    ap.add_argument("--body-path", required=True, help="path to markdown body (without leading # title)")
    ap.add_argument(
        "--image-keywords",
        default="",
        help="comma-separated keywords for Wikimedia Commons image (no API key)",
    )
    args = ap.parse_args()

    posts_dir = REPO_DIR / "posts"
    posts_dir.mkdir(parents=True, exist_ok=True)

    body = Path(args.body_path).read_text(encoding="utf-8").strip() + "\n"

    img_block = ""
    credit_block = ""
    if args.image_keywords.strip():
        # Fetch Commons image and embed as raw HTML line (generator keeps <img> as-is)
        import json as _json
        import subprocess as _sub

        r = _sub.check_output(
            [
                "python3",
                "scripts/commons_image.py",
                "--slug",
                args.slug,
                "--keywords",
                args.image_keywords,
            ],
            cwd=str(REPO_DIR),
        )
        meta = _json.loads(r.decode("utf-8"))
        img_block = meta.get("img_html", "").strip() + "\n\n"
        credit = meta.get("credit", "").strip()
        if credit:
            credit_block = "\n\n---\n\n" + credit + "\n"

    md = f"# {args.title}\n\n" + img_block + body + credit_block

    out_path = posts_dir / f"{args.slug}.md"
    if out_path.exists():
        raise SystemExit(f"post already exists: {out_path}")
    out_path.write_text(md, encoding="utf-8")

    # render site
    run(["python3", "scripts/generate.py"])

    # git commit/push
    run(["git", "add", "-A"])
    run(["git", "config", "user.email", "openclaw-bot@local"])
    run(["git", "config", "user.name", "OpenClaw"])

    # allow empty body changes? no.
    run(["git", "commit", "-m", f"post: {args.slug}"])

    env = os.environ.copy()
    env["GIT_SSH_COMMAND"] = (
        f"ssh -i {KEY_PATH} -o IdentitiesOnly=yes -o UserKnownHostsFile={KNOWN_HOSTS} -o StrictHostKeyChecking=yes"
    )
    subprocess.run(["git", "push", "origin", "main"], cwd=str(REPO_DIR), check=True, env=env)

    print(f"published {args.slug}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

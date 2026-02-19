#!/usr/bin/env python3
"""Create a new game folder from games/_template.

Usage:
  python3 scripts/new_game.py <slug>

Creates:
  games/<slug>/{index.html,GAME.md,LICENSES.md}
"""

import shutil
import sys
from pathlib import Path


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/new_game.py <slug>")
        raise SystemExit(2)

    slug = sys.argv[1].strip().strip('/')
    if not slug or slug.startswith('_') or '..' in slug:
        raise SystemExit("Invalid slug")

    src = Path('games/_template')
    dst = Path('games') / slug

    if not src.exists():
        raise SystemExit(f"Template not found: {src}")
    if dst.exists():
        raise SystemExit(f"Already exists: {dst}")

    dst.mkdir(parents=True)
    for name in ['index.html', 'GAME.md', 'LICENSES.md']:
        shutil.copy2(src / name, dst / name)

    print(f"created {dst}")


if __name__ == '__main__':
    main()

# Blog Operations Plan (Category-based Daily Publishing)

## Categories (daily 1 each)
1. newsletter
2. stocks
3. ai
4. work

## Schedule (UTC)
- 08:00 newsletter
- 11:30 stocks
- 16:00 ai
- 20:30 work

## Runtime Flow per job
1. acquire category lock (`.locks/<category>.lock`)
2. generate `docs/posts/YYYY-MM-DD-<category>.html`
3. append metadata to `data/posts.jsonl`
4. rebuild homepage (`scripts/rebuild_index.sh`)
5. commit & push to `main`

## Safety
- duplicate prevention by file existence + lock
- one category failure does not block others
- logs: `logs/publish.log` + `logs/cron-*.log`

## Cron install
> Current environment may block direct `crontab` access. If shell access is available, run:

```bash
crontab /home/node/.openclaw/workspace/pm-fieldnotes/scripts/cron.tab
crontab -l
```

## Manual test
```bash
cd /home/node/.openclaw/workspace/pm-fieldnotes
scripts/publish_category.sh newsletter
scripts/publish_category.sh stocks
scripts/publish_category.sh ai
scripts/publish_category.sh work
```

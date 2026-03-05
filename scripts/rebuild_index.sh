#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
META="$ROOT/data/posts.jsonl"
OUT="$ROOT/docs/index.html"

mkdir -p "$ROOT/docs"

rows=""
if [[ -f "$META" ]]; then
  mapfile -t lines < <(tail -n 40 "$META")
  for (( idx=${#lines[@]}-1 ; idx>=0 ; idx-- )); do
    line="${lines[idx]}"
    title=$(node -e "const j=JSON.parse(process.argv[1]);console.log(j.title)" "$line")
    slug=$(node -e "const j=JSON.parse(process.argv[1]);console.log(j.slug)" "$line")
    category=$(node -e "const j=JSON.parse(process.argv[1]);console.log(j.category)" "$line")
    dt=$(node -e "const j=JSON.parse(process.argv[1]);console.log(j.datetime)" "$line")
    rows+="<li><a href=\"/pm-fieldnotes/posts/${slug}.html\">${title}</a> <small>(${category}, ${dt})</small></li>"
  done
fi

cat > "$OUT" <<HTML
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>영기의 웹블로그</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:920px;margin:48px auto;padding:0 16px;line-height:1.7}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
    .card{border:1px solid #e5e7eb;border-radius:12px;padding:14px}
    .muted{color:#666}
  </style>
</head>
<body>
  <h1>영기의 웹블로그</h1>
  <p class="muted">주제별 매일 1개 자동 발행: 뉴스레터 · 주식투자 · AI·실무 · 업무역량</p>

  <h2>카테고리</h2>
  <div class="grid">
    <div class="card"><b>뉴스레터 정리</b><br/>매일 아침 핵심 이슈 요약</div>
    <div class="card"><b>주식투자</b><br/>매일 점심 시장 가설/리스크 기록</div>
    <div class="card"><b>AI·실무 인사이트</b><br/>매일 오후 자동화/생산성 팁</div>
    <div class="card"><b>업무역량</b><br/>매일 저녁 할일관리·업무관리·일잘하는법</div>
  </div>

  <h2>최근 발행</h2>
  <ul>
    ${rows:-<li>아직 발행된 글이 없습니다.</li>}
  </ul>
</body>
</html>
HTML

#!/usr/bin/env bash
set -euo pipefail

CATEGORY="${1:-}"
if [[ -z "$CATEGORY" ]]; then
  echo "usage: publish_category.sh <newsletter|stocks|ai|work>" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCK_FILE="$ROOT/.locks/${CATEGORY}.lock"
LOG_FILE="$ROOT/logs/publish.log"
META_FILE="$ROOT/data/posts.jsonl"
DATE_UTC="$(date -u +%F)"
DT_UTC="$(date -u +%FT%TZ)"

mkdir -p "$ROOT/.locks" "$ROOT/logs" "$ROOT/data" "$ROOT/docs/posts"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "[$DT_UTC] SKIP $CATEGORY lock-held" | tee -a "$LOG_FILE"
  exit 0
fi

slug_base="${DATE_UTC}-${CATEGORY}"
slug="$slug_base"
out="$ROOT/docs/posts/${slug}.html"
if [[ -f "$out" ]]; then
  suffix=$(date -u +%H%M)
  slug="${slug_base}-${suffix}"
  out="$ROOT/docs/posts/${slug}.html"
fi

case "$CATEGORY" in
  newsletter)
    title="[뉴스레터 정리] ${DATE_UTC} 핵심 이슈 3가지"
    summary="오늘 확인한 주요 이슈를 짧게 요약하고, 실무/시장 관점의 체크포인트를 정리합니다."
    bullets='\n      <li>핵심 이슈 1: 오늘의 주요 헤드라인 요약</li>\n      <li>핵심 이슈 2: 영향 범위(업계/시장/업무)</li>\n      <li>핵심 이슈 3: 내일 확인할 후속 지표</li>'
    ;;
  stocks)
    title="[주식투자] ${DATE_UTC} 시장 가설과 리스크 체크"
    summary="지수·금리·환율 중 핵심 흐름을 확인하고, 오늘의 가설과 무효화 조건을 기록합니다."
    bullets='\n      <li>가설: 현재 흐름이 이어질 경우 기대 시나리오</li>\n      <li>체크포인트: 지표 2~3개</li>\n      <li>리스크: 가설이 틀리는 조건</li>'
    ;;
  ai)
    title="[AI·실무] ${DATE_UTC} 오늘의 자동화/생산성 인사이트"
    summary="반복 업무를 줄이기 위한 AI 활용 아이디어를 하나 선정해 실행 가능한 형태로 정리합니다."
    bullets='\n      <li>문제: 현재 비효율 포인트 1개</li>\n      <li>방법: AI 적용 절차 3단계</li>\n      <li>결과: 시간 절감/품질 개선 예상치</li>'
    ;;
  work)
    title="[업무역량] ${DATE_UTC} 할일·업무관리·일잘하는법"
    summary="우선순위, 커뮤니케이션, 실행력을 높이기 위한 1일 1개 실천 포인트를 기록합니다."
    bullets='\n      <li>오늘의 우선순위 1개</li>\n      <li>실행 규칙 1개(예: 25분 집중)</li>\n      <li>회고 질문 1개(오늘 무엇을 개선했나)</li>'
    ;;
  *)
    echo "unknown category: $CATEGORY" >&2
    exit 1
    ;;
esac

cat > "$out" <<HTML
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:760px;margin:48px auto;padding:0 16px;line-height:1.7}
    .muted{color:#666}
  </style>
</head>
<body>
  <p><a href="/pm-fieldnotes/">← 홈으로</a></p>
  <h1>${title}</h1>
  <p class="muted">카테고리: ${CATEGORY} · 발행: ${DT_UTC} (UTC)</p>
  <p>${summary}</p>
  <ul>${bullets}
  </ul>
  <p class="muted">※ 자동 발행 템플릿 기반 초안입니다. 필요 시 수동으로 내용을 보강하세요.</p>
</body>
</html>
HTML

printf '{"date":"%s","datetime":"%s","category":"%s","title":%s,"slug":"%s"}\n' \
  "$DATE_UTC" "$DT_UTC" "$CATEGORY" "$(node -p "JSON.stringify(process.argv[1])" "$title")" "$slug" >> "$META_FILE"

"$ROOT/scripts/rebuild_index.sh"

cd "$ROOT"
git add docs data/posts.jsonl
if git diff --cached --quiet; then
  echo "[$DT_UTC] SKIP $CATEGORY no-change" | tee -a "$LOG_FILE"
  exit 0
fi
git commit -m "chore(content): publish ${CATEGORY} ${DATE_UTC}"
git push origin main

echo "[$DT_UTC] OK $CATEGORY $slug" | tee -a "$LOG_FILE"

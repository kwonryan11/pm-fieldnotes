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
SOURCE_FILE="$ROOT/data/newsletters.json"
DATE_UTC="$(date -u +%F)"
DT_UTC="$(date -u +%FT%TZ)"

source_html=""
if [[ -f "$SOURCE_FILE" ]]; then
  if [[ "$CATEGORY" == "newsletter" ]]; then
    source_html="$(node "$ROOT/scripts/generate_newsletter_digest.mjs" "$SOURCE_FILE" "$CATEGORY" 2>/dev/null || true)"
  else
    source_html="$(node -e '
const fs=require("fs");
const file=process.argv[1];
const cat=process.argv[2];
const data=JSON.parse(fs.readFileSync(file,"utf8"));
const byName=new Map([...(data.core||[]),...(data.extended||[])].map(x=>[x.name,x]));
const picks=(data.categoryDefaults&&data.categoryDefaults[cat])||[];
const lines=picks.slice(0,5).map(name=>{const v=byName.get(name); if(!v) return null; return `      <li><a href="${v.url}" target="_blank" rel="noopener noreferrer">${v.name}</a></li>`;}).filter(Boolean);
if(lines.length){
  console.log("\n  <h2>참고한 대표 뉴스레터</h2>\n  <ul>\n"+lines.join("\n")+"\n  </ul>");
}
' "$SOURCE_FILE" "$CATEGORY" 2>/dev/null || true)"
  fi
fi

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
    title="[뉴스레터 정리] ${DATE_UTC} 핵심 이슈 브리핑"
    summary="오늘 읽을 만한 흐름을 빠르게 훑고, 내일 확인할 체크포인트까지 남기는 실무형 브리핑입니다."
    bullets_html=$'\n      <li>거시 흐름 1줄 요약</li>\n      <li>업계/기업 레벨에서 의미 있는 변화 2개</li>\n      <li>내일 확인할 지표 및 일정</li>'
    body_html="
  <h2>오늘의 맥락</h2>
  <p>하루치 정보를 다 읽는 것보다, 의사결정에 영향을 주는 흐름만 빠르게 추려보는 게 효율적입니다. 오늘은 거시 환경, 산업 뉴스, 실행 아이템의 세 층으로 정리합니다.</p>

  <h2>핵심 관찰</h2>
  <p>첫째, 시장은 단기 변동보다 정책/유동성 신호에 더 민감하게 반응하고 있습니다. 숫자 하나보다 방향성과 지속 가능성을 봐야 합니다.</p>
  <p>둘째, 기업 뉴스는 실적 자체보다 가이던스(앞으로의 전망) 문구가 주가에 더 큰 영향을 주는 구간입니다. 발표문에서 비용·투자·수요 관련 표현을 분리해서 읽는 게 좋습니다.</p>

  <h2>실행 포인트</h2>
  <p>내일 아침 10분만 투자해 지수 선물, 달러 인덱스, 주요 섹터 ETF 흐름을 먼저 확인하세요. 방향이 엇갈리면 보수적으로 대응하고, 같은 방향이면 기존 가설을 유지하는 방식이 안전합니다.</p>

  <h2>한 줄 결론</h2>
  <p>정보의 양보다 우선순위가 중요합니다. 오늘은 ‘무엇이 변했고, 그래서 내 기준을 어떻게 조정할지’에 집중하면 충분합니다.</p>
"
    ;;
  stocks)
    title="[주식투자] ${DATE_UTC} 시장 가설과 리스크 점검"
    summary="상승/하락 예측보다 중요한 건 가설과 무효화 조건입니다. 오늘의 시나리오를 짧고 명확하게 기록합니다."
    bullets_html=$'\n      <li>기본 시나리오(왜 이 방향을 보는지)</li>\n      <li>확인 지표 3개(금리·환율·거래대금)</li>\n      <li>가설 무효화 조건(손절/축소 기준)</li>'
    body_html="
  <h2>시장 프레임</h2>
  <p>투자는 정답 찾기가 아니라 확률 게임입니다. 그래서 ‘맞추기’보다 ‘틀렸을 때 덜 다치기’가 성과를 결정합니다.</p>

  <h2>오늘의 가설</h2>
  <p>지수의 단기 반등은 가능하지만, 거래대금이 동반되지 않으면 추세 전환으로 보기 어렵습니다. 반등 국면에서도 종목 선택 기준을 더 엄격히 두는 편이 유리합니다.</p>

  <h2>체크해야 할 신호</h2>
  <p>미국 10년물 금리 방향, 원/달러 환율의 변동 폭, 반도체/금융 대형주의 상대 강도를 함께 보세요. 세 신호가 같은 방향이면 포지션 확신도를 높일 수 있습니다.</p>

  <h2>리스크 관리</h2>
  <p>가설이 틀렸다는 신호가 나오면 즉시 비중을 낮추고 관망으로 전환합니다. 좋은 전략은 손실을 짧게 끊고, 맞을 때만 길게 가져가는 전략입니다.</p>

  <h2>한 줄 결론</h2>
  <p>오늘의 목표는 수익 극대화가 아니라 판단 품질 유지입니다. 기준을 적어두면 감정 개입이 줄어듭니다.</p>
"
    ;;
  ai)
    title="[AI·실무] ${DATE_UTC} 자동화로 1시간 아끼는 방법"
    summary="반복 업무를 AI로 줄이는 현실적인 방법을 하나 골라, 바로 실행 가능한 형태로 정리합니다."
    bullets_html=$'\n      <li>반복되는 작업 1개 정의</li>\n      <li>프롬프트/체크리스트 템플릿 설계</li>\n      <li>품질 검수 규칙과 재사용 방법</li>'
    body_html="
  <h2>문제 정의</h2>
  <p>업무 시간이 사라지는 지점은 대부분 ‘반복 입력’과 ‘정리/요약’입니다. 이 영역은 AI로 체감 효율을 가장 빨리 만들 수 있습니다.</p>

  <h2>적용 방식</h2>
  <p>먼저 작업을 3단계로 쪼갭니다: 입력 정리 → 초안 생성 → 검수. 각 단계마다 출력 형식을 고정하면 결과 편차가 줄어듭니다.</p>
  <p>예를 들어 회의록 정리는 “결정사항/액션아이템/리스크” 3개 섹션만 뽑도록 고정하면, 길이가 달라도 품질이 일정해집니다.</p>

  <h2>실무 팁</h2>
  <p>프롬프트는 길게 쓰기보다 체크리스트형으로 작성하세요. 금지 규칙(추측 금지, 숫자 보수적 표기, 근거 없는 단정 금지)을 넣으면 신뢰도가 올라갑니다.</p>

  <h2>기대 효과</h2>
  <p>반복 업무 2~3개만 자동화해도 하루 30~60분을 회수할 수 있습니다. 중요한 건 화려한 자동화보다, 매일 쓰는 작은 자동화를 만드는 것입니다.</p>
"
    ;;
  work)
    title="[업무역량] ${DATE_UTC} 일잘러 실행 시스템"
    summary="우선순위·집중·회고 루틴을 간단히 고정해서 업무 밀도를 올리는 방법을 기록합니다."
    bullets_html=$'\n      <li>오늘의 최우선 1개 정의</li>\n      <li>방해 요소 차단 규칙 1개</li>\n      <li>퇴근 전 5분 회고 질문</li>'
    body_html="
  <h2>우선순위의 기준</h2>
  <p>바쁜 날일수록 할 일을 늘리기보다 줄여야 합니다. 오늘 성과를 좌우하는 ‘한 가지’가 무엇인지 먼저 정하면 실행력이 올라갑니다.</p>

  <h2>집중 설계</h2>
  <p>집중은 의지가 아니라 환경 문제입니다. 25분 집중 + 5분 정리 루틴을 2~3회만 돌려도 체감 생산성이 크게 개선됩니다.</p>

  <h2>커뮤니케이션</h2>
  <p>진행 공유는 길게 쓰지 말고, 상태(진행/이슈/요청) 3줄 구조로 통일하세요. 상대의 판단 시간을 줄여주는 사람이 협업에서 신뢰를 얻습니다.</p>

  <h2>회고 습관</h2>
  <p>퇴근 전 “오늘 반복된 병목이 무엇이었나?”를 한 줄로 남기면 내일의 개선이 빨라집니다. 회고는 반성이 아니라 시스템 업데이트입니다.</p>
"
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
  <ul>${bullets_html}
  </ul>
${body_html}
${source_html}
  <p class="muted">※ 자동 생성 원고입니다. 발행 전후로 수동 보강 가능합니다.</p>
</body>
</html>
HTML

printf '{"date":"%s","datetime":"%s","category":"%s","title":%s,"slug":"%s"}\n' \
  "$DATE_UTC" "$DT_UTC" "$CATEGORY" "$(node -p "JSON.stringify(process.argv[1])" "$title")" "$slug" >> "$META_FILE"

"$ROOT/scripts/rebuild_index.sh"

cd "$ROOT"
git add docs data/posts.jsonl data/newsletters.json scripts/publish_category.sh
if git diff --cached --quiet; then
  echo "[$DT_UTC] SKIP $CATEGORY no-change" | tee -a "$LOG_FILE"
  exit 0
fi
git commit -m "chore(content): publish ${CATEGORY} ${DATE_UTC}"
git push origin main

echo "[$DT_UTC] OK $CATEGORY $slug" | tee -a "$LOG_FILE"

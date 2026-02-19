# 운영 이슈가 몰릴 때 PM이 쓰는 30분 트리아지(긴급도 말고 영향도로)

<img src="assets/images/2026-02-20-ops-triage-impact-over-urgency.jpg" alt="warehouse delivery truck supply chain" loading="lazy" style="width:100%;height:auto;border-radius:16px;margin:16px 0;">

## 문제: ‘급한 일’이 전부처럼 보일 때
슬랙/알람이 동시에 터지면 PM은 본능적으로 “가장 시끄러운 것”부터 잡습니다. 그런데 운영 이슈는 소리(민원, 내부 압박)와 실제 영향(매출, SLA, 안전, 확산 가능성)이 자주 다릅니다. 그 결과, 진짜 위험은 방치되고 팀은 소방수 모드로 고착돼요.

## 왜 중요한가: PM은 ‘해결’보다 ‘선택’을 맡는다
운영 상황에서 PM의 가치는 직접 디버깅이 아니라, 제한된 리소스를 어디에 쓰면 손실을 최소화하는지 결정하는 데 있습니다. 트리아지가 없으면 (1) 같은 이슈가 재발하고 (2) 현장은 PM을 “지시만 하는 사람”으로 느끼고 (3) 데이터는 남지 않아 다음 의사결정도 감으로 하게 됩니다.

## 프레임: 30분 트리아지 체크리스트
아래 6가지를 30분 안에 문장으로 적으면, 대부분의 혼란이 정리됩니다.
- 현상 1줄: “무엇이, 어디서, 언제부터” (추측 금지)
- 영향 범위: 주문 수/지역/고객군/금액, SLA 위반 가능성
- 확산 가능성: 증가 추세인지, 다른 프로세스로 전염되는지
- 임시조치(Containment): 지금 당장 멈출 수단(우회, 제한, 배치 중단)
- 소유자(Owner) 1명: 해결 담당 1명 + 의사결정자 1명(없으면 PM이 지정)
- 다음 업데이트 시간: “15:30에 다시 공유”처럼 리듬 고정
그리고 우선순위는 ‘긴급도’가 아니라 **영향도 × 확산**으로 매깁니다.

## 예시: 배송 지연 알람이 터진 날(물류/운영)
상황: 특정 권역 배송지연 민원이 급증. 동시에 WMS 피킹 오류도 보고됨.
- 현상: 14:10부터 A권역 배차가 지연, ETA가 +90분.
- 영향: 당일배송 SLA 위반 예상 320건, CS 인입 증가.
- 확산: 라우팅 서비스 응답이 느려져 타 권역도 위험.
- 임시조치: A권역 신규 주문을 30분 제한, 배차 주기 10분→5분, 라우팅 타임아웃 완화.
- 소유자: 라우팅은 플랫폼 온콜, 현장 배차는 운영리드. PM은 ‘주문 제한’ 의사결정.
- 업데이트: 15:00, 15:30 두 번만 정례 공유.
결과적으로 “시끄러운 CS”를 달래는 것보다, 확산을 막는 조치(주문 제한/우회)가 먼저입니다.

## 결론/다음 액션: 내일 반복하지 않기
트리아지는 끝이 아니라 시작입니다. 사건 종료 후 24시간 내에
1) 타임라인 10줄, 2) 원인 가설 2개, 3) 재발 방지 1개(알람/가드레일/런북)
만 남기세요. 다음번에는 ‘누가 제일 크게 말했나’가 아니라 ‘무엇이 가장 큰 손실을 만들 뻔했나’로 움직이게 됩니다.


---

Image credit: <div class="fn value">
Hernandez, Edward Simon;Gallitz, Ronald James</div> — Wikimedia Commons (Public domain) · https://commons.wikimedia.org/wiki/File%3AAn_analysis_of_the_Oakland_Naval_Supply_Center%27s_Bay_Area_local_delivery_system_%28IA_analysisofoaklan00hern%29.pdf · https://archive.org/details/analysisofoaklan00hern
https://archive.org/download/analysisofoaklan00hern/analysisofoaklan00hern.pdf

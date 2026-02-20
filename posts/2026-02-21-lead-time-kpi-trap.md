# 물류 운영 PM의 KPI 함정: ‘출고건수’ 대신 ‘리드타임’을 보라

<img src="assets/images/2026-02-21-lead-time-kpi-trap.jpg" alt="barcode scanner warehouse pallet racking forklift truck" loading="lazy" style="width:100%;height:auto;border-radius:16px;margin:16px 0;">

## 문제: 숫자는 늘었는데 고객 불만이 줄지 않는다
운영/물류에서 흔한 상황이다. 출고건수, 처리라인 속도 같은 볼륨 KPI는 좋아 보이는데, CS는 그대로이고 리턴/누락 이슈가 반복된다. 원인은 대개 “측정이 쉬운 것”을 목표로 삼아, 실제 고객 경험(제때/정확히/온전하게)과 KPI가 어긋나는 데 있다.

## 왜 중요한가: KPI는 팀의 행동을 바꾼다
KPI는 보고용이 아니라 의사결정 장치다. 출고건수만 보면 피킹 검증을 생략하거나, 마감 직전 몰아치기 같은 행동이 합리화된다. 그 결과 오배송·파손·분실이 늘고, 재작업과 3PL 패널티가 발생하며, 결국 비용과 신뢰가 동시에 무너진다.

## 프레임/체크리스트: 1개 ‘북극성’ + 3개 ‘가드레일’
1) 북극성 KPI를 고객 기준으로 정의한다: 주문→출고(또는 주문→배송완료) 리드타임의 P90/P95.
2) 가드레일 3개를 붙인다: 정확도(오배송률/누락률), 품질(파손률), 비용(건당 처리비/재작업률).
3) 구간을 쪼갠다: 주문접수→할당→피킹→검수→패킹→출고→인계. 병목이 어디인지 KPI가 말하게 만든다.
4) 정의를 문서화한다: 분모/분자, 제외조건(예약/선주문), 타임스탬프 기준(WMS vs OMS)을 명확히.

## 예시(물류/운영): WMS-3PL 데이터로 리드타임을 ‘쪼개’ 개선하기
최근 마감지연이 문제라면, 전체 평균 대신 P95 리드타임을 본다. OMS 주문시간과 WMS 출고확정시간을 매칭해 구간별 소요를 계산한다. 분석 결과가 “피킹은 빠른데 검수 대기열이 길다”라면, 검수 인력 증원보다 먼저: (a) 고위험 SKU만 2중검수, (b) 바코드 스캔 누락 방지(스캔 강제), (c) 패킹 스테이션 동선 재배치 같은 조치를 실험한다. 동시에 오배송률/재작업률을 가드레일로 두어, 속도 개선이 품질을 갉아먹지 않게 한다.

## 결론/다음 액션: 오늘 바로 할 30분짜리 세팅
- 리드타임 북극성 KPI를 P90/P95로 정하고, 정의를 한 문단으로 적는다.
- 정확도/품질/비용 가드레일 3개를 붙여 대시보드에 함께 노출한다.
- WMS/3PL 타임스탬프 2~3개만이라도 연결해 “어느 구간이 느린지”부터 보이게 만든다.
KPI가 바뀌면 회의의 질문이 바뀌고, 질문이 바뀌면 현장의 행동이 바뀐다.


---

Image credit: <div class="fn value">
<dl><dd>Miertschin, Keith W.</dd>
<dd>Forrest, Brian D.</dd></dl></div> — Wikimedia Commons (Public domain) · https://commons.wikimedia.org/wiki/File%3AAnalysis_of_Tobyhanna_Army_Depot%27s_Radio_Frequency_Identification_%28RFID%29_program-_RFID_as_an_asset_management_tool_%28IA_analysisoftobyha1094510033%29.pdf · Internet Archive identifier: analysisoftobyha1094510033
https://archive.org/download/analysisoftobyha1094510033/analysisoftobyha1094510033.pdf

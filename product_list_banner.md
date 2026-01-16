상품 목록 페이지 배너 UI를 다음 요구사항대로 개선해줘.

목표
1) 배너는 유지하되 "첫 화면(스크롤 전)"에서 상품 그리드(첫 줄)가 일부라도 보이게 배너 높이를 줄인다.
2) 슬라이더를 center/peek 형태로 바꿔서 이전/다음 배너가 양옆에 '연하게' 보이게 한다.
   - 가운데 슬라이드: opacity 1, scale 1
   - 양옆 슬라이드: opacity 0.3~0.45, scale 0.92~0.96
   - 슬라이드 간 간격: 16~24px 정도
3) 배너는 페이지 컨테이너 폭(상품 그리드와 동일 max-width)에 맞추고, 모서리 라운드/overflow hidden 적용해서 완성도를 높인다.

제약/유의사항
- 기존 슬라이드 기능(자동 전환, 좌우 화살표, dot 인디케이터)이 있다면 유지하고, 없다면 최소한 좌우 이동 + dot 표시까지 구현해줘.
- 반응형 고려: 데스크탑에서는 peek가 보이되, 모바일에서는 화면이 좁으니 peek를 줄이거나(간격/scale/opacity 조정) 필요시 1장만 꽉 차게 보이게 처리해줘.
- CSS는 기존 파일 구조를 유지하고, 가능하면 banner 관련 클래스 내부에서만 수정(사이드 이펙트 최소화).
- JS는 기존 로직을 최대한 재사용하고, transform 기반 translateX로 구현(성능 고려).
- 배너 높이는 고정(px) 또는 clamp() 중 현재 코드 스타일에 더 맞는 방식으로 적용해줘.
  예: height: clamp(260px, 28vw, 360px) 같은 식도 가능.

작업 파일
- HTML: pages/products/list/index.html (배너 구조/클래스 확인 및 최소 수정)
- CSS: pages/products/list/product-list.css (banner container/track/slide 스타일 수정)
- JS: pages/products/list/product-list.js (슬라이드 계산 로직: center/peek 지원)

산출물
- 변경된 코드 전체(diff 형태면 더 좋음)
- 주요 변경 포인트 설명(왜 이렇게 했는지 5줄 내외)

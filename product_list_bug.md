다음은 상품 목록 페이지의 일부 코드야. 브라우저 줌(110%~200%) 시 화면에 큰 빈 여백이 생기고 푸터/하단 소셜 아이콘 영역이 어색한 위치에 보이는 레이아웃 깨짐 버그를 수정해줘.

✅ 파일/코드 맥락
- pages/products/list/index.html (아래 HTML 참고)
- pages/products/list/product-list.css (아래 CSS 참고)
- shared/css/common.css, shared/css/reset.css 도 반드시 함께 확인해줘 (줌 이슈는 여기 전역 레이아웃 규칙 때문에 생길 가능성이 큼)

✅ 증상
- 줌 확대(110~200%) 시 페이지 중간/하단에 큰 빈 공간이 생김
- footer가 중간에 떠 보이거나, 하단 아이콘(소셜)이 레이아웃 흐름과 다르게 표시됨
- 상품 그리드가 정상적으로 채워지지 않는 듯 보임

✅ 목표(완료 조건)
- 100% / 125% / 150% / 200% 줌에서도 레이아웃이 깨지지 않음
- footer는 항상 콘텐츠 아래에 자연스럽게 이어지고, 빈 여백이 과하게 생기지 않음
- 배너/그리드/푸터가 반응형으로 자연스럽게 수축/확장
- 불필요한 고정 높이/고정 px로 인해 줌에서 공간이 뻥 뜨는 문제 제거

✅ 반드시 체크할 원인 후보(코드 위치와 함께 진단해줘)
1) common.css 또는 다른 전역 스타일에
   - body, main, .container, footer 등에 height:100vh / min-height / overflow / position 설정이 있는지
   - display:flex + footer 밀어내기(예: main flex:1)가 제대로 되어있는지
2) banner-container { height: 500px } 같은 고정 높이가 줌 시 레이아웃 계산을 깨는지
   - 필요하면 clamp()/max-height/vh 기반으로 변경
3) footer 또는 social-icons가 position:absolute/fixed 혹은 float/transform 영향을 받는지
4) grid/flex에서 min-height:0, overflow, align-content/justify-content 설정 때문에 남는 공간이 과하게 분배되는지

✅ 수정 방향(권장)
- 페이지 레이아웃을 “sticky footer 패턴”으로 고쳐줘:
  html, body { height:100%; }
  body { min-height:100vh; display:flex; flex-direction:column; }
  main { flex:1; }
  footer는 문서 흐름 유지 (position absolute/fixed 금지)
- 배너 높이 500px 고정이면:
  height: clamp(240px, 30vw, 500px); 같은 방식으로 줌/해상도 대응
- product-grid의 gap/padding이 과하면 반응형으로 조절:
  gap: clamp(20px, 4vw, 60px)
  padding: clamp(24px, 5vw, 80px) 0

✅ 산출물
1) 원인 후보 Top3를 실제 코드 위치와 함께 짧게 설명
2) 적용한 수정안(최종 선택 1개) 설명
3) 변경사항을 diff 형태로 제시 (common.css 포함 가능)
4) 줌 테스트 체크리스트 (100/125/150/200%) + 모바일/데스크탑 폭 2~3개

--- 아래는 현재 코드 참고 ---

[product-list.css 일부]
.banner-section { width:100%; margin-bottom:80px; }
.banner-container { position:relative; width:100%; height:500px; overflow:hidden; }
.product-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:60px; padding:80px 0; }

[index.html 구조]
<body>
  <header>...</header>
  <main>
    <section class="banner-section">...</section>
    <div class="container">
      <section class="product-list-wrapper">
        <ul id="product-

너는 프론트엔드 엔지니어야. 아래 코드베이스에서 "상품 목록 페이지"에 이벤트 배너(슬라이더)를 구현해줘.

[목표]
- pages/products/list/index.html 의 <main class="container"> 내부에서
  <ul id="product-list" class="product-grid"> 위에 이벤트 배너 섹션을 추가한다.
- 디자인은 피그마 스펙을 최대한 그대로 반영한다.
- 기존 상품 리스트 렌더링(API.getProducts(), renderProducts)은 그대로 유지한다.
- 명세서 요구사항: "상품 목록 페이지에 있는 배너를 슬라이드로 구현해봅니다." 를 반드시 만족해야 한다. (정적 배너 금지)

[수정해야 할 파일]
1) HTML: pages/products/list/index.html
2) CSS: pages/products/list/product-list.css
3) JS: pages/products/list/product-list.js

[현재 코드(중요 부분)]
- index.html: (아래 그대로 유지하되 product-grid 위에 배너 섹션을 추가)
<main class="container">
  <section class="product-list-wrapper">
    <ul id="product-list" class="product-grid"></ul>
  </section>
</main>

- product-list.js:
async function renderProducts() { ... } / renderProducts(); 는 그대로 둔다.

[피그마 스펙]
- 배너 폭 기준: (컨테이너 안에 맞춤 / 화면 전체) = 화면 전체 1920
- 배너 높이(px): 500px
- 배너와 상품그리드 간격(px): 80px

- 슬라이드 개수: 5개
- 슬라이드 이미지 경로:
    우선은 이미지가 따로 없기 때문에 상품 목록의 사진을 순차적으로 지나가게 하면 좋을 것 같다. 약간 명도를 낮게 해서.

- 슬라이드 클릭 시 이동:
  해당 상품 구매 창으로 이동하게

- 좌/우 화살표:
  - 좌측 화살표 아이콘 파일 위치 : file:///C:/OpenMarket-Service/shared/assets/icons/icon-swiper-1.svg
  - 우측 화살표 아이콘 파일 위치 : file:///C:/OpenMarket-Service/shared/assets/icons/icon-swiper-2.svg
  - 버튼(클릭영역) 크기: 60 x 124
  - 위치: 좌측 56px, 우측 56px (배너 기준)

- 도트 인디케이터:
  - 도트 크기: 6px
  - 도트 간격: 6px
  - 기본색: #FFFFFF
  - 활성색: #000000
  - 위치: 배너 아래

[구현 요구사항]
- HTML 구조는 접근성 고려:
  - <section aria-label="이벤트 배너"> 사용
  - 화살표는 <button type="button" aria-label="이전 배너"> 형태
- CSS:
  - 배너는 overflow hidden, 슬라이드 전환은 transform 기반
  - 이미지 object-fit은 피그마 의도대로 (cover/contain 중 선택) = {FILL_ME}
- JS:
  - 좌/우 버튼으로 슬라이드 이동
  - 도트 클릭으로 해당 슬라이드로 이동
  - 명세서에 따라 배너는 반드시 "슬라이드(캐러셀)" 형태여야 한다. (좌/우 이동 + 도트 인디케이터 포함)
  - 자동재생: 3초
  - 무한루프 여부: yes

[완료 기준]
- 배너가 product-grid 위에 정상 노출
- 좌/우/도트 동작 정상
- 기존 상품 목록 렌더링 영향 없음
- 코드 변경은 지정 파일 내에서만 최소로

[추가]
- 최종 답변은 “수정된 파일별 코드 전체”를 보여줘(HTML/CSS/JS).

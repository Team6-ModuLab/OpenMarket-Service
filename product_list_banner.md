현재 상품 목록 배너 슬라이더에 버그가 있습니다.

증상
1) 화면을 좁게 했을 때, 배너를 다음/이전으로 넘길수록 브라우저 하단 가로 스크롤바 길이가 계속 커집니다.
2) 화면을 크게 하면 레이아웃이 이상해지고, 페이지가 가로로 밀린 듯한 overflow가 생깁니다. (가로 스크롤하면 헤더 일부만 보이는 상태)

원인 추정
- next/prev 이동 시 슬라이드를 clone해서 track에 계속 append하는 로직이 반복되거나,
- track/container width를 이동마다 누적(+=)으로 늘리는 계산이 들어가 document 전체 width가 커지는 것으로 보임.
- 또는 width:100vw 사용으로 overflow가 발생할 수 있음.

요구사항(수정 목표)
1) next/prev를 아무리 눌러도 document 가로 폭이 증가하지 않게 수정 (가로 스크롤바가 생기지 않게)
2) 슬라이드 개수(.banner-slide)가 이동할 때마다 증가하지 않게(무한 슬라이더면 초기 1회만 clone 생성)
3) track width는 초기/resize 때만 계산하고, 이동은 transform translateX만 변경
4) CSS에서 배너 wrapper는 overflow:hidden, 컨테이너는 width:100% + max-width 기반으로 고정
   - width:100vw가 있다면 가능하면 100%로 교체 (특히 컨테이너/섹션)
5) 창 resize 시에도 레이아웃/peek가 깨지지 않게 재계산 로직 추가

수정 파일
- pages/products/list/product-list.css
- pages/products/list/product-list.js
- pages/products/list/index.html (필요 시 최소 수정)

산출물
- 문제 원인(어떤 코드 때문에 width가 늘었는지) 짧게 설명
- 수정된 코드 diff 또는 전체 코드

상품 목록 페이지에서 창 너비를 줄이면(윈도우 리사이즈) 지금은 가로 스크롤바가 아예 안 생기거나, footer가 너무 찌그러져서 레이아웃이 깨져 보여.

내가 원하는 동작은 이거야:
- viewport 너비가 충분할 때는 반응형으로 자연스럽게 줄어듦
- 하지만 footer는 특정 최소 너비(min-width) 이하로는 더 이상 줄지 않게 “최소값”을 지정
- 화면이 그 min-width 보다 더 좁아지면, 페이지(또는 footer 영역)에 가로 스크롤바가 생겨서 사용자가 좌우로 스크롤해 볼 수 있게 만들기
- 즉 “footer는 min-width로 보호 + 그 이하에서는 horizontal scroll 활성화” 패턴으로 수정

요청:
1) 현재 CSS(common.css 포함)에서 스크롤바가 안 생기게 막는 요소(overflow-x: hidden 등) 있는지 찾아서 제거/조정
2) footer에 min-width를 적용하고, viewport가 더 좁아지면 가로 스크롤이 생기도록
   어떤 요소에 overflow-x:auto 또는 min-width를 줘야 하는지 선택해서 적용해줘
   (예: body/html, main wrapper, footer-top-inner/container 등)
3) 변경사항을 diff로 보여주고 왜 이렇게 하면 원하는 동작이 되는지 설명해줘
4) 크롬에서 창 너비를 줄였을 때 스크롤바가 생기는지 체크 방법도 같이 적어줘

참고:
- 최소값(min-width) 숫자는 너가 적절히 결정해줘.
- 페이지 파일: pages/products/list/index.html / product-list.css + shared/css/common.css 확인 필요

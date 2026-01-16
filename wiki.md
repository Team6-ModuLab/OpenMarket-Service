너는 우리 “오픈마켓 프론트엔드 서비스” 프로젝트의 문서화 담당이야.
레포 전체 코드를 읽고, GitHub Wiki 또는 /docs에 바로 넣을 수 있는 “프로젝트 위키”를 Markdown으로 작성해줘.

[프로젝트 컨텍스트]
- 프로젝트: 오픈마켓(상품 목록/상세/장바구니 등) 프론트엔드
- 스택: 순수 JS + (Vite 사용 중일 가능성 높음), HTML/CSS/JS
- 배포: GitHub Pages 사용 중
- 목표: 새 팀원이 10분 안에 실행/배포 흐름 이해 + 페이지/구조/규칙 파악

[원칙]
- 절대 추측하지 말고, 레포 안의 코드/설정 파일을 근거로만 작성해.
- 불확실하거나 레포에서 확인 안 되는 값은 “TODO(확인 필요)”로 남겨.
- 문서에는 가능한 한 “파일 경로/폴더 경로/엔트리 파일/핵심 함수명”을 링크처럼 명시해줘.
- 각 문서 끝에 “관련 파일/경로” 섹션을 꼭 넣어줘.

[먼저 찾아야 하는 것(필수)]
1) 실행 엔트리: (예: index.html, main.js, vite.config.js, package.json scripts)
2) 페이지 구조: pages/… 폴더 기준으로 어떤 화면이 있는지
3) API 연동: 상품 목록 GET /products/ 등 fetch 호출 위치, baseURL, 인증/토큰 처리 여부
4) 배포 설정: GitHub Pages 설정 방식, base path, 빌드 산출물(dist) 여부
5) 스타일 구조: CSS 파일 분리 규칙, 공통 스타일/컴포넌트 유무
6) 자주 발생한 이슈: timeout, 배너 슬라이더, 반응형/스크롤 문제 등 흔한 트러블 근거가 있으면 수집

[출력물]
아래 파일들을 /docs/wiki/ 경로 기준으로 Markdown 파일로 생성해줘.

(0) docs/wiki/README.md
- 위키 홈(문서 링크 허브)
- 1분 요약(실행/배포/핵심 구조)

(1) docs/wiki/01_Overview.md
- 프로젝트 목적, 주요 기능, 기술 스택
- 전체 페이지 목록(상품목록/상품상세/장바구니/로그인 등 실제 존재하는 것만)

(2) docs/wiki/02_QuickStart.md
- 개발환경 설치/필수 버전(node 등 확인되는 범위에서)
- 로컬 실행 방법: npm scripts 기반으로 실제 커맨드 정리
- 빌드 방법, 배포 방법(gh-pages or actions or pages 설정) 정리
- “10분 온보딩 체크리스트”

(3) docs/wiki/03_FolderStructure.md
- 폴더 트리 요약
- 각 폴더 역할(예: pages/, assets/, styles/, api/ 등 실제 기준)
- 파일 네이밍 규칙이 보이면 정리

(4) docs/wiki/04_PagesAndRouting.md
- 페이지별로: URL/진입 파일/연결 방식(링크/라우팅/쿼리스트링)
- 공통 레이아웃(헤더/푸터) 구조가 있으면 포함
- 페이지 간 이동 흐름(mermaid 다이어그램)

(5) docs/wiki/05_API_Integration.md
- API 명세서 기반이 아니라 “코드에 구현된 실제 호출” 기준으로 정리
- endpoint 목록, 요청/응답 처리, 에러 처리, pagination(next/previous) 처리 여부
- API base URL, CORS, timeout 이슈 관련 코드가 있으면 포함

(6) docs/wiki/06_UI_Components_Styling.md
- 배너 슬라이더(상품목록 이벤트 배너) 구현 방식(구조/DOM/CSS/JS)
- 공통 컴포넌트/유틸 함수가 있으면 정리
- 반응형/스크롤/레이아웃 핵심 포인트

(7) docs/wiki/07_Deployment_GitHubPages.md
- GitHub Pages 배포 구조 상세(빌드 산출물, base 경로, 404 처리, assets 경로)
- “timeout 문제”가 코드/설정에서 재현 가능한 근거가 있으면 원인 후보를 정리
- 배포 확인 체크리스트

(8) docs/wiki/08_Contributing.md
- 브랜치 전략(예: dev/main/feat/*), PR 규칙, 커밋 컨벤션이 레포에 있으면 정리
- 작업 단위/폴더 분리 방식(충돌 방지 가이드)

(9) docs/wiki/09_Troubleshooting.md
- 레포 근거 기반으로: 증상/원인/해결책
- (예: 배너가 너무 커보임, 화면 줄이면 footer 때문에 가로 스크롤, API 연결 실패 등)

[다이어그램 요구]
- 페이지 이동 흐름, 배포 흐름, 데이터 흐름은 mermaid로 최소 3개 포함해줘.

[마무리]
- 마지막에 “TODO(확인 필요)” 체크리스트를 만들어서
  레포에 없어서 확인 못한 정보(예: API 서버 주소, 환경변수 규칙, 인증 방식 등)를 정리해줘.

이제 레포를 분석해서 위 문서들을 생성해줘.

# 02. QuickStart - 빠른 시작 가이드

## 개발환경 설치

### 필수 요구사항

| 항목 | 버전/권장사항 |
|------|--------------|
| 브라우저 | Chrome, Firefox, Edge (최신 버전) |
| 코드 에디터 | VSCode 권장 |
| Live Server | VSCode 확장 프로그램 권장 |

> **참고**: 이 프로젝트는 빌드 도구(Vite, Webpack 등)를 사용하지 않는 순수 정적 파일 기반 프로젝트입니다. package.json이 없어 npm install이 필요하지 않습니다.

### VSCode 확장 프로그램 (권장)

1. **Live Server** - 로컬 개발 서버 실행
2. **Prettier** - 코드 포맷팅
3. **ESLint** - JavaScript 린팅

## 로컬 실행 방법

### 방법 1: VSCode Live Server (권장)

1. VSCode에서 프로젝트 폴더 열기
2. `index.html` 파일 선택
3. 우클릭 → "Open with Live Server" 선택
4. 브라우저에서 `http://127.0.0.1:5500` 접속

### 방법 2: 브라우저에서 직접 열기

1. 파일 탐색기에서 `index.html` 더블클릭
2. 브라우저에서 직접 열림

> **주의**: CORS 정책으로 인해 API 호출이 작동하지 않을 수 있습니다. Live Server 사용을 권장합니다.

### 방법 3: Python HTTP Server

```bash
# 프로젝트 루트에서 실행
python -m http.server 8000

# 브라우저에서 접속
# http://localhost:8000
```

### 방법 4: Node.js http-server

```bash
# http-server 전역 설치 (최초 1회)
npm install -g http-server

# 프로젝트 루트에서 실행
http-server -p 8000

# 브라우저에서 접속
# http://localhost:8000
```

## 빌드 방법

현재 프로젝트는 **빌드 과정이 필요 없습니다**. 모든 파일이 정적 파일로 구성되어 있어 별도의 빌드 없이 바로 실행/배포할 수 있습니다.

> **TODO(확인 필요)**: package.json, vite.config.js 파일이 없어 npm scripts 기반 빌드 설정이 확인되지 않습니다.

## 배포 방법

### GitHub Pages 배포

1. GitHub 레포지토리 Settings 이동
2. Pages 섹션에서 소스 브랜치 선택 (main 또는 dev)
3. 루트 폴더(`/`) 또는 `/docs` 선택
4. Save 클릭

> **TODO(확인 필요)**: 현재 GitHub Pages 배포 설정 상태가 확인되지 않습니다.

### 수동 배포

1. 프로젝트 전체 파일을 웹 서버에 업로드
2. `index.html`이 루트에 위치하도록 설정

## 10분 온보딩 체크리스트

새 팀원이 프로젝트를 이해하기 위한 순서:

### 1단계: 프로젝트 실행 (2분)

- [ ] 레포지토리 클론
  ```bash
  git clone <repository-url>
  cd OpenMarket-Service
  ```
- [ ] VSCode로 프로젝트 열기
- [ ] Live Server로 `index.html` 실행
- [ ] 상품 목록 페이지가 정상 표시되는지 확인

### 2단계: 폴더 구조 파악 (2분)

- [ ] `pages/` 폴더 내 페이지 구조 확인
- [ ] `shared/` 폴더 내 공용 리소스 확인
- [ ] [03_FolderStructure.md](./03_FolderStructure.md) 문서 읽기

### 3단계: 주요 파일 확인 (3분)

- [ ] `shared/js/api.js` - API 호출 방식 이해
- [ ] `shared/css/common.css` - 공용 스타일 및 CSS 변수 확인
- [ ] `pages/products/list/product-list.js` - 상품 목록 렌더링 로직

### 4단계: API 연동 이해 (2분)

- [ ] [05_API_Integration.md](./05_API_Integration.md) 문서 읽기
- [ ] API BaseURL 확인: `https://api.wenivops.co.kr/services/open-market`
- [ ] 인증 방식 확인: Bearer Token

### 5단계: 브랜치 전략 이해 (1분)

- [ ] [08_Contributing.md](./08_Contributing.md) 문서 읽기
- [ ] 자신의 작업 영역 및 feature 브랜치 확인

## 환경 설정 파일

### .env

```
VITE_API_BASE_URL=https://openmarket.weniv.co.kr
```

> **주의**: .env 파일의 값은 실제 코드에서 사용되지 않습니다. API 호출은 `shared/js/api.js`에 하드코딩된 URL을 사용합니다.

### .gitignore

```
nul
tmpclaude-*
node_modules/
.env
.env.local
.vscode/
.idea/
.DS_Store
Thumbs.db
```

---

## 관련 파일/경로

| 항목 | 경로 |
|------|------|
| 진입점 | `index.html` |
| 환경 설정 | `.env` |
| Git 제외 설정 | `.gitignore` |
| VSCode 설정 | `.vscode/settings.json` |

# OpenMarket-Service

호두샵 오픈마켓 서비스 프로젝트

## 프로젝트 구조

```
OpenMarket-Service/
├── pages/
│   ├── auth/
│   │   ├── login/           # 👤 팀원 1: 로그인 페이지
│   │   │   ├── index.html
│   │   │   ├── login.js
│   │   │   └── login.css
│   │   │
│   │   └── signup/          # 👤 팀원 2: 회원가입 페이지
│   │       ├── index.html
│   │       ├── signup.js
│   │       └── signup.css
│   │
│   └── products/
│       ├── list/            # 👤 팀원 3: 상품 목록 페이지
│       │   ├── index.html
│       │   ├── product-list.js
│       │   └── product-list.css
│       │
│       └── detail/          # 👤 팀원 4: 상품 상세 페이지
│           ├── index.html
│           ├── product-detail.js
│           └── product-detail.css
│
├── shared/                  # 공통 코드 (협의 후 수정)
│   ├── assets/              # 공통 이미지, 아이콘, 로고
│   │   └── icons/
│   ├── js/
│   │   ├── api.js           # API 호출 관련
│   │   └── utils.js         # 유틸리티 함수
│   │
│   └── css/
│       ├── reset.css        # CSS 리셋
│       ├── common.css       # 공통 스타일
│       └── auth.css         # 인증 페이지 공통 스타일
│
└── index.html               # 진입점 (자동 리다이렉트)
```

## 팀원별 작업 영역

### 👤 팀원 1: 로그인 페이지
- **작업 폴더**: `pages/auth/login/`
- **파일**: index.html, login.js, login.css
- **브랜치**: `feature/login`

### 👤 팀원 2: 회원가입 페이지
- **작업 폴더**: `pages/auth/signup/`
- **파일**: index.html, signup.js, signup.css
- **브랜치**: `feature/signup`

### 👤 팀원 3: 상품 목록 페이지
- **작업 폴더**: `pages/products/list/`
- **파일**: index.html, product-list.js, product-list.css
- **브랜치**: `feature/product-list`

### 👤 팀원 4: 상품 상세 페이지
- **작업 폴더**: `pages/products/detail/`
- **파일**: index.html, product-detail.js, product-detail.css
- **브랜치**: `feature/product-detail`

## 작업 규칙

### ✅ 충돌 방지 가이드

1. **독립 작업 원칙**
   - 각 팀원은 자신의 작업 폴더 내 파일만 수정
   - 다른 팀원의 폴더는 절대 수정하지 않음

2. **공통 코드 수정**
   - `shared/` 폴더 수정 시 반드시 팀원들과 사전 협의
   - 협의 후 별도 브랜치(`feature/shared-update`)에서 작업
   - PR을 통해 리뷰 후 병합

3. **브랜치 전략**
   - 각자 feature 브랜치에서 작업
   - main/dev 브랜치에 직접 push 금지
   - PR을 통한 코드 리뷰 후 병합

4. **커밋 메시지**
   ```
   [작업영역] 작업 내용

   예시:
   [Login] 로그인 폼 UI 구현
   [Signup] 비밀번호 유효성 검사 추가
   [ProductList] 상품 목록 API 연동
   [ProductDetail] 상품 상세 정보 표시
   [Shared] API 유틸리티 함수 추가
   ```

## 시작하기

### 로컬 실행
```bash
# Live Server 등의 웹 서버 실행
# 또는
npx serve .
```

### 브랜치 생성
```bash
# 팀원 1
git checkout -b feature/login

# 팀원 2
git checkout -b feature/signup

# 팀원 3
git checkout -b feature/product-list

# 팀원 4
git checkout -b feature/product-detail
```

## 페이지 접근 경로

- **메인(상품 목록)**: `/` → 자동으로 `/pages/products/list/index.html`로 이동
- **로그인**: `/pages/auth/login/index.html`
- **회원가입**: `/pages/auth/signup/index.html`
- **상품 상세**: `/pages/products/detail/index.html`

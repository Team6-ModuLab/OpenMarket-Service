# 03. FolderStructure - 폴더 구조

## 폴더 트리 요약

```
OpenMarket-Service/
│
├── index.html                              # 메인 진입점 (리다이렉트)
├── .env                                    # 환경 설정 (API URL)
├── .gitignore                              # Git 제외 설정
│
├── pages/                                  # 모든 페이지 컴포넌트
│   ├── auth/                              # 인증 페이지
│   │   ├── login/                         # 로그인
│   │   │   ├── index.html
│   │   │   ├── login.js
│   │   │   └── login.css
│   │   └── signup/                        # 회원가입
│   │       ├── index.html
│   │       ├── signup.js
│   │       └── signup.css
│   │
│   ├── products/                          # 상품 관련 페이지
│   │   ├── list/                          # 상품 목록
│   │   │   ├── index.html
│   │   │   ├── product-list.js
│   │   │   └── product-list.css
│   │   └── detail/                        # 상품 상세
│   │       ├── index.html
│   │       ├── product-detail.js
│   │       └── product-detail.css
│   │
│   ├── cart/                              # 장바구니
│   │   ├── index.html
│   │   ├── cart.js
│   │   └── cart.css
│   │
│   ├── order/                             # 주문
│   │   ├── index.html
│   │   ├── order.js
│   │   └── order.css
│   │
│   └── seller/                            # 판매자 기능
│       ├── seller-center/                 # 판매자 센터
│       │   ├── index.html
│       │   ├── seller-center.js
│       │   └── seller-center.css
│       └── seller-product-upload/         # 상품 등록/수정
│           ├── index.html
│           ├── seller-product-upload.js
│           └── seller-product-upload.css
│
├── shared/                                 # 공용 리소스
│   ├── js/
│   │   ├── api.js                         # API 호출 모듈
│   │   └── utils.js                       # 공용 유틸 함수
│   │
│   ├── css/
│   │   ├── reset.css                      # CSS 리셋
│   │   └── common.css                     # 헤더, 푸터, 공용 스타일
│   │
│   └── assets/
│       └── icons/                         # SVG/PNG 아이콘 (29개)
│           ├── Logo-hodu.png
│           ├── icon-search.svg
│           ├── icon-shopping-cart.svg
│           └── ...
│
├── .git/                                  # Git 저장소
├── .vscode/                               # VSCode 설정
│
└── 문서들
    ├── README.md                          # 프로젝트 개요
    ├── product_list_api.md                # API 명세
    ├── product_list_banner.md             # 배너 버그 리포트
    └── wiki.md                            # 위키 생성 요청
```

## 각 폴더 역할

### `pages/` - 페이지 컴포넌트

페이지별로 HTML, CSS, JavaScript를 분리하여 관리합니다.

| 폴더 | 역할 | 파일 구성 |
|------|------|---------|
| `auth/login/` | 로그인 페이지 | index.html, login.js, login.css |
| `auth/signup/` | 회원가입 페이지 | index.html, signup.js, signup.css |
| `products/list/` | 상품 목록 페이지 | index.html, product-list.js, product-list.css |
| `products/detail/` | 상품 상세 페이지 | index.html, product-detail.js, product-detail.css |
| `cart/` | 장바구니 페이지 | index.html, cart.js, cart.css |
| `order/` | 주문 페이지 | index.html, order.js, order.css |
| `seller/seller-center/` | 판매자 센터 | index.html, seller-center.js, seller-center.css |
| `seller/seller-product-upload/` | 상품 등록/수정 | index.html, seller-product-upload.js, seller-product-upload.css |

### `shared/` - 공용 리소스

여러 페이지에서 공통으로 사용하는 리소스를 관리합니다.

| 폴더 | 역할 | 주요 파일 |
|------|------|---------|
| `shared/js/` | 공용 JavaScript | api.js (API 호출), utils.js (유틸 함수) |
| `shared/css/` | 공용 스타일 | reset.css (리셋), common.css (헤더, 푸터, 변수) |
| `shared/assets/icons/` | 아이콘 파일 | 로고, UI 아이콘 (29개) |

### 루트 레벨 파일

| 파일 | 역할 |
|------|------|
| `index.html` | 진입점 - `/pages/products/list/`로 리다이렉트 |
| `.env` | 환경 변수 (실제 미사용) |
| `.gitignore` | Git 제외 파일 설정 |
| `README.md` | 프로젝트 설명 문서 |

## 파일 네이밍 규칙

### 페이지 파일

```
pages/{카테고리}/{페이지명}/
├── index.html            # HTML 마크업
├── {페이지명}.js         # JavaScript 로직
└── {페이지명}.css        # 스타일시트
```

**예시**:
- `pages/products/list/` → `product-list.js`, `product-list.css`
- `pages/auth/login/` → `login.js`, `login.css`

### 공용 파일

```
shared/{리소스타입}/{파일명}.{확장자}
```

**예시**:
- `shared/js/api.js` - API 호출 모듈
- `shared/css/common.css` - 공용 스타일

### 아이콘 파일

```
shared/assets/icons/icon-{기능}.{확장자}
```

**예시**:
- `icon-search.svg` - 검색 아이콘
- `icon-shopping-cart.svg` - 장바구니 아이콘
- `Logo-hodu.png` - 로고 (예외)

## 폴더별 담당 영역 (팀 작업)

| 팀원 | 담당 폴더 | 브랜치 |
|------|----------|--------|
| 팀원 1 | `pages/auth/login/` | feature/login |
| 팀원 2 | `pages/auth/signup/` | feature/signup |
| 팀원 3 | `pages/products/list/` | feature/product-list |
| 팀원 4 | `pages/products/detail/` | feature/product-detail |
| 공통 | `shared/` | feature/shared-update |

> **주의**: `shared/` 폴더 수정 시 팀원 사전 협의 필요

---

## 관련 파일/경로

| 항목 | 경로 |
|------|------|
| 페이지 폴더 | `pages/` |
| 공용 JS | `shared/js/` |
| 공용 CSS | `shared/css/` |
| 아이콘 | `shared/assets/icons/` |
| Git 설정 | `.gitignore` |

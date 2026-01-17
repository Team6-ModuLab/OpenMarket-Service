# HODU (호두샵)

> 판매자와 구매자를 연결하는 오픈마켓 서비스 플랫폼

온라인에서 상품을 쉽게 등록하고 판매할 수 있으며, 구매자는 다양한 상품을 검색하고 장바구니에 담아 주문할 수 있는 오픈마켓 서비스입니다.

![메인 화면](./docs/images/main-screenshot.png)

---

## 데모 / 배포 링크

> (추후 추가)

---

## 주요 기능

### 구매자 (Buyer)

| 기능 | 설명 |
|------|------|
| 상품 목록 조회 | 등록된 전체 상품을 목록으로 확인 |
| 상품 검색 | 키워드로 원하는 상품 검색 |
| 상품 상세 보기 | 상품의 상세 정보, 가격, 재고 확인 |
| 장바구니 | 상품을 담고 수량 조절, 선택 주문 |
| 주문하기 | 단일 상품 또는 장바구니 상품 주문 |
| 마이페이지 | 주문 내역 조회 및 주문 상세 확인 |

### 판매자 (Seller)

| 기능 | 설명 |
|------|------|
| 판매자 센터 | 등록한 상품 목록 관리 |
| 상품 등록 | 새 상품 정보 및 이미지 등록 |
| 상품 수정/삭제 | 기존 상품 정보 수정 및 삭제 |

### 공통

| 기능 | 설명 |
|------|------|
| 회원가입 | 구매자/판매자 유형 선택하여 가입 |
| 로그인/로그아웃 | JWT 기반 인증 (Access/Refresh Token) |
| 반응형 헤더 | 로그인 상태와 사용자 유형에 따른 동적 메뉴 |

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| **API 통신** | Fetch API (REST) |
| **인증** | JWT (Access Token + Refresh Token) |
| **로컬 저장소** | LocalStorage |
| **개발 서버** | Live Server / npx serve |

---

## 프로젝트 구조

```
OpenMarket-Service/
├── index.html                          # 진입점 (상품 목록으로 리다이렉트)
│
├── pages/                              # 페이지별 HTML/JS/CSS
│   ├── auth/
│   │   ├── login/                      # 로그인 페이지
│   │   │   ├── index.html
│   │   │   ├── login.js
│   │   │   └── login.css
│   │   └── signup/                     # 회원가입 페이지
│   │       ├── index.html
│   │       ├── signup.js
│   │       └── signup.css
│   │
│   ├── products/
│   │   ├── list/                       # 상품 목록 페이지
│   │   │   ├── index.html
│   │   │   ├── product-list.js
│   │   │   └── product-list.css
│   │   └── detail/                     # 상품 상세 페이지
│   │       ├── index.html
│   │       ├── product-detail.js
│   │       └── product-detail.css
│   │
│   ├── cart/                           # 장바구니 페이지
│   │   ├── index.html
│   │   ├── cart.js
│   │   └── cart.css
│   │
│   ├── order/                          # 주문 페이지
│   │   ├── index.html
│   │   ├── order.js
│   │   └── order.css
│   │
│   ├── mypage/                         # 마이페이지
│   │   ├── index.html
│   │   ├── mypage.js
│   │   ├── mypage.css
│   │   └── order-detail/               # 주문 상세 페이지
│   │       ├── index.html
│   │       ├── order-detail.js
│   │       └── order-detail.css
│   │
│   └── seller/
│       ├── seller-center/              # 판매자 센터
│       │   ├── index.html
│       │   ├── seller-center.js
│       │   └── seller-center.css
│       └── seller-product-upload/      # 상품 등록/수정
│           ├── index.html
│           ├── seller-product-upload.js
│           └── seller-product-upload.css
│
├── shared/                             # 공통 모듈
│   ├── assets/
│   │   └── icons/                      # 아이콘 이미지 (SVG)
│   ├── components/
│   │   ├── header/                     # 공통 헤더 컴포넌트
│   │   └── footer/                     # 공통 푸터 컴포넌트
│   ├── css/
│   │   ├── reset.css                   # CSS 리셋
│   │   ├── common.css                  # 공통 스타일
│   │   └── auth.css                    # 인증 페이지 공통 스타일
│   └── js/
│       ├── constants.js                # 상수 정의 (API URL, 키 등)
│       ├── api.js                      # API 호출 함수
│       ├── auth.js                     # 인증 서비스 (토큰 관리)
│       ├── utils.js                    # 유틸리티 함수 (헤더/푸터, 경로 등)
│       └── components/
│           └── Modal.js                # 모달 컴포넌트
│
└── docs/                               # 문서 및 이미지
```

### 핵심 디렉토리 설명

| 디렉토리 | 설명 |
|----------|------|
| `pages/` | 각 페이지별 독립적인 HTML, JS, CSS 파일 관리 |
| `shared/js/` | API 호출, 인증, 유틸리티 등 전역에서 사용하는 공통 로직 |
| `shared/css/` | 리셋 및 공통 스타일 정의 |
| `shared/assets/` | 아이콘 등 정적 리소스 |

---

## 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/Team6-ModuLab/OpenMarket-Service.git
cd OpenMarket-Service
```

### 2. 로컬 서버 실행

**방법 A: npx serve 사용**
```bash
npx serve .
```

**방법 B: VS Code Live Server 확장 사용**
- VS Code에서 프로젝트 열기
- Live Server 확장 설치
- `index.html` 파일 우클릭 → "Open with Live Server"

### 3. 접속

- 브라우저에서 `http://localhost:3000` (serve) 또는 `http://localhost:5500` (Live Server) 접속
- 자동으로 상품 목록 페이지(`/pages/products/list/index.html`)로 이동

---

## 환경 변수 / 설정

| 항목 | 값 | 설명 |
|------|-----|------|
| `API_BASE_URL` | `https://api.wenivops.co.kr/services/open-market` | API 서버 주소 (constants.js에 정의) |

> 별도 `.env` 파일 설정은 불필요합니다. API 주소는 `shared/js/constants.js`에서 관리됩니다.

---

## API 연동

### Base URL
```
https://api.wenivops.co.kr/services/open-market
```

### 주요 엔드포인트

| 기능 | Method | Endpoint |
|------|--------|----------|
| 상품 목록 조회 | GET | `/products/` |
| 상품 상세 조회 | GET | `/products/{id}/` |
| 로그인 | POST | `/accounts/login/` |
| 토큰 갱신 | POST | `/accounts/token/refresh/` |
| 판매자 상품 목록 | GET | `/{seller_name}/products/` |
| 상품 등록 | POST | `/products/` |
| 상품 수정 | PUT | `/products/{id}/` |
| 상품 삭제 | DELETE | `/products/{id}/` |
| 주문 생성 | POST | `/order/` |
| 주문 목록 조회 | GET | `/order/` |
| 주문 상세 조회 | GET | `/order/{id}/` |
| 주문 취소 | DELETE | `/order/{id}/` |

### 인증 흐름

1. **로그인**: `/accounts/login/`으로 username, password 전송 → Access Token, Refresh Token 발급
2. **인증 요청**: `Authorization: Bearer {access_token}` 헤더 포함
3. **토큰 만료 시**: 401 응답 → Refresh Token으로 `/accounts/token/refresh/` 호출 → 새 Access Token 발급
4. **Refresh 실패**: 자동 로그아웃 처리

---

## 팀 / 역할

| 담당 | 기능 | 브랜치 |
|------|------|--------|
| 팀원 1 | 로그인 페이지 | `feature/login` |
| 팀원 2 | 회원가입 페이지 | `feature/signup` |
| 팀원 3 | 상품 목록 페이지 | `feature/product-list` |
| 팀원 4 | 상품 상세 페이지 | `feature/product-detail` |

> (추후 팀원 이름 추가)

---

## 코딩 컨벤션 / 커밋 컨벤션

### 브랜치 전략

- `main`: 프로덕션 배포용
- `dev`: 개발 통합 브랜치
- `feature/*`: 기능 개발 브랜치

### 커밋 메시지 형식

```
[작업영역] 작업 내용

예시:
[Login] 로그인 폼 UI 구현
[Signup] 비밀번호 유효성 검사 추가
[ProductList] 상품 목록 API 연동
[ProductDetail] 상품 상세 정보 표시
[Shared] API 유틸리티 함수 추가
[Cart] 장바구니 수량 조절 기능 구현
```

### 작업 규칙

1. **독립 작업 원칙**: 각 팀원은 자신의 작업 폴더 내 파일만 수정
2. **공통 코드 수정**: `shared/` 폴더 수정 시 팀원들과 사전 협의
3. **PR 기반 병합**: main/dev 브랜치에 직접 push 금지, PR을 통한 코드 리뷰 후 병합

---

## 페이지 접근 경로

| 페이지 | 경로 |
|--------|------|
| 메인 (상품 목록) | `/` → 자동 리다이렉트 |
| 상품 목록 | `/pages/products/list/index.html` |
| 상품 상세 | `/pages/products/detail/index.html?id={product_id}` |
| 로그인 | `/pages/auth/login/index.html` |
| 회원가입 | `/pages/auth/signup/index.html` |
| 장바구니 | `/pages/cart/index.html` |
| 주문 | `/pages/order/index.html` |
| 마이페이지 | `/pages/mypage/index.html` |
| 주문 상세 | `/pages/mypage/order-detail/index.html?id={order_id}` |
| 판매자 센터 | `/pages/seller/seller-center/index.html` |
| 상품 등록 | `/pages/seller/seller-product-upload/index.html` |

---

## 트러블슈팅 / 회고

> (추후 추가)

---

## 추가로 필요한 정보 체크리스트

README를 더 풍성하게 만들기 위해 다음 정보를 추가해주세요:

- [ ] **프로젝트 스크린샷**: `./docs/images/` 폴더에 주요 화면 캡처 이미지 추가
- [ ] **데모 배포 URL**: GitHub Pages, Netlify, Vercel 등 배포 시 URL 추가
- [ ] **팀원 정보**: 팀원 이름, GitHub 프로필 링크
- [ ] **개발 기간**: 프로젝트 진행 기간 (예: 2024.01.01 ~ 2024.02.28)
- [ ] **라이선스**: MIT, Apache 2.0 등 라이선스 명시
- [ ] **트러블슈팅 사례**: 개발 중 겪은 이슈와 해결 방법 2~4개
- [ ] **시연 GIF**: 주요 기능 동작 화면 GIF 파일 (`./docs/images/demo.gif`)
- [ ] **기획서/디자인 링크**: Figma, Notion 등 외부 문서 링크
- [ ] **Node.js 버전**: 권장 Node.js 버전 (serve 사용 시)
- [ ] **브라우저 지원 범위**: 지원하는 브라우저 목록 (Chrome, Firefox, Safari 등)

# 06. UI Components & Styling - UI 컴포넌트 및 스타일링

## 배너 슬라이더

### 위치 및 파일

| 항목 | 경로 |
|------|------|
| HTML | `pages/products/list/index.html` |
| CSS | `pages/products/list/product-list.css` |
| JavaScript | `pages/products/list/product-list.js` |

### HTML 구조

```html
<section class="banner-section">
    <div class="banner-container">
        <div class="banner-track" id="banner-track">
            <!-- 슬라이드 동적 삽입 -->
            <div class="banner-slide active">
                <img src="..." alt="상품명">
                <div class="banner-text">
                    <span class="banner-title">상품명</span>
                    <span class="banner-price">10,000원</span>
                </div>
            </div>
        </div>
        <button class="banner-btn banner-btn-prev">◀</button>
        <button class="banner-btn banner-btn-next">▶</button>
    </div>
    <div class="banner-dots" id="banner-dots">
        <!-- 인디케이터 동적 삽입 -->
        <button class="dot active"></button>
        <button class="dot"></button>
    </div>
</section>
```

### CSS 스타일

```css
.banner-section {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    overflow: hidden;
}

.banner-container {
    position: relative;
    width: 100%;
    height: clamp(200px, 24vw, 320px); /* 반응형 높이 */
    overflow: visible; /* 양옆 peek 표시 */
}

.banner-track {
    display: flex;
    transition: transform 0.4s ease-out;
}

.banner-slide {
    flex-shrink: 0;
    width: 60%;
    margin: 0 12px;
    opacity: 0.4;
    transform: scale(0.94);
    transition: opacity 0.3s, transform 0.3s;
}

.banner-slide.active {
    opacity: 1;
    transform: scale(1);
}

.banner-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    border: none;
    cursor: pointer;
}

.banner-btn-prev { left: 10px; }
.banner-btn-next { right: 10px; }
```

### JavaScript 로직

```javascript
// 변수
let currentSlide = 0;
let slideInterval = null;
const SLIDE_COUNT = 5;
const AUTO_PLAY_DELAY = 4000;

// 초기화
function initBanner() {
    // 1. API로 상품 5개 조회
    // 2. 슬라이드 DOM 생성
    // 3. 인디케이터 생성
    // 4. 이벤트 리스너 등록
    // 5. 자동 재생 시작
}

// 슬라이드 위치 업데이트
function updateSlide() {
    const centerOffset = (containerWidth - slideWidth) / 2 - marginLeft;
    const translateX = centerOffset - (currentSlide * totalSlideWidth);
    bannerTrack.style.transform = `translateX(${translateX}px)`;
}

// 네비게이션
function nextSlide() {
    currentSlide = (currentSlide + 1) % SLIDE_COUNT;
    updateSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + SLIDE_COUNT) % SLIDE_COUNT;
    updateSlide();
}

// 자동 재생
function startAutoPlay() {
    slideInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
}

function stopAutoPlay() {
    clearInterval(slideInterval);
}
```

### 특징

- **Center/Peek 레이아웃**: 중앙 슬라이드가 강조되고 양옆에 다음 슬라이드 미리보기
- **반응형 높이**: `clamp(200px, 24vw, 320px)` 사용
- **자동 재생**: 4초마다 자동 슬라이드 전환
- **호버 시 일시 중지**: 마우스 오버 시 자동 재생 멈춤

## 공통 컴포넌트

### 헤더 (Header)

**파일**: `shared/css/common.css`

```css
#header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px;
}

.search-bar {
    display: flex;
    flex: 1;
    max-width: 400px;
    margin: 0 20px;
}

.user-menu {
    display: flex;
    gap: 16px;
}
```

### 푸터 (Footer)

```css
#footer {
    background: #F2F2F2;
    padding: 40px 0;
    flex-shrink: 0;
}

.footer-links {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}
```

### 버튼

```css
/* 기본 버튼 */
.btn {
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

/* Primary 버튼 (호두 그린) */
.btn-primary {
    background: var(--color-primary);
    color: white;
    border: none;
}

.btn-primary:hover {
    background: #1da73e;
}

/* Secondary 버튼 */
.btn-secondary {
    background: white;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
}
```

### 로그인 모달

```css
.login-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 32px;
    border-radius: 8px;
    text-align: center;
}
```

## CSS 변수 (Design Tokens)

**파일**: `shared/css/common.css`

```css
:root {
    /* 색상 */
    --color-primary: #21BF48;       /* 호두 그린 */
    --color-main-text: #333333;     /* 본문 텍스트 */
    --color-sub-text: #767676;      /* 보조 텍스트 */
    --color-bg-grey: #F2F2F2;       /* 배경 회색 */
    --border-grey: #C4C4C4;         /* 테두리 */

    /* 폰트 */
    --font-family: 'Spoqa Han Sans Neo', sans-serif;
}
```

## 레이아웃 패턴

### 컨테이너

```css
.container {
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: 0 20px;
}
```

### Sticky Footer

```css
html {
    height: 100%;
}

body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1 0 auto;
}

#footer {
    flex-shrink: 0;
}
```

### 최소 너비 제한

```css
body {
    min-width: 900px;
}
```

> **주의**: 900px 미만에서는 가로 스크롤이 발생합니다. 모바일 반응형은 미지원.

## 상품 그리드

**파일**: `pages/products/list/product-list.css`

```css
.product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 40px 0;
}

.product-card {
    border: 1px solid var(--border-grey);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
}

.product-info {
    padding: 16px;
}

.product-name {
    font-size: 16px;
    color: var(--color-main-text);
}

.product-price {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-primary);
}
```

## 유틸 함수

### 가격 포맷팅

```javascript
// shared/js/utils.js
function formatPrice(price) {
    return price.toLocaleString('ko-KR') + '원';
}

// 사용
formatPrice(10000); // "10,000원"
```

### 경로 계산

```javascript
// shared/js/utils.js
function getPagesBasePath() {
    const path = window.location.pathname;
    const match = path.match(/\/pages\/(.+)/);
    if (match) {
        const afterPages = match[1];
        const parts = afterPages.split('/');
        const folderCount = parts.length - 1;
        return '../'.repeat(folderCount);
    }
    return './';
}
```

### 헤더 업데이트

```javascript
// shared/js/utils.js
function updateHeader() {
    const token = localStorage.getItem('access');
    const userType = localStorage.getItem('userType');

    if (token) {
        if (userType === 'SELLER') {
            // 판매자 메뉴 표시
        } else {
            // 구매자 메뉴 표시
        }
    } else {
        // 비로그인 메뉴 표시
    }
}
```

## 아이콘 목록

**경로**: `shared/assets/icons/`

| 파일명 | 용도 |
|--------|------|
| `Logo-hodu.png` | 로고 |
| `icon-search.svg` | 검색 |
| `icon-shopping-cart.svg` | 장바구니 |
| `icon-shopping-bag.svg` | 쇼핑백 |
| `icon-user.svg` | 사용자 |
| `icon-plus.svg` | 수량 증가 |
| `icon-minus-line.svg` | 수량 감소 |
| `icon-check-*.svg` | 체크박스 |
| `icon-swiper-*.svg` | 배너 화살표 |

---

## 관련 파일/경로

| 항목 | 경로 |
|------|------|
| 공용 CSS | `shared/css/common.css` |
| CSS 리셋 | `shared/css/reset.css` |
| 유틸 함수 | `shared/js/utils.js` |
| 아이콘 | `shared/assets/icons/` |
| 배너 슬라이더 | `pages/products/list/product-list.js` |
| 상품 그리드 | `pages/products/list/product-list.css` |

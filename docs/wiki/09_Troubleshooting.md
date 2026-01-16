# 09. Troubleshooting - 문제 해결 가이드

## 배너 슬라이더 이슈

### 증상: 가로 스크롤 발생

**문제**: 배너 슬라이더 조작 시 document 전체에 가로 스크롤이 생김

**원인**:
- 슬라이드 이동 시 transform 위치 계산이 누적됨
- 양옆 peek 영역이 container를 넘어 overflow 발생

**관련 파일**:
- `pages/products/list/product-list.js`
- `pages/products/list/product-list.css`

**해결 방법**:
```css
/* product-list.css */
.banner-section {
    overflow: hidden; /* 추가 */
}

.banner-container {
    overflow: visible; /* 양옆 peek 유지 */
}
```

**참고 문서**: `product_list_banner.md`

---

### 증상: 배너가 너무 크게 보임

**문제**: 화면 크기에 따라 배너가 과도하게 커지거나 작아짐

**원인**: 고정 크기 사용

**해결 방법**:
```css
/* 반응형 높이 적용 */
.banner-container {
    height: clamp(200px, 24vw, 320px);
}
```

---

## API 연결 이슈

### 증상: API 호출 실패 (CORS 에러)

**문제**: 브라우저 콘솔에 CORS 에러 표시

**원인**:
- 로컬 파일(`file://`)에서 API 호출 시 CORS 정책 위반
- API 서버에서 해당 도메인 허용 안 됨

**해결 방법**:
1. Live Server 사용 (권장)
2. 로컬 HTTP 서버 실행
   ```bash
   python -m http.server 8000
   # 또는
   npx http-server -p 8000
   ```

---

### 증상: API 응답 지연 (Timeout)

**문제**: API 호출 후 응답이 오지 않거나 매우 느림

**원인**:
- 네트워크 문제
- API 서버 부하
- 잘못된 엔드포인트

**확인 방법**:
```javascript
// 브라우저 개발자 도구 Console에서
console.time('API');
fetch('https://api.wenivops.co.kr/services/open-market/products/')
    .then(res => {
        console.timeEnd('API');
        console.log('Status:', res.status);
    })
    .catch(err => console.error('Error:', err));
```

**해결 방법**:
1. 네트워크 상태 확인
2. API 서버 상태 확인
3. 엔드포인트 URL 확인

---

### 증상: 401 Unauthorized 에러

**문제**: 인증이 필요한 API 호출 시 401 에러

**원인**:
- 토큰이 없거나 만료됨
- 토큰 형식 오류

**확인 방법**:
```javascript
// localStorage에서 토큰 확인
console.log('access:', localStorage.getItem('access'));
console.log('userType:', localStorage.getItem('userType'));
```

**해결 방법**:
1. 다시 로그인
2. 토큰 유효성 확인
3. Authorization 헤더 형식 확인
   ```javascript
   headers: {
       'Authorization': `Bearer ${token}` // Bearer 띄어쓰기 주의
   }
   ```

---

## 페이지 네비게이션 이슈

### 증상: 페이지 이동 시 404 에러

**문제**: 링크 클릭 시 페이지를 찾을 수 없음

**원인**:
- 상대 경로 계산 오류
- 파일 경로 오타

**확인 방법**:
```javascript
// 현재 경로 확인
console.log('pathname:', window.location.pathname);
console.log('basePath:', getPagesBasePath());
```

**해결 방법**:
1. 상대 경로 확인
2. 파일 존재 여부 확인
3. `getPagesBasePath()` 함수 활용

---

### 증상: 헤더 메뉴가 표시되지 않음

**문제**: 로그인 후에도 헤더 메뉴가 업데이트되지 않음

**원인**:
- `updateHeader()` 함수 미호출
- localStorage 토큰 저장 실패

**확인 방법**:
```javascript
// 토큰 저장 확인
console.log('access:', localStorage.getItem('access'));
console.log('userType:', localStorage.getItem('userType'));
```

**해결 방법**:
```javascript
// 로그인 성공 후
localStorage.setItem('access', result.access);
localStorage.setItem('userType', result.user.user_type);
updateHeader(); // 헤더 업데이트 호출
```

---

## 장바구니 이슈

### 증상: 장바구니 데이터가 사라짐

**문제**: 페이지 새로고침 후 장바구니가 비어있음

**원인**:
- localStorage 저장 실패
- 다른 도메인에서 접근

**확인 방법**:
```javascript
// localStorage 확인
console.log('cart:', localStorage.getItem('cart'));
```

**해결 방법**:
```javascript
// 장바구니 저장
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// 장바구니 로드
function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
}
```

---

### 증상: 비로그인 시 장바구니 접근 불가

**문제**: 비로그인 상태에서 장바구니 클릭 시 아무 반응 없음

**예상 동작**: 로그인 모달 표시

**확인 방법**:
```javascript
// 로그인 모달 함수 존재 확인
console.log('showLoginModal:', typeof showLoginModal);
```

**해결 방법**:
```javascript
// 장바구니 클릭 시
cartBtn.addEventListener('click', () => {
    const token = localStorage.getItem('access');
    if (!token) {
        showLoginModal();
    } else {
        window.location.href = '/pages/cart/';
    }
});
```

---

## 스타일 이슈

### 증상: CSS가 적용되지 않음

**문제**: 스타일이 반영되지 않거나 깨져 보임

**원인**:
- CSS 파일 경로 오류
- 브라우저 캐시
- CSS 우선순위 문제

**해결 방법**:
1. 브라우저 캐시 삭제 (Ctrl + Shift + R)
2. 경로 확인
   ```html
   <link rel="stylesheet" href="../../../shared/css/reset.css">
   <link rel="stylesheet" href="../../../shared/css/common.css">
   ```
3. 개발자 도구에서 CSS 로드 확인 (Network 탭)

---

### 증상: 푸터가 콘텐츠 위로 올라옴

**문제**: 콘텐츠가 적을 때 푸터가 화면 중간에 위치

**원인**: Sticky Footer 미적용

**해결 방법**:
```css
/* common.css에 추가 */
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

---

## 회원가입 이슈

### 증상: ID 중복검사가 작동하지 않음

**문제**: 중복확인 버튼 클릭 시 반응 없음

**원인**:
- API 엔드포인트 오류
- 이벤트 리스너 미등록

**확인 방법**:
```javascript
// 개발자 도구 Network 탭에서 API 호출 확인
// POST /accounts/validate-username/
```

**관련 파일**: `pages/auth/signup/signup.js`

---

### 증상: 비밀번호 유효성 검사 실패

**문제**: 올바른 비밀번호인데 에러 메시지 표시

**규칙**:
- 최소 8자 이상
- 비밀번호 확인 필드와 일치

**확인 방법**:
```javascript
// 비밀번호 길이 확인
console.log('password length:', password.length);
console.log('match:', password === passwordConfirm);
```

---

## 일반 디버깅 팁

### 브라우저 개발자 도구 활용

1. **Console 탭**: JavaScript 에러 확인
2. **Network 탭**: API 요청/응답 확인
3. **Elements 탭**: DOM 구조 및 CSS 확인
4. **Application 탭**: localStorage 확인

### 유용한 디버깅 코드

```javascript
// localStorage 전체 확인
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(key, localStorage.getItem(key));
}

// 현재 페이지 정보
console.log('href:', window.location.href);
console.log('pathname:', window.location.pathname);
console.log('search:', window.location.search);

// API 응답 확인
fetch(url)
    .then(res => res.json())
    .then(data => console.log('data:', data))
    .catch(err => console.error('error:', err));
```

---

## TODO(확인 필요) 체크리스트

레포에서 확인되지 않은 정보 목록:

| 항목 | 상태 | 비고 |
|------|------|------|
| package.json | 미존재 | npm scripts 미설정 |
| vite.config.js | 미존재 | 빌드 설정 없음 |
| GitHub Pages 설정 | 미확인 | Settings → Pages 확인 필요 |
| 404.html | 미존재 | 에러 페이지 없음 |
| .env 실제 사용 | 미사용 | API URL 하드코딩됨 |
| API 서버 환경변수 | 미확인 | 개발/프로덕션 구분 |
| 토큰 갱신 로직 | 미확인 | refresh token 사용 여부 |
| Pagination | 미구현 | 첫 페이지만 표시 |

---

## 관련 파일/경로

| 항목 | 경로 |
|------|------|
| 배너 버그 리포트 | `product_list_banner.md` |
| API 명세 | `product_list_api.md` |
| 장바구니 문서 | `shopping_cart.md` |
| API 모듈 | `shared/js/api.js` |
| 공용 유틸 | `shared/js/utils.js` |

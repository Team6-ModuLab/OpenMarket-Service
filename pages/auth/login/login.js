// =============================================
// login.js - 로그인 페이지
// =============================================

const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorId = document.getElementById('error-id');
const errorPw = document.getElementById('error-pw');
const loginFailMsg = document.getElementById('login-fail-msg');

// 폼 제출 이벤트 (UI 제어 및 예외 처리)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 초기화
    errorId.style.display = 'none';
    errorPw.style.display = 'none';
    loginFailMsg.classList.add('hidden');

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // 유효성 검사 (입력창이 비었는지 확인)
    if (!username) {
        errorId.style.display = 'block';
        usernameInput.focus();
        return;
    }
    if (!password) {
        errorPw.style.display = 'block';
        passwordInput.focus();
        return;
    }

    try {
        const result = await API.login(username, password);

        // 로그인 성공 시 토큰 저장
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.access);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refresh);
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, result.user.user_type);

        if (result.user.user_type === USER_TYPES.SELLER) {
            localStorage.setItem(STORAGE_KEYS.SELLER_NAME, result.user.name);
            localStorage.setItem(STORAGE_KEYS.ACCOUNT_NAME, result.user.username);
        } else {
            localStorage.setItem(STORAGE_KEYS.BUYER_NAME, result.user.name);
        }

        const returnUrl = localStorage.getItem(STORAGE_KEYS.RETURN_URL);

        if (returnUrl) {
            localStorage.removeItem(STORAGE_KEYS.RETURN_URL);
            window.location.href = returnUrl;
        } else {
            window.location.href = '../../products/list/index.html';
        }

    } catch (error) {
        // 로그인 실패 시 처리 (아이디/비밀번호 불일치 등)
        passwordInput.value = '';
        passwordInput.focus();
        loginFailMsg.classList.remove('hidden');
    }
});

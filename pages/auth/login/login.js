// js/login.js

const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorId = document.getElementById('error-id');
const errorPw = document.getElementById('error-pw');
const loginFailMsg = document.getElementById('login-fail-msg');

// 2. 로그인 API 함수 (통신 역할만 수행)
async function login(username, password) {
    const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

    const response = await fetch(`${BASE_URL}/accounts/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        return data; // 성공 시 결과 반환
    } else {
        // 실패 시 서버의 에러 메시지나 커스텀 에러를 던짐
        throw new Error(data.FAIL_Message || 'AUTH_FAILED');
    }
}

// 3. 폼 제출 이벤트 (UI 제어 및 예외 처리)
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
        const result = await login(username, password);

        // 로그인 성공 시 토큰 저장
        localStorage.setItem('access', result.access);
        localStorage.setItem('refresh', result.refresh);
        localStorage.setItem('userType', result.user.user_type);

        // 메인으로 이동
        window.location.href = '../../products/list/index.html';

    } catch (error) {
        // 로그인 실패 시 처리 (아이디/비밀번호 불일치 등)
        passwordInput.value = '';
        passwordInput.focus();
        loginFailMsg.classList.remove('hidden');
    }
});
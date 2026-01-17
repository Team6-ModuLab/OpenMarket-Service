const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorId = document.getElementById('error-id');
const errorPw = document.getElementById('error-pw');
const loginFailMsg = document.getElementById('login-fail-msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorId.style.display = 'none';
    errorPw.style.display = 'none';
    loginFailMsg.classList.add('hidden');

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

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
        passwordInput.value = '';
        passwordInput.focus();
        loginFailMsg.classList.remove('hidden');
    }
});
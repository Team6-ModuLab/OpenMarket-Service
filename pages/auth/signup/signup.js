// 탭전환
const buyerTab = document.getElementById('buyer-tab');
const sellerTab = document.getElementById('seller-tab');
const sellerFields = document.querySelector('.seller-only-fields');
const businessNumber = document.getElementById('business-number');
const storeName = document.getElementById('store-name');

// 구매회원
buyerTab.addEventListener('click', () => {
    buyerTab.classList.add('active');
    sellerTab.classList.remove('active');
    sellerFields.classList.add('hidden');
    checkFormValidity();
});

// 판매회원
sellerTab.addEventListener('click', () => {
    sellerTab.classList.add('active');
    buyerTab.classList.remove('active');
    sellerFields.classList.remove('hidden');
    checkFormValidity();
});

// 상태
let isIdChecked = false;
let isIdAvailable = false;
let isPasswordValid = false;
let isPasswordMatch = false;
let isBusinessChecked = false;

// 이미사용중인아이디
const usedIds = ['jeju1234', 'test1234', 'hodu1234'];

// DOM
const userIdInput = document.getElementById('user-id');
const idMessage = document.getElementById('id-message');
const checkBtn = document.querySelector('.check-btn');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const passwordMessage = document.getElementById('password-message');
const passwordIcon = document.getElementById('password-icon');
const passwordConfirmIcon = document.getElementById('password-confirm-icon');
const signupForm = document.querySelector('.signup-form');
const signupBtn = document.querySelector('.signup-btn');
const termsCheckbox = document.getElementById('terms-agree');
const businessCheckBtn = document.getElementById('business-check-btn');
const phoneMiddle = document.getElementById('phone-middle');
const phoneLast = document.getElementById('phone-last');

// 아이디입력
userIdInput.addEventListener('input', () => {
    isIdChecked = false;
    isIdAvailable = false;
    idMessage.textContent = '';
    idMessage.className = 'validation-message';
    userIdInput.classList.remove('error', 'success');
    checkFormValidity();
});

// 중복확인
checkBtn.addEventListener('click', () => {
    const userId = userIdInput.value.trim();

    if (!userId) {
        idMessage.textContent = '아이디를 입력해주세요.';
        idMessage.className = 'validation-message error';
        userIdInput.classList.add('error');
        return;
    }
    if (userId.length < 8) {
        alert('아이디는 8자 이상 입력해주세요.');
        userIdInput.classList.add('error');
        userIdInput.classList.remove('success');
        isIdChecked = false;
        isIdAvailable = false;
        return;
    }
    if (usedIds.includes(userId)) {
        idMessage.textContent = '이미 사용중인 아이디입니다.';
        idMessage.className = 'validation-message error';
        userIdInput.classList.add('error');
        isIdChecked = true;
        isIdAvailable = false;
    } else {
        idMessage.textContent = '멋진 아이디네요 :)';
        idMessage.className = 'validation-message success';
        userIdInput.classList.remove('error');
        userIdInput.classList.add('success');
        isIdChecked = true;
        isIdAvailable = true;
    }
    checkFormValidity();
});

// 사업자등록번호인증
if (businessCheckBtn) {
    businessCheckBtn.addEventListener('click', () => {
        if (!businessNumber.value.trim()) {
            alert('사업자 등록번호를 입력해주세요.');
            return;
        }
        alert('사업자 등록번호가 인증되었습니다.');
        isBusinessChecked = true;
        businessNumber.classList.add('success');
        checkFormValidity();
    });
}

// 사업자등록번호
businessNumber.addEventListener('input', function () {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
    isBusinessChecked = false;
    businessNumber.classList.remove('success');
    checkFormValidity();
});

// 비밀번호유효성
passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length >= 8) {
        isPasswordValid = true;
        passwordInput.classList.add('success');
        passwordIcon.classList.add('show');
    } else {
        isPasswordValid = false;
        passwordInput.classList.remove('success');
        passwordIcon.classList.remove('show');
    }
    if (passwordConfirmInput.value) {
        checkPasswordMatch();
    }
    checkFormValidity();
});

// 비밀번호재확인
passwordConfirmInput.addEventListener('input', checkPasswordMatch);
function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirm = passwordConfirmInput.value;

    if (!confirm) {
        passwordMessage.textContent = '';
        passwordMessage.className = 'validation-message';
        passwordConfirmInput.classList.remove('error', 'success');
        passwordConfirmIcon.classList.remove('show');
        isPasswordMatch = false;
        checkFormValidity();
        return;
    }
    if (password !== confirm) {
        passwordMessage.textContent = '비밀번호가 일치하지 않습니다.';
        passwordMessage.className = 'validation-message error';
        passwordConfirmInput.classList.add('error');
        passwordConfirmInput.classList.remove('success');
        passwordConfirmIcon.classList.remove('show');
        isPasswordMatch = false;
    } else {
        passwordMessage.textContent = '';
        passwordMessage.className = 'validation-message';
        passwordConfirmInput.classList.remove('error');
        passwordConfirmInput.classList.add('success');
        passwordConfirmIcon.classList.add('show');
        isPasswordMatch = true;
    }
    checkFormValidity();
}

// 휴대폰번호
phoneMiddle.addEventListener('input', function () {
    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
    checkFormValidity();
});
phoneLast.addEventListener('input', function () {
    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
    checkFormValidity();
});

// 폼유효성
function checkFormValidity() {
    const isSeller = sellerTab.classList.contains('active');

    let sellerValid = true;
    if (isSeller) {
        sellerValid =
            businessNumber.value.trim() &&
            isBusinessChecked &&
            storeName.value.trim();
    }
    if (
        userIdInput.value &&
        isIdChecked &&
        isIdAvailable &&
        isPasswordValid &&
        isPasswordMatch &&
        document.getElementById('name').value &&
        phoneMiddle.value &&
        phoneLast.value &&
        termsCheckbox.checked &&
        sellerValid
    ) {
        signupBtn.classList.add('active');
        signupBtn.disabled = false;
    } else {
        signupBtn.classList.remove('active');
        signupBtn.disabled = true;
    }
}

document.getElementById('name').addEventListener('input', checkFormValidity);
termsCheckbox.addEventListener('change', checkFormValidity);
if (storeName) storeName.addEventListener('input', checkFormValidity);

// 폼제출 - 로그인 페이지로 이동
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!signupBtn.classList.contains('active')) return;
    alert('회원가입이 완료되었습니다.');
    window.location.href = '../login/index.html';
});
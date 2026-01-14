/* ===============================
   DOM
================================ */
const buyerTab = document.getElementById('buyer-tab');
const sellerTab = document.getElementById('seller-tab');
const sellerFields = document.querySelector('.seller-only-fields');
const signupForm = document.getElementById('signup-form');
const signupBtn = document.querySelector('.signup-btn');

const userIdInput = document.getElementById('user-id');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const nameInput = document.getElementById('name');
const phonePrefix = document.getElementById('phone-prefix');
const phoneMiddle = document.getElementById('phone-middle');
const phoneLast = document.getElementById('phone-last');
const businessNumber = document.getElementById('business-number');
const storeName = document.getElementById('store-name');
const termsCheckbox = document.getElementById('terms-agree');

const idMessage = document.getElementById('id-message');
const passwordMessage = document.getElementById('password-message');
const nameMessage = document.getElementById('name-message');
const phoneMessage = document.getElementById('phone-message');
const businessMessage = document.getElementById('business-message');
const storeMessage = document.getElementById('store-message');

const idCheckBtn = document.getElementById('id-check-btn');

/* ===============================
   상태
================================ */
let currentUserType = 'BUYER';
let isIdChecked = false;
let lastCheckedId = '';

let fieldStates = {
    userId: false,
    password: false,
    passwordConfirm: false,
    name: false,
    phone: false,
    business: false,
    store: false,
    terms: false
};

/* ===============================
   탭
================================ */
buyerTab.addEventListener('click', () => {
    buyerTab.classList.add('active');
    sellerTab.classList.remove('active');
    sellerFields.classList.add('hidden');
    currentUserType = 'BUYER';
    checkAllFields();
});

sellerTab.addEventListener('click', () => {
    sellerTab.classList.add('active');
    buyerTab.classList.remove('active');
    sellerFields.classList.remove('hidden');
    currentUserType = 'SELLER';
    checkAllFields();
});

/* ===============================
   아이디
================================ */
function validateUserId(value) {
    return /^[a-z0-9]{1,20}$/.test(value);
}

userIdInput.addEventListener('input', () => {
    if (userIdInput.value.trim() !== lastCheckedId) {
        isIdChecked = false;
        fieldStates.userId = false;
    }
    clearMessage(idMessage);
    checkAllFields();
});

/* 중복확인 - 진짜 API */
idCheckBtn.addEventListener('click', async () => {
    const username = userIdInput.value.trim();

    if (!validateUserId(username)) {
        showError(idMessage, '20자 이내 영문 소문자와 숫자만 사용 가능합니다.');
        return;
    }

    idCheckBtn.disabled = true;
    idCheckBtn.textContent = '확인 중...';

    try {
        const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';
        
        const response = await fetch(`${BASE_URL}/accounts/signup_valid/?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        console.log('Response:', data);

        if (response.ok) {
            showSuccess(idMessage, '사용 가능한 아이디입니다.');
            isIdChecked = true;
            lastCheckedId = username;
            fieldStates.userId = true;
        } else {
            showError(idMessage, data.username?.[0] || data.FAIL_Message || '이미 사용중인 아이디입니다.');
            isIdChecked = false;
            fieldStates.userId = false;
        }

    } catch (e) {
        console.error('Error:', e);
        showError(idMessage, '서버 연결에 실패했습니다. 다시 시도해주세요.');
        isIdChecked = false;
    } finally {
        idCheckBtn.disabled = false;
        idCheckBtn.textContent = '중복확인';
        checkAllFields();
    }
});

/* ===============================
   비밀번호
================================ */
passwordInput.addEventListener('blur', () => {
    fieldStates.password = passwordInput.value.length >= 8;
    checkAllFields();
});

passwordConfirmInput.addEventListener('blur', () => {
    fieldStates.passwordConfirm =
        passwordInput.value &&
        passwordInput.value === passwordConfirmInput.value;
    checkAllFields();
});

/* ===============================
   이름
================================ */
nameInput.addEventListener('blur', () => {
    fieldStates.name = !!nameInput.value.trim();
    checkAllFields();
});

/* ===============================
   휴대폰
================================ */
function checkPhone() {
    fieldStates.phone =
        phoneMiddle.value.length >= 3 &&
        phoneLast.value.length === 4;
    checkAllFields();
}
phoneMiddle.addEventListener('blur', checkPhone);
phoneLast.addEventListener('blur', checkPhone);

/* ===============================
   판매자
================================ */
if (businessNumber) {
    businessNumber.addEventListener('blur', () => {
        fieldStates.business = businessNumber.value.length === 10;
        checkAllFields();
    });
}

if (storeName) {
    storeName.addEventListener('blur', () => {
        fieldStates.store = !!storeName.value.trim();
        checkAllFields();
    });
}

/* ===============================
   약관
================================ */
termsCheckbox.addEventListener('change', () => {
    fieldStates.terms = termsCheckbox.checked;
    checkAllFields();
});

/* ===============================
   버튼 활성화
================================ */
function checkAllFields() {
    let valid =
        fieldStates.userId &&
        fieldStates.password &&
        fieldStates.passwordConfirm &&
        fieldStates.name &&
        fieldStates.phone &&
        fieldStates.terms;

    if (currentUserType === 'SELLER') {
        valid = valid && fieldStates.business && fieldStates.store;
    }

    signupBtn.disabled = !valid;
    signupBtn.classList.toggle('active', valid);
}

/* 회원가입 submit */
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isIdChecked) {
        alert('아이디 중복확인을 해주세요.');
        return;
    }

    const signupData = {
        username: userIdInput.value.trim(),
        password: passwordInput.value,
        password2: passwordConfirmInput.value,
        name: nameInput.value.trim(),
        phone_number: phonePrefix.value + phoneMiddle.value + phoneLast.value,
        login_type: currentUserType
    };

    if (currentUserType === 'SELLER') {
        signupData.company_registration_number = businessNumber.value.trim();
        signupData.store_name = storeName.value.trim();
    }

    try {
        const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';
        
        const response = await fetch(`${BASE_URL}/accounts/signup/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('회원가입이 완료되었습니다.');
            location.href = '../login/index.html';
        } else {
            alert(data.FAIL_Message || JSON.stringify(data));
        }
    } catch (e) {
        console.error('Error:', e);
        alert('회원가입 중 서버 오류가 발생했습니다.');
    }
});

/* ===============================
   메시지 유틸
================================ */
function showError(el, msg) {
    el.textContent = msg;
    el.className = 'validation-message error';
}
function showSuccess(el, msg) {
    el.textContent = msg;
    el.className = 'validation-message success';
}
function clearMessage(el) {
    el.textContent = '';
    el.className = 'validation-message';
}

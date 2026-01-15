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
const passwordValidationMessage = document.getElementById('password-validation-message');
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
    return /^[a-zA-Z0-9]{1,20}$/.test(value);
}

userIdInput.addEventListener('input', () => {
    const username = userIdInput.value.trim();
    
    if (username.length === 0) {
        clearMessage(idMessage);
        fieldStates.userId = false;
    } else if (!validateUserId(username)) {
        showError(idMessage, '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.');
        fieldStates.userId = false;
    } else {
        clearMessage(idMessage);
        fieldStates.userId = false;
    }
    
    if (username !== lastCheckedId) {
        isIdChecked = false;
        fieldStates.userId = false;
    }
    
    checkAllFields();
});

/* 중복확인 - 진짜 API */
idCheckBtn.addEventListener('click', async () => {
    const username = userIdInput.value.trim();

    if (!validateUserId(username)) {
        showError(idMessage, '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.');
        return;
    }

    idCheckBtn.disabled = true;

    try {
        const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';
        
        const response = await fetch(`${BASE_URL}/accounts/validate-username/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username })
        });

        const data = await response.json();
        console.log('Response:', response.status, data);

        if (response.status === 200) {
            showSuccess(idMessage, data.message || '사용 가능한 아이디입니다.');
            isIdChecked = true;
            lastCheckedId = username;
            fieldStates.userId = true;
        } else {
            showError(idMessage, data.error || data.message || '이미 사용중인 아이디입니다.');
            isIdChecked = false;
            fieldStates.userId = false;
        }

    } catch (e) {
        console.error('Error:', e);
        showError(idMessage, '서버 연결에 실패했습니다. 다시 시도해주세요.');
        isIdChecked = false;
    } finally {
        idCheckBtn.disabled = false;
        checkAllFields();
    }
});

/* ===============================
   비밀번호
================================ */
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    
    if (password.length === 0) {
        clearMessage(passwordValidationMessage);
        fieldStates.password = false;
    } else if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
        showError(passwordValidationMessage, '8자 이상, 영문 대소문자, 숫자, 특수문자를 사용하세요.');
        fieldStates.password = false;
    } else {
        showSuccess(passwordValidationMessage, '사용 가능한 비밀번호입니다.');
        fieldStates.password = true;
    }
    
    if (passwordConfirmInput.value) {
        checkPasswordConfirm();
    }
    
    checkAllFields();
});

function checkPasswordConfirm() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    
    if (passwordConfirm.length === 0) {
        clearMessage(passwordMessage);
        fieldStates.passwordConfirm = false;
    } else if (password !== passwordConfirm) {
        showError(passwordMessage, '비밀번호가 일치하지 않습니다.');
        fieldStates.passwordConfirm = false;
    } else {
        showSuccess(passwordMessage, '비밀번호가 일치합니다.');
        fieldStates.passwordConfirm = true;
    }
}

passwordConfirmInput.addEventListener('input', () => {
    checkPasswordConfirm();
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
// 커스텀 select 기능
const customSelect = document.getElementById('phone-prefix-custom');
const customSelectTrigger = customSelect.querySelector('.custom-select-trigger');
const customOptions = customSelect.querySelector('.custom-options');
const customOptionsList = customSelect.querySelectorAll('.custom-option');
const phonePrefixInput = document.getElementById('phone-prefix');

// select 열기/닫기
customSelectTrigger.addEventListener('click', () => {
    customSelect.classList.toggle('open');
});

// 옵션 선택
customOptionsList.forEach(option => {
    option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        
        // 선택된 값 표시
        customSelectTrigger.textContent = value;
        phonePrefixInput.value = value;
        
        // 선택 상태 업데이트
        customOptionsList.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // 드롭다운 닫기
        customSelect.classList.remove('open');
    });
});

// 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
        customSelect.classList.remove('open');
    }
});

// 숫자만 입력되도록
phoneMiddle.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value.length >= 3) {
        checkPhone();
    }
});

phoneLast.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value.length >= 4) {
        checkPhone();
    }
});

function checkPhone() {
    fieldStates.phone =
        phonePrefixInput.value.length >= 2 &&
        phoneMiddle.value.length >= 3 &&
        phoneLast.value.length === 4;
    checkAllFields();
}

/* ===============================
   판매자
================================ */
if (businessNumber) {
    // 숫자만 입력 + 자동 하이픈 (10자리)
    businessNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        // 최대 10자리까지만
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        // 000-00-00000 형식으로 자동 변환
        if (value.length > 3 && value.length <= 5) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 5) {
            value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5, 10);
        }
        
        e.target.value = value;
    });
    
    businessNumber.addEventListener('blur', () => {
        const cleanValue = businessNumber.value.replace(/-/g, '');
        fieldStates.business = cleanValue.length === 10;
        checkAllFields();
    });
}

// 사업자등록번호 인증 버튼
const businessCheckBtn = document.getElementById('business-check-btn');
if (businessCheckBtn) {
    businessCheckBtn.addEventListener('click', () => {
        const businessNum = businessNumber.value.replace(/-/g, '');
        
        if (businessNum.length !== 10) {
            alert('사업자 등록번호 10자리를 입력해주세요.');
            return;
        }
        
        // 임시 인증 (실제 API 연동 필요)
        alert('사업자 등록번호가 인증되었습니다.');
        fieldStates.business = true;
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
        name: nameInput.value.trim(),
        phone_number: phonePrefixInput.value + phoneMiddle.value + phoneLast.value
    };

    try {
        const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';
        
        // 구매자/판매자에 따라 엔드포인트 분기
        const endpoint = currentUserType === 'BUYER' 
            ? `${BASE_URL}/accounts/buyer/signup/`
            : `${BASE_URL}/accounts/seller/signup/`;
        
        // 판매자일 경우 추가 필드
        if (currentUserType === 'SELLER') {
            signupData.company_registration_number = businessNumber.value.replace(/-/g, '');
            signupData.store_name = storeName.value.trim();
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });

        const data = await response.json();
        console.log('Response:', response.status, data);

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
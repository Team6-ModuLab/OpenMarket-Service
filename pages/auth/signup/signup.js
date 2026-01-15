const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';
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
const idCheckBtn = document.getElementById('id-check-btn');

let currentUserType = 'BUYER';
let isIdChecked = false;
let lastCheckedId = '';
let isBusinessChecked = false;
let lastCheckedBusiness = '';
let lastCheckedPhone = '';
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

idCheckBtn.addEventListener('click', async () => {
    const username = userIdInput.value.trim();
    if (!validateUserId(username)) {
        showError(idMessage, '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.');
        return;
    }
    idCheckBtn.disabled = true;
    try {
        const response = await fetch(`${BASE_URL}/accounts/validate-username/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username })
        });
        const data = await response.json();
        console.log('Response:', response.status, data);
        if (response.ok) {
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

passwordInput.addEventListener('focus', () => {
    if (!fieldStates.userId) {
        showError(idMessage, '필수 정보입니다.');
    }
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

passwordConfirmInput.addEventListener('focus', () => {
    if (!fieldStates.password) {
        showError(passwordValidationMessage, '필수 정보입니다.');
    }
});

nameInput.addEventListener('blur', () => {
    const value = nameInput.value.trim();
    if (!value) {
        showError(nameMessage, '필수 정보입니다.');
        fieldStates.name = false;
    } else {
        clearMessage(nameMessage);
        fieldStates.name = true;
    }
    checkAllFields();
});

nameInput.addEventListener('focus', () => {
    if (!fieldStates.passwordConfirm) {
        showError(passwordMessage, '필수 정보입니다.');
    }
});

const customSelect = document.getElementById('phone-prefix-custom');
const customSelectTrigger = customSelect.querySelector('.custom-select-trigger');
const customOptionsList = customSelect.querySelectorAll('.custom-option');
const phonePrefixInput = document.getElementById('phone-prefix');

customSelectTrigger.addEventListener('click', () => {
    customSelect.classList.toggle('open');
});

customOptionsList.forEach(option => {
    option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        customSelectTrigger.textContent = value;
        phonePrefixInput.value = value;
        customOptionsList.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        customSelect.classList.remove('open');
    });
});

document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
        customSelect.classList.remove('open');
    }
});

phoneMiddle.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value.length > 4) {
        e.target.value = e.target.value.slice(0, 4);
    }
    fieldStates.phone = false;
    clearMessage(phoneMessage);
    checkAllFields();
});

phoneMiddle.addEventListener('focus', () => {
    if (!fieldStates.name) {
        showError(nameMessage, '필수 정보입니다.');
    }
});

phoneLast.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value.length > 4) {
        e.target.value = e.target.value.slice(0, 4);
    }
    fieldStates.phone = false;
    clearMessage(phoneMessage);
    if (e.target.value.length === 4 && phoneMiddle.value.length === 4) {
        checkPhone();
    } else {
        checkAllFields();
    }
});

async function checkPhone() {
    const prefix = phonePrefixInput.value;
    const middle = phoneMiddle.value;
    const last = phoneLast.value;
    if (middle.length < 4 || last.length < 4) {
        fieldStates.phone = false;
        checkAllFields();
        return;
    }
    const fullPhone = prefix + middle + last;
    if (fullPhone === lastCheckedPhone && fieldStates.phone) {
        checkAllFields();
        return;
    }
    console.log('휴대폰 중복 확인 시작:', fullPhone);
    try {
        const response = await fetch(`${BASE_URL}/accounts/validate-phone/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: fullPhone })
        });
        const data = await response.json();
        console.log('휴대폰 중복확인 응답:', response.status, data);
        if (response.ok) {
            showSuccess(phoneMessage, '사용 가능한 휴대폰 번호입니다.');
            lastCheckedPhone = fullPhone;
            fieldStates.phone = true;
        } else {
            showError(phoneMessage, data.error || data.message || '이미 등록된 전화번호입니다.');
            fieldStates.phone = false;
        }
    } catch (e) {
        console.error('휴대폰 중복확인 에러:', e);
        showError(phoneMessage, '서버 연결에 실패했습니다. 다시 시도해주세요.');
        fieldStates.phone = false;
    } finally {
        checkAllFields();
    }
}

if (businessNumber) {
    businessNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        if (value.length > 3 && value.length <= 5) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 5) {
            value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5, 10);
        }
        e.target.value = value;
        const cleanValue = value.replace(/-/g, '');
        if (cleanValue !== lastCheckedBusiness) {
            isBusinessChecked = false;
            fieldStates.business = false;
        }
    });
    
    businessNumber.addEventListener('blur', () => {
        const cleanValue = businessNumber.value.replace(/-/g, '');
        if (cleanValue.length === 10 && isBusinessChecked) {
            fieldStates.business = true;
        } else {
            fieldStates.business = false;
        }
        checkAllFields();
    });
}

const businessCheckBtn = document.getElementById('business-check-btn');
if (businessCheckBtn) {
    businessCheckBtn.addEventListener('click', async () => {
        const businessNum = businessNumber.value.replace(/-/g, '');
        if (businessNum.length !== 10) {
            alert('사업자 등록번호 10자리를 입력해주세요.');
            return;
        }
        businessCheckBtn.disabled = true;
        try {
            const response = await fetch(`${BASE_URL}/accounts/seller/validate-registration-number/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ company_registration_number: businessNum })
            });
            const data = await response.json();
            console.log('사업자번호 Response:', response.status, data);
            if (response.ok) {
                alert('사업자 등록번호가 인증되었습니다.');
                isBusinessChecked = true;
                lastCheckedBusiness = businessNum;
                fieldStates.business = true;
            } else {
                alert(data.error || data.message || '이미 등록된 사업자 등록번호입니다.');
                isBusinessChecked = false;
                fieldStates.business = false;
            }
        } catch (e) {
            console.error('사업자번호 Error:', e);
            alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
            isBusinessChecked = false;
        } finally {
            businessCheckBtn.disabled = false;
            checkAllFields();
        }
    });
}

if (storeName) {
    storeName.addEventListener('blur', () => {
        fieldStates.store = !!storeName.value.trim();
        checkAllFields();
    });
}

termsCheckbox.addEventListener('change', () => {
    fieldStates.terms = termsCheckbox.checked;
    checkAllFields();
});

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

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isIdChecked) {
        alert('아이디 중복확인을 해주세요.');
        return;
    }
    if (currentUserType === 'SELLER' && !isBusinessChecked) {
        alert('사업자등록번호 인증을 해주세요.');
        return;
    }
    if (!fieldStates.phone) {
        alert('휴대폰번호를 확인해주세요.');
        return;
    }
    
    const signupData = {
        username: userIdInput.value.trim(),
        password: passwordInput.value,
        name: nameInput.value.trim(),
        phone_number: phonePrefixInput.value + phoneMiddle.value + phoneLast.value
    };
    
    try {
        const endpoint = currentUserType === 'BUYER' 
            ? `${BASE_URL}/accounts/buyer/signup/`
            : `${BASE_URL}/accounts/seller/signup/`;
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
            if (data.phone_number) {
                showError(phoneMessage, data.phone_number[0] || '이미 등록된 전화번호입니다.');
            } else {
                alert(data.FAIL_Message || JSON.stringify(data));
            }
        }
    } catch (e) {
        console.error('Error:', e);
        alert('회원가입 중 서버 오류가 발생했습니다.');
    }
});

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
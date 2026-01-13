// DOM 요소
const buyerTab = document.getElementById('buyer-tab');
const sellerTab = document.getElementById('seller-tab');
const sellerFields = document.querySelector('.seller-only-fields');
const signupForm = document.getElementById('signup-form');
const signupBtn = document.querySelector('.signup-btn');

// Input 요소
const userIdInput = document.getElementById('user-id');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const nameInput = document.getElementById('name');
const phoneMiddle = document.getElementById('phone-middle');
const phoneLast = document.getElementById('phone-last');
const businessNumber = document.getElementById('business-number');
const storeName = document.getElementById('store-name');
const termsCheckbox = document.getElementById('terms-agree');

// 메시지 요소
const idMessage = document.getElementById('id-message');
const passwordValidationMessage = document.getElementById('password-validation-message');
const passwordMessage = document.getElementById('password-message');
const nameMessage = document.getElementById('name-message');
const phoneMessage = document.getElementById('phone-message');
const businessMessage = document.getElementById('business-message');
const storeMessage = document.getElementById('store-message');

// 아이콘 요소
const passwordIcon = document.getElementById('password-icon');
const passwordConfirmIcon = document.getElementById('password-confirm-icon');

// 버튼 요소
const idCheckBtn = document.getElementById('id-check-btn');
const businessCheckBtn = document.getElementById('business-check-btn');

// 상태 관리
let fieldStates = {
    userId: { filled: false, valid: false, checked: false },
    password: { filled: false, valid: false },
    passwordConfirm: { filled: false, valid: false },
    name: { filled: false, valid: false },
    phone: { filled: false, valid: false },
    business: { filled: false, valid: false, checked: false },
    store: { filled: false, valid: false },
    terms: false
};

let currentUserType = 'BUYER'; // 기본값: 구매회원
const usedIds = ['jeju1234', 'test1234', 'hodu1234'];
const usedPhoneNumbers = ['010-1234-5678', '011-1111-2222'];

// 탭 전환
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

// 아이디 검증
function validateUserId(value) {
    const pattern = /^[a-zA-Z0-9]{8,20}$/;
    return pattern.test(value);
}

// 실시간 입력 검증
userIdInput.addEventListener('input', () => {
    const value = userIdInput.value;
    
    // 허용되지 않은 문자 입력 시 오류 메시지
    if (value && !/^[a-z0-9]*$/.test(value)) {
        showError(userIdInput, idMessage, '8자 이상, 20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.');
        fieldStates.userId = { filled: false, valid: false, checked: false };
    } else {
    // 입력이 유효하면 중복확인 상태 초기화
    fieldStates.userId.checked = false;
    fieldStates.userId.valid = false;
    clearError(userIdInput, idMessage);
    }
    
    checkAllFields();
});

// 아이디, 포커스 잃을 때 유효성 검사
userIdInput.addEventListener('blur', () => {
    const value = userIdInput.value.trim();
    
    if (!value) {
        showError(userIdInput, idMessage, '필수 정보입니다.');
        fieldStates.userId = { filled: false, valid: false, checked: false };
    } else if (!validateUserId(value)) {
        showError(userIdInput, idMessage, '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.');
        fieldStates.userId = { filled: true, valid: false, checked: false };
    } else {
        clearError(userIdInput, idMessage);
        fieldStates.userId.filled = true;
    }
    checkAllFields();
});

// 아이디 입력 시 상태 초기화
userIdInput.addEventListener('input', () => {
    fieldStates.userId.checked = false;
    fieldStates.userId.valid = false;
    clearError(userIdInput, idMessage);
    checkAllFields();
});

// 중복확인 버튼 클릭
idCheckBtn.addEventListener('click', () => {
    const value = userIdInput.value.trim();
    
    if (!value) {
        showError(userIdInput, idMessage, '필수 정보입니다.');
        fieldStates.userId = { filled: false, valid: false, checked: false };
        return;
    }
    
    if (!validateUserId(value)) {
        showError(userIdInput, idMessage, '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.');
        fieldStates.userId = { filled: true, valid: false, checked: false };
        return;
    }
    
    // 중복 확인
    if (usedIds.includes(value)) {
        showError(userIdInput, idMessage, '이미 사용중인 아이디입니다.');
        fieldStates.userId = { filled: true, valid: false, checked: true };
    } else {
        showSuccess(userIdInput, idMessage, '멋진 아이디네요 :)');
        fieldStates.userId = { filled: true, valid: true, checked: true };
    }
    
    checkAllFields();
});

// 비밀번호 검증 (포커스 잃을 때)
function validatePassword(value) {
    const minLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

function validatePasswordCharacters(value) {
    const allowedPattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    return allowedPattern.test(value);
}

// 실시간 입력 검증
passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    
    // 허용되지 않은 문자 입력 시 오류 메시지
    if (value && !validatePasswordCharacters(value)) {
        showError(passwordInput, passwordValidationMessage, '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
        passwordIcon.classList.remove('show');
        fieldStates.password = { filled: false, valid: false };
    } else {
        // 입력이 유효하면 아이콘 표시
        if (value.length >= 8 && validatePassword(value)) {
            passwordIcon.classList.add('show');
        } else {
            passwordIcon.classList.remove('show');
        }
        
        // 입력 중에는 에러 메시지 제거
        if (value) {
            clearError(passwordInput, passwordValidationMessage);
        }
    }
});

passwordInput.addEventListener('blur', () => {
    const value = passwordInput.value;
    
    if (!value) {
        showError(passwordInput, passwordValidationMessage, '필수 정보입니다.');
        passwordIcon.classList.remove('show');
        fieldStates.password = { filled: false, valid: false };
    } else if (!validatePasswordCharacters(value)) {
        showError(passwordInput, passwordValidationMessage, '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
        passwordIcon.classList.remove('show');
        fieldStates.password = { filled: true, valid: false };
    } else if (!validatePassword(value)) {
        showError(passwordInput, passwordValidationMessage, '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
        passwordIcon.classList.remove('show');
        fieldStates.password = { filled: true, valid: false };
    } else {
        clearError(passwordInput, passwordValidationMessage);
        passwordIcon.classList.add('show');
        fieldStates.password = { filled: true, valid: true };
    }
    
    // 비밀번호 재확인도 체크
    if (passwordConfirmInput.value) {
        checkPasswordMatch();
    }
    
    checkAllFields();
});

passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    if (value.length >= 8) {
        passwordIcon.classList.add('show');
    } else {
        passwordIcon.classList.remove('show');
    }
});

// 비밀번호 재확인
passwordConfirmInput.addEventListener('blur', () => {
    checkPasswordMatch();
});

passwordConfirmInput.addEventListener('input', () => {
    if (passwordConfirmInput.value.length >= 8) {
        passwordConfirmIcon.classList.add('show');
    } else {
        passwordConfirmIcon.classList.remove('show');
    }
});

function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirm = passwordConfirmInput.value;

    if (!confirm) {
        showError(passwordConfirmInput, passwordMessage, '필수 정보입니다.');
        passwordConfirmIcon.classList.remove('show');
        fieldStates.passwordConfirm = { filled: false, valid: false };
    } else if (password !== confirm) {
        showError(passwordConfirmInput, passwordMessage, '비밀번호가 일치하지 않습니다.');
        passwordConfirmIcon.classList.remove('show');
        fieldStates.passwordConfirm = { filled: true, valid: false };
    } else {
        clearError(passwordConfirmInput, passwordMessage);
        passwordConfirmIcon.classList.add('show');
        fieldStates.passwordConfirm = { filled: true, valid: true };
    }
    
    checkAllFields();
}

// 이름 검증 (순서 체크)
nameInput.addEventListener('blur', () => {
    const value = nameInput.value.trim();

    if (!value) {
        showError(nameInput, nameMessage, '필수 정보입니다.');
        fieldStates.name = { filled: false, valid: false };
    } else {
        clearError(nameInput, nameMessage);
        fieldStates.name = { filled: true, valid: true };
    }
    
    checkAllFields();
});

nameInput.addEventListener('input', () => {
    clearError(nameInput, nameMessage);
});

// 휴대폰번호
phoneMiddle.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    clearError(phoneMiddle, phoneMessage);
    fieldStates.phone = { filled: false, valid: false };
    checkAllFields();
});

phoneLast.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    clearError(phoneLast, phoneMessage);
    fieldStates.phone = { filled: false, valid: false };
    checkAllFields();
});

phoneMiddle.addEventListener('blur', () => {
    checkPhoneNumber();
});

phoneLast.addEventListener('blur', () => {
    checkPhoneNumber();
});

function checkPhoneNumber() {
    const prefix = document.getElementById('phone-prefix').value;
    const middle = phoneMiddle.value;
    const last = phoneLast.value;
    
    // 빈 값 체크
    if (!middle || !last) {
        if (middle || last) {
            showError(phoneMiddle, phoneMessage, '휴대폰번호를 정확히 입력해주세요.');
        }
        fieldStates.phone = { filled: false, valid: false };
        checkAllFields();
        return;
    }
    
    // 길이 체크
    if (middle.length < 3 || last.length < 4) {
        showError(phoneMiddle, phoneMessage, '휴대폰번호를 정확히 입력해주세요.');
        fieldStates.phone = { filled: true, valid: false };
        checkAllFields();
        return;
    }
    
    // 중복 체크
    const fullPhoneNumber = `${prefix}-${middle}-${last}`;
    if (usedPhoneNumbers.includes(fullPhoneNumber)) {
        showError(phoneMiddle, phoneMessage, '해당 사용자 전화번호는 이미 존재합니다.');
        fieldStates.phone = { filled: true, valid: false };
        checkAllFields();
        return;
    }
    
    // 모든 검증 통과
    clearError(phoneMiddle, phoneMessage);
    fieldStates.phone = { filled: true, valid: true };
    checkAllFields();
}

// 판매회원 - 사업자 등록번호
businessNumber.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    fieldStates.business.checked = false;
    clearError(businessNumber, businessMessage);
    checkAllFields();
});

businessCheckBtn.addEventListener('click', () => {
    const value = businessNumber.value.trim();
    
    if (!value) {
        showError(businessNumber, businessMessage, '사업자 등록번호를 입력해주세요.');
        return;
    }
    
    if (value.length !== 10) {
        showError(businessNumber, businessMessage, '올바른 사업자 등록번호를 입력해주세요.');
        return;
    }
    
    alert('사업자 등록번호가 인증되었습니다.');
    clearError(businessNumber, businessMessage);
    fieldStates.business = { filled: true, valid: true, checked: true };
    checkAllFields();
});

// 스토어 이름
if (storeName) {
    storeName.addEventListener('blur', () => {
        const value = storeName.value.trim();

        if (!value) {
            showError(storeName, storeMessage, '필수 정보입니다.');
            fieldStates.store = { filled: false, valid: false };
        } else {
            clearError(storeName, storeMessage);
            fieldStates.store = { filled: true, valid: true };
        }
        
        checkAllFields();
    });
    
    storeName.addEventListener('input', () => {
        clearError(storeName, storeMessage);
    });
}

// 약관 동의
termsCheckbox.addEventListener('change', () => {
    fieldStates.terms = termsCheckbox.checked;
    checkAllFields();
});

// 전체 필드 검증 및 버튼 활성화
function checkAllFields() {
    let isValid = false;
    
    if (currentUserType === 'BUYER') {
        // 구매회원: 기본 필드만
        isValid = 
            fieldStates.userId.filled && fieldStates.userId.valid && fieldStates.userId.checked &&
            fieldStates.password.filled && fieldStates.password.valid &&
            fieldStates.passwordConfirm.filled && fieldStates.passwordConfirm.valid &&
            fieldStates.name.filled && fieldStates.name.valid &&
            fieldStates.phone.filled && fieldStates.phone.valid &&
            fieldStates.terms;
    } else {
        // 판매회원: 사업자 정보 포함
        isValid = 
            fieldStates.userId.filled && fieldStates.userId.valid && fieldStates.userId.checked &&
            fieldStates.password.filled && fieldStates.password.valid &&
            fieldStates.passwordConfirm.filled && fieldStates.passwordConfirm.valid &&
            fieldStates.name.filled && fieldStates.name.valid &&
            fieldStates.phone.filled && fieldStates.phone.valid &&
            fieldStates.business.filled && fieldStates.business.valid && fieldStates.business.checked &&
            fieldStates.store.filled && fieldStates.store.valid &&
            fieldStates.terms;
    }
    
    if (isValid) {
        signupBtn.classList.add('active');
        signupBtn.disabled = false;
    } else {
        signupBtn.classList.remove('active');
        signupBtn.disabled = true;
    }
}

    // 폼 제출 - 로그인 페이지로 이동
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!signupBtn.classList.contains('active')) return;
    
    // 회원가입 완료
    alert(`${currentUserType === 'BUYER' ? '구매' : '판매'}회원으로 가입되었습니다!`);
    window.location.href = '../login/index.html';  // ⭐ 로그인 페이지로 이동
});

// 유틸리티 함수 (에러/성공 메시지 표시)
function showError(input, messageEl, message) {
    input.classList.add('error');
    input.classList.remove('success');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = 'validation-message error';
    }
}

function showSuccess(input, messageEl, message) {
    input.classList.remove('error');
    input.classList.add('success');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = 'validation-message success';
    }
}

function clearError(input, messageEl) {
    input.classList.remove('error');
    if (messageEl) {
        messageEl.textContent = '';
        messageEl.className = 'validation-message';
    }
}
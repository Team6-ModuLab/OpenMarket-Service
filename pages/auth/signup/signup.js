// js/signup.js

const tabs = document.querySelectorAll('.tab-btn');
let currentType = 'BUYER';
let isIdChecked = false;

// Tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentType = tab.dataset.type;
        // Logic for Seller specific fields could go here (Registration Number, etc.)
        // But design shows same fields for Buyer for now, or just switches context.
    });
});

// Elements
const signupForm = document.getElementById('signup-form');
const btnSignup = document.getElementById('btn-signup');
const termsCheck = document.getElementById('terms-check');
const idInput = document.getElementById('id-input');
const btnCheckDup = document.getElementById('btn-check-dup');
const errorIdDup = document.getElementById('error-id-dup');
const pwInput = document.getElementById('pw-input');
const pwConfirmInput = document.getElementById('pw-confirm-input');
const errorPwMatch = document.getElementById('error-pw-match');
const nameInput = document.getElementById('name-input');
const phone2 = document.getElementById('phone-2');
const phone3 = document.getElementById('phone-3');

// Validation function to enable button
function checkValidation() {
    const isPwMatch = pwInput.value && pwConfirmInput.value && (pwInput.value === pwConfirmInput.value);
    const isAllFilled = idInput.value && nameInput.value && phone2.value && phone3.value;
    const isTerms = termsCheck.checked;

    if (isIdChecked && isPwMatch && isAllFilled && isTerms) {
        btnSignup.disabled = false;
        btnSignup.style.backgroundColor = 'var(--color-primary)';
    } else {
        btnSignup.disabled = true;
        btnSignup.style.backgroundColor = '#C4C4C4';
    }
}

// Events
[idInput, pwInput, pwConfirmInput, nameInput, phone2, phone3].forEach(input => {
    input.addEventListener('input', checkValidation);
});

termsCheck.addEventListener('change', checkValidation);

// ID Duplicate Check
btnCheckDup.addEventListener('click', async () => {
    const id = idInput.value.trim();
    if (!id) return;

    const isAvailable = await API.checkIdDuplicate(id);
    if (!isAvailable) {
        errorIdDup.style.display = 'block';
        errorIdDup.style.color = ''; // Reset to default red (or explicitly '#EB5757')
        errorIdDup.innerText = "이미 사용중인 아이디입니다.";
        isIdChecked = false;
    } else {
        errorIdDup.style.display = 'block';
        errorIdDup.style.color = 'var(--color-primary)';
        errorIdDup.innerText = "사용 가능한 아이디입니다.";
        isIdChecked = true;
    }
    checkValidation();
});

// Password Match Check
pwInput.addEventListener('input', () => { // Also check on input
    const wrap = document.getElementById('pw-wrap');
    if (pwInput.value.length > 0) wrap.classList.add('valid');
    else wrap.classList.remove('valid');
    checkValidation();
});

pwConfirmInput.addEventListener('input', () => {
    const wrap = document.getElementById('pw-check-wrap');
    if (pwConfirmInput.value.length > 0 && pwConfirmInput.value === pwInput.value) {
        wrap.classList.add('valid');
        errorPwMatch.style.display = 'none';
    } else {
        wrap.classList.remove('valid');
        if (pwConfirmInput.value.length > 0) errorPwMatch.style.display = 'block';
    }
    checkValidation();
});


// Submit
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btnSignup.disabled) return;

    try {
        await API.signup({
            username: idInput.value,
            password: pwInput.value,
            name: nameInput.value,
            user_type: currentType
        });
        
        alert('회원가입이 완료되었습니다.');
        window.location.href = './login.html';
    } catch (error) {
        alert('가입 중 오류가 발생했습니다.');
    }
});

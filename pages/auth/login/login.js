// js/login.js

const tabs = document.querySelectorAll('.tab-btn');
let currentType = 'BUYER';

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentType = tab.dataset.type;
    });
});

// Form Submission
const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorId = document.getElementById('error-id');
const errorPw = document.getElementById('error-pw');
const loginFailMsg = document.getElementById('login-fail-msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset Errors
    errorId.style.display = 'none';
    errorPw.style.display = 'none';
    loginFailMsg.classList.add('hidden');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    let hasError = false;

    if (!username) {
        errorId.style.display = 'block';
        usernameInput.focus();
        hasError = true;
    }
    
    // Per requirements: If login button is pressed with empty fields, focus on the empty field. 
    // If username is empty, focus there. If username is filled but password empty, focus password.
    if (!username) {
        // already handled
    } else if (!password) {
        errorPw.style.display = 'block';
        passwordInput.focus();
        hasError = true;
    }

    if (hasError) return;

    // Login Attempt
    try {
        const result = await API.login(username, password, currentType);
        
        // Success
        localStorage.setItem('token', result.token);
        localStorage.setItem('userType', currentType);
        
        // Go back to previous page or index
        // Requirement: "Move to previous page"
        // Since we don't have robust routing history, we can default to index.html
        // or check document.referrer if it's same origin.
        window.location.href = '../../products/list/index.html';

    } catch (error) {
        // Requirement: "If ID/PW mismatch, focus password and clear it."
        if (error === 'FAIL_MISMATCH') {
            passwordInput.value = '';
            passwordInput.focus();
            loginFailMsg.classList.remove('hidden');
        }
    }
});

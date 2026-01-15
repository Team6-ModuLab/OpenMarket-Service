// js/common.js

function updateHeader() {
    const token = localStorage.getItem('access');
    const userType = localStorage.getItem('userType'); // 'BUYER' or 'SELLER'
    const rightMenu = document.querySelector('.user-menu');

    if (!rightMenu) return;

    rightMenu.innerHTML = ''; // Clear current menu

    if (token) {
        // Logged In
        if (userType === 'SELLER') {
             rightMenu.innerHTML = `
                <div class="user-menu-item" id="btn-mypage">
                    <img src="../../../shared/assets/icons/icon-user.svg" alt="마이페이지">
                    <span>마이페이지</span>
                    <div class="user-dropdown">
                        <button id="menu-mypage">마이페이지</button>
                        <button id="menu-logout">로그아웃</button>
                    </div>
                </div>
                <div class="user-menu-item" id="btn-seller-center" style="background-color: var(--color-primary); color: #fff; padding: 10px 20px; border-radius: 5px; flex-direction: row; gap: 5px; cursor: pointer;">
                    <img src="../../../shared/assets/icons/icon-shopping-cart.svg" style="filter: brightness(0) invert(1); width: 24px; height: 24px; margin:0;" alt="">
                    <span>판매자 센터</span>
                </div>
            `;
        } else {
             // BUYER
             rightMenu.innerHTML = `
                <div class="user-menu-item" id="btn-cart">
                    <img src="../../../shared/assets/icons/icon-shopping-cart.svg" alt="장바구니">
                    <span>장바구니</span>
                </div>
                 <div class="user-menu-item" id="btn-mypage">
                    <img src="../../../shared/assets/icons/icon-user.svg" alt="마이페이지">
                    <span>마이페이지</span>
                    <div class="user-dropdown">
                        <button id="menu-mypage">마이페이지</button>
                        <button id="menu-logout">로그아웃</button>
                    </div>
                </div>
            `;
            
            // Buyer Cart Click
            document.getElementById('btn-cart').addEventListener('click', () => {
                window.location.href = '../../cart/index.html';
            });
        }
        
        // Seller Center Click
        const btnSellerCenter = document.getElementById('btn-seller-center');
        if (btnSellerCenter) {
            btnSellerCenter.addEventListener('click', () => {
                window.location.href = '../../seller/seller-center/index.html';
            });
        }

        // Dropdown Logic
        const btnMyPage = document.querySelector('#btn-mypage');
        const dropdown = btnMyPage.querySelector('.user-dropdown');
        const btnLogout = dropdown.querySelector('#menu-logout');

        btnMyPage.addEventListener('click', (e) => {
             dropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!btnMyPage.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Logout
        btnLogout.addEventListener('click', () => {
             localStorage.removeItem('access');
             localStorage.removeItem('userType');
             alert('로그아웃 되었습니다.');
             window.location.href = '../../../index.html';
        });

    } else {
        // Not Logged In
        rightMenu.innerHTML = `
            <div class="user-menu-item" id="btn-cart-guest">
                <img src="../../../shared/assets/icons/icon-shopping-cart.svg" alt="장바구니">
                <span>장바구니</span>
            </div>
            <div class="user-menu-item" id="btn-login">
                <img src="../../../shared/assets/icons/icon-user.svg" alt="로그인">
                <span>로그인</span>
            </div>
        `;

        // Event Listeners for Guest
        document.getElementById('btn-login').addEventListener('click', () => {
            window.location.href = '../../auth/login/index.html';
        });

        document.getElementById('btn-cart-guest').addEventListener('click', () => {
             showLoginModal();
        });
    }
}

function showLoginModal() {
    // Check if modal exists
    let modal = document.getElementById('login-modal');
    if (!modal) {
        // Create modal
        const modalHTML = `
            <div id="login-modal" class="modal-overlay">
                <div class="modal-content">
                     <button class="close-btn">&times;</button>
                    <p>로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?</p>
                    <div class="modal-buttons">
                        <button class="btn-no">아니오</button>
                        <button class="btn-yes">예</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('login-modal');
        
        // Add CSS for modal dynamically if not present
        if (!document.getElementById('modal-css')) {
            const style = document.createElement('style');
            style.id = 'modal-css';
            style.textContent = `
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
                }
                .modal-content {
                    background: #fff; padding: 40px 60px; text-align: center; position: relative; border: 1px solid #c4c4c4;
                }
                .modal-content p { font-size: 16px; margin-bottom: 30px; line-height: 1.5; color: #333; }
                .close-btn { position: absolute; top: 10px; right: 10px; font-size: 24px; color: #767676; }
                .modal-buttons { display: flex; gap: 10px; justify-content: center; }
                .modal-buttons button { width: 100px; padding: 10px 0; border: 1px solid #c4c4c4; background: #fff; border-radius: 5px; font-weight: 500;}
                .modal-buttons .btn-yes { background: var(--color-primary); color: #fff; border: none; }
            `;
            document.head.appendChild(style);
        }

        // Logic
        modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.btn-no').addEventListener('click', () => modal.remove());
        modal.querySelector('.btn-yes').addEventListener('click', () => {
             window.location.href = '../../auth/login/index.html';
        });
    }
}

// Convert price to string with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Setup search functionality
function setupSearch(searchResultPath = '') {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!searchInput || !searchBtn) return;

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `${searchResultPath}?search=${encodeURIComponent(query)}`;
        } else {
            window.location.href = searchResultPath || 'index.html';
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
});

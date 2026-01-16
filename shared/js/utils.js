// 현재 페이지에서 pages 폴더까지의 상대 경로 계산
function getPagesBasePath() {
    const path = window.location.pathname;
    const match = path.match(/\/pages\/(.+)/);
    if (match) {
        const afterPages = match[1];
        const parts = afterPages.split('/');
        const folderCount = parts.length - 1;
        return '../'.repeat(folderCount);
    }
    return './';
}

// 아이콘 호버 효과 추가 함수
function addIconHoverEffect(element, defaultIcon, hoverIcon) {
    const img = element.querySelector('img.icon-default');
    if (!img) return;

    element.addEventListener('mouseenter', () => {
        img.src = hoverIcon;
    });

    element.addEventListener('mouseleave', () => {
        img.src = defaultIcon;
    });

    element.addEventListener('click', () => {
        img.src = hoverIcon;
    });
}

function updateHeader() {
    const token = localStorage.getItem('access');
    const userType = localStorage.getItem('userType');
    const rightMenu = document.querySelector('.user-menu');

    if (!rightMenu) return;

    rightMenu.innerHTML = '';

    if (token) {
        if (userType === 'SELLER') {
             rightMenu.innerHTML = `
                <div class="user-menu-item" id="btn-mypage">
                    <img src="../../../shared/assets/icons/icon-user.svg" alt="마이페이지" class="icon-default">
                    <span>마이페이지</span>
                    <div class="user-dropdown">
                        <button id="menu-mypage" disabled style="color:#999; cursor:not-allowed;">마이페이지</button>
                        <button id="menu-logout">로그아웃</button>
                    </div>
                </div>
                <div class="user-menu-item" id="btn-seller-center" style="background-color: var(--color-primary); color: #fff; padding: 10px 20px; border-radius: 5px; flex-direction: row; gap: 5px; cursor: pointer;">
                    <img src="../../../shared/assets/icons/icon-shopping-cart.svg" style="filter: brightness(0) invert(1); width: 24px; height: 24px; margin:0;" alt="" class="icon-default">
                    <span>판매자 센터</span>
                </div>
            `;

            const btnMyPage = document.getElementById('btn-mypage');
            addIconHoverEffect(
                btnMyPage,
                '../../../shared/assets/icons/icon-user.svg',
                '../../../shared/assets/icons/icon-user-2.svg'
            );

            const btnSellerCenter = document.getElementById('btn-seller-center');
            const sellerImg = btnSellerCenter.querySelector('img.icon-default');
            if (sellerImg) {
                btnSellerCenter.addEventListener('mouseenter', () => {
                    sellerImg.src = '../../../shared/assets/icons/icon-shopping-cart-2.svg';
                });
                btnSellerCenter.addEventListener('mouseleave', () => {
                    sellerImg.src = '../../../shared/assets/icons/icon-shopping-cart.svg';
                });
            }

        } else {
             rightMenu.innerHTML = `
                <div class="user-menu-item" id="btn-cart">
                    <img src="../../../shared/assets/icons/icon-shopping-cart.svg" alt="장바구니" class="icon-default">
                    <span>장바구니</span>
                </div>
                 <div class="user-menu-item" id="btn-mypage">
                    <img src="../../../shared/assets/icons/icon-user.svg" alt="마이페이지" class="icon-default">
                    <span>마이페이지</span>
                    <div class="user-dropdown">
                        <button id="menu-mypage">마이페이지</button>
                        <button id="menu-logout">로그아웃</button>
                    </div>
                </div>
            `;
            
            const btnCart = document.getElementById('btn-cart');
            addIconHoverEffect(
                btnCart,
                '../../../shared/assets/icons/icon-shopping-cart.svg',
                '../../../shared/assets/icons/icon-shopping-cart-2.svg'
            );

            const btnMyPage = document.getElementById('btn-mypage');
            addIconHoverEffect(
                btnMyPage,
                '../../../shared/assets/icons/icon-user.svg',
                '../../../shared/assets/icons/icon-user-2.svg'
            );
            
            btnCart.addEventListener('click', () => {
                window.location.href = `${getPagesBasePath()}cart/index.html`;
            });
        }
        
        const btnSellerCenter = document.getElementById('btn-seller-center');
        if (btnSellerCenter) {
            btnSellerCenter.addEventListener('click', () => {
                window.location.href = `${getPagesBasePath()}seller/seller-center/index.html`;
            });
        }

        const btnMyPage = document.querySelector('#btn-mypage');
        const dropdown = btnMyPage.querySelector('.user-dropdown');
        const btnMenuMyPage = dropdown.querySelector('#menu-mypage');
        const btnLogout = dropdown.querySelector('#menu-logout');

        btnMyPage.addEventListener('click', (e) => {
             dropdown.classList.toggle('show');
        });

        if (btnMenuMyPage) {
            btnMenuMyPage.addEventListener('click', () => {
                if (btnMenuMyPage.disabled) return;
                window.location.href = `${getPagesBasePath()}my/index.html`;
            });
        }

        document.addEventListener('click', (e) => {
            if (!btnMyPage.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        btnLogout.addEventListener('click', () => {
             AuthService.clearAuth();
             alert('로그아웃 되었습니다.');
             window.location.href = `${getPagesBasePath()}../index.html`;
        });

    } else {
        rightMenu.innerHTML = `
            <div class="user-menu-item" id="btn-cart-guest">
                <img src="../../../shared/assets/icons/icon-shopping-cart.svg" alt="장바구니" class="icon-default">
                <span>장바구니</span>
            </div>
            <div class="user-menu-item" id="btn-login">
                <img src="../../../shared/assets/icons/icon-user.svg" alt="로그인" class="icon-default">
                <span>로그인</span>
            </div>
        `;

        const btnCartGuest = document.getElementById('btn-cart-guest');
        addIconHoverEffect(
            btnCartGuest,
            '../../../shared/assets/icons/icon-shopping-cart.svg',
            '../../../shared/assets/icons/icon-shopping-cart-2.svg'
        );

        const btnLogin = document.getElementById('btn-login');
        addIconHoverEffect(
            btnLogin,
            '../../../shared/assets/icons/icon-user.svg',
            '../../../shared/assets/icons/icon-user-2.svg'
        );

        btnLogin.addEventListener('click', () => {
            window.location.href = `${getPagesBasePath()}auth/login/index.html`;
        });

        btnCartGuest.addEventListener('click', () => {
             showLoginModal();
        });
    }
}

function showLoginModal() {
    let modal = document.getElementById('login-modal');
    if (!modal) {
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

        modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.btn-no').addEventListener('click', () => modal.remove());
        modal.querySelector('.btn-yes').addEventListener('click', () => {
            localStorage.setItem('returnUrl', window.location.href);
            window.location.href = `${getPagesBasePath()}auth/login/index.html`;
        });
    }
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

document.addEventListener('DOMContentLoaded', async () => {
    // access 토큰 없고 refresh 토큰 있으면 자동 갱신 시도
    await AuthService.initAuth();
    updateHeader();
});
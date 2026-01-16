// ===== 상수 정의 =====
const PATHS = {
    ICONS: '../../../shared/assets/icons/',
    getIcon: (name) => `../../../shared/assets/icons/icon-${name}.svg`,
};

// ===== 유틸리티 함수 =====
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

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ===== 아이콘 관련 함수 =====
function addIconHoverEffect(element, iconName) {
    const img = element.querySelector('img.icon-default');
    if (!img) return;

    const defaultIcon = PATHS.getIcon(iconName);
    const hoverIcon = PATHS.getIcon(`${iconName}-2`);

    element.addEventListener('mouseenter', () => img.src = hoverIcon);
    element.addEventListener('mouseleave', () => img.src = defaultIcon);
    element.addEventListener('click', () => img.src = hoverIcon);
}

// ===== HTML 생성 함수 =====
function createMenuItem(id, iconName, text, additionalClasses = '') {
    return `
        <div class="user-menu-item ${additionalClasses}" id="${id}">
            <img src="${PATHS.getIcon(iconName)}" alt="${text}" class="icon-default">
            <span>${text}</span>
        </div>
    `;
}

function createMyPageDropdown(isSellerDisabled = false) {
    const disabledAttr = isSellerDisabled ? 'disabled style="color:#999; cursor:not-allowed;"' : '';
    return `
        <div class="user-dropdown">
            <button id="menu-mypage" ${disabledAttr}>마이페이지</button>
            <button id="menu-logout">로그아웃</button>
        </div>
    `;
}

// ===== 메뉴 생성 함수 (역할별 분리) =====
function createSellerMenu() {
    return `
        <div class="user-menu-item" id="btn-mypage">
            <img src="${PATHS.getIcon('user')}" alt="마이페이지" class="icon-default">
            <span>마이페이지</span>
            ${createMyPageDropdown(true)}
        </div>
        <div class="user-menu-item" id="btn-seller-center" 
             style="background-color: var(--color-primary); color: #fff; padding: 10px 20px; 
                    border-radius: 5px; flex-direction: row; gap: 5px; cursor: pointer;">
            <img src="${PATHS.getIcon('shopping-cart')}" 
                 style="filter: brightness(0) invert(1); width: 24px; height: 24px; margin:0;" 
                 alt="판매자 센터" class="icon-default">
            <span>판매자 센터</span>
        </div>
    `;
}

function createBuyerMenu() {
    return `
        ${createMenuItem('btn-cart', 'shopping-cart', '장바구니')}
        <div class="user-menu-item" id="btn-mypage">
            <img src="${PATHS.getIcon('user')}" alt="마이페이지" class="icon-default">
            <span>마이페이지</span>
            ${createMyPageDropdown(false)}
        </div>
    `;
}

function createGuestMenu() {
    return `
        ${createMenuItem('btn-cart-guest', 'shopping-cart', '장바구니')}
        ${createMenuItem('btn-login', 'user', '로그인')}
    `;
}

// ===== 이벤트 핸들러 설정 =====
function setupSellerMenuEvents() {
    const btnMyPage = document.getElementById('btn-mypage');
    const btnSellerCenter = document.getElementById('btn-seller-center');
    
    addIconHoverEffect(btnMyPage, 'user');
    setupMyPageDropdown(btnMyPage);
    
    // 판매자 센터 호버 효과
    const sellerImg = btnSellerCenter?.querySelector('img.icon-default');
    if (sellerImg) {
        btnSellerCenter.addEventListener('mouseenter', () => {
            sellerImg.src = PATHS.getIcon('shopping-cart-2');
        });
        btnSellerCenter.addEventListener('mouseleave', () => {
            sellerImg.src = PATHS.getIcon('shopping-cart');
        });
        btnSellerCenter.addEventListener('click', () => {
            window.location.href = `${getPagesBasePath()}seller/seller-center/index.html`;
        });
    }
}

function setupBuyerMenuEvents() {
    const btnCart = document.getElementById('btn-cart');
    const btnMyPage = document.getElementById('btn-mypage');
    
    addIconHoverEffect(btnCart, 'shopping-cart');
    addIconHoverEffect(btnMyPage, 'user');
    setupMyPageDropdown(btnMyPage);
    
    btnCart?.addEventListener('click', () => {
        window.location.href = `${getPagesBasePath()}cart/index.html`;
    });
}

function setupGuestMenuEvents() {
    const btnCartGuest = document.getElementById('btn-cart-guest');
    const btnLogin = document.getElementById('btn-login');
    
    addIconHoverEffect(btnCartGuest, 'shopping-cart');
    addIconHoverEffect(btnLogin, 'user');
    
    btnLogin?.addEventListener('click', () => {
        window.location.href = `${getPagesBasePath()}auth/login/index.html`;
    });
    
    btnCartGuest?.addEventListener('click', showLoginModal);
}

function setupMyPageDropdown(btnMyPage) {
    if (!btnMyPage) return;
    
    const dropdown = btnMyPage.querySelector('.user-dropdown');
    const btnMenuMyPage = dropdown?.querySelector('#menu-mypage');
    const btnLogout = dropdown?.querySelector('#menu-logout');
    
    btnMyPage.addEventListener('click', () => {
        dropdown?.classList.toggle('show');
    });
    
    btnMenuMyPage?.addEventListener('click', () => {
        if (!btnMenuMyPage.disabled) {
            window.location.href = `${getPagesBasePath()}my/index.html`;
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!btnMyPage.contains(e.target)) {
            dropdown?.classList.remove('show');
        }
    });
    
    btnLogout?.addEventListener('click', () => {
        AuthService.clearAuth();
        alert('로그아웃 되었습니다.');
        window.location.href = `${getPagesBasePath()}../index.html`;
    });
}

// ===== 메인 헤더 업데이트 함수 =====
function updateHeader() {
    const token = localStorage.getItem('access');
    const userType = localStorage.getItem('userType');
    const rightMenu = document.querySelector('.user-menu');

    if (!rightMenu) return;

    // 메뉴 HTML 생성
    if (token) {
        rightMenu.innerHTML = userType === 'SELLER' 
            ? createSellerMenu() 
            : createBuyerMenu();
    } else {
        rightMenu.innerHTML = createGuestMenu();
    }

    // 이벤트 설정
    if (token) {
        userType === 'SELLER' ? setupSellerMenuEvents() : setupBuyerMenuEvents();
    } else {
        setupGuestMenuEvents();
    }
}

// ===== 모달 관련 =====
function showLoginModal() {
    if (document.getElementById('login-modal')) return;
    
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
    injectModalStyles();
    setupModalEvents();
}

function injectModalStyles() {
    if (document.getElementById('modal-css')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-css';
    style.textContent = `
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; 
            justify-content: center; align-items: center; z-index: 1000;
        }
        .modal-content {
            background: #fff; padding: 40px 60px; text-align: center; 
            position: relative; border: 1px solid #c4c4c4;
        }
        .modal-content p { 
            font-size: 16px; margin-bottom: 30px; 
            line-height: 1.5; color: #333; 
        }
        .close-btn { 
            position: absolute; top: 10px; right: 10px; 
            font-size: 24px; color: #767676; 
        }
        .modal-buttons { display: flex; gap: 10px; justify-content: center; }
        .modal-buttons button { 
            width: 100px; padding: 10px 0; border: 1px solid #c4c4c4; 
            background: #fff; border-radius: 5px; font-weight: 500;
        }
        .modal-buttons .btn-yes { 
            background: var(--color-primary); color: #fff; border: none; 
        }
    `;
    document.head.appendChild(style);
}

function setupModalEvents() {
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    
    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.btn-no').addEventListener('click', () => modal.remove());
    modal.querySelector('.btn-yes').addEventListener('click', () => {
        localStorage.setItem('returnUrl', window.location.href);
        window.location.href = `${getPagesBasePath()}auth/login/index.html`;
    });
}

// ===== 검색 기능 =====
function setupSearch(searchResultPath = '') {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!searchInput || !searchBtn) return;

    const performSearch = () => {
        const query = searchInput.value.trim();
        const targetPath = query 
            ? `${searchResultPath}?search=${encodeURIComponent(query)}`
            : searchResultPath || 'index.html';
        window.location.href = targetPath;
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', async () => {
    await AuthService.initAuth();
    updateHeader();
});
let isDropdownClickListenerRegistered = false;

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

function getSharedBasePath() {
    return `${getPagesBasePath()}../shared/`;
}

function getIconPath(iconName) {
    return `${getSharedBasePath()}assets/icons/icon-${iconName}.svg`;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function navigateTo(route) {
    window.location.href = route;
}

function navigateToLogin(returnUrl = null) {
    if (returnUrl) {
        localStorage.setItem(STORAGE_KEYS.RETURN_URL, returnUrl);
    }
    navigateTo(`${getPagesBasePath()}auth/login/index.html`);
}

function addIconHoverEffect(element, iconName) {
    const img = element.querySelector('img.icon-default');
    if (!img) return;

    const defaultIcon = getIconPath(iconName);
    const hoverIcon = getIconPath(`${iconName}-2`);

    element.addEventListener('mouseenter', () => img.src = hoverIcon);
    element.addEventListener('mouseleave', () => img.src = defaultIcon);
    element.addEventListener('click', () => img.src = hoverIcon);
}

function createMenuItem(id, iconName, text, additionalClasses = '') {
    return `
        <div class="user-menu-item ${additionalClasses}" id="${id}">
            <img src="${getIconPath(iconName)}" alt="${text}" class="icon-default">
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

function createSellerMenu() {
    return `
        <div class="user-menu-item" id="btn-mypage">
            <img src="${getIconPath(ICON_NAMES.USER)}" alt="마이페이지" class="icon-default">
            <span>마이페이지</span>
            ${createMyPageDropdown(true)}
        </div>
        <div class="user-menu-item" id="btn-seller-center"
             style="background-color: var(--color-primary); color: #fff; padding: 10px 20px;
                    border-radius: 5px; flex-direction: row; gap: 5px; cursor: pointer;">
            <img src="${getIconPath(ICON_NAMES.SHOPPING_CART)}"
                 style="filter: brightness(0) invert(1); width: 24px; height: 24px; margin:0;"
                 alt="판매자 센터" class="icon-default">
            <span>판매자 센터</span>
        </div>
    `;
}

function createBuyerMenu() {
    return `
        ${createMenuItem('btn-cart', ICON_NAMES.SHOPPING_CART, '장바구니')}
        <div class="user-menu-item" id="btn-mypage">
            <img src="${getIconPath(ICON_NAMES.USER)}" alt="마이페이지" class="icon-default">
            <span>마이페이지</span>
            ${createMyPageDropdown(false)}
        </div>
    `;
}

function createGuestMenu() {
    return `
        ${createMenuItem('btn-cart-guest', ICON_NAMES.SHOPPING_CART, '장바구니')}
        ${createMenuItem('btn-login', ICON_NAMES.USER, '로그인')}
    `;
}

function setupSellerMenuEvents() {
    const btnMyPage = document.getElementById('btn-mypage');
    const btnSellerCenter = document.getElementById('btn-seller-center');

    addIconHoverEffect(btnMyPage, ICON_NAMES.USER);
    setupMyPageDropdown(btnMyPage);

    const sellerImg = btnSellerCenter?.querySelector('img.icon-default');
    if (sellerImg) {
        btnSellerCenter.addEventListener('mouseenter', () => {
            sellerImg.src = getIconPath(`${ICON_NAMES.SHOPPING_CART}-2`);
        });
        btnSellerCenter.addEventListener('mouseleave', () => {
            sellerImg.src = getIconPath(ICON_NAMES.SHOPPING_CART);
        });
        btnSellerCenter.addEventListener('click', () => {
            window.location.href = `${getPagesBasePath()}seller/seller-center/index.html`;
        });
    }
}

function setupBuyerMenuEvents() {
    const btnCart = document.getElementById('btn-cart');
    const btnMyPage = document.getElementById('btn-mypage');

    addIconHoverEffect(btnCart, ICON_NAMES.SHOPPING_CART);
    addIconHoverEffect(btnMyPage, ICON_NAMES.USER);
    setupMyPageDropdown(btnMyPage);

    btnCart?.addEventListener('click', () => {
        window.location.href = `${getPagesBasePath()}cart/index.html`;
    });
}

function setupGuestMenuEvents() {
    const btnCartGuest = document.getElementById('btn-cart-guest');
    const btnLogin = document.getElementById('btn-login');

    addIconHoverEffect(btnCartGuest, ICON_NAMES.SHOPPING_CART);
    addIconHoverEffect(btnLogin, ICON_NAMES.USER);

    btnLogin?.addEventListener('click', () => {
        window.location.href = `${getPagesBasePath()}auth/login/index.html`;
    });

    btnCartGuest?.addEventListener('click', () => {
        Modal.showLoginModal();
    });
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
            window.location.href = `${getPagesBasePath()}mypage/index.html`;
        }
    });

    if (!isDropdownClickListenerRegistered) {
        document.addEventListener('click', (e) => {
            const currentBtnMyPage = document.getElementById('btn-mypage');
            const currentDropdown = currentBtnMyPage?.querySelector('.user-dropdown');
            if (currentBtnMyPage && !currentBtnMyPage.contains(e.target)) {
                currentDropdown?.classList.remove('show');
            }
        });
        isDropdownClickListenerRegistered = true;
    }

    btnLogout?.addEventListener('click', () => {
        AuthService.clearAuth();
        alert('로그아웃 되었습니다.');
        window.location.href = `${getPagesBasePath()}products/list/index.html`;
    });
}

function updateHeader() {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
    const rightMenu = document.querySelector('.user-menu');

    if (!rightMenu) return;

    if (token) {
        rightMenu.innerHTML = userType === USER_TYPES.SELLER
            ? createSellerMenu()
            : createBuyerMenu();
    } else {
        rightMenu.innerHTML = createGuestMenu();
    }

    if (token) {
        userType === USER_TYPES.SELLER ? setupSellerMenuEvents() : setupBuyerMenuEvents();
    } else {
        setupGuestMenuEvents();
    }
}

function showLoginModal() {
    Modal.showLoginModal();
}

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

function getFooterHTML() {
    const sharedPath = getSharedBasePath() + 'assets/icons';

    return `
        <div class="footer-top">
            <div class="container footer-top-inner">
                <div class="footer-links">
                    <a href="#">호두샵 소개</a>
                    <span class="divider">|</span>
                    <a href="#">이용약관</a>
                    <span class="divider">|</span>
                    <a href="#" class="bold">개인정보처리방침</a>
                    <span class="divider">|</span>
                    <a href="#">전자금융거래약관</a>
                    <span class="divider">|</span>
                    <a href="#">청소년보호정책</a>
                    <span class="divider">|</span>
                    <a href="#">제휴문의</a>
                </div>
                <div class="social-icons">
                    <a href="#" aria-label="Instagram">
                        <img src="${sharedPath}/icon-${ICON_NAMES.INSTA}.svg" alt="Instagram">
                    </a>
                    <a href="#" aria-label="Facebook">
                        <img src="${sharedPath}/icon-${ICON_NAMES.FB}.svg" alt="Facebook">
                    </a>
                    <a href="#" aria-label="YouTube">
                        <img src="${sharedPath}/icon-${ICON_NAMES.YT}.svg" alt="YouTube">
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p class="company-name">(주)HODU SHOP</p>
                <address>
                    제주특별자치도 제주시 동광고 137 제주코딩베이스캠프<br>
                    사업자 번호 : 000-0000-0000 | 통신판매업<br>
                    대표 : 김호두
                </address>
            </div>
        </div>
    `;
}

function updateFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
        footer.innerHTML = getFooterHTML();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await AuthService.initAuth();
    updateHeader();
    updateFooter();
});
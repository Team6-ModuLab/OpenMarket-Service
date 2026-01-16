// Utils 모듈 (IIFE 패턴)
const Utils = (function() {
    // 아이콘 경로 상수 (private)
    const ICON_BASE_PATH = '../../../shared/assets/icons';
    const ICONS = {
        user: {
            default: `${ICON_BASE_PATH}/icon-user.svg`,
            hover: `${ICON_BASE_PATH}/icon-user-2.svg`
        },
        cart: {
            default: `${ICON_BASE_PATH}/icon-shopping-cart.svg`,
            hover: `${ICON_BASE_PATH}/icon-shopping-cart-2.svg`
        }
    };

    // 현재 페이지에서 pages 폴더까지의 상대 경로 계산 (private)
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

    // 헤더 메뉴 HTML 템플릿 (private)
    function getSellerMenuHTML() {
        return `
            <div class="user-menu-item" id="btn-mypage">
                <img src="${ICONS.user.default}" alt="마이페이지" class="icon-default">
                <span>마이페이지</span>
                <div class="user-dropdown">
                    <button id="menu-mypage" disabled style="color:#999; cursor:not-allowed;">마이페이지</button>
                    <button id="menu-logout">로그아웃</button>
                </div>
            </div>
            <div class="user-menu-item" id="btn-seller-center" style="background-color: var(--color-primary); color: #fff; padding: 10px 20px; border-radius: 5px; flex-direction: row; gap: 5px; cursor: pointer;">
                <img src="${ICONS.cart.default}" style="filter: brightness(0) invert(1); width: 24px; height: 24px; margin:0;" alt="" class="icon-default">
                <span>판매자 센터</span>
            </div>
        `;
    }

    function getBuyerMenuHTML() {
        return `
            <div class="user-menu-item" id="btn-cart">
                <img src="${ICONS.cart.default}" alt="장바구니" class="icon-default">
                <span>장바구니</span>
            </div>
            <div class="user-menu-item" id="btn-mypage">
                <img src="${ICONS.user.default}" alt="마이페이지" class="icon-default">
                <span>마이페이지</span>
                <div class="user-dropdown">
                    <button id="menu-mypage">마이페이지</button>
                    <button id="menu-logout">로그아웃</button>
                </div>
            </div>
        `;
    }

    function getGuestMenuHTML() {
        return `
            <div class="user-menu-item" id="btn-cart-guest">
                <img src="${ICONS.cart.default}" alt="장바구니" class="icon-default">
                <span>장바구니</span>
            </div>
            <div class="user-menu-item" id="btn-login">
                <img src="${ICONS.user.default}" alt="로그인" class="icon-default">
                <span>로그인</span>
            </div>
        `;
    }

    // 아이콘 호버 효과 추가 함수 (private)
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

    // 헤더 업데이트 (private)
    function updateHeader() {
        const token = localStorage.getItem('access');
        const userType = localStorage.getItem('userType');
        const rightMenu = document.querySelector('.user-menu');

        if (!rightMenu) return;

        rightMenu.innerHTML = '';

        if (token) {
            if (userType === 'SELLER') {
                rightMenu.innerHTML = getSellerMenuHTML();

                const btnMyPage = document.getElementById('btn-mypage');
                addIconHoverEffect(btnMyPage, ICONS.user.default, ICONS.user.hover);

                const btnSellerCenter = document.getElementById('btn-seller-center');
                const sellerImg = btnSellerCenter.querySelector('img.icon-default');
                if (sellerImg) {
                    btnSellerCenter.addEventListener('mouseenter', () => {
                        sellerImg.src = ICONS.cart.hover;
                    });
                    btnSellerCenter.addEventListener('mouseleave', () => {
                        sellerImg.src = ICONS.cart.default;
                    });
                }

            } else {
                rightMenu.innerHTML = getBuyerMenuHTML();

                const btnCart = document.getElementById('btn-cart');
                addIconHoverEffect(btnCart, ICONS.cart.default, ICONS.cart.hover);

                const btnMyPage = document.getElementById('btn-mypage');
                addIconHoverEffect(btnMyPage, ICONS.user.default, ICONS.user.hover);

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
                    window.location.href = `${getPagesBasePath()}mypage/index.html`;
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
            rightMenu.innerHTML = getGuestMenuHTML();

            const btnCartGuest = document.getElementById('btn-cart-guest');
            addIconHoverEffect(btnCartGuest, ICONS.cart.default, ICONS.cart.hover);

            const btnLogin = document.getElementById('btn-login');
            addIconHoverEffect(btnLogin, ICONS.user.default, ICONS.user.hover);

            btnLogin.addEventListener('click', () => {
                window.location.href = `${getPagesBasePath()}auth/login/index.html`;
            });

            btnCartGuest.addEventListener('click', () => {
                 showLoginModal();
            });
        }
    }

    // 로그인 모달 표시 (public)
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

    // 가격 포맷팅 (public)
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // 검색 설정 (public)
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

    // Footer HTML 템플릿 (private)
    function getFooterHTML() {
        const basePath = getPagesBasePath();
        const sharedPath = `${basePath}../shared/assets/icons`;

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
                            <img src="${sharedPath}/icon-insta.svg" alt="Instagram">
                        </a>
                        <a href="#" aria-label="Facebook">
                            <img src="${sharedPath}/icon-fb.svg" alt="Facebook">
                        </a>
                        <a href="#" aria-label="YouTube">
                            <img src="${sharedPath}/icon-yt.svg" alt="YouTube">
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

    // 푸터 업데이트 (private)
    function updateFooter() {
        const footer = document.getElementById('footer');
        if (footer) {
            footer.innerHTML = getFooterHTML();
        }
    }

    // 초기화
    function init() {
        document.addEventListener('DOMContentLoaded', async () => {
            await AuthService.initAuth();
            updateHeader();
            updateFooter();
        });
    }

    // 자동 초기화 실행
    init();

    // Public API
    return {
        formatPrice,
        showLoginModal,
        setupSearch
    };
})();

// 기존 코드 호환성을 위한 전역 함수 (deprecated)
const formatPrice = Utils.formatPrice;
const showLoginModal = Utils.showLoginModal;
const setupSearch = Utils.setupSearch;

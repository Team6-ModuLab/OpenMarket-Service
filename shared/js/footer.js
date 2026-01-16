// shared/js/footer.js

const Footer = {
    getFooterHTML() {
        // getPagesBasePath()는 utils.js에 정의되어 있음
        const basePath = typeof getPagesBasePath === 'function' ? getPagesBasePath() : './';
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
    },

    init() {
        const footer = document.getElementById('footer');
        if (footer) {
            footer.innerHTML = this.getFooterHTML();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Footer.init();
});

const Modal = {
    show(options) {
        const {
            id = 'modal',
            title = '',
            message = '',
            confirmText = '확인',
            cancelText = '취소',
            onConfirm = () => {},
            onCancel = () => {},
            showCancel = true
        } = options;

        if (document.getElementById(id)) return;

        const modalHTML = `
            <div id="${id}" class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close-btn">&times;</button>
                    ${title ? `<h3 class="modal-title">${title}</h3>` : ''}
                    <p class="modal-message">${message}</p>
                    <div class="modal-buttons">
                        ${showCancel ? `<button class="modal-btn modal-btn--cancel">${cancelText}</button>` : ''}
                        <button class="modal-btn modal-btn--confirm">${confirmText}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.injectStyles();
        this.bindEvents(id, onConfirm, onCancel);
    },

    hide(id = 'modal') {
        const modal = document.getElementById(id);
        if (modal) modal.remove();
    },

    showLoginModal() {
        this.show({
            id: 'login-modal',
            message: '로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?',
            confirmText: '예',
            cancelText: '아니오',
            onConfirm: () => {
                localStorage.setItem(STORAGE_KEYS.RETURN_URL, window.location.href);
                const basePath = typeof getPagesBasePath === 'function' ? getPagesBasePath() : './';
                window.location.href = `${basePath}auth/login/index.html`;
            }
        });
    },

    showDeleteModal(onConfirm, message = '상품을 삭제하시겠습니까?') {
        this.show({
            id: 'delete-modal',
            message: message,
            confirmText: '확인',
            cancelText: '취소',
            onConfirm
        });
    },

    showCartSuccessModal(isNewItem) {
        const message = isNewItem
            ? '장바구니에 상품을 담았습니다.<br>장바구니로 이동하시겠습니까?'
            : '이미 장바구니에 있는 상품입니다.<br>수량을 추가했습니다. 장바구니로 이동하시겠습니까?';

        this.show({
            id: 'cart-success-modal',
            message: message,
            confirmText: '예',
            cancelText: '아니오',
            onConfirm: () => {
                window.location.href = '../../cart/index.html';
            }
        });
    },

    showStockExceededModal() {
        this.show({
            id: 'stock-exceeded-modal',
            message: '재고 수량이 초과되었습니다.',
            confirmText: '확인',
            showCancel: false
        });
    },

    injectStyles() {
        if (document.getElementById('modal-base-css')) return;

        const style = document.createElement('style');
        style.id = 'modal-base-css';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: #fff;
                padding: 40px 60px;
                text-align: center;
                position: relative;
                border: 1px solid #c4c4c4;
                border-radius: 10px;
                min-width: 300px;
            }
            .modal-title {
                font-size: 18px;
                margin-bottom: 15px;
                color: #333;
                font-weight: 700;
            }
            .modal-message {
                font-size: 16px;
                margin-bottom: 30px;
                line-height: 1.5;
                color: #333;
            }
            .modal-close-btn {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 24px;
                color: #767676;
                background: none;
                border: none;
                cursor: pointer;
            }
            .modal-close-btn:hover {
                color: #333;
            }
            .modal-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            .modal-btn {
                min-width: 100px;
                padding: 10px 20px;
                border: 1px solid #c4c4c4;
                background: #fff;
                border-radius: 5px;
                font-weight: 500;
                cursor: pointer;
                font-size: 16px;
            }
            .modal-btn--confirm {
            background: var(--color-primary, #21bf48) !important;
            color: #fff !important;
            border: none !important;
            }
            .modal-btn--confirm:hover {
                background: #1ca73e;
            }
            .modal-btn--cancel:hover {
                background: #f5f5f5;
            }
        `;
        document.head.appendChild(style);
    },

    bindEvents(id, onConfirm, onCancel) {
        const modal = document.getElementById(id);
        if (!modal) return;

        const closeBtn = modal.querySelector('.modal-close-btn');
        const cancelBtn = modal.querySelector('.modal-btn--cancel');
        const confirmBtn = modal.querySelector('.modal-btn--confirm');

        const hide = () => this.hide(id);

        closeBtn?.addEventListener('click', () => { onCancel(); hide(); });
        cancelBtn?.addEventListener('click', () => { onCancel(); hide(); });
        confirmBtn?.addEventListener('click', () => { onConfirm(); hide(); });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                onCancel();
                hide();
            }
        });
    }
};

window.Modal = Modal;
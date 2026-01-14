// =============================================
// 장바구니 페이지 JavaScript
// =============================================

// 아이콘 경로 (교체 포인트)
const ICON_DELETE = '../../shared/assets/icons/icon-delete.svg';
const ICON_MINUS = '../../shared/assets/icons/minus-icon_2.png';
const ICON_PLUS = '../../shared/assets/icons/plus-icon_2.png';

// 장바구니 아이템 (API에서 가져온 상품 정보 + localStorage 수량)
let cartItems = [];

// DOM 요소
let deleteTargetId = null;

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
});

// localStorage에서 장바구니 데이터 로드 후 API로 상품 정보 가져오기
async function loadCartFromStorage() {
    const itemsContainer = document.getElementById('cart-items');

    // 로딩 표시
    itemsContainer.innerHTML = '<div class="cart-page__loading">장바구니를 불러오는 중...</div>';

    // localStorage에서 장바구니 데이터 읽기
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cartData.length === 0) {
        cartItems = [];
        renderCart();
        bindEvents();
        return;
    }

    try {
        // 각 상품 ID로 API 호출하여 상품 정보 가져오기
        const productPromises = cartData.map(async (cartItem) => {
            try {
                const product = await API.getProduct(cartItem.productId);
                return {
                    id: cartItem.productId,
                    seller: product.seller?.store_name || '판매자',
                    name: product.name,
                    price: product.price,
                    shippingFee: product.shipping_fee || 0,
                    shippingMethod: '택배배송',
                    quantity: cartItem.quantity,
                    image: product.image,
                    stock: product.stock || 0,
                    checked: true
                };
            } catch (error) {
                console.error(`상품 ${cartItem.productId} 로드 실패:`, error);
                return null;
            }
        });

        const results = await Promise.all(productPromises);
        cartItems = results.filter(item => item !== null);

        renderCart();
        bindEvents();
    } catch (error) {
        console.error('장바구니 로드 실패:', error);
        cartItems = [];
        renderCart();
        bindEvents();
    }
}

// localStorage에 장바구니 데이터 저장
function saveCartToStorage() {
    const cartData = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
    }));
    localStorage.setItem('cart', JSON.stringify(cartData));
}

// 장바구니 렌더링
function renderCart() {
    const itemsContainer = document.getElementById('cart-items');
    const emptyContainer = document.getElementById('cart-empty');
    const summaryContainer = document.getElementById('cart-summary');
    const orderBtnWrap = document.getElementById('order-btn-wrap');

    if (cartItems.length === 0) {
        // 빈 장바구니
        itemsContainer.innerHTML = '';
        emptyContainer.classList.remove('hidden');
        summaryContainer.classList.add('hidden');
        orderBtnWrap.classList.add('hidden');
    } else {
        // 상품 있는 장바구니
        emptyContainer.classList.add('hidden');
        summaryContainer.classList.remove('hidden');
        orderBtnWrap.classList.remove('hidden');

        itemsContainer.innerHTML = cartItems.map(item => createCartItemHTML(item)).join('');
        updateSummary();
        updateSelectAll();
    }
}

// 장바구니 아이템 HTML 생성
function createCartItemHTML(item) {
    const totalPrice = item.price * item.quantity;
    const shippingText = item.shippingFee === 0 ? '무료배송' : `${item.shippingMethod} / ${formatPrice(item.shippingFee)}원`;

    return `
        <div class="cart-page__item" data-id="${item.id}">
            <div class="cart-page__item-check">
                <label class="cart-page__checkbox">
                    <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${item.checked ? 'checked' : ''}>
                    <span class="cart-page__checkbox-custom"></span>
                </label>
            </div>
            <div class="cart-page__item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-page__item-image">
                <div class="cart-page__item-details">
                    <span class="cart-page__item-seller">${item.seller}</span>
                    <span class="cart-page__item-name">${item.name}</span>
                    <span class="cart-page__item-unit-price">${formatPrice(item.price)}원</span>
                    <span class="cart-page__item-shipping">${shippingText}</span>
                </div>
            </div>
            <div class="cart-page__item-quantity">
                <div class="cart-page__quantity-control">
                    <button class="cart-page__quantity-btn cart-page__quantity-btn--minus" data-id="${item.id}">
                        <img src="${ICON_MINUS}" alt="감소">
                    </button>
                    <span class="cart-page__quantity-value">${item.quantity}</span>
                    <button class="cart-page__quantity-btn cart-page__quantity-btn--plus" data-id="${item.id}" ${item.quantity >= item.stock ? 'disabled' : ''}>
                        <img src="${ICON_PLUS}" alt="증가">
                    </button>
                </div>
            </div>
            <div class="cart-page__item-price-wrap">
                <span class="cart-page__item-total-price">${formatPrice(totalPrice)}원</span>
                <button class="cart-page__item-order-btn" data-id="${item.id}">주문하기</button>
            </div>
            <button class="cart-page__item-delete" data-id="${item.id}">
                <img src="${ICON_DELETE}" alt="삭제">
            </button>
        </div>
    `;
}

// 이벤트 바인딩
function bindEvents() {
    const itemsContainer = document.getElementById('cart-items');
    const selectAllCheckbox = document.getElementById('select-all');
    const orderBtn = document.getElementById('order-btn');
    const deleteModal = document.getElementById('delete-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');

    // 전체 선택 체크박스
    selectAllCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        cartItems.forEach(item => item.checked = isChecked);

        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });

        updateSummary();
    });

    // 아이템 컨테이너 이벤트 위임
    itemsContainer.addEventListener('click', (e) => {
        const target = e.target;

        // 개별 체크박스
        if (target.classList.contains('item-checkbox')) {
            const id = target.dataset.id;
            const item = cartItems.find(i => String(i.id) === id);
            if (item) {
                item.checked = target.checked;
                updateSummary();
                updateSelectAll();
            }
            return;
        }

        // 수량 감소 버튼
        const minusBtn = target.closest('.cart-page__quantity-btn--minus');
        if (minusBtn) {
            const id = minusBtn.dataset.id;
            handleQuantityChange(id, -1);
            return;
        }

        // 수량 증가 버튼
        const plusBtn = target.closest('.cart-page__quantity-btn--plus');
        if (plusBtn && !plusBtn.disabled) {
            const id = plusBtn.dataset.id;
            handleQuantityChange(id, 1);
            return;
        }

        // 삭제 버튼
        const deleteBtn = target.closest('.cart-page__item-delete');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            showDeleteModal(id);
            return;
        }

        // 개별 주문 버튼
        const itemOrderBtn = target.closest('.cart-page__item-order-btn');
        if (itemOrderBtn) {
            const id = itemOrderBtn.dataset.id;
            const item = cartItems.find(i => String(i.id) === id);
            if (item) {
                console.log('개별 주문하기:', item);
                alert(`"${item.name}" 상품을 주문합니다.`);
            }
            return;
        }
    });

    // 하단 주문 버튼
    orderBtn.addEventListener('click', () => {
        const selectedItems = cartItems.filter(item => item.checked);
        if (selectedItems.length === 0) {
            alert('주문할 상품을 선택해주세요.');
            return;
        }
        console.log('선택 상품 주문하기:', selectedItems);
        alert(`${selectedItems.length}개 상품을 주문합니다.`);
    });

    // 모달 닫기
    modalClose.addEventListener('click', hideDeleteModal);
    modalCancel.addEventListener('click', hideDeleteModal);

    // 모달 확인 (삭제)
    modalConfirm.addEventListener('click', () => {
        if (deleteTargetId !== null) {
            deleteCartItem(deleteTargetId);
            hideDeleteModal();
        }
    });

    // 모달 외부 클릭 시 닫기
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            hideDeleteModal();
        }
    });
}

// 수량 변경
function handleQuantityChange(id, delta) {
    const item = cartItems.find(i => String(i.id) === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    if (newQuantity > item.stock) return;

    item.quantity = newQuantity;

    // localStorage 업데이트
    saveCartToStorage();

    // DOM 업데이트
    const itemEl = document.querySelector(`.cart-page__item[data-id="${id}"]`);
    if (itemEl) {
        const quantityValue = itemEl.querySelector('.cart-page__quantity-value');
        const totalPrice = itemEl.querySelector('.cart-page__item-total-price');
        const plusBtn = itemEl.querySelector('.cart-page__quantity-btn--plus');

        quantityValue.textContent = item.quantity;
        totalPrice.textContent = formatPrice(item.price * item.quantity) + '원';

        // 재고 제한 버튼 상태 업데이트
        plusBtn.disabled = item.quantity >= item.stock;
    }

    updateSummary();
}

// 삭제 모달 표시
function showDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('delete-modal').classList.remove('hidden');
}

// 삭제 모달 숨기기
function hideDeleteModal() {
    deleteTargetId = null;
    document.getElementById('delete-modal').classList.add('hidden');
}

// 장바구니 아이템 삭제
function deleteCartItem(id) {
    cartItems = cartItems.filter(item => String(item.id) !== id);
    saveCartToStorage();
    renderCart();
}

// 전체 선택 체크박스 상태 업데이트
function updateSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all');
    const allChecked = cartItems.length > 0 && cartItems.every(item => item.checked);
    selectAllCheckbox.checked = allChecked;
}

// 합계 업데이트
function updateSummary() {
    const selectedItems = cartItems.filter(item => item.checked);

    let totalProductPrice = 0;
    let totalShipping = 0;
    const totalDiscount = 0; // 현재 할인 기능 없음

    selectedItems.forEach(item => {
        totalProductPrice += item.price * item.quantity;
        totalShipping += item.shippingFee;
    });

    const totalPayment = totalProductPrice - totalDiscount + totalShipping;

    document.getElementById('total-product-price').innerHTML = formatPrice(totalProductPrice) + '<span class="cart-page__summary-unit">원</span>';
    document.getElementById('total-discount').innerHTML = formatPrice(totalDiscount) + '<span class="cart-page__summary-unit">원</span>';
    document.getElementById('total-shipping').innerHTML = formatPrice(totalShipping) + '<span class="cart-page__summary-unit">원</span>';
    document.getElementById('total-payment').innerHTML = formatPrice(totalPayment) + '<span class="cart-page__summary-unit">원</span>';
}

let cartItems = [];

let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
});

async function loadCartFromStorage() {
    const itemsContainer = document.getElementById('cart-items');

    itemsContainer.innerHTML = '<div class="cart-page__loading">장바구니를 불러오는 중...</div>';

    const cartData = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');

    if (cartData.length === 0) {
        cartItems = [];
        renderCart();
        bindEvents();
        return;
    }

    try {
        const productPromises = cartData.map(async (cartItem) => {
            try {
                const product = await API.getProduct(cartItem.productId);
                return {
                    id: cartItem.productId,
                    seller: product.seller?.store_name || '판매자',
                    name: product.name,
                    price: product.price,
                    shipping_fee: product.shipping_fee,
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

function saveCartToStorage() {
    const cartData = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
    }));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartData));
}

function renderCart() {
    const itemsContainer = document.getElementById('cart-items');
    const emptyContainer = document.getElementById('cart-empty');
    const summaryContainer = document.getElementById('cart-summary');
    const orderBtnWrap = document.getElementById('order-btn-wrap');

    if (cartItems.length === 0) {
        itemsContainer.innerHTML = '';
        emptyContainer.classList.remove('hidden');
        summaryContainer.classList.add('hidden');
        orderBtnWrap.classList.add('hidden');
    } else {
        emptyContainer.classList.add('hidden');
        summaryContainer.classList.remove('hidden');
        orderBtnWrap.classList.remove('hidden');

        itemsContainer.innerHTML = cartItems.map(item => createCartItemHTML(item)).join('');
        updateSummary();
        updateSelectAll();
    }
}

function createCartItemHTML(item) {
    const totalPrice = item.price * item.quantity;
    const shippingText = item.shipping_fee === 0 ? '무료배송' : `${item.shippingMethod} / ${formatPrice(item.shipping_fee)}원`;

    const iconDelete = getSharedBasePath() + 'assets/icons/icon-delete.svg';
    const iconMinus = getSharedBasePath() + 'assets/icons/minus-icon_2.png';
    const iconPlus = getSharedBasePath() + 'assets/icons/plus-icon_2.png';

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
                        <img src="${iconMinus}" alt="감소">
                    </button>
                    <span class="cart-page__quantity-value">${item.quantity}</span>
                    <button class="cart-page__quantity-btn cart-page__quantity-btn--plus" data-id="${item.id}" ${item.quantity >= item.stock ? 'disabled' : ''}>
                        <img src="${iconPlus}" alt="증가">
                    </button>
                </div>
            </div>
            <div class="cart-page__item-price-wrap">
                <span class="cart-page__item-total-price">${formatPrice(totalPrice)}원</span>
                <button class="cart-page__item-order-btn" data-id="${item.id}">주문하기</button>
            </div>
            <button class="cart-page__item-delete" data-id="${item.id}">
                <img src="${iconDelete}" alt="삭제">
            </button>
        </div>
    `;
}

function bindEvents() {
    const itemsContainer = document.getElementById('cart-items');
    const selectAllCheckbox = document.getElementById('select-all');
    const orderBtn = document.getElementById('order-btn');
    const deleteModal = document.getElementById('delete-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');

    selectAllCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        cartItems.forEach(item => item.checked = isChecked);

        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });

        updateSummary();
    });

    itemsContainer.addEventListener('click', (e) => {
        const target = e.target;

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

        const minusBtn = target.closest('.cart-page__quantity-btn--minus');
        if (minusBtn) {
            const id = minusBtn.dataset.id;
            handleQuantityChange(id, -1);
            return;
        }

        const plusBtn = target.closest('.cart-page__quantity-btn--plus');
        if (plusBtn && !plusBtn.disabled) {
            const id = plusBtn.dataset.id;
            handleQuantityChange(id, 1);
            return;
        }

        const deleteBtn = target.closest('.cart-page__item-delete');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            showDeleteModal(id);
            return;
        }

        const itemOrderBtn = target.closest('.cart-page__item-order-btn');
        if (itemOrderBtn) {
            const id = itemOrderBtn.dataset.id;
            const item = cartItems.find(i => String(i.id) === id);
            if (item) {
                const orderData = {
                    order_kind: 'direct_order',
                    product_id: item.id,
                    quantity: item.quantity,
                    item_info: item
                };
                localStorage.setItem(STORAGE_KEYS.ORDER_DATA, JSON.stringify(orderData));
                window.location.href = '../order/index.html';
            }
            return;
        }
    });

    orderBtn.addEventListener('click', () => {
        const selectedItems = cartItems.filter(item => item.checked);
        if (selectedItems.length === 0) {
            alert('주문할 상품을 선택해주세요.');
            return;
        }

        if (selectedItems.length === 1) {
            const item = selectedItems[0];
            const orderData = {
                order_kind: 'direct_order',
                product_id: item.id,
                quantity: item.quantity,
                item_info: item
            };
            localStorage.setItem(STORAGE_KEYS.ORDER_DATA, JSON.stringify(orderData));
            window.location.href = '../order/index.html';
            return;
        }

        const allItemIds = [];
        selectedItems.forEach(item => {
            for (let k = 0; k < item.quantity; k++) {
                allItemIds.push(item.id);
            }
        });

        const orderData = {
            order_kind: 'cart_order',
            cart_items: allItemIds,
            items_info: selectedItems
        };

        localStorage.setItem(STORAGE_KEYS.ORDER_DATA, JSON.stringify(orderData));
        window.location.href = '../order/index.html';
    });

    modalClose.addEventListener('click', hideDeleteModal);
    modalCancel.addEventListener('click', hideDeleteModal);

    modalConfirm.addEventListener('click', () => {
        if (deleteTargetId !== null) {
            deleteCartItem(deleteTargetId);
            hideDeleteModal();
        }
    });

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            hideDeleteModal();
        }
    });
}

function handleQuantityChange(id, delta) {
    const item = cartItems.find(i => String(i.id) === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    if (newQuantity > item.stock) return;

    item.quantity = newQuantity;

    saveCartToStorage();

    const itemEl = document.querySelector(`.cart-page__item[data-id="${id}"]`);
    if (itemEl) {
        const quantityValue = itemEl.querySelector('.cart-page__quantity-value');
        const totalPrice = itemEl.querySelector('.cart-page__item-total-price');
        const plusBtn = itemEl.querySelector('.cart-page__quantity-btn--plus');

        quantityValue.textContent = item.quantity;
        totalPrice.textContent = formatPrice(item.price * item.quantity) + '원';

        plusBtn.disabled = item.quantity >= item.stock;
    }

    updateSummary();
}

function showDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('delete-modal').classList.remove('hidden');
}

function hideDeleteModal() {
    deleteTargetId = null;
    document.getElementById('delete-modal').classList.add('hidden');
}

function deleteCartItem(id) {
    cartItems = cartItems.filter(item => String(item.id) !== id);
    saveCartToStorage();
    renderCart();
}

function updateSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all');
    const allChecked = cartItems.length > 0 && cartItems.every(item => item.checked);
    selectAllCheckbox.checked = allChecked;
}

function updateSummary() {
    const selectedItems = cartItems.filter(item => item.checked);

    let totalProductPrice = 0;
    let totalShipping = 0;
    const totalDiscount = 0;

    selectedItems.forEach(item => {
        totalProductPrice += item.price * item.quantity;
        totalShipping += item.shipping_fee;
    });

    const totalPayment = totalProductPrice - totalDiscount + totalShipping;

    document.getElementById('total-product-price').innerHTML = formatPrice(totalProductPrice) + '<span class="cart-page__summary-unit">원</span>';
    document.getElementById('total-discount').innerHTML = formatPrice(totalDiscount) + '<span class="cart-page__summary-unit">원</span>';
    document.getElementById('total-shipping').innerHTML = formatPrice(totalShipping) + '<span class="cart-page__summary-unit">원</span>';
    document.getElementById('total-payment').innerHTML = formatPrice(totalPayment) + '<span class="cart-page__summary-unit">원</span>';
}
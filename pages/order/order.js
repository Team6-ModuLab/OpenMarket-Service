// =============================================
// order.js - 주문/결제 페이지
// =============================================

let orderData = null;

document.addEventListener('DOMContentLoaded', () => {
    loadOrderData();
    loadUserInfo();
    setupModalListeners();
    console.log(localStorage);
});

function setupModalListeners() {
    // 결제하기 버튼 (모달 표시)
    document.getElementById('btn-pay').addEventListener('click', () => {
        // 1. 유효성 검사
        if (!validateOrderForm()) {
            return;
        }

        // 2. 모달에 금액 정보 표시
        updateModalPrices();

        // 3. 모달 표시
        showPaymentModal();
    });

    // 모달 외부 클릭 시 닫기
    document.getElementById('payment-confirm-modal').addEventListener('click', (e) => {
        if (e.target.id === 'payment-confirm-modal') {
            hidePaymentModal();
        }
    });

    // 모달의 결제하기 버튼 (실제 결제 처리)
    document.getElementById('btn-modal-pay').addEventListener('click', async () => {
        await processPayment();
    });
}

function loadUserInfo() {
    const buyerName = localStorage.getItem(STORAGE_KEYS.BUYER_NAME);

    if (buyerName) {
        // 주문자 정보에 자동 입력
        const ordererNameInput = document.getElementById('orderer-name');
        if (ordererNameInput) {
            ordererNameInput.value = buyerName;
        }

        // 수령인 정보에도 자동 입력
        const receiverNameInput = document.getElementById('receiver-name');
        if (receiverNameInput) {
            receiverNameInput.value = buyerName;
        }
    }
}

function loadOrderData() {
    const data = localStorage.getItem(STORAGE_KEYS.ORDER_DATA);

    if (!data) {
        alert('주문 정보가 없습니다. 메인 페이지로 이동합니다.');
        window.location.href = '../list/index.html';
        return;
    }

    try {
        orderData = JSON.parse(data);
        console.log(orderData);
        renderOrderItems();
    } catch (e) {
        console.error('주문 정보 파싱 오류:', e);
        alert('주문 정보가 손상되었습니다. 다시 시도해주세요.');
        window.location.href = '../list/index.html';
    }
}

// 주문 상품 렌더링
function renderOrderItems() {
    const listContainer = document.getElementById('order-items-list');
    let itemsInfo = [];

    if (orderData.order_kind === 'direct_order') {
        itemsInfo = [orderData.item_info];
    } else if (orderData.order_kind === 'cart_order') {
        itemsInfo = orderData.items_info;
    }

    if (!itemsInfo || itemsInfo.length === 0) {
        listContainer.innerHTML = '<p style="padding:20px; text-align:center;">주문할 상품이 없습니다.</p>';
        return;
    }

    let totalProductPrice = 0;
    let totalShippingFee = 0;

    const itemsHTML = itemsInfo.map(item => {
        const rawQuantity = item.quantity || orderData.quantity;
        const quantity = Number(rawQuantity);

        const price = Number(item.price);
        const shippingFee = Number(item.shipping_fee);

        // 상품 금액 합계
        const itemTotalPrice = price * quantity;
        totalProductPrice += itemTotalPrice;

        // 배송비 (개별 배송비 가정)
        totalShippingFee += shippingFee;

        return `
            <div class="order-item">
                <div class="col-info">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <span class="item-seller">${item.seller || item.store_name}</span>
                        <span class="item-name">${item.name}</span>
                        <span class="item-qty">수량: ${quantity}개</span>
                    </div>
                </div>
                <div class="col-discount">-</div>
                <div class="col-shipping">${shippingFee > 0 ? formatPrice(shippingFee) + '원' : '무료배송'}</div>
                <div class="col-price">${formatPrice(itemTotalPrice + shippingFee)}원</div>
            </div>
        `;
    }).join('');

    listContainer.innerHTML = itemsHTML;

    // 하단 금액 업데이트
    document.getElementById('total-order-price').innerText = formatPrice(totalProductPrice + totalShippingFee) + '원';

    updateFinalPaymentSummary(totalProductPrice, totalShippingFee);
}

// 최종 금액 업데이트
function updateFinalPaymentSummary(productPrice, shippingFee) {
    const totalPrice = productPrice + shippingFee;

    document.getElementById('final-product-price').innerText = formatPrice(productPrice) + '원';
    document.getElementById('final-discount').innerText = '0원';
    document.getElementById('final-shipping').innerText = formatPrice(shippingFee) + '원';
    document.getElementById('final-total-price').innerText = formatPrice(totalPrice) + '원';

    orderData._totalPrice = totalPrice;
}

function validateOrderForm() {
    // 주문자 정보 유효성 검사
    const ordererName = document.getElementById('orderer-name').value.trim();
    const ordererPhone2 = document.getElementById('orderer-phone-2').value.trim();
    const ordererPhone3 = document.getElementById('orderer-phone-3').value.trim();
    const ordererEmail = document.getElementById('orderer-email').value.trim();

    if (!ordererName) {
        alert('주문자 이름을 입력해주세요.');
        return false;
    }
    if (!ordererPhone2 || !ordererPhone3) {
        alert('주문자 휴대폰 번호를 입력해주세요.');
        return false;
    }
    if (!ordererEmail) {
        alert('주문자 이메일을 입력해주세요.');
        return false;
    }

    // 배송지 정보 유효성 검사
    const receiverName = document.getElementById('receiver-name').value.trim();
    const phone2 = document.getElementById('phone-2').value.trim();
    const phone3 = document.getElementById('phone-3').value.trim();
    const address1 = document.getElementById('address-1').value.trim();
    const address2 = document.getElementById('address-2').value.trim();
    const agree = document.getElementById('agree-all').checked;

    if (!receiverName) {
        alert('수령인 이름을 입력해주세요.');
        return false;
    }
    if (!phone2 || !phone3) {
        alert('수령인 휴대폰 번호를 입력해주세요.');
        return false;
    }
    if (!address1 || !address2) {
        alert('배송지 주소를 모두 입력해주세요.');
        return false;
    }
    if (!agree) {
        alert('구매 조건 확인 및 결제 진행에 동의해주세요.');
        return false;
    }

    return true;
}

function updateModalPrices() {
    const productPrice = document.getElementById('final-product-price').innerText;
    const discount = document.getElementById('final-discount').innerText;
    const shipping = document.getElementById('final-shipping').innerText;
    const totalPrice = document.getElementById('final-total-price').innerText;

    document.getElementById('modal-product-price').innerText = productPrice;
    document.getElementById('modal-discount').innerText = discount;
    document.getElementById('modal-shipping').innerText = shipping;
    document.getElementById('modal-total-price').innerText = totalPrice;
}

function showPaymentModal() {
    const modal = document.getElementById('payment-confirm-modal');
    modal.classList.remove('hidden');
}

function hidePaymentModal() {
    const modal = document.getElementById('payment-confirm-modal');
    modal.classList.add('hidden');
}

// 실제 결제 처리 함수
async function processPayment() {
    // 모달 닫기
    hidePaymentModal();

    // 데이터 수집
    const ordererPhone1 = document.getElementById('orderer-phone-1').value.trim();
    const ordererPhone2 = document.getElementById('orderer-phone-2').value.trim();
    const ordererPhone3 = document.getElementById('orderer-phone-3').value.trim();
    const phone1 = document.getElementById('phone-1').value.trim();
    const phone2 = document.getElementById('phone-2').value.trim();
    const phone3 = document.getElementById('phone-3').value.trim();
    const address1 = document.getElementById('address-1').value.trim();
    const address2 = document.getElementById('address-2').value.trim();
    const zipCode = document.getElementById('zip-code').value.trim();
    const message = document.getElementById('delivery-message').value.trim();
    const receiverName = document.getElementById('receiver-name').value.trim();
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    const ordererPhoneNumber = `${ordererPhone1}${ordererPhone2}${ordererPhone3}`;
    const receiverPhoneNumber = `${phone1}${phone2}${phone3}`;
    const fullAddress = `${address1} ${address2} [${zipCode}]`;
    const ordererName = document.getElementById('orderer-name').value.trim();
    const ordererEmail = document.getElementById('orderer-email').value.trim();

    const commonPayload = {
        receiver: receiverName,
        receiver_phone_number: receiverPhoneNumber,
        address: fullAddress,
        delivery_message: message || '배송 전 연락바랍니다.',
        payment_method: paymentMethod,
    };

    try {
        let results = [];

        if (orderData.order_kind === 'direct_order') {
            // 단일 상품 직접 주문
            const payload = {
                ...commonPayload,
                order_type: 'direct_order',
                product: orderData.product_id,
                quantity: orderData.quantity,
                total_price: orderData._totalPrice
            };
            const res = await API.createOrder(payload);
            results.push(res);
        } else {
            // 장바구니 주문 (다중 상품)
            const promises = orderData.items_info.map(item => {
                const quantity = Number(item.quantity);
                const price = Number(item.price);
                const shipping = Number(item.shipping_fee);
                const itemTotal = (price * quantity) + shipping;

                const payload = {
                    ...commonPayload,
                    order_type: 'direct_order',
                    product: item.id,
                    quantity: quantity,
                    total_price: itemTotal
                };
                return API.createOrder(payload);
            });

            results = await Promise.all(promises);
        }

        // 결과 처리
        const failedOrders = results.filter(r => !r.success);

        if (failedOrders.length === 0) {
            alert('모든 주문이 정상적으로 처리되었습니다.');

            if (orderData.order_kind === 'cart_order') {
                removePurchasedItemsFromCart(orderData.cart_items);
            } else if (orderData.order_kind === 'direct_order') {
                removePurchasedItemsFromCart([orderData.product_id]);
            }

            localStorage.removeItem(STORAGE_KEYS.ORDER_DATA);
            window.location.href = '../../index.html';
        } else {
            console.error('일부 또는 전체 주문 실패:', failedOrders);
            alert(`총 ${results.length}건 중 ${failedOrders.length}건의 주문 처리에 실패했습니다.\n첫 번째 오류: ${JSON.stringify(failedOrders[0].data)}`);
        }

    } catch (error) {
        console.error('주문 요청 중 오류:', error);
        alert('시스템 오류가 발생했습니다.');
    }
}

function removePurchasedItemsFromCart(purchasedIds) {
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');

    const idSet = new Set(purchasedIds.map(id => String(id)));
    cart = cart.filter(item => !idSet.has(String(item.productId)));

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

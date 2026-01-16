
// =============================================
// 주문 페이지 JavaScript
// =============================================

let orderData = null;

document.addEventListener('DOMContentLoaded', () => {
    loadOrderData();
});

// localStorage에서 주문 데이터 로드
function loadOrderData() {
    const data = localStorage.getItem('order_data');

    if (!data) {
        alert('주문 정보가 없습니다. 메인 페이지로 이동합니다.');
        window.location.href = '../list/index.html';
        return;
    }

    try {
        orderData = JSON.parse(data);
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

    // direct_order와 cart_order를 모두 items_info 배열로 통일하여 처리
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
        // direct_order는 quantity가 최상위에 있지만, cart_order의 items_info 내 item은 quantity를 가짐.
        // direct_order의 경우 item_info에 quantity가 없으므로 orderData.quantity 사용
        const rawQuantity = item.quantity || orderData.quantity;
        const quantity = Number(rawQuantity); 
        
        const price = Number(item.price);
        const shippingFee = Number(item.shipping_fee || item.shippingFee || 0);

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
    // 할인 기능이 있다면 여기서 계산
    document.getElementById('final-shipping').innerText = formatPrice(shippingFee) + '원';
    document.getElementById('final-total-price').innerText = formatPrice(totalPrice) + '원';

    // 전역 변수나 dataset에 저장해둘 수도 있음 (필요 시)
    orderData._totalPrice = totalPrice;
}


// 결제 버튼 핸들러
document.getElementById('btn-pay').addEventListener('click', async () => {
    // 1. 유효성 검사
    const receiverName = document.getElementById('receiver-name').value.trim();
    const phone1 = document.getElementById('phone-1').value.trim();
    const phone2 = document.getElementById('phone-2').value.trim();
    const phone3 = document.getElementById('phone-3').value.trim();
    const address1 = document.getElementById('address-1').value.trim();
    const address2 = document.getElementById('address-2').value.trim();
    const zipCode = document.getElementById('zip-code').value.trim();
    const message = document.getElementById('delivery-message').value.trim();
    const agree = document.getElementById('agree-all').checked;

    if (!receiverName) return alert('수령인 이름을 입력해주세요.');
    if (!phone2 || !phone3) return alert('휴대폰 번호를 입력해주세요.');
    if (!address1 || !address2) return alert('배송지 주소를 모두 입력해주세요.');
    if (!agree) return alert('구매 조건 확인 및 결제 진행에 동의해주세요.');

    // 2. 데이터 구성
    const phoneNumber = `${phone1}${phone2}${phone3}`; // 하이픈 제거 (11자 제한 대응)
    const fullAddress = `${address1} ${address2} [${zipCode}]`;
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

    // commonPayload: 공통 배송/결제 정보
    const commonPayload = {
        receiver: receiverName,
        receiver_phone_number: phoneNumber,
        address: fullAddress,
        delivery_message: message || '배송 전 연락바랍니다.',
        payment_method: paymentMethod,
        // total_price, order_type 등은 개별 요청마다 다를 수 있음
    };

    try {
        let results = [];
        
        if (orderData.order_kind === 'direct_order') {
            // 1. 단일 상품 직접 주문
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
            // 2. 장바구니 주문 (다중 상품)
            // 서버 스펙상 cart_order는 서버 카트에 담긴 상품만 주문 가능함.
            // 현재 클라이언트 사이드 카트를 사용 중이므로, 
            // 다중 상품 주문 시 'direct_order'를 병렬로 여러 번 호출하는 방식으로 처리.
            
            const promises = orderData.items_info.map(item => {
                const quantity = Number(item.quantity);
                const price = Number(item.price);
                const shipping = Number(item.shipping_fee || item.shippingFee || 0);
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
            
            // 주문 성공 후 처리: 카트 비우기
            // cart_order뿐만 아니라 direct_order(바로구매)도 카트에 해당 상품이 있다면 제거
            if (orderData.order_kind === 'cart_order') {
                removePurchasedItemsFromCart(orderData.cart_items);
            } else if (orderData.order_kind === 'direct_order') {
                removePurchasedItemsFromCart([orderData.product_id]);
            }
            
            localStorage.removeItem('order_data');
            window.location.href = '../../index.html';
        } else {
            console.error('일부 또는 전체 주문 실패:', failedOrders);
            alert(`총 ${results.length}건 중 ${failedOrders.length}건의 주문 처리에 실패했습니다.\n첫 번째 오류: ${JSON.stringify(failedOrders[0].data)}`);
            // 실패 시 로직은 복잡해질 수 있으나(부분 환불 등), 현재는 알림만 제공
        }

    } catch (error) {
        console.error('주문 요청 중 오류:', error);
        alert('시스템 오류가 발생했습니다.');
    }
});

// 카트에서 구매한 아이템 제거
function removePurchasedItemsFromCart(purchasedIds) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // ID 비교 시 형변환(String)하여 안전하게 처리
    const idSet = new Set(purchasedIds.map(id => String(id)));
    
    // idSet에 없는 것만 남김
    cart = cart.filter(item => !idSet.has(String(item.productId)));
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

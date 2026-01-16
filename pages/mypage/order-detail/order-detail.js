// order-detail.js

document.addEventListener('DOMContentLoaded', async () => {
    // Get Order ID from URL
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');

    if (!orderId) {
        alert('잘못된 접근입니다.');
        window.location.href = '../index.html';
        return;
    }

    const container = document.getElementById('order-detail-container');

    try {
        const order = await API.getOrder(orderId);
        console.log('Order Detail:', order);

        // Render strict strict API fields
        // {
        //     "id": Int,
        //     "order_number": String,
        //     "payment_method": ...,
        //     "order_status": ...,
        //     "order_type": ...,
        //     "total_price": Int,
        //     "order_items": [...],
        //     "receiver": String,
        //     "receiver_phone_number": String,
        //     "address": String,
        //     "delivery_message": String | null,
        //     "created_at": Time
        // }

        const date = new Date(order.created_at).toLocaleString();
        const totalPrice = order.total_price.toLocaleString();
        
        const statusMap = {
            'card': '신용카드',
            'deposit': '무통장입금',
            'phone': '휴대폰결제',
            'naverpay': '네이버페이',
            'kakaopay': '카카오페이',
            'payment_pending': '입금 확인 중',
            'payment_complete': '결제 완료',
            'preparing': '배송 준비 중',
            'shipping': '배송 중',
            'delivered': '배송 완료',
            'delivered': '배송 완료',
            'cancled': '주문 취소',
            'cancelled': '주문 취소' // Include correct spelling just in case
        };

        const paymentMethod = statusMap[order.payment_method] || order.payment_method;
        const status = statusMap[order.order_status] || order.order_status;

        // Render Items
        let itemsHtml = '';
        if (order.order_items && order.order_items.length > 0) {
            order.order_items.forEach(item => {
                const product = item.product;
                const productName = product.product_name || product.name || '상품명 없음';
                // Note: API spec for Product object isn't fully detailed here but usually contain image/name
                const imgSrc = product.image || '../../../shared/assets/icons/icon-image.png';
                const quantity = item.ordered_quantity;
                const unitPrice = item.ordered_unit_price.toLocaleString();
                const itemTotal = item.item_total_price.toLocaleString();
                const shippingFee = item.ordered_shipping_fee.toLocaleString();

                itemsHtml += `
                    <div class="item-row">
                        <img src="${imgSrc}" alt="${productName}" class="item-img">
                        <div class="item-info">
                            <span class="item-name">${productName}</span>
                            <div class="item-price-calc">
                                ${unitPrice}원 × ${quantity}개 + 배송비 ${shippingFee}원
                            </div>
                        </div>
                        <div class="item-total">${itemTotal}원</div>
                    </div>
                `;
            });
        } else {
            itemsHtml = '<div class="item-row">주문 상품 정보가 없습니다.</div>';
        }

        container.innerHTML = `
            <section>
                <div class="section-title">주문 정보</div>
                <table class="info-table">
                    <tr>
                        <th>주문번호</th>
                        <td>${order.order_number}</td>
                    </tr>
                    <tr>
                        <th>주문일시</th>
                        <td>${date}</td>
                    </tr>
                    <tr>
                        <th>주문상태</th>
                        <td>${status}</td>
                    </tr>
                </table>
            </section>

            <section>
                <div class="section-title">주문 상품</div>
                <div class="items-list">
                    ${itemsHtml}
                </div>
            </section>

            <section>
                <div class="section-title">배송지 정보</div>
                <table class="info-table">
                <div class="section-title">배송지 정보</div>
                <table class="info-table">
                    <tr>
                        <th>수령인</th>
                        <td>${order.receiver}</td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td>${order.receiver_phone_number}</td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td>${order.address}</td>
                    </tr>
                    <tr>
                        <th>배송메세지</th>
                        <td>${order.delivery_message || '-'}</td>
                    </tr>
                </table>
            </section>

            <section>
                <div class="section-title">결제 정보</div>
                <table class="info-table">
                    <tr>
                        <th>결제수단</th>
                        <td>${paymentMethod}</td>
                    </tr>
                    <tr>
                        <th>총 결제금액</th>
                        <td><strong style="font-size: 24px; color: #EB5757;">${totalPrice}원</strong></td>
                    </tr>
                </table>
            </section>
        `;

    } catch (error) {
        console.error('Failed to load order detail:', error);
        container.innerHTML = `<div class="loading">주문 정보를 불러오는데 실패했습니다.<br>${error.detail || error.message}</div>`;
    }
});

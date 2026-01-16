// =============================================
// mypage.js - 마이페이지
// =============================================

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Login
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);

    if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        window.location.href = '../auth/login/index.html';
        return;
    }

    // 2. Display User ID
    const buyerName = localStorage.getItem(STORAGE_KEYS.BUYER_NAME) || '고객';
    const userIdEl = document.getElementById('user-id');
    if (userIdEl) userIdEl.textContent = buyerName;

    // 3. Fetch Orders
    const orderListContainer = document.getElementById('order-list');

    try {
        const orderData = await API.getOrders();
        console.log('My Orders:', orderData);

        const orders = orderData.results ? orderData.results : [];

        orderListContainer.innerHTML = '';

        if (orders.length === 0) {
            orderListContainer.innerHTML = '<div class="loading">주문 내역이 없습니다.</div>';
            return;
        }

        // Render Orders
        orders.forEach(order => {
            // Filter out cancelled orders
            const status = order.order_status;
            if (status === ORDER_STATUS.CANCELLED || status === 'cancelled') return;

            const card = document.createElement('div');
            card.className = 'order-card';

            // Format Date
            const date = new Date(order.created_at).toLocaleDateString();
            const totalPrice = order.total_price.toLocaleString();

            // Construct Items Preview
            let itemsHtml = '';

            if (order.order_items && order.order_items.length > 0) {
                order.order_items.forEach(item => {
                    const product = item.product;
                    const productName = product.name || product.product_name || '상품명 없음';
                    const imgSrc = product.image || getSharedBasePath() + 'assets/icons/icon-image.png';
                    const quantity = item.ordered_quantity;
                    const itemPrice = item.item_total_price.toLocaleString();

                    itemsHtml += `
                        <div class="preview-item">
                            <img src="${imgSrc}" alt="${productName}" class="preview-img">
                            <div class="preview-info">
                                <span class="preview-name">${productName}</span>
                                <span class="preview-meta">${quantity}개 / ${itemPrice}원</span>
                            </div>
                        </div>
                    `;
                });
            } else {
                itemsHtml = '<div class="preview-item">주문 상품 정보 없음</div>';
            }

            // Status translation
            const statusText = ORDER_STATUS_TEXT[order.order_status] || order.order_status;

            card.innerHTML = `
                <div class="order-header">
                    <span class="order-date">${date} | 주문번호 ${order.order_number}</span>
                    <div class="header-right">
                        <button class="btn-cancel-order" data-id="${order.id}">주문 취소</button>
                        <span class="order-detail-link">상세보기 ></span>
                    </div>
                </div>
                <div class="order-items-preview">
                    ${itemsHtml}
                </div>
                <div class="order-summary">
                    <span class="status-badge" style="color: #21BF48; margin-right: 10px;">${statusText}</span>
                    총 결제금액: ${totalPrice}원
                </div>
            `;

            // Click event to navigate to individual page
            card.addEventListener('click', (e) => {
                // Prevent navigation if Cancel Button is clicked
                if (e.target.classList.contains('btn-cancel-order')) return;
                window.location.href = `./order-detail/index.html?id=${order.id}`;
            });

            // Cancel Button Logic
            const btnCancel = card.querySelector('.btn-cancel-order');
            if (btnCancel) {
                if (order.order_status === ORDER_STATUS.CANCELLED || order.order_status === 'cancelled') {
                    btnCancel.style.display = 'none';
                }

                btnCancel.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('정말 이 주문을 취소하시겠습니까?')) {
                        try {
                            const result = await API.deleteOrder(order.id);
                            alert(result.detail || '주문이 취소되었습니다.');
                            window.location.reload();
                        } catch (err) {
                            alert(err.message || '주문 취소에 실패했습니다.');
                        }
                    }
                });
            }

            orderListContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to load orders:', error);
        orderListContainer.innerHTML = `<div class="loading">주문 정보를 불러오는데 실패했습니다.<br>${error.message}</div>`;
    }
});

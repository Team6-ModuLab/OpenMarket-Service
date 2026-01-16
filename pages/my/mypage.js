// mypage.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Login
    const token = localStorage.getItem('access');
    const userType = localStorage.getItem('userType');
    
    if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        window.location.href = '../auth/login/index.html';
        return;
    }

    if (userType === 'SELLER') {
        // Optional: Redirect sellers to seller center or allow them to view their purchases if they can buy?
        // Usually sellers can also be buyers, but requirements focused on "Buyer My Page". 
        // We will proceed assuming the user wants to see their purchase history.
    }

    // 2. Display User ID
    // User requested to use 'buyerName' from localStorage
    const buyerName = localStorage.getItem('buyerName') || '고객';
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
            // Filter out cancelled orders (handling both API spec 'cancled' and correct English 'cancelled')
            const status = order.order_status;
            if (status === 'cancled' || status === 'cancelled') return;

            // Strict mapping based on API spec provided
            // order: { id, order_number, created_at, order_status, total_price, order_items: [...] }
            
            const card = document.createElement('div');
            card.className = 'order-card';
            
            // Format Date
            const date = new Date(order.created_at).toLocaleDateString();
            const totalPrice = order.total_price.toLocaleString();
            
            // Construct Items Preview
            // We'll show the first few items or all items in a simplified view
            let itemsHtml = '';
            
            if (order.order_items && order.order_items.length > 0) {
                order.order_items.forEach(item => {
                    const product = item.product; // Nested product object
                    const productName = product.name || product.product_name || '상품명 없음'; 
                    // Tried product.product_name based on assumption, but user reported undefined. 
                    // Likely 'name' as per standard product model.
                    
                    const imgSrc = product.image || '../../shared/assets/icons/icon-image.png'; // Fallback
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

            // Status translation if needed
            // "payment_pending"|"payment_complete"|"preparing"|"shipping"|"delivered"|"cancled"
            const statusMap = {
                'payment_pending': '입금 확인 중',
                'payment_complete': '결제 완료',
                'preparing': '배송 준비 중',
                'shipping': '배송 중',
                'delivered': '배송 완료',
                'cancled': '주문 취소' // Typo "cancled" in API Spec matches strict requirement
            };
            const statusText = statusMap[order.order_status] || order.order_status;

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
                window.location.href = `./individual/index.html?id=${order.id}`;
            });
            
            // Cancel Button Logic
            const btnCancel = card.querySelector('.btn-cancel-order');
            if (btnCancel) {
                // If order is already canceled, maybe disable button?
                // Spec says "DELETE" sets status to cancelled. 
                // If it's already 'cancled', typically you shouldn't be able to delete again.
                // But user just asked to make the button. I'll add a check for better UX.
                if (order.order_status === 'cancled' || order.order_status === 'cancelled') {
                    btnCancel.style.display = 'none'; // Or disable
                }

                btnCancel.addEventListener('click', async (e) => {
                    e.stopPropagation(); // Explicitly stop propagation here too just in case
                    if(confirm('정말 이 주문을 취소하시겠습니까?')) {
                        try {
                            const result = await API.deleteOrder(order.id);
                            // API might return success message or just 204
                            alert(result.detail || '주문이 취소되었습니다.');
                            window.location.reload();
                        } catch(err) {
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

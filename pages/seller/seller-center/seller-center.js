document.addEventListener('DOMContentLoaded', async () => {
    // Check login
    const token = localStorage.getItem('access');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'SELLER') {
        alert('판매자만 접근할 수 있습니다.');
        window.location.href = '../../../index.html';
        return;
    }

    const sellerName = localStorage.getItem('sellerName');
    
    if (!sellerName) {
        alert('판매자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        window.location.href = '../../auth/login/index.html';
        return;
    }

    // Update Sidebar/Header Name
    const nameElements = document.querySelectorAll('.seller-name');
    nameElements.forEach(el => el.textContent = sellerName);

    // Fetch Products
    const productListContainer = document.getElementById('product-list');
    const productCountSidebar = document.getElementById('product-count-sidebar');

    try {
        const products = await API.getSellerProducts(sellerName);
        
        // Update count
        productCountSidebar.textContent = products.length;

        // Render Data
        productListContainer.innerHTML = '';
        
        if (products.length === 0) {
            productListContainer.innerHTML = '<div class="loading">등록된 상품이 없습니다.</div>';
            return;
        }

        products.forEach(product => {
            const item = document.createElement('li');
            item.className = 'product-item';
            
            const priceFormatted = product.price.toLocaleString();

            item.innerHTML = `
                <div class="item-info">
                    <img src="${product.image}" alt="${product.name}" class="item-img">
                    <div class="item-details">
                        <span class="item-name">${product.name}</span>
                        <span class="item-stock">재고 : ${product.stock}개</span>
                    </div>
                </div>
                <div class="item-price">${priceFormatted}원</div>
                <div class="item-btn-col">
                    <button class="btn-edit" data-id="${product.id}">수정</button>
                </div>
                <div class="item-btn-col">
                    <button class="btn-delete" data-id="${product.id}">삭제</button>
                </div>
            `;
            productListContainer.appendChild(item);
        });

        // Edit 
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.href = `../../seller/seller-product-upload/index.html?id=${id}`;
            });
        });

        // Delete
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if(confirm('정말 삭제하시겠습니까?')) {
                    try {
                        await API.deleteProduct(id);
                        alert('상품이 삭제되었습니다.');
                        window.location.reload(); 
                    } catch (err) {
                        alert(err.message);
                    }
                }
            });
        });

    } catch (error) {
        productListContainer.innerHTML = `<div class="loading">상품을 불러오는 데 실패했습니다.<br>${error.message}</div>`;
    }
});

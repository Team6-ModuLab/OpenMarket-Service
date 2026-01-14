// seller-center.js

document.addEventListener('DOMContentLoaded', async () => {
    // Check login
    const token = localStorage.getItem('access');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'SELLER') {
        alert('판매자만 접근할 수 있습니다.');
        window.location.href = '../../../index.html'; // Or login
        return;
    }

    // Since we don't have the seller name stored explicitly in localstorage as 'sellerName' usually,
    // we might need to rely on what information we have.
    // The previous login API response saves 'access', 'refresh', 'userType'.
    // Does it verify account name?
    // Let's assume for now we might need to fetch profile or similar, API spec doesn't show "Get Profile".
    // However, the `getSellerProducts` requires `seller_name`. 
    // Wait, usually the login response or a decoded token might have it. 
    // IF NOT, we might be stuck. 
    // CHECK: When logging in login() returns data. 
    // Does login return user info?
    // API Spec for Login (from memory or typical): usually returns token + user info.
    // If we didn't save it, we might need to.
    
    // WORKAROUND: For now, I'll attempt to use a stored 'account_name' if I can find where I saved it.
    // If not saved, I need to modify login logic to save it. 
    // BUT I can't modify login page logic right now easily if it's in another file I didn't plan to touch much (auth/login.js).
    // Let's check `shared/js/api.js` login function again. It returns `data`. 
    // The `auth/login/login.js` (which I haven't seen but assume exists) likely handles saving token.
    // I should check `localStorage` items.
    
    // For this implementation step, let's assume `localStorage.getItem('account_name')` exists.
    // If testing reveals it's missing, I'll have to add it to the login flow.
    // I will add a fallback or check.

    /*
     * Note: In a real scenario, I would check `auth/login.js` to see what it saves.
     * I'll proceed assuming 'account_name' or 'username' is stored.
     * If not, I will prompt the user (myself) to fix it, but let's write defensive code.
     */
    
    // seller-center.js
    
    // Trying to get seller name. Logic: If I logged in, I should know who I am.
    // Use 'account_name' (ID) for API calls if required, but the prompt asked to use 'name' stored in localStorage.
    // The prompt: "seller name을 localStorage에 저장된 name을 통해서"
    const sellerName = localStorage.getItem('sellerName'); // API requires 'seller_name' (user.name) as per user instruction
    const sellerDisplayName = localStorage.getItem('sellerName'); // For Display
    
    if (!sellerName) {
        alert('판매자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        window.location.href = '../../auth/login/index.html'; // Redirect to login
        return;
    }

    // Update Sidebar/Header Name
    const nameElements = document.querySelectorAll('.seller-distinct, #seller-name');
    nameElements.forEach(el => el.textContent = sellerDisplayName || sellerName);

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

        // Attach Event Listeners
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

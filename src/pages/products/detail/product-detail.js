// js/detail.js

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let product = null;
let quantity = 1;

const detailArea = document.getElementById('product-detail-area');

async function loadProduct() {
    if (!productId) {
        alert('잘못된 접근입니다.');
        window.location.href = './index.html';
        return;
    }

    try {
        product = await API.getProductDetail(productId);
        renderDetail();
    } catch (error) {
        alert('상품을 불러올 수 없습니다.');
        window.location.href = './index.html';
    }
}

function renderDetail() {
    detailArea.innerHTML = `
        <div class="detail-img">
            <img src="${product.image}" alt="${product.product_name}">
        </div>
        <div class="detail-info">
            <p class="detail-seller">${product.seller_store}</p>
            <h2 class="detail-name">${product.product_name}</h2>
            <p class="detail-price">${formatPrice(product.price)}<span>원</span></p>
            
            <p class="delivery-info">
                택배배송 / ${product.shipping_fee > 0 ? formatPrice(product.shipping_fee) + '원' : '무료배송'}
            </p>

            <div class="quantity-control">
                <button id="btn-minus">-</button>
                <input type="number" id="quantity-input" value="1" readonly>
                <button id="btn-plus">+</button>
            </div>

            <div class="total-price-area">
                <p>총 상품 금액</p>
                <div class="total-price-wrapper">
                    <span class="total-number-items">총 수량 <span id="total-qty">1</span>개</span>
                    <span class="total-price-val" id="total-price">${formatPrice(product.price)}<span>원</span></span>
                </div>
            </div>

            <div class="action-buttons">
                <button class="btn-buy">바로 구매</button>
                <button class="btn-cart">장바구니</button>
            </div>
        </div>
    `;

    // Event Listeners for Buttons
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const inputQty = document.getElementById('quantity-input');
    const btnBuy = document.querySelector('.btn-buy');
    const btnCart = document.querySelector('.btn-cart');
    
    // Add event listeners
    btnMinus.addEventListener('click', () => updateQuantity(-1));
    btnPlus.addEventListener('click', () => updateQuantity(1));
    
    btnBuy.addEventListener('click', handleBuy);
    btnCart.addEventListener('click', handleCart);

    // Initial check
    checkStockLimit();
}

function updateQuantity(change) {
    const newQty = quantity + change;
    if (newQty < 1) return;
    if (newQty > product.stock) return;

    quantity = newQty;
    document.getElementById('quantity-input').value = quantity;
    document.getElementById('total-qty').innerText = quantity;
    document.getElementById('total-price').innerHTML = `${formatPrice(product.price * quantity)}<span>원</span>`;
    
    checkStockLimit();
}

function checkStockLimit() {
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');

    if (quantity <= 1) btnMinus.disabled = true;
    else btnMinus.disabled = false;

    if (quantity >= product.stock) btnPlus.disabled = true;
    else btnPlus.disabled = false;
}

function handleBuy() {
    const token = localStorage.getItem('token');
    if (!token) {
        showLoginModal();
    } else {
        alert(`[구매 완료] ${product.product_name} ${quantity}개를 구매했습니다.`);
        // Logic to clear token or update stock could go here for mock
    }
}

function handleCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        showLoginModal();
    } else {
         alert(`[장바구니 담기] ${product.product_name}`);
    }
}

loadProduct();

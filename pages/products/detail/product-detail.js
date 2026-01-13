// js/detail.js

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || '1';

let product = null;
let quantity = 1;

const detailArea = document.getElementById('product-detail-area');

async function loadProduct() {
    try {
        product = await API.getProductDetail(productId);
        renderDetail();
    } catch (error) {
        console.log('샘플 데이터 사용');
        product = {
            product_id: 1,
            product_name: "Hack Your Life 개발자 노트북 파우치",
            image: "https://openmarket.weniv.co.kr/media/products/2026/01/11/IMG_01.jpg",
            price: 29000,
            shipping_fee: 3000,
            stock: 50,
            seller_store: "우당탕탕 라이켓의 실험실",
            product_info: "개발자를 위한 힙한 노트북 파우치입니다."
        };
        renderDetail();
    }
}

function renderDetail() {
    detailArea.innerHTML = `
        <div class="product-main">
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
        </div>

        <div class="product-tabs">
            <div class="tab-buttons">
                <button class="tab-btn active" data-tab="detail">버튼</button>
                <button class="tab-btn" data-tab="review">리뷰</button>
                <button class="tab-btn" data-tab="qna">Q&A</button>
                <button class="tab-btn" data-tab="return">반품/교환정보</button>
            </div>
            
            <div class="tab-content">
                <div class="tab-panel active" id="tab-detail">
                    <p>${product.product_info || '상품 상세 정보입니다.'}</p>
                </div>
                
                <div class="tab-panel" id="tab-review">
                    <p>리뷰가 없습니다.</p>
                </div>
                
                <div class="tab-panel" id="tab-qna">
                    <p>Q&A가 없습니다.</p>
                </div>
                
                <div class="tab-panel" id="tab-return">
                    <h3>반품/교환 안내</h3>
                    <p>교환 및 반품이 가능한 경우</p>
                    <ul>
                        <li>상품을 공급받으신 날로부터 7일 이내</li>
                        <li>상품이 표시·광고 내용과 다른 경우</li>
                    </ul>
                    <p>교환 및 반품이 불가능한 경우</p>
                    <ul>
                        <li>고객님의 책임있는 사유로 상품이 훼손된 경우</li>
                        <li>포장을 개봉하여 사용 후 상품 가치가 현저히 감소한 경우</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const btnBuy = document.querySelector('.btn-buy');
    const btnCart = document.querySelector('.btn-cart');
    
    btnMinus.addEventListener('click', () => updateQuantity(-1));
    btnPlus.addEventListener('click', () => updateQuantity(1));
    btnBuy.addEventListener('click', handleBuy);
    btnCart.addEventListener('click', handleCart);

    checkStockLimit();
    setupTabs();
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
        alert('로그인이 필요합니다.');
    } else {
        alert(`[구매 완료] ${product.product_name} ${quantity}개를 구매했습니다.`);
    }
}

function handleCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
    } else {
        alert(`[장바구니 담기] ${product.product_name}`);
    }
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            button.classList.add('active');
            
            const tabName = button.getAttribute('data-tab');
            document.getElementById(`tab-${tabName}`).classList.add('active');
        });
    });
}

loadProduct();
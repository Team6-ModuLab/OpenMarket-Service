const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let product = null;
let quantity = 1;

const detailArea = document.getElementById('product-detail-area');

async function getRealProductDetail(id) {
  const response = await fetch(`https://api.wenivops.co.kr/services/open-market/products/${id}/`);
  if (!response.ok) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  return await response.json();
}

async function loadProduct() {
  if (!productId) {
    alert('잘못된 접근입니다.');
    window.location.href = '../list/index.html';
    return;
  }

  try {
    product = await getRealProductDetail(productId);
    console.log('상품 정보:', product);
    renderDetail();
  } catch (error) {
    console.error('상품 불러오기 실패:', error);
    alert('상품 정보를 불러올 수 없습니다.');
    window.location.href = '../list/index.html';
  }
}

function renderDetail() {
  quantity = 1;

  detailArea.innerHTML = `
    <div class="product-main">
      <div class="detail-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="detail-info">
        <p class="detail-seller">${product.seller?.store_name || ''}</p>
        <h2 class="detail-name">${product.name}</h2>    
        <p class="detail-price">${formatPrice(product.price)}<span>원</span></p>

        <p class="delivery-info">
          택배배송 / ${product.shipping_fee > 0 ? formatPrice(product.shipping_fee) + '원' : '무료배송'}
        </p>

        <div class="quantity-control">
          <button id="btn-minus" type="button">-</button>
          <input type="text" id="quantity-input" value="1" readonly>
          <button id="btn-plus" type="button">+</button>
        </div>

        <div class="total-price-area">
          <p>총 상품 금액</p>
          <div class="total-price-wrapper">
            <span class="total-number-items">총 수량 <span id="total-qty">1</span>개</span>
            <span class="total-price-val" id="total-price">${formatPrice(product.price)}<span>원</span></span>
          </div>
        </div>

        ${Number(product.stock ?? 0) <= 0 ? `<p class="stock-alert">현재 재고가 없습니다.</p>` : ``}

        <div class="action-buttons">
          <button class="btn-buy" type="button">바로 구매</button>
          <button class="btn-cart" type="button">장바구니</button>
        </div>
      </div>
    </div>

    <div class="product-tabs">
      <div class="tab-buttons">
        <button class="tab-btn active" data-tab="detail">상세</button>
        <button class="tab-btn" data-tab="review">리뷰</button>
        <button class="tab-btn" data-tab="qna">Q&A</button>
        <button class="tab-btn" data-tab="return">반품/교환정보</button>
      </div>

      <div class="tab-content">
        <div class="tab-panel active" id="tab-detail">
          <p>${product.info || '상품 상세 정보입니다.'}</p>
        </div>
        <div class="tab-panel" id="tab-review"><p>리뷰가 없습니다.</p></div>
        <div class="tab-panel" id="tab-qna"><p>Q&A가 없습니다.</p></div>
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

  document.getElementById('btn-minus').addEventListener('click', () => updateQuantity(-1));
  document.getElementById('btn-plus').addEventListener('click', () => updateQuantity(1));
  document.querySelector('.btn-buy').addEventListener('click', handleBuy);
  document.querySelector('.btn-cart').addEventListener('click', handleCart);

  checkStockLimit();
  // lockWhenOutOfStock();  // 
  setupTabs();
}

function updateQuantity(change) {
  const stock = Number(product.stock ?? 0);
  const newQty = quantity + change;

  if (newQty < 1) return;
  if (newQty > stock) return;

  quantity = newQty;
  document.getElementById('quantity-input').value = String(quantity);
  document.getElementById('total-qty').innerText = String(quantity);
  document.getElementById('total-price').innerHTML = `${formatPrice(product.price * quantity)}<span>원</span>`;

  checkStockLimit();
}

function checkStockLimit() {
  const btnMinus = document.getElementById('btn-minus');
  const btnPlus = document.getElementById('btn-plus');
  const stock = Number(product.stock ?? 0);

  btnMinus.disabled = quantity <= 1;
  btnPlus.disabled = stock <= 0 || quantity >= stock;
}

function handleBuy() {
  console.log('구매 버튼 클릭! 재고:', product.stock);
  
  const token = localStorage.getItem('accessToken') || localStorage.getItem('access');
  
  if (!token) {
    console.log('로그인 필요');
    showLoginModal();
    return;
  }

  const stock = Number(product.stock ?? 0);
  
  
  if (stock <= 0 || quantity > stock) {
    console.log('재고 부족 모달 표시');
    showStockExceededModal();
    return;
  }

  alert(`[구매 완료]\n${product.name}\n수량: ${quantity}개\n총 금액: ${formatPrice(product.price * quantity)}원`);
}

function handleCart() {
  console.log('장바구니 버튼 클릭! 재고:', product.stock);
  
  const token = localStorage.getItem('accessToken') || localStorage.getItem('access');
  
  if (!token) {
    console.log('로그인 필요');
    showLoginModal();
    return;
  }

  const stock = Number(product.stock ?? 0);
  
  
  if (stock <= 0 || quantity > stock) {
    console.log('재고 부족 모달 표시');
    showStockExceededModal();
    return;
  }


  console.log('장바구니 성공 모달 표시');
  showCartSuccessModal();
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


function showCartSuccessModal() {
  console.log('showCartSuccessModal 함수 실행됨!');
  

  const existing = document.getElementById('cart-success-modal');
  if (existing) {
    existing.remove();
  }

  const modalHTML = `
    <div id="cart-success-modal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn">&times;</button>
        <p>이미 장바구니에 있는 상품입니다.<br>장바구니로 이동하시겠습니까?</p>
        <div class="modal-buttons">
          <button class="btn-no">아니오</button>
          <button class="btn-yes">예</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  console.log('모달 HTML 추가 완료');
  
  const modal = document.getElementById('cart-success-modal');
  console.log('모달 요소:', modal);

  modal.querySelector('.close-btn').addEventListener('click', () => {
    console.log('X 버튼 클릭');
    modal.remove();
  });
  
  modal.querySelector('.btn-no').addEventListener('click', () => {
    console.log('아니오 버튼 클릭');
    modal.remove();
  });
  
  modal.querySelector('.btn-yes').addEventListener('click', () => {
    console.log('예 버튼 클릭 - 장바구니로 이동');
    // window.location.href = '../../cart/index.html';
    alert('장바구니 페이지로 이동합니다!'); // 임시
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      console.log('배경 클릭');
      modal.remove();
    }
  });
}


function showStockExceededModal() {
  console.log('showStockExceededModal 함수 실행됨!');
  

  const existing = document.getElementById('stock-exceeded-modal');
  if (existing) {
    existing.remove();
  }

  const modalHTML = `
    <div id="stock-exceeded-modal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn">&times;</button>
        <p>재고 수량이 초과되었습니다.</p>
        <div class="modal-buttons">
          <button class="btn-no">아니오</button>
          <button class="btn-yes">예</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  console.log('재고 초과 모달 HTML 추가 완료');
  
  const modal = document.getElementById('stock-exceeded-modal');

  modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
  modal.querySelector('.btn-no').addEventListener('click', () => modal.remove());
  modal.querySelector('.btn-yes').addEventListener('click', () => modal.remove());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

loadProduct();
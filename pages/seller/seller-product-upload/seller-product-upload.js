document.addEventListener('DOMContentLoaded', async () => {
    // ===== 권한 확인 =====
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);

    if (!token || userType !== USER_TYPES.SELLER) {
        alert('판매자만 접근할 수 있습니다.');
        window.location.href = '../../../index.html';
        return;
    }

    // ===== 상수 정의 =====
    const ERROR_MSG = {
        NAME_REQUIRED: '상품명을 입력해주세요.',
        NAME_TOO_LONG: '상품명은 20자 이내로 입력해주세요.',
        PRICE_REQUIRED: '판매가를 입력해주세요.',
        PRICE_INVALID: '판매가는 숫자만 입력 가능합니다.',
        PRICE_ZERO: '판매가는 0보다 커야 합니다.',
        SHIPPING_FEE_REQUIRED: '배송비를 입력해주세요.',
        SHIPPING_FEE_INVALID: '배송비는 숫자만 입력 가능합니다.',
        SHIPPING_FEE_NEGATIVE: '배송비는 0 이상이어야 합니다.',
        STOCK_REQUIRED: '재고를 입력해주세요.',
        STOCK_INVALID: '재고는 숫자만 입력 가능합니다.',
        STOCK_NEGATIVE: '재고는 0 이상이어야 합니다.',
        INFO_REQUIRED: '상품 상세 정보를 입력해주세요.',
        IMAGE_REQUIRED: '상품 이미지를 등록해주세요.',
        CANCEL_CONFIRM: '작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?'
    };

    // ===== URL 파라미터 확인 =====
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const isEditMode = !!productId;

    // ===== DOM 요소 =====
    const imgPreviewBox = document.getElementById('img-preview-box');
    const imgInput = document.getElementById('img-upload');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const shippingMethodInput = document.getElementById('shipping-method');
    const shippingFeeInput = document.getElementById('shipping-fee');
    const stockInput = document.getElementById('stock');
    const productInfoInput = document.getElementById('product-info');
    const nameLengthSpan = document.getElementById('name-length');
    const btnSave = document.querySelector('.btn-save');
    const btnCancel = document.getElementById('btn-cancel');
    const btnsShipping = document.querySelectorAll('.btn-shipping');

    // 에러 메시지 요소
    const nameError = document.getElementById('name-error');
    const priceError = document.getElementById('price-error');
    const shippingFeeError = document.getElementById('shipping-fee-error');
    const stockError = document.getElementById('stock-error');
    const infoError = document.getElementById('info-error');
    const imageError = document.getElementById('image-error');

    let currentImgFile = null;

    // ===== 수정 모드 설정 =====
    if (isEditMode) {
        document.querySelector('.page-heading').textContent = '상품 수정';
        btnSave.textContent = '수정하기';
        fetchProductData(productId);
    }

    // ===== 유틸리티 함수 =====
    function formatNumberWithComma(value) {
        const number = value.replace(/[^0-9]/g, '');
        return number ? parseInt(number).toLocaleString() : '';
    }

    function parseFormattedNumber(value) {
        return parseInt(value.replace(/,/g, ''));
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function clearError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    function previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgPreviewBox.innerHTML = `<img src="${e.target.result}" class="preview-img" alt="상품 이미지 미리보기">`;
        };
        reader.readAsDataURL(file);
    }

    function checkFormHasContent() {
        return productNameInput.value.trim() ||
               productPriceInput.value.trim() ||
               shippingFeeInput.value.trim() ||
               stockInput.value.trim() ||
               productInfoInput.value.trim() ||
               currentImgFile;
    }

    // ===== 이미지 업로드 =====
    imgPreviewBox.addEventListener('click', () => imgInput.click());
    
    imgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            currentImgFile = file;
            previewImage(file);
            clearError(imageError);
        }
    });

    // ===== 상품명 입력 =====
    productNameInput.addEventListener('input', () => {
        const value = productNameInput.value;
        nameLengthSpan.textContent = value.length;
        
        if (!value.trim()) {
            showError(nameError, ERROR_MSG.NAME_REQUIRED);
        } else if (value.length > 20) {
            showError(nameError, ERROR_MSG.NAME_TOO_LONG);
        } else {
            clearError(nameError);
        }
    });

    // ===== 판매가 입력 =====
    productPriceInput.addEventListener('input', (e) => {
        e.target.value = formatNumberWithComma(e.target.value);
        const value = e.target.value;
        
        if (!value) {
            showError(priceError, ERROR_MSG.PRICE_REQUIRED);
        } else if (parseFormattedNumber(value) <= 0) {
            showError(priceError, ERROR_MSG.PRICE_ZERO);
        } else {
            clearError(priceError);
        }
    });

    // ===== 배송비 입력 =====
    shippingFeeInput.addEventListener('input', (e) => {
        e.target.value = formatNumberWithComma(e.target.value);
        const value = e.target.value;
        
        if (!value) {
            showError(shippingFeeError, ERROR_MSG.SHIPPING_FEE_REQUIRED);
        } else if (parseFormattedNumber(value) < 0) {
            showError(shippingFeeError, ERROR_MSG.SHIPPING_FEE_NEGATIVE);
        } else {
            clearError(shippingFeeError);
        }
    });

    // ===== 재고 입력 =====
    stockInput.addEventListener('input', (e) => {
        e.target.value = formatNumberWithComma(e.target.value);
        const value = e.target.value;
        
        if (!value) {
            showError(stockError, ERROR_MSG.STOCK_REQUIRED);
        } else if (parseFormattedNumber(value) < 0) {
            showError(stockError, ERROR_MSG.STOCK_NEGATIVE);
        } else {
            clearError(stockError);
        }
    });

    // ===== 상품 정보 입력 =====
    productInfoInput.addEventListener('input', () => {
        if (!productInfoInput.value.trim()) {
            showError(infoError, ERROR_MSG.INFO_REQUIRED);
        } else {
            clearError(infoError);
        }
    });

    // ===== 배송 방법 선택 =====
    btnsShipping.forEach(btn => {
        btn.addEventListener('click', () => {
            btnsShipping.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            shippingMethodInput.value = btn.getAttribute('data-value');
        });
    });

    // ===== 취소 버튼 =====
    btnCancel?.addEventListener('click', () => {
        const hasContent = checkFormHasContent();
        
        if (hasContent) {
            if (confirm(ERROR_MSG.CANCEL_CONFIRM)) {
                history.back();
            }
        } else {
            history.back();
        }
    });

    // ===== 폼 제출 =====
    document.querySelector('.product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('name', productNameInput.value);
        formData.append('price', parseFormattedNumber(productPriceInput.value));
        formData.append('shipping_method', shippingMethodInput.value);
        formData.append('shipping_fee', parseFormattedNumber(shippingFeeInput.value));
        formData.append('stock', parseFormattedNumber(stockInput.value));
        formData.append('info', productInfoInput.value);

        if (currentImgFile) {
            formData.append('image', currentImgFile);
        } else if (!isEditMode) {
            alert(ERROR_MSG.IMAGE_REQUIRED);
            return;
        }

        try {
            let result;
            if (isEditMode) {
                result = await API.updateProduct(productId, formData);
            } else {
                result = await API.createProduct(formData);
            }

            if (result.success) {
                alert(isEditMode ? '상품이 수정되었습니다.' : '상품이 등록되었습니다.');
                window.location.href = '../seller-center/index.html';
            } else {
                let msg = '오류가 발생했습니다.\n';
                if (result.data) {
                    for (const [key, value] of Object.entries(result.data)) {
                        if (Array.isArray(value)) {
                            msg += `${key}: ${value.join(', ')}\n`;
                        } else {
                            msg += `${key}: ${value}\n`;
                        }
                    }
                }
                alert(msg);
            }
        } catch (error) {
            alert('요청 중 오류가 발생했습니다.');
            console.error(error);
        }
    });

    // ===== 유효성 검사 =====
    function validateForm() {
        const name = productNameInput.value.trim();
        const price = productPriceInput.value.trim();
        const shippingFee = shippingFeeInput.value.trim();
        const stock = stockInput.value.trim();
        const info = productInfoInput.value.trim();
        
        let isValid = true;

        // 상품명 검사
        if (!name) {
            showError(nameError, ERROR_MSG.NAME_REQUIRED);
            isValid = false;
        } else if (name.length > 20) {
            showError(nameError, ERROR_MSG.NAME_TOO_LONG);
            isValid = false;
        } else {
            clearError(nameError);
        }

        // 판매가 검사
        if (!price) {
            showError(priceError, ERROR_MSG.PRICE_REQUIRED);
            isValid = false;
        } else if (!/^[0-9,]+$/.test(price)) {
            showError(priceError, ERROR_MSG.PRICE_INVALID);
            isValid = false;
        } else if (parseFormattedNumber(price) <= 0) {
            showError(priceError, ERROR_MSG.PRICE_ZERO);
            isValid = false;
        } else {
            clearError(priceError);
        }

        // 배송비 검사
        if (!shippingFee) {
            showError(shippingFeeError, ERROR_MSG.SHIPPING_FEE_REQUIRED);
            isValid = false;
        } else if (!/^[0-9,]+$/.test(shippingFee)) {
            showError(shippingFeeError, ERROR_MSG.SHIPPING_FEE_INVALID);
            isValid = false;
        } else if (parseFormattedNumber(shippingFee) < 0) {
            showError(shippingFeeError, ERROR_MSG.SHIPPING_FEE_NEGATIVE);
            isValid = false;
        } else {
            clearError(shippingFeeError);
        }

        // 재고 검사
        if (!stock) {
            showError(stockError, ERROR_MSG.STOCK_REQUIRED);
            isValid = false;
        } else if (!/^[0-9,]+$/.test(stock)) {
            showError(stockError, ERROR_MSG.STOCK_INVALID);
            isValid = false;
        } else if (parseFormattedNumber(stock) < 0) {
            showError(stockError, ERROR_MSG.STOCK_NEGATIVE);
            isValid = false;
        } else {
            clearError(stockError);
        }

        // 상품 정보 검사
        if (!info) {
            showError(infoError, ERROR_MSG.INFO_REQUIRED);
            isValid = false;
        } else {
            clearError(infoError);
        }

        // 이미지 검사
        if (!isEditMode && !currentImgFile) {
            showError(imageError, ERROR_MSG.IMAGE_REQUIRED);
            isValid = false;
        } else {
            clearError(imageError);
        }

        return isValid;
    }

    // ===== 상품 데이터 불러오기 (수정 모드) =====
    async function fetchProductData(id) {
        try {
            const product = await API.getProduct(id);
            
            productNameInput.value = product.name;
            productPriceInput.value = product.price.toLocaleString();
            shippingFeeInput.value = product.shipping_fee.toLocaleString();
            stockInput.value = product.stock.toLocaleString();
            productInfoInput.value = product.info;

            shippingMethodInput.value = product.shipping_method;
            btnsShipping.forEach(btn => {
                if (btn.getAttribute('data-value') === product.shipping_method) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });

            if (product.image) {
                imgPreviewBox.innerHTML = `<img src="${product.image}" class="preview-img" alt="상품 이미지">`;
            }

            nameLengthSpan.textContent = product.name.length;

        } catch (error) {
            alert('상품 정보를 불러오는 데 실패했습니다.');
            console.error(error);
            history.back();
        }
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('access');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'SELLER') {
        alert('판매자만 접근할 수 있습니다.');
        window.location.href = '../../../index.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const isEditMode = !!productId;

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
    const btnsShipping = document.querySelectorAll('.btn-shipping');

    const nameError = document.getElementById('name-error');
    const priceError = document.getElementById('price-error');
    const shippingFeeError = document.getElementById('shipping-fee-error');
    const stockError = document.getElementById('stock-error');
    const infoError = document.getElementById('info-error');
    const imageError = document.getElementById('image-error');

    let currentImgFile = null;

    if (isEditMode) {
        document.querySelector('.page-heading').textContent = '상품 수정';
        btnSave.textContent = '수정하기';
        fetchProductData(productId);
    }

    imgPreviewBox.addEventListener('click', () => imgInput.click());
    imgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            currentImgFile = file;
            previewImage(file);
        }
    });

    productNameInput.addEventListener('input', () => {
        nameLengthSpan.textContent = productNameInput.value.length;
        
        if (productNameInput.value.trim() === '') {
            showError(nameError, '상품명을 입력해주세요.');
        } else if (productNameInput.value.length > 20) {
            showError(nameError, '상품명은 20자 이내로 입력해주세요.');
        } else {
            clearError(nameError);
        }
    });

    productPriceInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value ? parseInt(value).toLocaleString() : '';
        
        if (value === '') {
            showError(priceError, '판매가를 입력해주세요.');
        } else if (parseInt(value) <= 0) {
            showError(priceError, '판매가는 0보다 커야 합니다.');
        } else {
            clearError(priceError);
        }
    });

    shippingFeeInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value ? parseInt(value).toLocaleString() : '';
        
        if (value === '') {
            showError(shippingFeeError, '배송비를 입력해주세요.');
        } else if (parseInt(value) < 0) {
            showError(shippingFeeError, '배송비는 0 이상이어야 합니다.');
        } else {
            clearError(shippingFeeError);
        }
    });

    stockInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value ? parseInt(value).toLocaleString() : '';
        
        if (value === '') {
            showError(stockError, '재고를 입력해주세요.');
        } else if (parseInt(value) < 0) {
            showError(stockError, '재고는 0 이상이어야 합니다.');
        } else {
            clearError(stockError);
        }
    });

    productInfoInput.addEventListener('input', () => {
        if (productInfoInput.value.trim() === '') {
            showError(infoError, '상품 상세 정보를 입력해주세요.');
        } else {
            clearError(infoError);
        }
    });

    btnsShipping.forEach(btn => {
        btn.addEventListener('click', () => {
            btnsShipping.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            shippingMethodInput.value = btn.getAttribute('data-value');
        });
    });

    document.querySelector('.product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('name', productNameInput.value);
        formData.append('price', parseInt(productPriceInput.value.replace(/,/g, '')));
        formData.append('shipping_method', shippingMethodInput.value);
        formData.append('shipping_fee', parseInt(shippingFeeInput.value.replace(/,/g, '')));
        formData.append('stock', parseInt(stockInput.value.replace(/,/g, '')));
        formData.append('info', productInfoInput.value);

        if (currentImgFile) {
            formData.append('image', currentImgFile);
        } else if (!isEditMode) {
            alert('이미지를 등록해주세요.');
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

    function previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgPreviewBox.innerHTML = `<img src="${e.target.result}" class="preview-img" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function clearError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    function validateForm() {
        const name = productNameInput.value.trim();
        const price = productPriceInput.value.trim();
        const shippingFee = shippingFeeInput.value.trim();
        const stock = stockInput.value.trim();
        const info = productInfoInput.value.trim();
        
        let isValid = true;

        if (!name) {
            showError(nameError, '상품명을 입력해주세요.');
            isValid = false;
        } else if (name.length > 20) {
            showError(nameError, '상품명은 20자 이내로 입력해주세요.');
            isValid = false;
        } else {
            clearError(nameError);
        }

        if (!price) {
            showError(priceError, '판매가를 입력해주세요.');
            isValid = false;
        } else if (!/^[0-9,]+$/.test(price)) {
            showError(priceError, '판매가는 숫자만 입력 가능합니다.');
            isValid = false;
        } else if (parseInt(price.replace(/,/g, '')) <= 0) {
            showError(priceError, '판매가는 0보다 커야 합니다.');
            isValid = false;
        } else {
            clearError(priceError);
        }

        if (!shippingFee) {
            showError(shippingFeeError, '배송비를 입력해주세요.');
            isValid = false;
        } else if (!/^[0-9,]+$/.test(shippingFee)) {
            showError(shippingFeeError, '배송비는 숫자만 입력 가능합니다.');
            isValid = false;
        } else if (parseInt(shippingFee.replace(/,/g, '')) < 0) {
            showError(shippingFeeError, '배송비는 0 이상이어야 합니다.');
            isValid = false;
        } else {
            clearError(shippingFeeError);
        }

        if (!stock) {
            showError(stockError, '재고를 입력해주세요.');
            isValid = false;
        } else if (!/^[0-9,]+$/.test(stock)) {
            showError(stockError, '재고는 숫자만 입력 가능합니다.');
            isValid = false;
        } else if (parseInt(stock.replace(/,/g, '')) < 0) {
            showError(stockError, '재고는 0 이상이어야 합니다.');
            isValid = false;
        } else {
            clearError(stockError);
        }

        if (!info) {
            showError(infoError, '상품 상세 정보를 입력해주세요.');
            isValid = false;
        } else {
            clearError(infoError);
        }

        if (!isEditMode && !currentImgFile) {
            showError(imageError, '상품 이미지를 등록해주세요.');
            isValid = false;
        } else {
            clearError(imageError);
        }

        return isValid;
    }

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
                } else {
                    btn.classList.remove('active');
                }
            });

            if (product.image) {
                imgPreviewBox.innerHTML = `<img src="${product.image}" class="preview-img" alt="Product Image">`;
            }

            nameLengthSpan.textContent = product.name.length;

        } catch (error) {
            alert('상품 정보를 불러오는 데 실패했습니다.');
            console.error(error);
            history.back();
        }
    }
});
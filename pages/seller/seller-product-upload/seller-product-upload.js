// seller-product-upload.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('access');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'SELLER') {
        alert('판매자만 접근할 수 있습니다.');
        window.location.href = '../../../index.html';
        return;
    }

    // Check query params for Edit Mode
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const isEditMode = !!productId;

    // Elements
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

    let currentImgFile = null;

    // Initialize Edit Mode
    if (isEditMode) {
        document.querySelector('.page-heading').textContent = '상품 수정';
        btnSave.textContent = '수정하기';
        fetchProductData(productId);
    }

    // Event Listeners

    // Image Upload
    imgPreviewBox.addEventListener('click', () => imgInput.click());
    imgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            currentImgFile = file;
            previewImage(file);
        }
    });

    // Name Length Count
    productNameInput.addEventListener('input', () => {
        nameLengthSpan.textContent = productNameInput.value.length;
    });

    // Shipping Method Toggle
    btnsShipping.forEach(btn => {
        btn.addEventListener('click', () => {
             btnsShipping.forEach(b => b.classList.remove('active'));
             btn.classList.add('active');
             shippingMethodInput.value = btn.getAttribute('data-value');
        });
    });

    // Form Submit
    document.querySelector('.product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validation check
        if (!validateForm()) return;

        // Prepare Data
        // API requires Multipart/Form-data for image upload
        // Note: For Update, image might be optional if avoiding re-upload? 
        // API Spec for PUT: "Res 수정이 필요한 값들만 넣어주면 됩니다."
        // However, standard FormData with fetch will just send what is appended.
        
        const formData = new FormData();
        formData.append('name', productNameInput.value);
        formData.append('price', parseInt(productPriceInput.value.replace(/,/g, '')));
        formData.append('shipping_method', shippingMethodInput.value);
        formData.append('shipping_fee', parseInt(shippingFeeInput.value.replace(/,/g, '')));
        formData.append('stock', parseInt(stockInput.value.replace(/,/g, '')));
        formData.append('info', productInfoInput.value);

        // Image Handling
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
                // Determine error message from result.data
                // Example: { "name": ["필수항목"] }
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

    // Helper: Preview Image
    function previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
             imgPreviewBox.innerHTML = `<img src="${e.target.result}" class="preview-img" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }

    // Helper: Validate
    function validateForm() {
        // Basic HTML5 required handles usage, but logic checks can be added here
        // Check numeric inputs
        // Note: Inputs have type text to allow formatting (commas), but we should strip them before check.
        // Or implement auto-comma formatting.
        return true;
    }

    // Fetch Data for Edit
    async function fetchProductData(id) {
        try {
            const product = await API.getProduct(id);
            
            // Fill fields
            productNameInput.value = product.name;
            productPriceInput.value = product.price;
            shippingFeeInput.value = product.shipping_fee;
            stockInput.value = product.stock;
            productInfoInput.value = product.info;

            // Shipping Method
            shippingMethodInput.value = product.shipping_method;
            btnsShipping.forEach(btn => {
                if (btn.getAttribute('data-value') === product.shipping_method) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Image (Show existing)
            if (product.image) {
                imgPreviewBox.innerHTML = `<img src="${product.image}" class="preview-img" alt="Product Image">`;
            }

            // Word Count
            nameLengthSpan.textContent = product.name.length;

        } catch (error) {
            alert('상품 정보를 불러오는 데 실패했습니다.');
            console.error(error);
            history.back();
        }
    }
    
    // Auto-format numbers (Optional polish)
    // For MVP, just assuming user enters numbers.
});

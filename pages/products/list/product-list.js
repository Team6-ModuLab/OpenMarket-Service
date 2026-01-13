// js/index.js

async function renderProducts() {
    const productList = document.getElementById('product-list');
    
    try {
        const products = await API.getProducts(); // Fetch mock products

        products.forEach(product => {
            const li = document.createElement('li');
            li.className = 'product-card';
            li.onclick = () => {
                window.location.href = `../detail/index.html?id=${product.id}`;
            };

            li.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <p class="seller-name">${product.seller.store_name}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formatPrice(product.price)}<span>원</span></p>
                </div>
            `;
            productList.appendChild(li);
        });

    } catch (error) {
        console.error("Failed to load products:", error);
    }
}

// Initial Load
renderProducts();

// js/index.js

// ===== Banner Slider =====
let bannerProducts = [];
let currentSlide = 0;
let slideInterval = null;
const SLIDE_COUNT = 5;
const AUTO_PLAY_DELAY = 3000;

async function initBanner() {
    const bannerTrack = document.getElementById('banner-track');
    const bannerDots = document.getElementById('banner-dots');

    try {
        const products = await API.getProducts();
        bannerProducts = products.slice(0, SLIDE_COUNT);

        // Create slides
        bannerProducts.forEach((product, index) => {
            const slide = document.createElement('div');
            slide.className = 'banner-slide';
            slide.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
            slide.addEventListener('click', () => {
                window.location.href = `../detail/index.html?id=${product.id}`;
            });
            bannerTrack.appendChild(slide);
        });

        // Create dots
        bannerProducts.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `banner-dot${index === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `배너 ${index + 1}로 이동`);
            dot.addEventListener('click', () => goToSlide(index));
            bannerDots.appendChild(dot);
        });

        // Setup controls
        document.querySelector('.banner-btn-prev').addEventListener('click', prevSlide);
        document.querySelector('.banner-btn-next').addEventListener('click', nextSlide);

        // Start autoplay
        startAutoPlay();

        // Pause on hover
        const bannerContainer = document.querySelector('.banner-container');
        bannerContainer.addEventListener('mouseenter', stopAutoPlay);
        bannerContainer.addEventListener('mouseleave', startAutoPlay);

    } catch (error) {
        console.error("Failed to load banner:", error);
    }
}

function updateSlide() {
    const bannerTrack = document.getElementById('banner-track');
    const dots = document.querySelectorAll('.banner-dot');

    bannerTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % bannerProducts.length;
    updateSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + bannerProducts.length) % bannerProducts.length;
    updateSlide();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlide();
}

function startAutoPlay() {
    if (slideInterval) return;
    slideInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
}

function stopAutoPlay() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// ===== Product List =====
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
initBanner();
renderProducts();

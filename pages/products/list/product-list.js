// js/index.js

// ===== Banner Slider (Center/Peek Layout) =====
let bannerProducts = [];
let currentSlide = 0;
let slideInterval = null;
const SLIDE_COUNT = 5;
const AUTO_PLAY_DELAY = 4000;

async function initBanner() {
    const bannerTrack = document.getElementById('banner-track');
    const bannerDots = document.getElementById('banner-dots');

    try {
        const products = await API.getProducts();
        bannerProducts = products.slice(0, SLIDE_COUNT);

        // Create slides
        bannerProducts.forEach((product, index) => {
            const slide = document.createElement('div');
            slide.className = `banner-slide${index === 0 ? ' active' : ''}`;
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

        // Initial position
        updateSlide();

        // Start autoplay
        startAutoPlay();

        // Pause on hover
        const bannerContainer = document.querySelector('.banner-container');
        bannerContainer.addEventListener('mouseenter', stopAutoPlay);
        bannerContainer.addEventListener('mouseleave', startAutoPlay);

        // Recalculate on resize
        window.addEventListener('resize', updateSlide);

    } catch (error) {
        console.error("Failed to load banner:", error);
    }
}

function updateSlide() {
    const bannerTrack = document.getElementById('banner-track');
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');

    if (slides.length === 0) return;

    // Update active class on slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    // Calculate translateX for center/peek layout
    const containerWidth = document.querySelector('.banner-container').offsetWidth;
    const slide = slides[0];
    const slideStyle = getComputedStyle(slide);
    const slideWidth = slide.offsetWidth;
    const slideMargin = parseFloat(slideStyle.marginLeft) + parseFloat(slideStyle.marginRight);
    const totalSlideWidth = slideWidth + slideMargin;

    // Center the current slide: offset to center first slide, then move by slide index
    const centerOffset = (containerWidth - slideWidth) / 2 - parseFloat(slideStyle.marginLeft);
    const translateX = centerOffset - (currentSlide * totalSlideWidth);

    bannerTrack.style.transform = `translateX(${translateX}px)`;

    // Update dots
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
async function renderProducts(searchQuery = '') {
    const productList = document.getElementById('product-list');
    
    try {
        let url = 'https://api.wenivops.co.kr/services/open-market/products/';
        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        const products = data.results;

        productList.innerHTML = '';

        if (products.length === 0) {
            productList.innerHTML = `
                <div class="no-results">
                    <p>검색 결과가 없습니다.</p>
                </div>
            `;
            return;
        }

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


const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search') || '';

const searchInput = document.getElementById('search-input');
if (searchInput && searchQuery) {
    searchInput.value = searchQuery;
}

// Initial Load
initBanner();
renderProducts(searchQuery);
setupSearch();

// js/api.js

const mockProducts = [
    {
        product_id: 1,
        product_name: "Hack Your Life 개발자 노트북 파우치",
        image: "https://openmarket.weniv.co.kr/media/products/2026/01/11/IMG_01.jpg", 
        price: 29000,
        shipping_method: "PARCEL", 
        shipping_fee: 3000,
        stock: 50,
        seller_store: "우당탕탕 라이켓의 실험실",
        product_info: "개발자를 위한 힙한 노트북 파우치입니다."
    },
    {
        product_id: 2,
        product_name: "네 개발잡니다 개발자키링 금속키링",
        image: "https://openmarket.weniv.co.kr/media/products/2026/01/11/IMG_02.jpg",
        price: 29000,
        shipping_method: "PARCEL",
        shipping_fee: 3000,
        stock: 30,
        seller_store: "제주코딩베이스캠프",
        product_info: "너두 개발자? 야 나두."
    },
    {
        product_id: 3,
        product_name: "딥러닝 개발자 무릎 담요",
        image: "https://openmarket.weniv.co.kr/media/products/2026/01/11/IMG_03.jpg",
        price: 17500,
        shipping_method: "PARCEL",
        shipping_fee: 0,
        stock: 10,
        seller_store: "백엔드글로벌",
        product_info: "따뜻한 담요와 함께 코딩하세요."
    },
    {
        product_id: 4,
        product_name: "우당탕탕 라이켓의 실험실 스티커 팩",
        image: "https://openmarket.weniv.co.kr/media/products/2026/01/11/IMG_04.jpg",
        price: 12000,
        shipping_method: "PARCEL",
        shipping_fee: 3000,
        stock: 100,
        seller_store: "코딩앤유",
        product_info: "다꾸용 스티커 팩입니다."
    },
    {
        product_id: 5,
        product_name: "버그를 Java라 버그잡는 개리씨 키링",
        image: "https://openmarket.weniv.co.kr/media/products/2026/01/11/IMG_05.jpg",
        price: 15000,
        shipping_method: "PARCEL",
        shipping_fee: 3000,
        stock: 25,
        seller_store: "파이썬스쿨",
        product_info: "버그를 잡아주는 부적 키링."
    }
];

const mockUsers = []; // Will store users here

const API = {
    // Get all products
    getProducts: async () => {
        // Simulate network delay
        return new Promise(resolve => {
            setTimeout(() => resolve(mockProducts), 500);
        });
    },

    // Get product by ID
    getProductDetail: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const product = mockProducts.find(p => p.product_id === parseInt(id));
                if (product) resolve(product);
                else reject("Product not found");
            }, 500);
        });
    },

    // Check ID duplicate (Mock)
    checkIdDuplicate: async (username) => {
        return new Promise(resolve => {
            // Check against existing users (for now, just a simple check)
            const exists = mockUsers.some(u => u.username === username);
            resolve(!exists); // Returns true if available
        });
    },

    // Login
    login: async (username, password, userType) => {
        return new Promise((resolve, reject) => {
            // Verify against mockUsers or hardcoded admin/test users
            // userType: 'BUYER' or 'SELLER'
            
            // Allow a test user
            if (username === 'test' && password === 'test1234') {
                const user = { username: 'test', user_type: userType, name: '테스트유저' };
                resolve({ token: 'mock-jwt-token', user });
            } else if (username === '' || password === '') {
                 reject('FAIL_EMPTY');
            } else {
                reject('FAIL_MISMATCH');
            }
        });
    },

    // Signup
    signup: async (userData) => {
         return new Promise((resolve) => {
            mockUsers.push(userData);
            resolve({ success: true });
        });
    }
};

window.API = API; // Expose to window

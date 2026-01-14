// js/api.js
const API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

const API = {
    // Get all products
    getProducts: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results; // Return the results array from pagination response
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    },

    // Get single product by ID
    getProduct: async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
            throw error;
        }
    },

    login: async(username, password) => {
        const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return data; // 성공 시 결과 반환
        } else {
            // 실패 시 서버의 에러 메시지나 커스텀 에러를 던짐
            throw new Error(data.FAIL_Message || 'AUTH_FAILED');
        }
    }
};

window.API = API; // Expose to window

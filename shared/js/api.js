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
    },

    // Get products for a specific seller
    getSellerProducts: async (sellerName) => {
        const token = localStorage.getItem('access');
        try {
            const response = await fetch(`${API_BASE_URL}/${sellerName}/products/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                // If 403 or 404, might handle differently, but here just throw
                 const errorData = await response.json();
                 throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(response)
            return data.results; 
        } catch (error) {
            console.error('Failed to fetch seller products:', error);
            throw error;
        }
    },

    // Create a new product
    createProduct: async (productData) => {
        const token = localStorage.getItem('access');
        try {
            console.log('Token check:', token);
            const response = await fetch(`${API_BASE_URL}/products/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do not set Content-Type for FormData, browser sets it with boundary
                },
                body: productData
            });

            const data = await response.json();
            if (!response.ok) {
                // Return data even if error, to handle validation messages
                return { success: false, data: data };
            }
            return { success: true, data: data };
        } catch (error) {
            console.error('Failed to create product:', error);
            throw error;
        }
    },

    // Update an existing product
    updateProduct: async (productId, productData) => {
        const token = localStorage.getItem('access');
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}/`, {
                method: 'PUT', // or PATCH if supported/needed
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: productData
            });

            const data = await response.json();
            if (!response.ok) {
                 return { success: false, data: data };
            }
            return { success: true, data: data };
        } catch (error) {
           console.error('Failed to update product:', error);
           throw error;
        }
    },

    // Delete a product
    deleteProduct: async (productId) => {
        const token = localStorage.getItem('access');
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || `Delete failed`);
            }
            return true;
        } catch (error) {
            console.error('Failed to delete product:', error);
            throw error;
        }
    }
};

window.API = API; // Expose to window

// js/api.js
const API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

const API = {
    // Get all products (인증 불필요)
    getProducts: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    },

    // Get single product by ID (인증 불필요)
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

    // 로그인 (인증 불필요)
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
            return data;
        } else {
            throw new Error(data.FAIL_Message || 'AUTH_FAILED');
        }
    },

    // Get products for a specific seller (인증 필요)
    getSellerProducts: async (sellerName) => {
        try {
            const response = await AuthService.fetchWithAuth(`${API_BASE_URL}/${sellerName}/products/`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Failed to fetch seller products:', error);
            throw error;
        }
    },

    // Create a new product (인증 필요)
    createProduct: async (productData) => {
        try {
            const response = await AuthService.fetchWithAuth(`${API_BASE_URL}/products/`, {
                method: 'POST',
                body: productData
            });

            const data = await response.json();
            if (!response.ok) {
                return { success: false, data: data };
            }
            return { success: true, data: data };
        } catch (error) {
            console.error('Failed to create product:', error);
            throw error;
        }
    },

    // Update an existing product (인증 필요)
    updateProduct: async (productId, productData) => {
        try {
            const response = await AuthService.fetchWithAuth(`${API_BASE_URL}/products/${productId}/`, {
                method: 'PUT',
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

    // Delete a product (인증 필요)
    deleteProduct: async (productId) => {
        try {
            const response = await AuthService.fetchWithAuth(`${API_BASE_URL}/products/${productId}/`, {
                method: 'DELETE'
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
    },

    // ============================================
    // Order API (모두 인증 필요)
    // ============================================

    // Create Order
    createOrder: async (orderData) => {
        try {
            const response = await AuthService.fetchWithAuth(`${API_BASE_URL}/order/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, data: data };
            }
            return { success: true, data: data };
        } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
        }
    },

    // Get Order List
    getOrders: async () => {
        try {
            const response = await AuthService.fetchWithAuth(`${API_BASE_URL}/order/`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            throw error;
        }
    },

    // Get Single Order
    getOrder: async (orderId) => {
        try {
            const response = await AuthService.fetchWithAuth(`${API_BASE_URL}/order/${orderId}/`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch order ${orderId}:`, error);
            throw error;
        }
    },

    // Delete (Cancel) Order
    deleteOrder: async (orderId) => {
        try {
            const response = await AuthService.fetchWithAuth(`${API_BASE_URL}/order/${orderId}/`, {
                method: 'DELETE'
            });

            if (response.status === 204) return true;

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Failed to cancel order');
            }
            return data;
        } catch (error) {
            console.error(`Failed to cancel order ${orderId}:`, error);
            throw error;
        }
    }
};

window.API = API;

const API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

const API = {
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

    login: async (username, password) => {
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
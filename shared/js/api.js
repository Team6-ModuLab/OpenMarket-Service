function createApiResponse(success, data, error = null) {
    return { success, data, error };
}

const API = {
    getProducts: async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/products/`);
            if (!response.ok) {
                throw new Error(API_ERRORS.SERVER_ERROR);
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
            const response = await fetch(`${CONFIG.API_BASE_URL}/products/${productId}/`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(API_ERRORS.NOT_FOUND);
                }
                throw new Error(API_ERRORS.SERVER_ERROR);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
            throw error;
        }
    },

    login: async (username, password) => {
        const response = await fetch(`${CONFIG.API_BASE_URL}/accounts/login/`, {
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
            const response = await AuthService.fetchWithAuth(`${CONFIG.API_BASE_URL}/${sellerName}/products/`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || API_ERRORS.SERVER_ERROR);
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
            const response = await AuthService.fetchWithAuth(`${CONFIG.API_BASE_URL}/products/`, {
                method: 'POST',
                body: productData
            });
            const data = await response.json();
            if (!response.ok) {
                return createApiResponse(false, data);
            }
            return createApiResponse(true, data);
        } catch (error) {
            console.error('Failed to create product:', error);
            throw error;
        }
    },

    updateProduct: async (productId, productData) => {
        try {
            const response = await AuthService.fetchWithAuth(`${CONFIG.API_BASE_URL}/products/${productId}/`, {
                method: 'PUT',
                body: productData
            });
            const data = await response.json();
            if (!response.ok) {
                return createApiResponse(false, data);
            }
            return createApiResponse(true, data);
        } catch (error) {
            console.error('Failed to update product:', error);
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        try {
            const response = await AuthService.fetchWithAuth(`${CONFIG.API_BASE_URL}/products/${productId}/`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || API_ERRORS.SERVER_ERROR);
            }
            return true;
        } catch (error) {
            console.error('Failed to delete product:', error);
            throw error;
        }
    },

    createOrder: async (orderData) => {
        try {
            const response = await AuthService.fetchWithAuth(`${CONFIG.API_BASE_URL}/order/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (!response.ok) {
                return createApiResponse(false, data);
            }
            return createApiResponse(true, data);
        } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
        }
    },

    getOrders: async () => {
        try {
            const response = await AuthService.fetchWithAuth(`${CONFIG.API_BASE_URL}/order/`);
            if (!response.ok) {
                throw new Error(API_ERRORS.SERVER_ERROR);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            throw error;
        }
    },

    getOrder: async (orderId) => {
        try {
            const response = await AuthService.fetchWithAuth(`${CONFIG.API_BASE_URL}/order/${orderId}/`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(API_ERRORS.NOT_FOUND);
                }
                throw new Error(API_ERRORS.SERVER_ERROR);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch order ${orderId}:`, error);
            throw error;
        }
    },

    deleteOrder: async (orderId) => {
        try {
            const response = await AuthService.fetchWithAuth(`${CONFIG.API_BASE_URL}/order/${orderId}/`, {
                method: 'DELETE'
            });
            if (response.status === 204) return true;
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || API_ERRORS.SERVER_ERROR);
            }
            return data;
        } catch (error) {
            console.error(`Failed to cancel order ${orderId}:`, error);
            throw error;
        }
    }
};
window.API = API;
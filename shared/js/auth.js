const AuthService = {
    isRefreshing: false,
    refreshQueue: [],

    getAccessToken() {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    getRefreshToken() {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    setAccessToken(token) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    },

    setRefreshToken(token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    clearAuth() {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
        localStorage.removeItem(STORAGE_KEYS.SELLER_NAME);
        localStorage.removeItem(STORAGE_KEYS.BUYER_NAME);
        localStorage.removeItem(STORAGE_KEYS.ACCOUNT_NAME);
    },

    async refreshAccessToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('NO_REFRESH_TOKEN');
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/accounts/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken
            }),
        });

        if (!response.ok) {
            throw new Error('REFRESH_FAILED');
        }
        const data = await response.json();
        this.setAccessToken(data.access);
        if (data.refresh) {
            this.setRefreshToken(data.refresh);
        }

        return data.access;
    },

    async handleRefresh() {
        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.refreshQueue.push({ resolve, reject });
            });
        }

        this.isRefreshing = true;

        try {
            const newToken = await this.refreshAccessToken();
            this.refreshQueue.forEach(({ resolve }) => resolve(newToken));
            this.refreshQueue = [];

            return newToken;
        } catch (error) {
            this.refreshQueue.forEach(({ reject }) => reject(error));
            this.refreshQueue = [];

            throw error;
        } finally {
            this.isRefreshing = false;
        }
    },

    handleLogout() {
        this.clearAuth();
        alert(API_ERRORS.SESSION_EXPIRED);
        if (typeof getPagesBasePath === 'function') {
            const basePath = getPagesBasePath();
            window.location.href = `${basePath}auth/login/index.html`;
        } else {
            const path = window.location.pathname;
            const match = path.match(/\/pages\/(.+)/);
            if (match) {
                const afterPages = match[1];
                const parts = afterPages.split('/');
                const folderCount = parts.length - 1;
                const basePath = '../'.repeat(folderCount);
                window.location.href = `${basePath}auth/login/index.html`;
            } else {
                window.location.href = '/pages/auth/login/index.html';
            }
        }
    },

    async fetchWithAuth(url, options = {}) {
        const token = this.getAccessToken();
        const headers = {
            ...options.headers,
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let response = await fetch(url, {
            ...options,
            headers,
        });
        if (response.status !== 401) {
            return response;
        }
        try {
            const newToken = await this.handleRefresh();
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, {
                ...options,
                headers,
            });

            return response;
        } catch (error) {
            this.handleLogout();
            throw error;
        }
    },

    async initAuth() {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();
        if (!accessToken && !refreshToken) {
            return { isLoggedIn: false };
        }
        if (accessToken) {
            return { isLoggedIn: true };
        }
        if (refreshToken) {
            try {
                await this.handleRefresh();
                return { isLoggedIn: true };
            } catch (error) {
                this.clearAuth();
                return { isLoggedIn: false };
            }
        }
        return { isLoggedIn: false };
    }
};

window.AuthService = AuthService;
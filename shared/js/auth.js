// shared/js/auth.js
// 토큰 관리 및 자동 리프레시 모듈

const AUTH_API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

const AuthService = {
    // 리프레시 중복 방지 플래그
    isRefreshing: false,
    // 리프레시 대기 중인 요청 큐
    refreshQueue: [],

    // ============================================
    // 토큰 저장/조회/삭제
    // ============================================
    getAccessToken() {
        return localStorage.getItem('access');
    },

    getRefreshToken() {
        return localStorage.getItem('refresh');
    },

    setAccessToken(token) {
        localStorage.setItem('access', token);
    },

    setRefreshToken(token) {
        localStorage.setItem('refresh', token);
    },

    // 모든 인증 관련 데이터 삭제
    clearAuth() {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('userType');
        localStorage.removeItem('sellerName');
        localStorage.removeItem('buyerName');
        localStorage.removeItem('account_name');
    },

    // ============================================
    // 리프레시 토큰으로 새 액세스 토큰 발급
    // ============================================
    async refreshAccessToken() {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            throw new Error('NO_REFRESH_TOKEN');
        }

        const response = await fetch(`${AUTH_API_BASE_URL}/accounts/token/refresh/`, {
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

        // 새 액세스 토큰 저장
        this.setAccessToken(data.access);

        // 서버에서 새 리프레시 토큰도 주면 저장
        if (data.refresh) {
            this.setRefreshToken(data.refresh);
        }

        return data.access;
    },

    // ============================================
    // 리프레시 처리 (중복 방지 + 큐 관리)
    // ============================================
    async handleRefresh() {
        // 이미 리프레시 중이면 큐에 추가하고 대기
        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.refreshQueue.push({ resolve, reject });
            });
        }

        this.isRefreshing = true;

        try {
            const newToken = await this.refreshAccessToken();

            // 큐에 대기 중인 요청들 성공 처리
            this.refreshQueue.forEach(({ resolve }) => resolve(newToken));
            this.refreshQueue = [];

            return newToken;
        } catch (error) {
            // 큐에 대기 중인 요청들 실패 처리
            this.refreshQueue.forEach(({ reject }) => reject(error));
            this.refreshQueue = [];

            throw error;
        } finally {
            this.isRefreshing = false;
        }
    },

    // ============================================
    // 로그아웃 처리 (인증 실패 시)
    // ============================================
    handleLogout() {
        this.clearAuth();
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');

        // 현재 경로에서 로그인 페이지로 이동
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
    },

    // ============================================
    // 인증이 필요한 fetch 요청 래퍼
    // ============================================
    async fetchWithAuth(url, options = {}) {
        const token = this.getAccessToken();

        // 헤더에 Authorization 추가
        const headers = {
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // 첫 번째 요청
        let response = await fetch(url, {
            ...options,
            headers,
        });

        // 401 에러가 아니면 그대로 반환
        if (response.status !== 401) {
            return response;
        }

        // 401 에러: 토큰 리프레시 시도
        try {
            const newToken = await this.handleRefresh();

            // 새 토큰으로 재요청
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, {
                ...options,
                headers,
            });

            return response;
        } catch (error) {
            // 리프레시 실패 시 로그아웃
            this.handleLogout();
            throw error;
        }
    },

    // ============================================
    // 앱 초기화 시 토큰 검증 (부팅/새로고침)
    // ============================================
    async initAuth() {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();

        // 토큰이 전혀 없으면 비로그인 상태
        if (!accessToken && !refreshToken) {
            return { isLoggedIn: false };
        }

        // 액세스 토큰이 있으면 일단 로그인 상태로 간주
        // (실제 만료 여부는 API 호출 시 401로 판단)
        if (accessToken) {
            return { isLoggedIn: true };
        }

        // 액세스 토큰은 없지만 리프레시 토큰이 있으면 갱신 시도
        if (refreshToken) {
            try {
                await this.handleRefresh();
                return { isLoggedIn: true };
            } catch (error) {
                // 리프레시 실패 시 비로그인 상태
                this.clearAuth();
                return { isLoggedIn: false };
            }
        }

        return { isLoggedIn: false };
    }
};

// 전역 노출
window.AuthService = AuthService;

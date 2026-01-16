// shared/js/auth.js
// 토큰 관리 및 자동 리프레시 모듈

const AUTH_API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

const AuthService = {
    // 리프레시 중복 방지 플래그
    isRefreshing: false,
    // 리프레시 대기 중인 요청 큐
    refreshQueue: [],
    // 디버그 모드 (콘솔 로깅)
    debug: true,

    log(...args) {
        if (this.debug) {
            console.log('[AuthService]', ...args);
        }
    },

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
            this.log('❌ refresh 토큰 없음');
            throw new Error('NO_REFRESH_TOKEN');
        }

        this.log('🔄 refresh 요청 시작...');

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
            this.log('❌ refresh 요청 실패:', response.status);
            throw new Error('REFRESH_FAILED');
        }

        const data = await response.json();
        this.log('✅ 새 access 토큰 수신:', data.access?.substring(0, 20) + '...');

        // 새 액세스 토큰 저장
        this.setAccessToken(data.access);
        this.log('💾 access 토큰 저장 완료');

        // 서버에서 새 리프레시 토큰도 주면 저장
        if (data.refresh) {
            this.setRefreshToken(data.refresh);
            this.log('💾 refresh 토큰도 갱신됨');
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
        this.log('⚠️ 401 에러 발생 → 토큰 갱신 시도');
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

        this.log('🚀 initAuth 시작');
        this.log('  - access 토큰:', accessToken ? '있음' : '없음');
        this.log('  - refresh 토큰:', refreshToken ? '있음' : '없음');

        // 토큰이 전혀 없으면 비로그인 상태
        if (!accessToken && !refreshToken) {
            this.log('➡️ 토큰 없음 → 비로그인');
            return { isLoggedIn: false };
        }

        // 액세스 토큰이 있으면 일단 로그인 상태로 간주
        // (실제 만료 여부는 API 호출 시 401로 판단)
        if (accessToken) {
            this.log('➡️ access 있음 → 로그인 상태');
            return { isLoggedIn: true };
        }

        // 액세스 토큰은 없지만 리프레시 토큰이 있으면 갱신 시도
        if (refreshToken) {
            this.log('➡️ access 없음, refresh 있음 → 갱신 시도');
            try {
                await this.handleRefresh();
                this.log('✅ 갱신 성공 → 로그인 상태');
                return { isLoggedIn: true };
            } catch (error) {
                // 리프레시 실패 시 비로그인 상태
                this.log('❌ 갱신 실패 → 비로그인');
                this.clearAuth();
                return { isLoggedIn: false };
            }
        }

        return { isLoggedIn: false };
    }
};

// 전역 노출
window.AuthService = AuthService;

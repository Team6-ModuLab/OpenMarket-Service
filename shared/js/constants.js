// =============================================
// constants.js - 전역 상수 정의
// =============================================

// API 설정
const CONFIG = {
    API_BASE_URL: 'https://api.wenivops.co.kr/services/open-market'
};

// localStorage 키
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access',
    REFRESH_TOKEN: 'refresh',
    USER_TYPE: 'userType',
    SELLER_NAME: 'sellerName',
    BUYER_NAME: 'buyerName',
    ACCOUNT_NAME: 'account_name',
    ORDER_DATA: 'order_data',
    CART: 'cart',
    RETURN_URL: 'returnUrl'
};

// 사용자 유형
const USER_TYPES = {
    SELLER: 'SELLER',
    BUYER: 'BUYER'
};

// 아이콘 이름
const ICON_NAMES = {
    DELETE: 'delete',
    MINUS: 'minus',
    PLUS: 'plus',
    SHOPPING_CART: 'shopping-cart',
    USER: 'user',
    INSTA: 'insta',
    FB: 'fb',
    YT: 'yt'
};

// API 에러 메시지
const API_ERRORS = {
    NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
    NOT_FOUND: '해당 항목을 찾을 수 없습니다.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다.',
    SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.'
};

// 주문 상태
const ORDER_STATUS = {
    PAYMENT_PENDING: 'payment_pending',
    PAYMENT_COMPLETE: 'payment_complete',
    PREPARING: 'preparing',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    CANCELLED: 'cancled' // API 스펙에 맞춤 (typo)
};

// 주문 상태 한글 매핑
const ORDER_STATUS_TEXT = {
    'payment_pending': '입금 확인 중',
    'payment_complete': '결제 완료',
    'preparing': '배송 준비 중',
    'shipping': '배송 중',
    'delivered': '배송 완료',
    'cancled': '주문 취소',
    'cancelled': '주문 취소'
};

// 결제 방법 한글 매핑
const PAYMENT_METHOD_TEXT = {
    'card': '신용카드',
    'deposit': '무통장입금',
    'phone': '휴대폰결제',
    'naverpay': '네이버페이',
    'kakaopay': '카카오페이'
};

// 전역 노출
window.CONFIG = CONFIG;
window.STORAGE_KEYS = STORAGE_KEYS;
window.USER_TYPES = USER_TYPES;
window.ICON_NAMES = ICON_NAMES;
window.API_ERRORS = API_ERRORS;
window.ORDER_STATUS = ORDER_STATUS;
window.ORDER_STATUS_TEXT = ORDER_STATUS_TEXT;
window.PAYMENT_METHOD_TEXT = PAYMENT_METHOD_TEXT;

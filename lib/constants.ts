export const PRODUCT_CATEGORIES = [
    { name: 'Điện thoại', slug: 'phone' },
    { name: 'Laptop', slug: 'laptop' },
    { name: 'Tai nghe', slug: 'headphone' },
    { name: 'Đồng hồ', slug: 'watch' },
    { name: 'Máy ảnh', slug: 'camera' },
    { name: 'Phụ kiện', slug: 'accessory' },
];

export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHODS = ['COD', 'VNPAY', 'MOMO', 'BANKING', 'ZALOPAY'];

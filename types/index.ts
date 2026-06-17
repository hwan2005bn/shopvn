export interface User {
    id: string;
    email: string;
    name: string;
    password?: string;
    role: 'user' | 'admin';
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    rating: number;
    reviewCount: number; // ← ĐÃ SỬA
    createdAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    userName: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: Address;
    paymentMethod: string;
    createdAt: string;
}

export interface Address {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    productId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

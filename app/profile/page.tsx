'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, User as UserIcon, MapPin, Phone, Mail } from 'lucide-react';

interface Order {
    id: string;
    total: number;
    discount: number;
    finalTotal: number;
    status: string;
    voucherCode: string | null;
    paymentMethod: string;
    createdAt: string;
    items: Array<{
        id: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
    }>;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Đã huỷ', color: 'bg-red-100 text-red-700' },
    paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
};

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [tab, setTab] = useState<'info' | 'orders'>('info');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchOrders();
        }
    }, [user, loading, router]);

    const fetchOrders = async () => {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
    };

    if (loading || !user) {
        return <div className="max-w-4xl mx-auto px-4 py-20 text-center">Đang tải...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Tài khoản của tôi</h1>

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    onClick={() => setTab('info')}
                    className={`px-6 py-3 font-semibold ${tab === 'info' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
                        }`}
                >
                    Thông tin cá nhân
                </button>
                <button
                    onClick={() => setTab('orders')}
                    className={`px-6 py-3 font-semibold ${tab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
                        }`}
                >
                    Đơn hàng ({orders.length})
                </button>
            </div>

            {/* Tab thông tin */}
            {tab === 'info' && (
                <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
                    <div className="flex items-center gap-4 pb-4 border-b">
                        <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-gray-500">
                                {user.role === 'admin' ? '👑 Quản trị viên' : 'Khách hàng'}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            <span>ID: {user.id}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab đơn hàng */}
            {tab === 'orders' && (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
                            <Link
                                href="/products"
                                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                Mua sắm ngay
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                                    <div>
                                        <p className="font-bold">Đơn #{order.id.slice(-8).toUpperCase()}</p>
                                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded text-xs font-semibold ${statusLabels[order.status]?.color || 'bg-gray-100'
                                            }`}
                                    >
                                        {statusLabels[order.status]?.label || order.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatPrice(item.price)} x {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-sm">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-3 space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Tạm tính:</span>
                                        <span>{formatPrice(order.total)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Voucher ({order.voucherCode}):</span>
                                            <span>-{formatPrice(order.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Tổng cộng:</span>
                                        <span className="text-blue-600">
                                            {formatPrice(order.finalTotal || order.total)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {order.address}, {order.ward}, {order.district}, {order.city}
                                    </p>
                                    <p className="flex items-center gap-2 mt-1">
                                        <Phone className="w-4 h-4" />
                                        {order.phone}
                                    </p>
                                    <p className="mt-1">Thanh toán: {order.paymentMethod}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, Eye, X } from 'lucide-react';

interface Order {
    id: string;
    userName: string;
    total: number;
    discount: number;
    finalTotal: number;
    status: string;
    voucherCode: string | null;
    paymentMethod: string;
    createdAt: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    items: Array<{
        id: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
    }>;
}

const statuses = [
    { value: 'pending', label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { value: 'processing', label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { value: 'shipped', label: 'Đang giao', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { value: 'delivered', label: 'Đã giao', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { value: 'cancelled', label: 'Đã huỷ', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
];

export default function AdminOrdersPage() {
    const router = useRouter();

    const { user, loading, isAdmin } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selected, setSelected] = useState<Order | null>(null);

    useEffect(() => {
        if (!loading && (!user || !isAdmin) && user !== null) {
            router.push('/login');
            return;
        }
        if (user) fetchOrders();
    }, [user, loading, isAdmin, router]);

    const fetchOrders = async () => {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
    };

    const updateStatus = async (id: string, status: string) => {
        await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        fetchOrders();
        if (selected?.id === id) setSelected({ ...selected, status });
    };

    const filtered = orders.filter((o) => {
        const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.userName.toLowerCase().includes(search.toLowerCase()) ||
            o.phone.includes(search);
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Đang tải...</div>;

    if (!user || !isAdmin) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">📦 Quản lý đơn hàng</h1>

            {/* Filter */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row gap-3 border dark:border-gray-800">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                        placeholder="Tìm theo mã đơn, tên, SĐT..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tất cả trạng thái</option>
                    {statuses.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-x-auto border dark:border-gray-800">
                <table className="w-full text-gray-900 dark:text-gray-100">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-b dark:border-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Mã đơn</th>
                            <th className="px-4 py-3 text-left font-semibold">Khách hàng</th>
                            <th className="px-4 py-3 text-left font-semibold">Ngày</th>
                            <th className="px-4 py-3 text-left font-semibold">Tổng</th>
                            <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
                            <th className="px-4 py-3 text-left font-semibold">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-800">
                        {filtered.map((o) => {
                            const st = statuses.find((s) => s.value === o.status);
                            return (
                                <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="px-4 py-3 font-mono text-sm text-blue-600 dark:text-blue-400">#{o.id.slice(-8).toUpperCase()}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{o.userName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{o.phone}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{formatDate(o.createdAt)}</td>
                                    <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                                        {formatPrice(o.finalTotal || o.total)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={o.status}
                                            onChange={(e) => updateStatus(o.id, e.target.value)}
                                            className={`px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer outline-none ${st?.color || 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {statuses.map((s) => (
                                                <option key={s.value} value={s.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{s.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelected(o)}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">Không có đơn hàng nào</p>
                )}
            </div>

            {/* Modal chi tiết */}
            {selected && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border dark:border-gray-800 shadow-2xl">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-gray-800">
                            <h2 className="text-xl font-bold">Đơn #{selected.id.slice(-8).toUpperCase()}</h2>
                            <button onClick={() => setSelected(null)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Khách hàng</h3>
                                <p className="font-medium">{selected.fullName} - {selected.phone}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                    {selected.address}, {selected.ward}, {selected.district}, {selected.city}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Sản phẩm</h3>
                                <div className="space-y-1 max-h-[30vh] overflow-y-auto pr-1">
                                    {selected.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 py-2 border-b dark:border-gray-800 last:border-0">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border dark:border-gray-800" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatPrice(item.price)} x {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2 pt-3 border-t dark:border-gray-800">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Tạm tính:</span><span>{formatPrice(selected.total)}</span>
                                </div>
                                {selected.discount > 0 && (
                                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                        <span>Voucher {selected.voucherCode}:</span><span>-{formatPrice(selected.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-800">
                                    <span>Tổng cộng:</span><span className="text-blue-600 dark:text-blue-400">{formatPrice(selected.finalTotal || selected.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

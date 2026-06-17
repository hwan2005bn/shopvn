'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Power, X, Copy } from 'lucide-react';

interface Voucher {
    id: string;
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minOrderValue: number;
    maxDiscount: number | null;
    usageLimit: number;
    usageCount: number;
    userLimit: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export default function AdminVouchersPage() {
    const router = useRouter();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        code: '',
        description: '',
        discountType: 'percent',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscount: 0,
        usageLimit: 0,
        userLimit: 1,
        endDate: '',
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user || JSON.parse(user).role !== 'admin') {
            router.push('/login');
            return;
        }
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        const res = await fetch('/api/vouchers');
        const data = await res.json();
        setVouchers(data.vouchers || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/vouchers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (data.success) {
            alert('✅ Tạo voucher thành công!');
            setShowForm(false);
            setForm({
                code: '',
                description: '',
                discountType: 'percent',
                discountValue: 0,
                minOrderValue: 0,
                maxDiscount: 0,
                usageLimit: 0,
                userLimit: 1,
                endDate: '',
            });
            fetchVouchers();
        } else {
            alert('❌ ' + data.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xoá voucher này?')) return;
        await fetch(`/api/vouchers/${id}`, { method: 'DELETE' });
        fetchVouchers();
    };

    const handleToggle = async (id: string, isActive: boolean) => {
        await fetch(`/api/vouchers/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: !isActive }),
        });
        fetchVouchers();
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Đã copy: ${code}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">🎟️ Quản lý Voucher</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Tạo voucher
                </button>
            </div>

            {/* Modal tạo voucher */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Tạo Voucher mới</h2>
                            <button onClick={() => setShowForm(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                required
                                placeholder="Mã code (VD: SALE50)"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input
                                required
                                placeholder="Mô tả"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <select
                                value={form.discountType}
                                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="percent">Giảm theo %</option>
                                <option value="fixed">Giảm số tiền cố định</option>
                            </select>
                            <input
                                required
                                type="number"
                                placeholder={form.discountType === 'percent' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VND)'}
                                value={form.discountValue}
                                onChange={(e) => setForm({ ...form, discountValue: +e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            {form.discountType === 'percent' && (
                                <input
                                    type="number"
                                    placeholder="Giảm tối đa (VND) - tuỳ chọn"
                                    value={form.maxDiscount}
                                    onChange={(e) => setForm({ ...form, maxDiscount: +e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            )}
                            <input
                                type="number"
                                placeholder="Đơn tối thiểu (VND)"
                                value={form.minOrderValue}
                                onChange={(e) => setForm({ ...form, minOrderValue: +e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Tổng lượt dùng (0 = không giới hạn)"
                                value={form.usageLimit}
                                onChange={(e) => setForm({ ...form, usageLimit: +e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Mỗi user dùng tối đa"
                                value={form.userLimit}
                                onChange={(e) => setForm({ ...form, userLimit: +e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input
                                required
                                type="date"
                                placeholder="Ngày hết hạn"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded"
                            >
                                Tạo voucher
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Danh sách voucher */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Mã</th>
                            <th className="px-4 py-3 text-left">Mô tả</th>
                            <th className="px-4 py-3 text-left">Giảm</th>
                            <th className="px-4 py-3 text-left">Đã dùng</th>
                            <th className="px-4 py-3 text-left">Hết hạn</th>
                            <th className="px-4 py-3 text-left">Trạng thái</th>
                            <th className="px-4 py-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((v) => (
                            <tr key={v.id} className="border-t">
                                <td className="px-4 py-3 font-mono font-bold">{v.code}</td>
                                <td className="px-4 py-3 text-sm">{v.description}</td>
                                <td className="px-4 py-3">
                                    {v.discountType === 'percent'
                                        ? `${v.discountValue}%`
                                        : `${v.discountValue.toLocaleString('vi-VN')}đ`}
                                </td>
                                <td className="px-4 py-3">
                                    {v.usageCount} / {v.usageLimit || '∞'}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {new Date(v.endDate).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {v.isActive ? 'Hoạt động' : 'Tắt'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => copyCode(v.code)}
                                            className="p-1 text-gray-500 hover:text-blue-600"
                                            title="Copy mã"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleToggle(v.id, v.isActive)}
                                            className="p-1 text-gray-500 hover:text-yellow-600"
                                            title={v.isActive ? 'Tắt' : 'Bật'}
                                        >
                                            <Power className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(v.id)}
                                            className="p-1 text-gray-500 hover:text-red-600"
                                            title="Xoá"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {vouchers.length === 0 && (
                    <p className="text-center py-8 text-gray-500">Chưa có voucher nào</p>
                )}
            </div>
        </div>
    );
}

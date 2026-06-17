'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
    const router = useRouter();
    const items = useCartStore((s) => s.items);
    const totalPrice = useCartStore((s) => s.totalPrice);
    const clearCart = useCartStore((s) => s.clearCart);

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    // ĐÃ ĐƯA VÀO TRONG COMPONENT: Các state liên quan tới Voucher
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [voucherMessage, setVoucherMessage] = useState('');

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        paymentMethod: 'COD',
    });

    useEffect(() => {
        // Check user
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Vui lòng đăng nhập để thanh toán');
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userStr));
        setForm((prev) => ({ ...prev, fullName: JSON.parse(userStr).name }));
    }, [router]);

    useEffect(() => {
        if (user && items.length === 0) {
            alert('Giỏ hàng trống!');
            router.push('/products');
        }
    }, [user, items, router]);

    // ĐÃ ĐƯA VÀO TRONG COMPONENT: Hàm áp dụng mã giảm giá
    const applyVoucher = async () => {
        if (!voucherCode) return;
        setLoading(true);
        setVoucherMessage('');

        try {
            const res = await fetch('/api/vouchers/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: voucherCode, orderTotal: totalPrice() }),
            });

            const data = await res.json();
            if (data.success) {
                setVoucherDiscount(data.discount);
                setVoucherMessage(`✅ Áp dụng thành công! Giảm ${data.discount.toLocaleString('vi-VN')}đ`);
            } else {
                setVoucherDiscount(0);
                setVoucherMessage('❌ ' + data.error);
            }
        } catch (err) {
            setVoucherMessage('❌ Lỗi kiểm tra voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }
        setLoading(true);

        try { // ĐÃ SỬA: Thêm dấu mở ngoặc '{' cho block try bị thiếu ở đây
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingAddress: form,
                    paymentMethod: form.paymentMethod,
                    voucherCode: voucherDiscount > 0 ? voucherCode : null,
                }),
            });

            const data = await res.json();
            if (data.success) {
                alert('✅ Đặt hàng thành công! Mã đơn: ' + data.order.id);
                clearCart();
                router.push(`/payment/${data.order.id}`);
            } else {
                alert('❌ ' + (data.error || 'Có lỗi xảy ra'));
            }
        } catch (err) {
            alert('❌ Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    if (!user || items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form nhập thông tin */}
                <form onSubmit={handleSubmit} className="md:col-span-2 bg-white p-6 rounded-lg shadow space-y-4">
                    <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>
                    <input
                        required
                        placeholder="Họ tên"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <input
                        required
                        placeholder="Số điện thoại"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <input
                        required
                        placeholder="Địa chỉ cụ thể"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                            required
                            placeholder="Tỉnh/TP"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            className="px-4 py-2 border rounded"
                        />
                        <input
                            required
                            placeholder="Quận/Huyện"
                            value={form.district}
                            onChange={(e) => setForm({ ...form, district: e.target.value })}
                            className="px-4 py-2 border rounded"
                        />
                        <input
                            required
                            placeholder="Phường/Xã"
                            value={form.ward}
                            onChange={(e) => setForm({ ...form, ward: e.target.value })}
                            className="px-4 py-2 border rounded"
                        />
                    </div>

                    <h2 className="text-xl font-semibold pt-4">Phương thức thanh toán</h2>
                    <select
                        value={form.paymentMethod}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2 border rounded mb-4"
                    >
                        <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                        <option value="BANK">Chuyển khoản ngân hàng</option>
                        <option value="MOMO">Ví MoMo</option>
                    </select>

                    {/* ĐÃ LỒNG VÀO ĐÚNG VỊ TRÍ: Phần nhập voucher */}
                    <div className="border-t pt-4">
                        <label className="font-semibold text-sm text-gray-700">Mã giảm giá (không bắt buộc)</label>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                placeholder="Nhập mã voucher"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                className="flex-1 px-3 py-2 border rounded text-sm"
                            />
                            <button
                                type="button"
                                onClick={applyVoucher}
                                disabled={!voucherCode || loading}
                                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400 transition"
                            >
                                Áp dụng
                            </button>
                        </div>
                        {voucherMessage && (
                            <p className={`mt-2 text-xs font-medium ${voucherDiscount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {voucherMessage}
                            </p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                        </button>
                    </div>
                </form>

                {/* Tóm tắt đơn hàng (Bên cột phải) */}
                <div className="bg-white p-6 rounded-lg shadow h-fit space-y-4">
                    <h2 className="text-xl font-bold mb-4">Đơn hàng của bạn</h2>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {items.map((i) => (
                            <div key={i.product.id} className="flex justify-between text-sm border-b pb-2">
                                <div>
                                    <p className="font-medium">{i.product.name}</p>
                                    <p className="text-gray-500">x{i.quantity}</p>
                                </div>
                                <p className="font-semibold">{formatPrice(i.product.price * i.quantity)}</p>
                            </div>
                        ))}
                    </div>

                    {/* ĐÃ LỒNG VÀO ĐÚNG VỊ TRÍ: Phần tính toán tổng tiền mới sau giảm giá */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Tạm tính:</span>
                            <span>{formatPrice(totalPrice())}</span>
                        </div>
                        {voucherDiscount > 0 && (
                            <div className="flex justify-between text-sm text-green-600 font-medium">
                                <span>Giảm giá:</span>
                                <span>-{formatPrice(voucherDiscount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Tổng cộng:</span>
                            <span className="text-blue-600">{formatPrice(totalPrice() - voucherDiscount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
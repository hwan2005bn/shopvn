'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
                <Link href="/products" className="text-blue-600 hover:underline">
                    Tiếp tục mua sắm →
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.product.id} className="bg-white p-4 rounded-lg shadow flex space-x-4">
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p className="text-blue-600 font-bold">
                                    {formatPrice(item.product.price)}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center border rounded">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            className="px-2 py-1"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-3 py-1 border-x">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            className="px-2 py-1"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.product.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={clearCart}
                        className="text-red-500 hover:underline"
                    >
                        Xóa tất cả
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h2 className="text-xl font-bold mb-4">Tổng đơn hàng</h2>
                    <div className="space-y-2 mb-4">
                        {items.map((i) => (
                            <div key={i.product.id} className="flex justify-between text-sm">
                                <span>{i.product.name} x {i.quantity}</span>
                                <span>{formatPrice(i.product.price * i.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 mb-4">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Tổng cộng:</span>
                            <span className="text-blue-600">{formatPrice(totalPrice())}</span>
                        </div>
                    </div>
                    <Link
                        href="/checkout"
                        className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
                    >
                        Thanh toán
                    </Link>
                </div>
            </div>
        </div>
    );
}

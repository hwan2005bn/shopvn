'use client';
import ReviewSection from '@/components/ReviewSection';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingCart, Minus, Plus } from 'lucide-react';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((s) => s.addItem);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((r) => r.json())
            .then((d) => {
                setProduct(d.product);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center py-20">Đang tải...</div>;
    if (!product) return <div className="text-center py-20">Không tìm thấy sản phẩm</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <div className="flex items-center mb-4">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-2">{product.rating} ({product.reviewCount} đánh giá)</span>
                    </div>
                    <p className="text-4xl font-bold text-blue-600 mb-6">
                        {formatPrice(product.price)}
                    </p>
                    <p className="text-gray-700 mb-6">{product.description}</p>
                    <p className="mb-6">
                        <span className="font-semibold">Tình trạng:</span>{' '}
                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                        </span>
                    </p>

                    <div className="flex items-center space-x-4 mb-6">
                        <span className="font-semibold">Số lượng:</span>
                        <div className="flex items-center border rounded">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-2"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="px-3 py-2"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => {
                                addItem(product, quantity);
                                alert('Đã thêm vào giỏ hàng!');
                            }}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Thêm vào giỏ</span>
                        </button>
                        <button
                            onClick={() => {
                                addItem(product, quantity);
                                router.push('/cart');
                            }}
                            className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                        >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
            <ReviewSection productId={product.id} />
        </div>

    );
}

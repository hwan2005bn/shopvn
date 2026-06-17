'use client';

import toast from 'react-hot-toast';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((s) => s.addItem);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
            <Link href={`/products/${product.id}`}>
                <div className="relative overflow-hidden aspect-square">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    {product.stock < 20 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Sắp hết
                        </span>
                    )}
                </div>
            </Link>
            <div className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 min-h-[3rem]">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center mt-2">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">
                            {product.rating} ({product.reviewCount})
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-blue-600">
                        {formatPrice(product.price)}
                    </span>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addItem(product);
                            toast.success('Đã thêm vào giỏ hàng!');
                        }}
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

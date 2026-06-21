'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

import { ProductCardSkeleton } from '@/components/Skeleton';
import { Product } from '@/types';
import { Search } from 'lucide-react';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const category = searchParams.get('category');


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (debouncedSearch) params.append('search', debouncedSearch);

                const res = await fetch(`/api/products?${params}`);
                const data = await res.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Lỗi nạp sản phẩm từ PostgreSQL:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, debouncedSearch]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Tương thích Dark Mode cho Tiêu đề */}
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white transition-colors">
                {category ? `Danh mục: ${category}` : 'Tất cả sản phẩm'}
            </h1>

            {/* Tương thích Dark Mode cho Thanh Tìm kiếm */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                />
            </div>

            {loading ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : products.length === 0 ? (

                <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-medium">
                    Không tìm thấy sản phẩm nào phù hợp
                </div>
            ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}
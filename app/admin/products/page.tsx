'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState({
        name: '', description: '', price: 0, image: '', category: 'phone', stock: 0,
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user || JSON.parse(user).role !== 'admin') {
            router.push('/login');
            return;
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editing ? `/api/products/${editing.id}` : '/api/products';
        const method = editing ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            fetchProducts();
            setShowForm(false);
            setEditing(null);
            setForm({ name: '', description: '', price: 0, image: '', category: 'phone', stock: 0 });
        } else {
            alert('Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa sản phẩm này?')) return;
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    const handleEdit = (p: Product) => {
        setEditing(p);
        setForm({
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            category: p.category,
            stock: p.stock,
        });
        setShowForm(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
                <button
                    onClick={() => { setShowForm(true); setEditing(null); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm SP</span>
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
                            </h2>
                            <button onClick={() => setShowForm(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                required
                                placeholder="Tên sản phẩm"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <textarea
                                required
                                placeholder="Mô tả"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input
                                required
                                type="number"
                                placeholder="Giá"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: +e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input
                                required
                                placeholder="URL hình ảnh"
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="phone">Điện thoại</option>
                                <option value="laptop">Laptop</option>
                                <option value="headphone">Tai nghe</option>
                                <option value="watch">Đồng hồ</option>
                                <option value="camera">Máy ảnh</option>
                                <option value="accessory">Phụ kiện</option>
                            </select>
                            <input
                                required
                                type="number"
                                placeholder="Số lượng"
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: +e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded"
                            >
                                {editing ? 'Cập nhật' : 'Thêm'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Hình</th>
                            <th className="px-4 py-3 text-left">Tên</th>
                            <th className="px-4 py-3 text-left">Giá</th>
                            <th className="px-4 py-3 text-left">Kho</th>
                            <th className="px-4 py-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="px-4 py-3">
                                    <img src={p.image} className="w-16 h-16 object-cover rounded" />
                                </td>
                                <td className="px-4 py-3">{p.name}</td>
                                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                                <td className="px-4 py-3">{p.stock}</td>
                                <td className="px-4 py-3 space-x-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

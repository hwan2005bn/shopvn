import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';

export default async function AdminDashboard() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') redirect('/login');

    const products = await db.getAllProducts();
    const orders = await db.getAllOrders();

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Sản phẩm</p>
                            <p className="text-2xl font-bold">{products.length}</p>
                        </div>
                        <Package className="w-10 h-10 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Đơn hàng</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                        <ShoppingBag className="w-10 h-10 text-green-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Doanh thu</p>
                            <p className="text-2xl font-bold">
                                {new Intl.NumberFormat('vi-VN').format(totalRevenue)}đ
                            </p>
                        </div>
                        <DollarSign className="w-10 h-10 text-yellow-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Users</p>
                            { }
                            <p className="text-2xl font-bold">2</p>
                        </div>
                        <Users className="w-10 h-10 text-purple-500" />
                    </div>
                </div>
            </div>

            <div className="flex space-x-4">
                <a href="/admin/products" className="bg-blue-600 text-white px-6 py-3 rounded">
                    Quản lý sản phẩm
                </a>
                <a href="/admin/orders" className="bg-green-600 text-white px-6 py-3 rounded">
                    Quản lý đơn hàng
                </a>
            </div>
        </div>
    );
}
'use client';
import { useState } from 'react';
import { registerSchema } from '@/lib/validations';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    // State lưu trữ danh sách lỗi hiển thị dưới chân các ô Input
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({}); // Reset lỗi cũ

        // 1. CHẶN VÀ KIỂM TRA LỖI NGAY TẠI CLIENT
        const result = registerSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: { [key: string]: string } = {};
            // Duyệt qua danh sách lỗi của Zod và đẩy vào State
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                fieldErrors[path] = issue.message;
            });
            setErrors(fieldErrors);
            return; // Dừng xử lý, không gửi Request lên Server nữa
        }

        // 2. GỬI DATA LÊN SERVER NẾU HỢP LỆ
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (data.success) {
                toast.success('Đăng ký thành công!');
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Đăng ký tài khoản</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ô Nhập Tên */}
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Họ và tên</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                </div>

                {/* Ô Nhập Email */}
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Email</label>
                    <input
                        type="text"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>

                {/* Ô Nhập Mật khẩu */}
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Mật khẩu</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className={`w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-semibold disabled:bg-gray-400"
                >
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </form>
        </div>
    );
}
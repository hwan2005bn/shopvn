'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Đăng nhập thành công!');
            router.push(data.user.role === 'admin' ? '/admin' : '/');
            router.refresh();
        } else {
            setError(data.error);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-6">Đăng nhập</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
                <input
                    type="email"
                    required
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                />
                <input
                    type="password"
                    required
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
                <p className="text-center text-sm">
                    Chưa có tài khoản? <Link href="/register" className="text-blue-600">Đăng ký</Link>
                </p>
            </form>
        </div>
    );
}

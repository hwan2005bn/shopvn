'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, LogOut, Shield } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useRouter, usePathname } from 'next/navigation';
// Import nút chuyển đổi Dark Mode bạn vừa cấu hình
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Khắc phục Hydration: Chỉ render các dữ liệu động (Giỏ hàng/User) sau khi đã Mounted ở Client
    const [isMounted, setIsMounted] = useState(false);

    const totalItems = useCartStore((s) => s.totalItems());
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, [pathname]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🛍️</span>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">ShopVN</span>
                    </Link>

                    {/* Menu desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                            Trang chủ
                        </Link>
                        <Link href="/products" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                            Sản phẩm
                        </Link>

                        {/* 1. NÚT BẬT DARK MODE TRÊN DESKTOP */}
                        <ThemeToggle />

                        {/* Giỏ hàng */}
                        <Link href="/cart" className="relative text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                            <ShoppingCart className="w-6 h-6" />
                            {isMounted && totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {user?.role === 'admin' && (
                            <Link href="/admin/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                                📦 Quản lý đơn hàng
                            </Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link href="/admin/vouchers" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                                🎟️ Quản lý Voucher
                            </Link>
                        )}

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                >
                                    <User className="w-6 h-6" />
                                    <span>{user.name}</span>
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700">
                                        <Link
                                            href="/profile"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                        >
                                            Tài khoản
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium"
                                            >
                                                <Shield className="w-4 h-4 inline mr-2" />
                                                Quản trị
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                                        >
                                            <LogOut className="w-4 h-4 inline mr-2" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link href="/login" className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded font-medium">
                                    Đăng nhập
                                </Link>
                                <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Nút bấm Menu Mobile & DarkMode nhóm lại */}
                    <div className="flex md:hidden items-center space-x-4">
                        {/* 2. NÚT BẬT DARK MODE TRÊN MOBILE */}
                        <ThemeToggle />

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-gray-700 dark:text-gray-200"
                            aria-label="Toggle Menu"
                        >
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Menu rút gọn trên Mobile */}
                {menuOpen && (
                    <div className="md:hidden pb-4 space-y-2 border-t dark:border-gray-800 pt-2">
                        <Link href="/" className="block py-2 text-gray-700 dark:text-gray-200 font-medium">
                            Trang chủ
                        </Link>
                        <Link href="/products" className="block py-2 text-gray-700 dark:text-gray-200 font-medium">
                            Sản phẩm
                        </Link>
                        <Link href="/cart" className="block py-2 text-gray-700 dark:text-gray-200 font-medium">
                            Giỏ hàng {isMounted ? `(${totalItems})` : '(0)'}
                        </Link>

                        {user ? (
                            <>
                                <Link href="/profile" className="block py-2 text-gray-700 dark:text-gray-200 font-medium">
                                    Tài khoản: <span className="text-blue-600 dark:text-blue-400">{user.name}</span>
                                </Link>
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="block py-2 text-blue-600 dark:text-blue-400 font-medium">
                                        <Shield className="w-4 h-4 inline mr-1" /> Trang quản trị
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block py-2 text-red-600 dark:text-red-400 w-full text-left font-medium"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2 pt-2">
                                <Link href="/login" className="w-full text-center py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded font-medium">
                                    Đăng nhập
                                </Link>
                                <Link href="/register" className="w-full text-center py-2 bg-blue-600 text-white rounded font-medium">
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
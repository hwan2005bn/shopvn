'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Menu, X, LogOut, Shield, Package, Ticket } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Khắc phục Hydration cho dữ liệu động từ Store / LocalStorage
    const [isMounted, setIsMounted] = useState(false);

    const totalItems = useCartStore((s) => s.totalItems());
    const router = useRouter();
    const pathname = usePathname();

    // Refs hỗ trợ tính năng click outside
    const userMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, [pathname]);

    // Xử lý đóng các menu khi click ra ngoài hoặc nhấn phím Escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setUserMenuOpen(false);
                setMenuOpen(false);
            }
        };

        if (userMenuOpen || menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [userMenuOpen, menuOpen]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.removeItem('user');
            setUser(null);
            setUserMenuOpen(false);
            setMenuOpen(false);
            toast.success('Đã đăng xuất!');
            router.push('/');
            router.refresh();
        } catch {
            toast.error('Có lỗi xảy ra khi đăng xuất');
        }
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

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                            Trang chủ
                        </Link>
                        <Link href="/products" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                            Sản phẩm
                        </Link>
                        <Link href="/promotions" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                            Khuyến mãi
                        </Link>
                        <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                            Liên hệ
                        </Link>

                        {/* Nút chuyển đổi giao diện trên Desktop */}
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

                        {/* User Dropdown Menu */}
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
                                >
                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold/90">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden lg:inline">{user.name}</span>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700 transition duration-150">
                                        <div className="px-4 py-2 border-b dark:border-gray-700">
                                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            href="/profile"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                                        >
                                            <User className="w-4 h-4" /> Tài khoản
                                        </Link>

                                        {user.role === 'admin' && (
                                            <>
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-blue-600 dark:text-blue-400 font-medium"
                                                >
                                                    <Shield className="w-4 h-4" /> Dashboard
                                                </Link>
                                                <Link
                                                    href="/admin/orders"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                                                >
                                                    <Package className="w-4 h-4" /> Đơn hàng
                                                </Link>
                                                <Link
                                                    href="/admin/vouchers"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                                                >
                                                    <Ticket className="w-4 h-4" /> Voucher
                                                </Link>
                                            </>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-sm border-t dark:border-gray-700 mt-1"
                                        >
                                            <LogOut className="w-4 h-4" /> Đăng xuất
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

                    {/* Khối điều khiển trên Mobile (Gồm DarkMode + Hamburger Button) */}
                    <div className="flex md:hidden items-center space-x-3">
                        <ThemeToggle />
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            aria-label="Toggle Menu"
                        >
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Menu rút gọn Mobile */}
                {menuOpen && (
                    <div ref={mobileMenuRef} className="md:hidden pb-4 space-y-2 border-t dark:border-gray-800 pt-2">
                        <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium">
                            Trang chủ
                        </Link>
                        <Link href="/products" onClick={() => setMenuOpen(false)} className="block py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium">
                            Sản phẩm
                        </Link>
                        <Link href="/promotions" onClick={() => setMenuOpen(false)} className="block py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium">
                            Khuyến mãi
                        </Link>
                        <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium">
                            Liên hệ
                        </Link>
                        <Link href="/cart" onClick={() => setMenuOpen(false)} className="block py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium">
                            Giỏ hàng {isMounted ? `(${totalItems})` : '(0)'}
                        </Link>

                        {user ? (
                            <>
                                <div className="border-t dark:border-gray-800 my-2"></div>
                                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium">
                                    👤 Tài khoản: <span className="text-blue-600 dark:text-blue-400">{user.name}</span>
                                </Link>

                                {user.role === 'admin' && (
                                    <>
                                        <Link href="/admin" onClick={() => setMenuOpen(false)} className="block py-2 px-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium">
                                            🛡️ Trang quản trị (Dashboard)
                                        </Link>
                                        <Link href="/admin/orders" onClick={() => setMenuOpen(false)} className="block py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium">
                                            📦 Quản lý đơn hàng
                                        </Link>
                                        <Link href="/admin/vouchers" onClick={() => setMenuOpen(false)} className="block py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium">
                                            🎟️ Quản lý Voucher
                                        </Link>
                                    </>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2 px-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 rounded font-medium"
                                >
                                    🚪 Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="border-t dark:border-gray-800 my-2"></div>
                                <div className="flex flex-col space-y-2 pt-1 px-2">
                                    <Link href="/login" onClick={() => setMenuOpen(false)} className="w-full text-center py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded font-medium">
                                        Đăng nhập
                                    </Link>
                                    <Link href="/register" onClick={() => setMenuOpen(false)} className="w-full text-center py-2 bg-blue-600 text-white rounded font-medium">
                                        Đăng ký
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
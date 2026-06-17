import Link from 'next/link';

// Định nghĩa dữ liệu mảng liên kết để dễ quản lý và bảo trì
const links = [
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Khuyến mãi', href: '/promotions' },
    { name: 'Liên hệ', href: '/contact' },
];

const support = [
    { name: 'Chính sách đổi trả', href: '/return-policy' },
    { name: 'Bảo hành', href: '/warranty' },
    { name: 'Sản phẩm', href: '/products-info' },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 border-t border-gray-800 transition-colors duration-300 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Cột 1: Giới thiệu ngắn */}
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">🛍️ ShopVN</h3>
                    <p className="text-sm text-gray-400">Cửa hàng công nghệ hàng đầu Việt Nam.</p>
                </div>

                {/* Cột 2: Các liên kết hệ thống */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Liên kết</h4>
                    <ul className="space-y-2 text-sm">
                        {links.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="hover:text-white transition-colors duration-200">
                                    {l.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cột 3: Chính sách & Hỗ trợ */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
                    <ul className="space-y-2 text-sm">
                        {support.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="hover:text-white transition-colors duration-200">
                                    {l.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cột 4: Thông tin liên hệ trực tiếp */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>📧 support@shopvn.com</li>
                        <li>📞 1900-xxxx</li>
                        <li>📍 Hà Nội, Việt Nam</li>
                    </ul>
                </div>
            </div>

            {/* Dòng chữ bản quyền dưới chân trang */}
            <div className="border-t border-gray-800 dark:border-gray-900 py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} ShopVN. All rights reserved.
            </div>
        </footer>
    );
}
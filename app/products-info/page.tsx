import StaticPage from '@/components/StaticPage';

export default function ProductsInfoPage() {
    return (
        <StaticPage title="Sản phẩm của chúng tôi" subtitle="�a dạng - Chính hãng - Giá tốt">
            <h2 className="text-2xl font-bold mt-6 mb-3">Các danh mục nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                    { icon: '📱', name: 'Điện thoại', desc: 'iPhone, Samsung, Xiaomi, OPPO...' },
                    { icon: '💻', name: 'Laptop', desc: 'MacBook, Dell, HP, ASUS, Lenovo...' },
                    { icon: '🎧', name: 'Tai nghe', desc: 'AirPods, Sony, JBL, Beats...' },
                    { icon: '⌚', name: 'Đồng hồ thông minh', desc: 'Apple Watch, Samsung Galaxy Watch...' },
                ].map((c, i) => (
                    <div key={i} className="p-4 border rounded-lg flex items-center gap-3">
                        <span className="text-4xl">{c.icon}</span>
                        <div>
                            <h3 className="font-bold">{c.name}</h3>
                            <p className="text-sm text-gray-600">{c.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="text-2xl font-bold mt-6 mb-3">Cam kết</h2>
            <p> 100% hàng chính hãng - Hoàn tiền 200% nếu phát hiện hàng giả</p>
            <p> Bảo hành chính hãng từ 12-24 tháng</p>
            <p> Đổi trả miễn phí trong 30 ngày</p>
        </StaticPage>
    );
}

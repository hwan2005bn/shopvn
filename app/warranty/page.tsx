import StaticPage from '@/components/StaticPage';
import { Shield, Clock, Wrench } from 'lucide-react';

export default function WarrantyPage() {
    return (
        <StaticPage title="Chính sách bảo hành" subtitle="Bảo hành chính hãng 12-24 tháng">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                    { icon: Shield, title: 'Chính hãng 100%', desc: 'Bảo hành từ hãng' },
                    { icon: Clock, title: 'Nhanh chóng', desc: 'Xử lý 3-7 ngày' },
                    { icon: Wrench, title: 'Miễn phí', desc: 'Không phí sửa chữa' },
                ].map((b, i) => (
                    <div key={i} className="p-4 border rounded-lg text-center">
                        <b.icon className="w-10 h-10 mx-auto text-blue-600 mb-2" />
                        <h3 className="font-bold">{b.title}</h3>
                        <p className="text-sm text-gray-600">{b.desc}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-6 mb-3">Thời hạn bảo hành</h2>
            <table className="w-full mb-6 border">
                <thead className="bg-gray-100">
                    <tr><th className="p-2 border">Sản phẩm</th><th className="p-2 border">Thời hạn</th></tr>
                </thead>
                <tbody>
                    {[
                        ['iPhone, iPad, MacBook', '12 tháng'],
                        ['Samsung Galaxy', '12 tháng'],
                        ['Laptop Dell, HP, ASUS', '24 tháng'],
                        ['Phụ kiện (tai nghe, sạc)', '6-12 tháng'],
                    ].map(([p, w], i) => (
                        <tr key={i}>
                            <td className="p-2 border">{p}</td>
                            <td className="p-2 border font-semibold">{w}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-2xl font-bold mt-6 mb-3">Điều kiện bảo hành</h2>
            <ul className="list-disc pl-6 space-y-1">
                <li>Còn trong thời hạn bảo hành</li>
                <li>Có hóa đơn mua hàng từ ShopVN</li>
                <li>Tem bảo hành còn nguyên vẹn</li>
                <li>Lỗi do nhà sản xuất (không do người dùng)</li>
            </ul>
        </StaticPage>
    );
}

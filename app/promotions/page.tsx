import StaticPage from '@/components/StaticPage';
import { Tag, Gift, Percent } from 'lucide-react';

export default function PromotionsPage() {
    return (
        <StaticPage title="Khuyến mãi" subtitle="Cơ hội tiết kiệm tốt nhất">
            <div className="space-y-4">
                {[
                    { icon: Percent, title: 'Giảm 10% đơn đầu tiên', code: 'WELCOME10', desc: 'Cho khách hàng mới, đơn từ 1 triệu' },
                    { icon: Tag, title: 'Giảm 50K đơn từ 500K', code: 'SALE50K', desc: 'Áp dụng mọi sản phẩm' },
                    { icon: Gift, title: 'Flash Sale cuối tuần', code: 'WEEKEND', desc: 'Giảm đến 50% các sản phẩm laptop' },
                ].map((p, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                        <p.icon className="w-10 h-10 text-blue-600" />
                        <div className="flex-1">
                            <h3 className="font-bold">{p.title}</h3>
                            <p className="text-sm text-gray-600">{p.desc}</p>
                            <p className="text-xs text-gray-500 mt-1">Mã: <span className="font-mono font-bold text-blue-600">{p.code}</span></p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="font-bold">📌 Lưu ý:</p>
                <p className="text-sm">Mã giảm giá có thể thay đổi theo chương trình. Theo dõi fanpage để cập nhật!</p>
            </div>
        </StaticPage>
    );
}

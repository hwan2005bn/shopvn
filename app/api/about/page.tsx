import StaticPage from '@/components/StaticPage';
import { Award, Users, Globe, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <StaticPage title="Về ShopVN" subtitle="Cửa hàng công nghệ hàng đầu Việt Nam">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { icon: Award, label: '10+ năm', desc: 'Kinh nghiệm' },
                    { icon: Users, label: '500K+', desc: 'Khách hàng' },
                    { icon: Globe, label: '63', desc: 'Tỉnh thành' },
                    { icon: Heart, label: '99%', desc: 'Hài lòng' },
                ].map((s, i) => (
                    <div key={i} className="text-center p-4 bg-blue-50 rounded-lg">
                        <s.icon className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                        <p className="font-bold text-xl">{s.label}</p>
                        <p className="text-sm text-gray-600">{s.desc}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-6 mb-3">Sứ mệnh</h2>
            <p className="mb-4">
                ShopVN ra đời với sứ mệnh mang đến cho khách hàng Việt Nam những sản phẩm công nghệ
                chính hãng với giá tốt nhất, dịch vụ chuyên nghiệp và trải nghiệm mua sắm tuyệt vời.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-3">Tầm nhìn</h2>
            <p className="mb-4">
                Trở thành nền tảng thương mại điện tử công nghệ số 1 Việt Nam và vươn ra khu vực Đông Nam Á.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-3">Giá trị cốt lõi</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Chất lượng sản phẩm là trên hết</li>
                <li>Khách hàng là trung tâm</li>
                <li>Minh bạch, trung thực</li>
                <li>Đổi mới sáng tạo không ngừng</li>
            </ul>
        </StaticPage>
    );
}

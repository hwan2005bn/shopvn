import StaticPage from '@/components/StaticPage';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ReturnPolicyPage() {
    return (
        <StaticPage title="Chính sách đổi trả" subtitle="Đổi trả miễn phí trong 30 ngày">
            <h2 className="text-2xl font-bold mt-6 mb-3">Điều kiện đổi trả</h2>
            <ul className="space-y-2 mb-6">
                {[
                    'Sản phẩm còn nguyên tem, hộp, chưa qua sử dụng',
                    'Trong vòng 30 ngày kể từ ngày nhận hàng',
                    'Có hóa đơn/phiếu giao hàng',
                    'Sản phẩm lỗi do nhà sản xuất',
                ].map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{c}</span>
                    </li>
                ))}
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-3">Không áp dụng đổi trả</h2>
            <ul className="space-y-2 mb-6">
                {[
                    'Sản phẩm đã qua sử dụng, có dấu hiệu trầy xước',
                    'Phụ kiện đã mất tem, bao bì',
                    'Sản phẩm khuyến mãi đặc biệt (ghi rõ trong CT)',
                    'Quá thời hạn 30 ngày',
                ].map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{c}</span>
                    </li>
                ))}
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-3">Quy trình đổi trả</h2>
            <ol className="list-decimal pl-6 space-y-2">
                <li>Liên hệ hotline 1900-6868 hoặc email support@shopvn.com</li>
                <li>Cung cấp mã đơn hàng + hình ảnh sản phẩm</li>
                <li>Nhân viên xác nhận và hướng dẫn gửi hàng</li>
                <li>Đóng gói và gửi về kho ShopVN</li>
                <li>Hoàn tiền/đổi mới trong 3-5 ngày làm việc</li>
            </ol>
        </StaticPage>
    );
}

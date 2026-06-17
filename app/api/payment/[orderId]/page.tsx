'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const [method, setMethod] = useState('VNPAY');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handlePay = async () => {
        setLoading(true);
        const res = await fetch('/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, method }),
        });
        const data = await res.json();
        setResult(data);
        setLoading(false);

        if (data.success) {
            setTimeout(() => router.push('/profile'), 2000);
        }
    };

    if (result?.success) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-green-600">Thanh toán thành công!</h1>
                <p className="mt-2 text-gray-600">Mã GD: {result.transactionId}</p>
                <p className="text-sm text-gray-500 mt-4">Đang chuyển về trang cá nhân...</p>
            </div>
        );
    }

    if (result && !result.success) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-red-600">Thanh toán thất bại</h1>
                <button onClick={() => setResult(null)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Chọn phương thức thanh toán</h1>
            <div className="space-y-3 mb-6">
                {['VNPAY', 'MOMO', 'ZALOPAY', 'BANKING', 'COD'].map((m) => (
                    <label key={m} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            name="method"
                            value={m}
                            checked={method === m}
                            onChange={(e) => setMethod(e.target.value)}
                        />
                        <span className="font-medium">{m}</span>
                    </label>
                ))}
            </div>
            <button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
                {loading ? <><Loader2 className="animate-spin" /> Đang xử lý...</> : 'Thanh toán ngay'}
            </button>
        </div>
    );
}

'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.');
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-2">Liên hệ với chúng tôi</h1>
            <p className="text-center text-gray-600 mb-8">Hỗ trợ 24/7 - Phản hồi trong 24h</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { icon: Phone, title: 'Hotline', info: '1900-6868', desc: 'Miễn phí' },
                    { icon: Mail, title: 'Email', info: 'support@shopvn.com', desc: 'Phản hồi 24h' },
                    { icon: MapPin, title: 'Địa chỉ', info: 'Hà Nội', desc: 'Xem bản đồ' },
                ].map((c, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow text-center">
                        <c.icon className="w-10 h-10 mx-auto text-blue-600 mb-3" />
                        <h3 className="font-bold">{c.title}</h3>
                        <p className="text-blue-600 font-semibold">{c.info}</p>
                        <p className="text-sm text-gray-500">{c.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <MessageCircle /> Gửi tin nhắn
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        required
                        placeholder="Họ tên"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        required
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <textarea
                        required
                        placeholder="Nội dung..."
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2">
                        <Send className="w-4 h-4" /> Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}

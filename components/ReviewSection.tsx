'use client';
import { useState, useEffect } from 'react';
import { Star, Trash2, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ReviewSection({ productId }: { productId: string }) {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [user, setUser] = useState<any>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hovered, setHovered] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Vui lòng đăng nhập để đánh giá');
            router.push('/login');
            return;
        }
        if (!comment.trim()) {
            alert('Vui lòng nhập nhận xét');
            return;
        }

        setLoading(true);
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, rating, comment }),
        });

        const data = await res.json();
        if (data.success) {
            setComment('');
            setRating(5);
            fetchReviews();
            router.refresh();
        } else {
            alert(data.error);
        }
        setLoading(false);
    };

    const handleEdit = (review: Review) => {
        setRating(review.rating);
        setComment(review.comment);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xoá đánh giá này?')) return;
        const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchReviews();
            router.refresh();
        } else {
            alert('Có lỗi xảy ra');
        }
    };

    // Kiểm tra user đã review chưa
    const userReview = user ? reviews.find((r) => r.userId === user.id) : null;

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">
                Đánh giá sản phẩm ({reviews.length})
            </h2>

            {/* Form đánh giá */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-6 pb-6 border-b">
                    <p className="text-sm text-gray-600 mb-2">
                        {userReview ? 'Cập nhật đánh giá của bạn:' : 'Đánh giá của bạn:'}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    className="p-1"
                                >
                                    <Star
                                        className={`w-7 h-7 transition ${star <= (hovered || rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">({rating}/5)</span>
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={3}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Đang gửi...' : userReview ? 'Cập nhật' : 'Gửi đánh giá'}
                    </button>
                </form>
            ) : (
                <p className="mb-6 pb-6 border-b text-gray-500">
                    Vui lòng <a href="/login" className="text-blue-600 hover:underline">đăng nhập</a> để đánh giá
                </p>
            )}

            {/* Danh sách reviews */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Chưa có đánh giá nào. Hãy là người đầu tiên!
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                        {review.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{review.userName}</p>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {user && (user.id === review.userId || user.role === 'admin') && (
                                    <div className="flex gap-1">
                                        {user.id === review.userId && (
                                            <button
                                                onClick={() => handleEdit(review)}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                title="Sửa"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                            title="Xoá"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-700 ml-13 pl-13">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-1 ml-13 pl-13">
                                {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

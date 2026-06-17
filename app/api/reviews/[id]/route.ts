import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// DELETE: Xoá review
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) {
            return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 });
        }

        // Chỉ user tạo review hoặc admin mới được xoá
        if (review.userId !== user.id && user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const productId = review.productId;
        await prisma.review.delete({ where: { id } });

        // Tính lại rating
        const allReviews = await prisma.review.findMany({ where: { productId } });
        const avgRating = allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            : 0;

        await prisma.product.update({
            where: { id: productId },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: allReviews.length, // ← dùng reviewCount
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

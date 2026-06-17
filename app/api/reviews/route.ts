import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET: Lấy reviews theo productId
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Thiếu productId' }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({  // ← prisma.review (đúng)
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ reviews });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Tạo hoặc cập nhật review
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
        }

        const { productId, rating, comment } = await req.json();

        if (!productId || !rating || !comment) {
            return NextResponse.json({ error: 'Vui lòng điền đầy đủ' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating phải từ 1-5' }, { status: 400 });
        }

        // Kiểm tra user đã review sản phẩm này chưa
        const existing = await prisma.review.findFirst({
            where: { userId: user.id, productId },
        });

        let review;
        if (existing) {
            review = await prisma.review.update({
                where: { id: existing.id },
                data: { rating, comment },
            });
        } else {
            review = await prisma.review.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    productId,
                    rating,
                    comment,
                },
            });
        }

        // Tính lại rating trung bình
        const allReviews = await prisma.review.findMany({
            where: { productId },
        });

        const avgRating = allReviews.reduce(
            (sum: number, r: { rating: number }) => sum + r.rating,
            0
        ) / allReviews.length;



        // Cập nhật vào product
        await prisma.product.update({
            where: { id: productId },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: allReviews.length,
            },
        });

        return NextResponse.json({ success: true, review });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

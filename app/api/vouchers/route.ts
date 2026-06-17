import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET: Lấy danh sách voucher (admin: tất cả, user: còn hiệu lực)
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let vouchers;
        if (user.role === 'admin') {
            vouchers = await prisma.voucher.findMany({
                orderBy: { createdAt: 'desc' },
            });
        } else {
            // User chỉ thấy voucher còn hiệu lực
            const now = new Date();
            vouchers = await prisma.voucher.findMany({
                where: {
                    isActive: true,
                    startDate: { lte: now },
                    endDate: { gte: now },
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        return NextResponse.json({ vouchers });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Tạo voucher mới (chỉ admin)
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            usageLimit,
            userLimit,
            startDate,
            endDate,
        } = await req.json();

        // Validate
        if (!code || !description || !discountType || !discountValue || !endDate) {
            return NextResponse.json(
                { error: 'Vui lòng điền đầy đủ thông tin' },
                { status: 400 }
            );
        }

        if (!['percent', 'fixed'].includes(discountType)) {
            return NextResponse.json(
                { error: 'Loại giảm giá không hợp lệ' },
                { status: 400 }
            );
        }

        // Check code đã tồn tại
        const existing = await prisma.voucher.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (existing) {
            return NextResponse.json(
                { error: 'Mã voucher đã tồn tại' },
                { status: 400 }
            );
        }

        const voucher = await prisma.voucher.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountType,
                discountValue: parseFloat(discountValue),
                minOrderValue: parseFloat(minOrderValue || 0),
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
                usageLimit: parseInt(usageLimit || 0),
                userLimit: parseInt(userLimit || 1),
                startDate: new Date(startDate || new Date()),
                endDate: new Date(endDate),
                isActive: true,
            },
        });

        return NextResponse.json({ success: true, voucher });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

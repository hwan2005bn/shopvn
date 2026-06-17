import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// POST: Validate và tính toán giảm giá
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
        }

        const { code, orderTotal } = await req.json();

        if (!code || !orderTotal) {
            return NextResponse.json(
                { error: 'Thiếu thông tin' },
                { status: 400 }
            );
        }

        // Tìm voucher
        const voucher = await prisma.voucher.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!voucher) {
            return NextResponse.json(
                { error: 'Mã voucher không tồn tại' },
                { status: 404 }
            );
        }

        // Check còn hiệu lực
        if (!voucher.isActive) {
            return NextResponse.json(
                { error: 'Mã voucher đã bị vô hiệu hoá' },
                { status: 400 }
            );
        }

        const now = new Date();
        if (now < voucher.startDate) {
            return NextResponse.json(
                { error: 'Mã voucher chưa đến thời gian sử dụng' },
                { status: 400 }
            );
        }
        if (now > voucher.endDate) {
            return NextResponse.json(
                { error: 'Mã voucher đã hết hạn' },
                { status: 400 }
            );
        }

        // Check usage limit
        if (voucher.usageLimit > 0 && voucher.usageCount >= voucher.usageLimit) {
            return NextResponse.json(
                { error: 'Mã voucher đã hết lượt sử dụng' },
                { status: 400 }
            );
        }

        // Check user limit
        const userUsageCount = await prisma.voucherUsage.count({
            where: { voucherId: voucher.id, userId: user.id },
        });
        if (userUsageCount >= voucher.userLimit) {
            return NextResponse.json(
                { error: 'Bạn đã sử dụng mã này rồi' },
                { status: 400 }
            );
        }

        // Check min order
        if (orderTotal < voucher.minOrderValue) {
            return NextResponse.json(
                {
                    error: `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}đ để dùng mã này`,
                },
                { status: 400 }
            );
        }

        // Tính số tiền giảm
        let discount = 0;
        if (voucher.discountType === 'percent') {
            discount = (orderTotal * voucher.discountValue) / 100;
            if (voucher.maxDiscount && discount > voucher.maxDiscount) {
                discount = voucher.maxDiscount;
            }
        } else {
            discount = voucher.discountValue;
        }

        // Không giảm quá tổng đơn
        if (discount > orderTotal) {
            discount = orderTotal;
        }

        return NextResponse.json({
            success: true,
            voucher: {
                code: voucher.code,
                description: voucher.description,
                discountType: voucher.discountType,
                discountValue: voucher.discountValue,
            },
            discount: Math.round(discount),
            finalTotal: Math.round(orderTotal - discount),
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

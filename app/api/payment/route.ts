import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, method } = await req.json();

        // Cập nhật trạng thái đơn hàng thành "processing"
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'processing',
                paymentMethod: method,
            },
        });

        // Mock: 90% thành công
        const success = Math.random() > 0.1;

        if (success) {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'paid' as any },  // Thêm 'paid' vào schema nếu muốn
            });
            return NextResponse.json({
                success: true,
                message: 'Thanh toán thành công',
                transactionId: 'TXN' + Date.now(),
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Thanh toán thất bại (mock)'
            });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

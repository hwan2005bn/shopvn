import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Định nghĩa kiểu dữ liệu rõ ràng cho cấu trúc Item gửi từ Client
interface OrderItemInput {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: user.role === 'admin' ? {} : { userId: user.id },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ orders });
    } catch (error: any) {
        console.error('Orders GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
        }

        const body = await req.json();
        const { items, shippingAddress, paymentMethod, voucherCode } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Giỏ hàng trống' }, { status: 400 });
        }

        // Tính tổng
        const orderItems = items.map((item: any) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: parseInt(item.quantity),
        }));

        const total = orderItems.reduce(
            (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
            0
        );

        // Xử lý voucher
        let discount = 0;
        let voucherId: string | null = null;

        if (voucherCode) {
            const voucher = await prisma.voucher.findUnique({
                where: { code: voucherCode.toUpperCase() },
            });

            if (!voucher) {
                return NextResponse.json({ error: 'Mã voucher không tồn tại' }, { status: 400 });
            }

            if (!voucher.isActive) {
                return NextResponse.json({ error: 'Voucher đã bị vô hiệu' }, { status: 400 });
            }

            const now = new Date();
            if (now < voucher.startDate || now > voucher.endDate) {
                return NextResponse.json({ error: 'Voucher không trong thời hạn' }, { status: 400 });
            }

            if (voucher.usageLimit > 0 && voucher.usageCount >= voucher.usageLimit) {
                return NextResponse.json({ error: 'Voucher đã hết lượt' }, { status: 400 });
            }

            const userUsage = await prisma.voucherUsage.count({
                where: { voucherId: voucher.id, userId: user.id },
            });
            if (userUsage >= voucher.userLimit) {
                return NextResponse.json({ error: 'Bạn đã dùng voucher này rồi' }, { status: 400 });
            }

            if (total < voucher.minOrderValue) {
                return NextResponse.json(
                    { error: `Đơn tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}đ` },
                    { status: 400 }
                );
            }

            // Tính discount
            if (voucher.discountType === 'percent') {
                discount = (total * voucher.discountValue) / 100;
                if (voucher.maxDiscount && discount > voucher.maxDiscount) {
                    discount = voucher.maxDiscount;
                }
            } else {
                discount = voucher.discountValue;
            }
            if (discount > total) discount = total;

            voucherId = voucher.id;
        }

        const finalTotal = total - discount;

        // Tạo đơn hàng với transaction
        const newOrder = await prisma.$transaction(async (tx: any) => {
            // Trừ stock
            for (const item of orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Tăng usage count nếu có voucher
            if (voucherId) {
                await tx.voucher.update({
                    where: { id: voucherId },
                    data: { usageCount: { increment: 1 } },
                });
            }

            // Tạo đơn hàng
            const order = await tx.order.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    items: { create: orderItems },
                    total,
                    discount,
                    voucherCode: voucherCode ? voucherCode.toUpperCase() : null,
                    finalTotal,
                    status: 'pending',
                    paymentMethod,
                    fullName: shippingAddress.fullName,
                    phone: shippingAddress.phone,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    district: shippingAddress.district,
                    ward: shippingAddress.ward,
                },
                include: { items: true },
            });

            // Lưu lịch sử dùng voucher
            if (voucherId) {
                await tx.voucherUsage.create({
                    data: {
                        voucherId,
                        userId: user.id,
                        orderId: order.id,
                        discount,
                    },
                });
            }

            return order;
        });

        return NextResponse.json({ success: true, order: newOrder });
    } catch (error: any) {
        console.error('Orders POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
// import { getCurrentUser } from '@/lib/auth';

// export async function GET(req: NextRequest) {
//   try {
//     const user = await getCurrentUser();
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const orders = await prisma.order.findMany({
//       where: user.role === 'admin' ? {} : { userId: user.id },
//       include: { items: true },
//       orderBy: { createdAt: 'desc' },
//     });

//     return NextResponse.json({ orders });
//   } catch (error: any) {
//     console.error('Orders GET error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const user = await getCurrentUser();
//     if (!user) {
//       return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
//     }

//     const body = await req.json();
//     const { items, shippingAddress, paymentMethod } = body;

//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: 'Giỏ hàng trống' }, { status: 400 });
//     }

//     // Tính tổng
//     const orderItems = items.map((item: any) => ({
//       productId: item.product.id,
//       name: item.product.name,
//       price: item.product.price,
//       image: item.product.image,
//       quantity: parseInt(item.quantity),
//     }));

//     const total = orderItems.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );

//     // Tạo đơn hàng với transaction (an toàn)
//     const newOrder = await prisma.$transaction(async (tx) => {
//       // Trừ stock sản phẩm
//       for (const item of orderItems) {
//         await tx.product.update({
//           where: { id: item.productId },
//           data: { stock: { decrement: item.quantity } },
//         });
//       }

//       // Tạo đơn hàng
//       return tx.order.create({
//         data: {
//           userId: user.id,
//           userName: user.name,
//           items: {
//             create: orderItems,
//           },
//           total,
//           status: 'pending',
//           paymentMethod,
//           fullName: shippingAddress.fullName,
//           phone: shippingAddress.phone,
//           address: shippingAddress.address,
//           city: shippingAddress.city,
//           district: shippingAddress.district,
//           ward: shippingAddress.ward,
//         },
//         include: { items: true },
//       });
//     });

//     return NextResponse.json({ success: true, order: newOrder });
//   } catch (error: any) {
//     console.error('Orders POST error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

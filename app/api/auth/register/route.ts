import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
// Import schema Zod bạn đã tạo từ lib/validations
import { registerSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. DÙNG ZOD XÁC THỰC DỮ LIỆU ĐẦU VÀO
        const validated = registerSchema.safeParse(body);

        // Nếu dữ liệu không hợp lệ theo Schema, trả về mã lỗi 400 kèm nội dung lỗi cụ thể
        if (!validated.success) {
            return NextResponse.json(
                {
                    error: validated.error.issues[0].message, // Câu lỗi đầu tiên (VD: "Tên phải có ít nhất 2 ký tự")
                    details: validated.error.flatten().fieldErrors // Chi tiết lỗi phân theo từng ô input (nếu cần)
                },
                { status: 400 }
            );
        }

        // 2. LẤY DỮ LIỆU SẠCH ĐÃ QUA KIỂM DUYỆT TỪ ZOD
        const { email, password, name } = validated.data;
        const normalizedEmail = email.toLowerCase();

        // Check email tồn tại trong cơ sở dữ liệu PostgreSQL
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email đã được sử dụng' },
                { status: 400 }
            );
        }

        // Tạo user mới
        const hashedPassword = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                email: normalizedEmail,
                name,
                password: hashedPassword,
                role: 'user',
            },
        });

        // Tạo token JWT xác thực phiên làm việc
        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });

        const response = NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
            },
        });

        // Ghi token bảo mật vào Cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // Hạn dùng 7 ngày
        });

        return response;
    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: error.message || 'Lỗi server' },
            { status: 500 }
        );
    }
}
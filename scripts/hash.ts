import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Mật khẩu lấy từ terminal truyền vào, mặc định là admin123
    const passwordInput = process.argv[2] || 'admin123';

    // Tiến hành băm mật khẩu bằng bcryptjs đúng chuẩn hệ thống của bạn
    const hashedPassword = bcrypt.hashSync(passwordInput, 10);

    const adminEmail = 'admin@shop.com';

    console.log('🔄 Đang khởi tạo tài khoản Admin trong PostgreSQL...');

    // Sử dụng upsert: Nếu chưa có email này thì tạo mới, nếu có rồi thì cập nhật mật khẩu/role mới
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: 'admin', // Điền 'admin' hoặc 'ADMIN' đúng theo Enum trong schema.prisma của bạn
        },
        create: {
            email: adminEmail,
            name: 'Admin Hệ Thống',
            password: hashedPassword,
            role: 'admin', // Điền 'admin' hoặc 'ADMIN' đúng theo Enum trong schema.prisma của bạn
        },
    });

    console.log('\n=========================================');
    console.log('🎉 TẠO TÀI KHOẢN ADMIN THÀNH CÔNG!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password thực tế: ${passwordInput}`);
    console.log(`🛡️  Role: ${admin.role}`);
    console.log('=========================================\n');
}

main()
    .catch((e) => {
        console.error('❌ Lỗi khi tạo Admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
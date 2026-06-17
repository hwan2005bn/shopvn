import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Bắt đầu seed data...\n');

    // Xoá data cũ
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Đã xoá data cũ\n');

    // =================== USERS ===================
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await prisma.user.create({
        data: {
            email: 'admin@shop.com',
            name: 'Admin',
            password: adminPassword,
            role: 'admin',
        },
    });

    await prisma.user.create({
        data: {
            email: 'user@shop.com',
            name: 'Nguyễn Văn A',
            password: userPassword,
            role: 'user',
        },
    });
    console.log('✅ Đã tạo 2 users (admin + user)\n');

    // =================== CATEGORIES ===================
    const categories = await prisma.category.createMany({
        data: [
            { name: 'Điện thoại', slug: 'phone', icon: '📱' },
            { name: 'Laptop', slug: 'laptop', icon: '💻' },
            { name: 'Tai nghe', slug: 'headphone', icon: '🎧' },
            { name: 'Đồng hồ', slug: 'watch', icon: '⌚' },
            { name: 'Máy ảnh', slug: 'camera', icon: '📷' },
            { name: 'Phụ kiện', slug: 'accessory', icon: '🎮' },
        ],
    });
    console.log(`✅ Đã tạo ${categories.count} categories\n`);

    // =================== VOUCHERS ===================
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Hết hạn sau 30 ngày

    await prisma.voucher.createMany({
        data: [
            {
                code: 'WELCOME10',
                description: 'Giảm 10% cho đơn hàng đầu tiên',
                discountType: 'percent',
                discountValue: 10,
                maxDiscount: 500000,
                minOrderValue: 1000000,
                usageLimit: 100,
                userLimit: 1,
                endDate,
            },
            {
                code: 'SALE50K',
                description: 'Giảm ngay 50,000đ cho đơn từ 500,000đ',
                discountType: 'fixed',
                discountValue: 50000,
                minOrderValue: 500000,
                usageLimit: 50,
                userLimit: 2,
                endDate,
            },
            {
                code: 'FREESHIP',
                description: 'Giảm 30,000đ phí ship',
                discountType: 'fixed',
                discountValue: 30000,
                minOrderValue: 0,
                usageLimit: 0,
                userLimit: 5,
                endDate,
            },
        ],
    });
    console.log('✅ Đã tạo 3 vouchers mẫu\n');

    // =================== PRODUCTS ===================
    await prisma.product.createMany({
        data: [
            {
                name: 'iPhone 15 Pro Max',
                description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch.',
                price: 29990000,
                image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500',
                category: 'phone',
                stock: 50,
                rating: 4.9,
                reviewCount: 1280,
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'Samsung Galaxy S24 Ultra với bút S Pen, camera 200MP, màn hình Dynamic AMOLED 2X 6.8 inch.',
                price: 31990000,
                image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
                category: 'phone',
                stock: 35,
                rating: 4.8,
                reviewCount: 950,
            },
            {
                name: 'MacBook Pro M3',
                description: 'MacBook Pro 14 inch với chip M3, RAM 16GB, SSD 512GB, màn hình Liquid Retina XDR.',
                price: 49990000,
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
                category: 'laptop',
                stock: 20,
                rating: 4.9,
                reviewCount: 540,
            },
            {
                name: 'Dell XPS 15',
                description: 'Dell XPS 15 với Intel Core i7, RAM 16GB, SSD 1TB, màn hình OLED 4K.',
                price: 42990000,
                image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500',
                category: 'laptop',
                stock: 15,
                rating: 4.7,
                reviewCount: 320,
            },
            {
                name: 'AirPods Pro 2',
                description: 'AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động, âm thanh không gian.',
                price: 5990000,
                image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500',
                category: 'headphone',
                stock: 100,
                rating: 4.8,
                reviewCount: 2100,
            },
            {
                name: 'Sony WH-1000XM5',
                description: 'Tai nghe chụp đầu Sony với chống ồn hàng đầu, pin 30 giờ.',
                price: 8990000,
                image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
                category: 'headphone',
                stock: 60,
                rating: 4.9,
                reviewCount: 850,
            },
            {
                name: 'Apple Watch Series 9',
                description: 'Apple Watch Series 9 với chip S9, màn hình Always-On, GPS.',
                price: 10990000,
                image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
                category: 'watch',
                stock: 80,
                rating: 4.7,
                reviewCount: 670,
            },
            {
                name: 'Canon EOS R6 Mark II',
                description: 'Máy ảnh mirrorless full-frame với cảm biến 24.2MP, quay video 4K 60fps.',
                price: 52990000,
                image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
                category: 'camera',
                stock: 10,
                rating: 4.9,
                reviewCount: 230,
            },
        ],
    });
    console.log('✅ Đã tạo 8 sản phẩm\n');

    console.log('🎉 SEED HOÀN TẤT!\n');
    console.log('📝 Tài khoản test:');
    console.log('   👑 Admin: admin@shop.com / admin123');
    console.log('   👤 User:  user@shop.com / user123\n');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import prisma from '@/lib/prisma';
import { User, Product, Order, Category } from '@/types';

export const db = {
    // =================== USERS ===================
    findUserByEmail: async (email: string) => {
        return await prisma.user.findUnique({
            where: { email },
        });
    },

    findUserById: async (id: string) => {
        return await prisma.user.findUnique({
            where: { id },
        });
    },

    createUser: async (userData: any) => {
        return await prisma.user.create({
            data: userData,
        });
    },

    // =================== PRODUCTS ===================
    getAllProducts: async () => {
        return await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
    },

    getProductById: async (id: string) => {
        return await prisma.product.findUnique({
            where: { id },
        });
    },

    getProductsByCategory: async (categorySlug: string) => {
        return await prisma.product.findMany({
            where: {
                category: categorySlug, // Hoặc liên kết quan hệ nếu bạn đặt Relation trong schema
            },
        });
    },

    searchProducts: async (query: string) => {
        return await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
        });
    },

    createProduct: async (productData: any) => {
        return await prisma.product.create({
            data: productData,
        });
    },

    updateProduct: async (id: string, data: any) => {
        return await prisma.product.update({
            where: { id },
            data,
        });
    },

    deleteProduct: async (id: string) => {
        try {
            await prisma.product.delete({ where: { id } });
            return true;
        } catch {
            return false;
        }
    },

    // =================== CATEGORIES ===================
    getAllCategories: async () => {
        return await prisma.category.findMany();
    },

    // =================== ORDERS ===================
    getAllOrders: async () => {
        return await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
        });
    },

    getOrderById: async (id: string) => {
        return await prisma.order.findUnique({
            where: { id },
            include: { items: true }, // Bao gồm các sản phẩm trong đơn hàng nếu có
        });
    },

    getOrdersByUser: async (userId: string) => {
        return await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    },

    createOrder: async (orderData: any) => {
        return await prisma.order.create({
            data: orderData,
        });
    },

    updateOrder: async (id: string, data: any) => {
        return await prisma.order.update({
            where: { id },
            data,
        });
    },
};
import prisma from '@/lib/prisma';

export const productService = {
    async getAll(filters?: { category?: string; search?: string }) {
        return prisma.product.findMany({ where: filters });
    },
    async getById(id: string) {
        return prisma.product.findUnique({ where: { id } });
    },
    async create(data: any) {
        return prisma.product.create({ data });
    },
    async update(id: string, data: any) {
        return prisma.product.update({ where: { id }, data });
    },
    async delete(id: string) {
        return prisma.product.delete({ where: { id } });
    },
};

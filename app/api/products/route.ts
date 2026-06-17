import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const where: any = {};

        if (category) {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ products });
    } catch (error: any) {
        console.error('Products GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: parseFloat(body.price),
                image: body.image,
                category: body.category,
                stock: parseInt(body.stock),
                rating: 0,
                reviewCount: 0,
            },
        });

        return NextResponse.json({ success: true, product: newProduct });
    } catch (error: any) {
        console.error('Products POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

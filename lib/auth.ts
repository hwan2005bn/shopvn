import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const generateToken = (payload: UserPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): UserPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch {
        return null;
    }
};

export const getCurrentUser = async (): Promise<SessionUser | null> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return null;

        const decoded = verifyToken(token);
        if (!decoded) return null;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) return null;

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
        };
    } catch (err) {
        console.error('getCurrentUser error:', err);
        return null;
    }
};

export const requireAuth = async () => {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    return user;
};

export const requireAdmin = async () => {
    const user = await requireAuth();
    if (user.role !== 'admin') throw new Error('Forbidden');
    return user;
};

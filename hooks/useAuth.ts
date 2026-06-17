// hooks/useAuth.ts
'use client';
import { useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const u = localStorage.getItem('user');
            if (u) {
                try {
                    setUser(JSON.parse(u));
                } catch {
                    setUser(null);
                }
            }
        }
        setLoading(false);
    }, []);

    const isAdmin = user?.role === 'admin';

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return { user, loading, isAdmin, logout };
}

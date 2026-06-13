'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Si ya terminó de cargar y no es Admin, expulsar
    if (!isLoading) {
      const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
      if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, isLoading, router, pathname]);

  // 2. Pantalla de carga estética para evitar parpadeos
  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-indigo-400 font-black tracking-widest uppercase animate-pulse">
          Validando credenciales...
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6 animate-in fade-in duration-500">
      {children}
    </main>
  );
}
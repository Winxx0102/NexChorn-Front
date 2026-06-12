// app/admin/layout.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN'))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="text-white p-10">Cargando acceso...</div>;

  return <div className="max-w-7xl mx-auto p-6">{children}</div>;
}
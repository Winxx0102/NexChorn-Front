// components/AdminGuard.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
      router.push('/chronicles'); // Redirige si no tiene permisos
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="text-white">Validando acceso...</div>;
  if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') return null;

  return <>{children}</>;
}
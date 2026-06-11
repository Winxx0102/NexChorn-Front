'use client';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[]; // Espera nombres de roles en texto
}

export const RoleGuard = ({ children, roles }: RoleGuardProps) => {
  const { user } = useAuth();

  // Si no hay usuario o el rol no coincide, bloqueamos
  if (!user || !roles.includes(user.role as string)) {
    return null;
  }

  return <>{children}</>;
};
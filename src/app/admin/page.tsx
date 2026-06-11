// src/app/admin/page.tsx
'use client';
import { RoleGuard } from '@/components/RoleGuard';

export default function AdminPage() {
  return (
    <RoleGuard roles={['ADMIN', 'SUPERADMIN']}>
      <div className="p-10">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        {/* Aquí harías un fetch('/users') para listar y mostrar botones de bloquear/promover */}
      </div>
    </RoleGuard>
  );
}
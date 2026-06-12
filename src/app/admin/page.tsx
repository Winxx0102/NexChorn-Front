'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  // 1. Añadimos isLoading para evitar que la página se rompa al cargar
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Función de carga segura
  const loadUsers = async () => {
    try {
      const res = await fetchApi('/users');
      // Aseguramos que sea un array aunque el backend responda otra cosa
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Avoid synchronous setState inside the effect by deferring the call
    // to the next tick. This prevents the "calling setState synchronously" lint error.
    if (!isLoading) {
      const t = setTimeout(() => void loadUsers(), 0);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  const handleAction = async (id: string, action: 'block' | 'unblock' | 'role', role?: string) => {
    try {
      if (action === 'role') {
        await fetchApi(`/users/role/${id}`, { 
          method: 'PATCH', 
          body: JSON.stringify({ role }) 
        });
      } else {
        await fetchApi(`/users/${action}/${id}`, { method: 'PATCH' });
      }
      toast.success("Actualizado correctamente");
      loadUsers(); // Recargamos la lista
    } catch {
      toast.error("Error al actualizar");
    }
  };

  // 3. Estado de carga visual
  if (isLoading || loading) {
    return <div className="p-20 text-center text-white">Cargando panel...</div>;
  }

  return (
    <div className="bg-gray-900/60 p-8 rounded-3xl border border-white/10">
      <h1 className="text-3xl font-bold text-white mb-6">Panel de Administración</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-300">
          <thead className="text-indigo-400 uppercase text-sm border-b border-white/10">
            <tr><th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4">Acciones</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => handleAction(u.id, 'block')} className="text-red-400 hover:text-red-300 transition-colors">Bloquear</button>
                  {user?.role === 'SUPERADMIN' && (
                    <select 
                      defaultValue={u.role}
                      onChange={(e) => handleAction(u.id, 'role', e.target.value)} 
                      className="bg-gray-800 border border-white/10 rounded px-2 py-1 text-sm text-white"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPERADMIN">SUPERADMIN</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
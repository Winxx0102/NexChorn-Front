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
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchApi('/users').then((res: User[]) => setUsers(res));
  }, []);

  const handleAction = async (id: string, action: 'block' | 'unblock' | 'role', role?: string) => {
    try {
      if (action === 'role') {
        await fetchApi(`/users/role/${id}`, { method: 'PATCH', body: JSON.stringify({ role }) });
      } else {
        await fetchApi(`/users/${action}/${id}`, { method: 'PATCH' });
      }
      toast.success("Acción realizada con éxito");
      const updated = await fetchApi('/users');
      setUsers(updated);
    } catch {
      toast.error("Error al actualizar");
    }
  };

  return (
    <div className="bg-gray-900/60 p-8 rounded-3xl border border-white/10">
      <h1 className="text-3xl font-bold text-white mb-6">Panel de Administración</h1>
      <table className="w-full text-left text-gray-300">
        <thead className="text-indigo-400 uppercase text-sm border-b border-white/10">
          <tr><th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4">Acciones</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="p-4">{u.email}</td>
              <td className="p-4">{u.role}</td>
              <td className="p-4 flex gap-2">
                <button onClick={() => handleAction(u.id, 'block')} className="text-red-400 hover:text-red-300">Bloquear</button>
                {user?.role === 'SUPERADMIN' && (
                  <select onChange={(e) => handleAction(u.id, 'role', e.target.value)} className="bg-gray-800 rounded p-1">
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
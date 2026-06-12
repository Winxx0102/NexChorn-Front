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
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, blockedUsers: 0, totalChronicles: 0 });
  const [loading, setLoading] = useState(true);

  // Cargamos usuarios Y estadísticas en paralelo
  const loadData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        fetchApi('/users'),
        fetchApi('/users/admin/stats')
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setStats(statsData);
    } catch (err) {
      toast.error("Error al cargar los datos del panel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => void loadData(), 0);
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
      loadData(); // Recargamos todo para refrescar métricas también
    } catch {
      toast.error("Error al actualizar");
    }
  };

  if (isLoading || loading) {
    return <div className="p-20 text-center text-white">Cargando panel administrativo...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Usuarios Totales', value: stats.totalUsers },
          { label: 'Usuarios Bloqueados', value: stats.blockedUsers },
          { label: 'Total Crónicas', value: stats.totalChronicles },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900/60 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-gray-900/60 p-8 rounded-3xl border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-6">Gestión de Usuarios</h1>
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
    </div>
  );
}
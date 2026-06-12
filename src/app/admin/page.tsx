'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface User {
  id: number;
  email?: string;
  role?: string;
  isBlocked: boolean; // Importante: esto viene de tu base de datos
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, blockedUsers: 0, totalchronicles: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        fetchApi('/users'),
        fetchApi('/users/admin/stats')
      ]);
      setUsers(Array.isArray(usersData) ? usersData : (usersData.data || []));
      setStats(statsData);
    } catch (err) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      // defer the state updates to avoid synchronous setState inside effect
      const t = setTimeout(() => {
        loadData();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  const handleAction = async (id: number, action: 'block' | 'unblock' | 'role', role?: string) => {
    try {
      if (action === 'role') {
        await fetchApi(`/users/role/${id}`, { method: 'PATCH', body: JSON.stringify({ role }) });
      } else {
        // Llama al endpoint de bloquear o desbloquear
        await fetchApi(`/users/${action}/${id}`, { method: 'PATCH' });
      }
      toast.success("Acción completada con éxito");
      loadData();
    } catch {
      toast.error("Error al ejecutar la acción");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase()));
  }, [users, search]);

  if (loading) return <div className="text-white text-center p-20">Cargando dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Tarjetas de Métricas - Diseño Estético */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Usuarios Totales', val: stats.totalUsers, color: 'indigo' },
          { title: 'Bloqueados', val: stats.blockedUsers, color: 'red' },
          { title: 'Total Crónicas', val: stats.totalchronicles, color: 'emerald' }
        ].map((item, i) => (
          <div key={i} className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border border-white/10 shadow-xl hover:border-white/20 transition-all">
            <h3 className={`text-${item.color}-400 text-sm font-semibold uppercase tracking-wider`}>{item.title}</h3>
            <p className="text-4xl font-bold text-white mt-3">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-gray-900/60 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
          <input 
            placeholder="Buscar por email..."
            className="bg-gray-800/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full text-left text-gray-300">
          <thead className="text-indigo-400 text-xs uppercase tracking-widest border-b border-white/10">
            <tr><th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4 text-center">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">{u.email}</td>
                <td className="p-4"><span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300">{u.role}</span></td>
                <td className="p-4 flex gap-3 justify-center items-center">
                  {/* Botón de Bloqueo Toggleable */}
                  <button 
                    onClick={() => handleAction(u.id, u.isBlocked ? 'unblock' : 'block')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all border ${
                      u.isBlocked 
                        ? 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10' 
                        : 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                    }`}
                  >
                    {u.isBlocked ? 'Desbloquear' : 'Bloquear'}
                  </button>

                  {user?.role === 'SUPERADMIN' && (
                    <select 
                      defaultValue={u.role}
                      onChange={(e) => handleAction(u.id, 'role', e.target.value)}
                      className="bg-gray-800 border border-white/10 rounded-lg px-3 py-1 text-sm text-white hover:border-indigo-500 cursor-pointer"
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
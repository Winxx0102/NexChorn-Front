'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface User {
  id: number;
  email?: string;
  role?: string;
  isBlocked: boolean;
  _count: { chronicles: number };
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, blockedUsers: 0, totalchronicles: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersResponse, statsData] = await Promise.all([
        fetchApi('/users'),
        fetchApi('/users/admin/stats')
      ]);
      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      setStats(statsData);
    } catch (err) {
      toast.error("Error al cargar los datos administrativos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      // call inside an async IIFE to avoid calling setState synchronously in the effect body
      void (async () => {
        await loadData();
      })();
    }
  }, [isLoading]);

  const handleAction = async (id: number, action: 'block' | 'unblock' | 'role', newRole?: string) => {
    try {
      if (action === 'role') {
        // Confirmación específica para roles
        if (!confirm(`¿Confirmas ascender/cambiar el rol a ${newRole}?`)) return;
        await fetchApi(`/users/role/${id}`, { 
          method: 'PATCH', 
          body: JSON.stringify({ role: newRole }) 
        });
      } else {
        await fetchApi(`/users/${action}/${id}`, { method: 'PATCH' });
      }
      
      toast.success("Cambio realizado correctamente");
      // Recargamos los datos para asegurar que la tabla muestre la verdad del servidor
      await loadData();
    } catch (err) {
      toast.error("Error al ejecutar la acción");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase()));
  }, [users, search]);

  if (loading && users.length === 0) return <div className="text-white text-center p-20">Cargando panel de administración...</div>;

  return (
    <div className="space-y-8">
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Usuarios Totales', val: stats.totalUsers, color: 'indigo' },
          { title: 'Bloqueados', val: stats.blockedUsers, color: 'red' },
          { title: 'Crónicas Totales', val: stats.totalchronicles, color: 'emerald' }
        ].map((item, i) => (
          <div key={i} className="bg-gray-900/60 p-6 rounded-3xl border border-white/10 shadow-xl">
            <h3 className={`text-${item.color}-400 text-sm font-bold uppercase tracking-widest`}>{item.title}</h3>
            <p className="text-4xl font-bold text-white mt-3">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Gestión de Usuarios */}
      <div className="bg-gray-900/60 p-8 rounded-3xl border border-white/10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Usuarios Registrados</h2>
          </div>
          <input 
            placeholder="Buscar por email..."
            className="bg-gray-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full text-left text-gray-300">
          <thead className="text-indigo-400 text-xs uppercase tracking-widest border-b border-white/10">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Rol</th>
              <th className="p-4 text-center">Crónicas</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    u.role === 'SUPERADMIN' ? 'bg-purple-900/50 text-purple-300' : 
                    u.role === 'ADMIN' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 text-gray-300'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-center font-mono">{u._count?.chronicles || 0}</td>
                <td className="p-4 flex gap-3 justify-center items-center">
                  
                  {/* Botón de Bloqueo */}
                  <button 
                    onClick={() => handleAction(u.id, u.isBlocked ? 'unblock' : 'block')}
                    className={`px-3 py-1 rounded-lg text-sm border transition-all ${
                      u.isBlocked ? 'border-emerald-500/50 text-emerald-400' : 'border-red-500/50 text-red-400'
                    }`}
                  >
                    {u.isBlocked ? 'Desbloquear' : 'Bloquear'}
                  </button>

                  {/* Selector de Roles */}
                  {user?.role === 'SUPERADMIN' && (
                    <select 
                      key={u.role} // Esto fuerza a React a re-renderizar si el rol cambia
                      defaultValue={u.role}
                      onChange={(e) => handleAction(u.id, 'role', e.target.value)}
                      className="bg-gray-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-white cursor-pointer hover:border-indigo-500"
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
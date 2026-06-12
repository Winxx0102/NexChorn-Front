'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import UserActionMenu from '@/components/admin/UserActionMenu'; // Importa el nuevo componente

type AdminUser = {
  id: number;
  email: string;
  role: string;
  isBlocked: boolean;
  _count?: {
    chronicles: number;
  };
};

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
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
    } catch {
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      void Promise.resolve().then(loadData);
    }
  }, [isLoading]);

  const handleAction = async (id: number, action: 'block' | 'unblock' | 'role', newRole?: string) => {
    try {
      if (action === 'role') {
        if (!confirm(`¿Confirmas cambiar el rol a ${newRole}?`)) return;
        await fetchApi(`/users/role/${id}`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) });
      } else {
        await fetchApi(`/users/${action}/${id}`, { method: 'PATCH' });
      }
      toast.success("Acción realizada con éxito");
      await loadData();
    } catch {
      toast.error("Error al ejecutar la acción");
    }
  };

  const filteredUsers = useMemo(() => users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase())), [users, search]);

  if (loading && users.length === 0) return <div className="text-white text-center p-20">Cargando...</div>;

  return (
    <div className="space-y-8 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Usuarios Totales', val: stats.totalUsers, color: 'indigo' },
          { title: 'Bloqueados', val: stats.blockedUsers, color: 'red' },
          { title: 'Crónicas Totales', val: stats.totalchronicles, color: 'emerald' }
        ].map((item, i) => (
          <div key={i} className="bg-gray-900/60 p-6 rounded-3xl border border-white/10 shadow-xl transition-transform hover:scale-[1.02]">
            <h3 className={`text-${item.color}-400 text-sm font-bold uppercase tracking-widest`}>{item.title}</h3>
            <p className="text-4xl font-bold text-white mt-3">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/60 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
            <p className="text-gray-400 text-sm">Administración y permisos</p>
          </div>
          <input 
            placeholder="Buscar por email..."
            className="bg-gray-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 transition-all"
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
                  <span className={`px-2 py-1 rounded text-xs ${u.role === 'SUPERADMIN' ? 'bg-purple-900/50 text-purple-300' : u.role === 'ADMIN' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 text-gray-300'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-center font-mono">{u._count?.chronicles || 0}</td>
                <td className="p-4 flex justify-center">
                  <UserActionMenu 
                    userRole={user?.role || ''}
                    targetUser={{ id: u.id, role: u.role, isBlocked: u.isBlocked }}
                    onAction={handleAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
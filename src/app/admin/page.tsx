'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import UserActionMenu from '@/components/admin/UserActionMenu';

type AdminUser = {
  id: number;
  email: string;
  role: string;
  isBlocked: boolean;
  _count?: { chronicles: number };
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
        await fetchApi(`/users/role/${id}`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) });
      } else {
        await fetchApi(`/users/${action}/${id}`, { method: 'PATCH' });
      }
      toast.success("Operación exitosa");
      await loadData();
    } catch {
      toast.error("Error al procesar la solicitud");
    }
  };

  const filteredUsers = useMemo(() => 
    users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase())), 
    [users, search]
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-400">Cargando panel...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Usuarios', val: stats.totalUsers, color: 'indigo' },
          { title: 'Bloqueados', val: stats.blockedUsers, color: 'red' },
          { title: 'Crónicas', val: stats.totalchronicles, color: 'emerald' }
        ].map((item, i) => (
          <div key={i} className="bg-gray-900/40 p-6 rounded-3xl border border-white/5 shadow-xl">
            <h3 className={`text-${item.color}-400 text-[10px] font-black uppercase tracking-widest`}>{item.title}</h3>
            <p className="text-4xl font-black text-white mt-2">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Tabla de Gestión */}
      <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Gestión de Usuarios</h2>
            <p className="text-gray-500 text-sm">Control de acceso y permisos de la comunidad</p>
          </div>
          <input 
            placeholder="Filtrar por email..."
            className="bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-all w-full md:w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Rol</th>
                <th className="p-4 text-center">Crónicas</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm font-medium text-gray-300 group-hover:text-white">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'SUPERADMIN' ? 'bg-purple-500/10 text-purple-400' : u.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-center text-sm text-gray-400 font-mono">{u._count?.chronicles || 0}</td>
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
    </motion.div>
  );
}
'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, blockedUsers: 0, totalchronicles: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    // carga de datos del panel de administración
    try {
      setLoading(true);
      const [usersResponse, statsData] = await Promise.all([
        fetchApi('/users'),
        fetchApi('/users/admin/stats')
      ]);

      // --- LOGS DE DEPURACIÓN ---
      console.log("Raw Users Response:", usersResponse);
      console.log("Raw Stats Response:", statsData);
      
      // Manejo flexible de la respuesta (por si viene como { data: [] } o como array directo)
      const usersArray = Array.isArray(usersResponse) 
        ? usersResponse 
        : (usersResponse?.data || []);
        
      setUsers(usersArray);
      setStats(statsData || { totalUsers: 0, blockedUsers: 0, totalchronicles: 0 });
      
    } catch (err) {
      console.error("Error cargando datos:", err);
      toast.error("Error al cargar los datos del panel");
    } finally {
      setLoading(false);
    }
  };

  // 1. Verificación de seguridad y carga de datos
  useEffect(() => {
    if (!isLoading) {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
        toast.error("Acceso denegado");
        router.push('/');
      } else {
        // avoid synchronous setState inside effect — schedule load on next tick
        const t = setTimeout(() => { loadData(); }, 0);
        return () => clearTimeout(t);
      }
    }
  }, [isLoading, user, router]);

  const handleAction = async (id: number, action: 'block' | 'unblock' | 'role', newRole?: string) => {
    try {
      if (action === 'role') {
        await fetchApi(`/users/role/${id}`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) });
      } else {
        await fetchApi(`/users/${action}/${id}`, { method: 'PATCH' });
      }
      toast.success("Operación exitosa");
      await loadData();
    } catch (err) {
      console.error("Error en acción:", err);
      toast.error("Error al procesar la solicitud");
    }
  };

  const filteredUsers = useMemo(() => 
    users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase())), 
    [users, search]
  );

  // 2. Pantalla de carga o denegación
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-indigo-400">Cargando...</div>;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
      {/* Tarjetas */}
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

      {/* Tabla */}
      <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-white">Gestión de Usuarios</h2>
          <input 
            placeholder="Buscar..."
            className="bg-gray-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {users.length === 0 && !loading ? (
          <div className="text-center py-20 text-gray-500">No se encontraron usuarios en el sistema.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-500 text-[10px] uppercase border-b border-white/5">
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
                    <td className="p-4 text-sm text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${u.role === 'SUPERADMIN' ? 'text-purple-400' : 'text-indigo-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-400 font-mono">{u._count?.chronicles || 0}</td>
                    <td className="p-4 flex justify-center">
                      <UserActionMenu 
                        userRole={user.role ?? ''}
                        currentUserId={Number(user.id)}
                        targetUser={{ id: u.id, role: u.role, isBlocked: u.isBlocked }}
                        onAction={handleAction}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
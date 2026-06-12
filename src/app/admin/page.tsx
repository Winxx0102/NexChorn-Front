'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface User {
  id: number;
  email?: string;
  role?: string;
  blocked?: boolean;
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, blockedUsers: 0, totalchronicles: 0 });
  const [search, setSearch] = useState(''); // Estado para el buscador
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        fetchApi('/users'),
        fetchApi('/users/admin/stats')
      ]);
      // Si usersData llega como objeto, asegúrate de que sea el array correcto
      setUsers(Array.isArray(usersData) ? usersData : []);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => {
        loadData();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  // FILTRO: Se ejecuta cada vez que cambia el search o la lista de users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => 
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleAction = async (id: number, action: 'block' | 'role', role?: string) => {
    try {
      if (action === 'role') {
        await fetchApi(`/users/role/${id}`, { method: 'PATCH', body: JSON.stringify({ role }) });
      } else {
        await fetchApi(`/users/block/${id}`, { method: 'PATCH' });
      }
      toast.success("Acción realizada");
      loadData();
    } catch {
      toast.error("Error al actualizar");
    }
  };

  if (loading) return <div className="text-white text-center p-20">Cargando...</div>;

  return (
    <div className="space-y-8">
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/60 p-6 rounded-2xl border border-white/10">
            <h3 className="text-gray-400 text-sm">Usuarios Totales</h3>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-900/60 p-6 rounded-2xl border border-white/10">
            <h3 className="text-gray-400 text-sm">Total Crónicas</h3>
            <p className="text-3xl font-bold text-white">{stats.totalchronicles}</p>
        </div>
      </div>

      {/* Tabla con Buscador */}
      <div className="bg-gray-900/60 p-8 rounded-3xl border border-white/10">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
          <input 
            placeholder="Buscar por email..."
            className="bg-gray-800 p-2 rounded text-white border border-white/10"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full text-left text-gray-300">
          <thead>
            <tr className="text-indigo-400 uppercase text-sm border-b border-white/10">
              <th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => handleAction(u.id, 'block')} className="text-red-400">Bloquear</button>
                  {user?.role === 'SUPERADMIN' && (
                    <select 
                      defaultValue={u.role}
                      onChange={(e) => handleAction(u.id, 'role', e.target.value)}
                      className="bg-gray-800 rounded p-1"
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
'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface User {
  id: number;
  email?: string;
  role?: string;
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

      // --- DEBUG CRÍTICO ---
      console.log("Respuesta de /users:", usersData); 
      // ---------------------

      // Adaptación inteligente: busca en qué parte del objeto vienen los usuarios
      const dataToSet = Array.isArray(usersData) 
        ? usersData 
        : (usersData.data || usersData.users || []); // Intenta extraerlos si vienen anidados
      
      setUsers(dataToSet);
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
      loadData();
    }
  }, [isLoading]);

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
      toast.success("Acción realizada con éxito");
      loadData();
    } catch {
      toast.error("Error al ejecutar la acción");
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
          <input 
            placeholder="Buscar por email..."
            className="bg-gray-800 p-2 rounded text-white border border-white/10 w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="text-indigo-400 uppercase text-sm border-b border-white/10">
                <th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">{u.email || 'Sin email'}</td>
                    <td className="p-4">{u.role}</td>
                    <td className="p-4 flex gap-3 justify-center">
                      <button 
                        onClick={() => handleAction(u.id, 'block')} 
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Bloquear
                      </button>
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
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">No se encontraron usuarios.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
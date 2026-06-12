'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

import ChronicleCard from '@/components/ChroniclesCard';

type Chronicle = {
  id?: string;
  _id?: string;
  title?: string;
  author?: string;
  [key: string]: unknown;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi('/chronicles');
        setChronicles(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (err) {
        console.error("Error al cargar crónicas:", err);
      }
    };
    if (user) loadData();
  }, [user]);

  // Lógica de filtrado y paginación
  const filteredChronicles = useMemo(() => {
    return chronicles.filter(c => 
      c.title?.toString().toLowerCase().includes(search.toLowerCase()) || 
      c.author?.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [chronicles, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredChronicles.slice(start, start + itemsPerPage);
  }, [filteredChronicles, currentPage]);

  const totalPages = Math.ceil(filteredChronicles.length / itemsPerPage);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
      
        <main className="max-w-7xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Crónicas</h1>
          
          {/* Buscador */}
          <input 
            type="text"
            placeholder="Buscar por título o autor..."
            className="w-full mb-8 p-4 bg-gray-900/50 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500"
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((c, index) => (
              <ChronicleCard key={c?.id || c?._id || index} chronicle={c} user={user} />
            ))}
          </div>

          {/* Paginador */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-indigo-600' : 'bg-gray-800'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
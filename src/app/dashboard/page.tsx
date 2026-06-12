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
  authorEmail?: string;
  content?: string;
  [key: string]: unknown;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState<'title' | 'author' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi('/chronicles');
        setChronicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar crónicas:", err);
      }
    };
    if (user) loadData();
  }, [user]);

  const filteredChronicles = useMemo(() => {
    return chronicles.filter(c => {
      const searchLower = search.toLowerCase();
      const title = c.title?.toString().toLowerCase() || '';
      const author = c.author?.toString().toLowerCase() || '';

      if (filterBy === 'title') return title.includes(searchLower);
      if (filterBy === 'author') return author.includes(searchLower);
      return title.includes(searchLower) || author.includes(searchLower);
    });
  }, [chronicles, search, filterBy]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredChronicles.slice(start, start + itemsPerPage);
  }, [filteredChronicles, currentPage]);

  const totalPages = Math.ceil(filteredChronicles.length / itemsPerPage);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Explorar Crónicas</h1>
          
          {/* Barra de Filtros Avanzada */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input 
              type="text"
              placeholder={`Buscar por ${filterBy === 'all' ? 'título o autor' : filterBy}...`}
              className="flex-1 p-4 bg-gray-900/50 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500"
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
            
              <select 
                className="bg-gray-900/50 border border-white/10 rounded-xl px-4 text-gray-300 outline-none"
                onChange={(e) => setFilterBy(e.target.value as 'title' | 'author' | 'all')}
                value={filterBy}
            >
              <option value="all">Todo</option>
              <option value="title">Título</option>
              <option value="author">Autor</option>
            </select>
          </div>
          
          {/* Grid de Crónicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.length > 0 ? (
              paginatedData.map((c, index) => (
                <ChronicleCard key={c?.id || c?._id || index} chronicle={c} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-20">No se encontraron crónicas con esos filtros.</p>
            )}
          </div>

          {/* Paginador */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
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
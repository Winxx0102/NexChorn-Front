'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChronicleCard from '@/components/ChroniclesCard';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen pb-20">
        <main className="max-w-7xl mx-auto px-6 py-12">
          
          <div className="flex flex-col mb-12">
            <h1 className="text-4xl font-black text-white mb-2">Explorar</h1>
            <p className="text-gray-400">Descubre y sumérgete en las crónicas de la comunidad.</p>
          </div>
          
          {/* Barra de búsqueda y Filtro Responsivos */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            {/* Campo de búsqueda */}
            <div className="relative flex-1 group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors">🔍</span>
              <input 
                type="text"
                placeholder={`Buscar en ${filterBy === 'all' ? 'todo el archivo' : filterBy}...`}
                className="w-full p-4 pl-12 bg-gray-900/40 border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:bg-gray-900 transition-all shadow-xl"
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            {/* Botón de Filtro Estilizado */}
            <div className="relative">
              <select 
                className="w-full md:w-auto appearance-none bg-gray-900/40 border border-white/5 rounded-2xl px-6 py-4 text-gray-300 outline-none focus:text-white transition-all cursor-pointer hover:bg-gray-900 focus:ring-2 focus:ring-indigo-500/20 pr-12"
                onChange={(e) => setFilterBy(e.target.value as 'title' | 'author' | 'all')}
                value={filterBy}
              >
                <option value="all">📁 Filtrar: Todo</option>
                <option value="title">📖 Título</option>
                <option value="author">👤 Autor</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>
          </div>
          
          {/* Grid de Crónicas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedData.length > 0 ? (
              paginatedData.map((c, index) => (
                <ChronicleCard key={c?.id || c?._id || index} chronicle={c} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-600 border border-dashed border-gray-800 rounded-3xl">
                No se encontraron crónicas que coincidan con tu búsqueda.
              </div>
            )}
          </motion.div>

          {/* Paginador */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl transition-all font-bold ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-900 text-gray-500 hover:bg-gray-800'}`}
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
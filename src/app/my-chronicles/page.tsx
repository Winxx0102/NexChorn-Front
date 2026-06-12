'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';

import ChronicleCard from '@/components/ChroniclesCard';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';

type Chronicle = {
  id?: string;
  _id?: string;
  [key: string]: unknown;
};

export default function MyChroniclesPage() {
  const { user } = useAuth();
  const [myChronicles, setMyChronicles] = useState<Chronicle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para buscador y paginación
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!user) return;

    const loadMyChronicles = async () => {
      try {
        setLoading(true);
        const data = await fetchApi('/chronicles/my/list');
        setMyChronicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar crónicas:", err);
        toast.error("No pudimos cargar tus crónicas");
      } finally {
        setLoading(false);
      }
    };
    
    loadMyChronicles();
  }, [user]);

  // Lógica de filtrado y paginación
  const filteredChronicles = useMemo(() => {
    return myChronicles.filter(c => 
      c.title?.toString().toLowerCase().includes(search.toLowerCase()) || 
      c.author?.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [myChronicles, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredChronicles.slice(start, start + itemsPerPage);
  }, [filteredChronicles, currentPage]);

  const totalPages = Math.ceil(filteredChronicles.length / itemsPerPage);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
     
        <main className="max-w-7xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Mis Crónicas</h1>
          
          {/* Buscador */}
          {myChronicles.length > 0 && (
            <input 
              type="text"
              placeholder="Buscar entre tus crónicas..."
              className="w-full mb-8 p-4 bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          )}
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-indigo-400 animate-pulse">Cargando tus historias...</div>
            </div>
          ) : paginatedData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedData.map((c: Chronicle) => (
                  <ChronicleCard key={c.id || c._id} chronicle={c} />
                ))}
              </div>

              {/* Paginador */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === i + 1 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-gray-900/30 backdrop-blur-md border border-white/10 rounded-2xl">
              <p className="text-gray-400">
                {search ? "No encontramos crónicas que coincidan con tu búsqueda." : "Aún no has publicado ninguna crónica."}
              </p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
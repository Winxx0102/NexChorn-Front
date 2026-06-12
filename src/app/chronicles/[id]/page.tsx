'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function ChronicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  // El contexto de auth no expone 'loading' en este proyecto, así que solo obtenemos user
  const { user } = useAuth();
  const authLoading = false;
  
  interface Chronicle {
    id?: string;
    _id?: string;
    title?: string;
    author?: string;
    content?: string;
    [key: string]: unknown;
  }

  const [chronicle, setChronicle] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Lógica de permisos flexible: verifica si el usuario existe y su rol coincide
  // Usamos toUpperCase para evitar problemas con ADMIN vs admin
const userRole = (user?.role as string | undefined)?.toUpperCase()
  const canEdit = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    fetchApi(`/chronicles/${id}`)
      .then((data) => {
        setChronicle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar la crónica:", err);
        setLoading(false);
      });
  }, [params.id]);

  // Si estamos cargando datos o la autenticación, mostramos un estado neutral
  if (loading || authLoading) {
    return <div className="min-h-screen  text-white flex items-center justify-center">Cargando...</div>;
  }
  
  if (!chronicle) {
    return <div className="min-h-screen  text-white flex items-center justify-center">Crónica no encontrada.</div>;
  }

  return (
    <div className="min-h-screen ">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <button 
          onClick={() => router.back()} 
          className="text-gray-400 hover:text-white mb-8 text-sm transition-colors"
        >
          ← Volver al Dashboard
        </button>

        <article className="bg-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{chronicle.title}</h1>
              <p className="text-lg text-indigo-400 italic">Por: {chronicle.author}</p>
            </div>

            {/* Renderizado condicional del botón */}
            {canEdit && (
              <button 
                onClick={() => {
                  const idToEdit = chronicle.id || chronicle._id;
                  if (idToEdit) {
                    router.push(`/chronicles/edit/${idToEdit}`);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20"
              >
                Editar Crónica
              </button>
            )}
          </div>

          <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
            {chronicle.content}
          </div>
        </article>
      </main>
    </div>
  );
}
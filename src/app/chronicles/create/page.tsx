'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner'; // Importación de sonner

export default function CreateChroniclePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: '', author: '', content: '' });

  // 1. DEPURACIÓN INMEDIATA: Ver qué llega al renderizar
  useEffect(() => {
    if (user) {
      console.log("DEBUG: Objeto usuario detectado en la página:", user);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. EXTRACCIÓN FLEXIBLE
    const userId =
      user?.id ||
      (user as { sub?: string; _id?: string; userId?: string })?.sub ||
      (user as { sub?: string; _id?: string; userId?: string })?._id ||
      (user as { sub?: string; _id?: string; userId?: string })?.userId;

    if (!userId) {
      console.error("DEBUG: El usuario no tiene un ID válido. Objeto:", user);
      toast.error("Error: No se pudo identificar al usuario. Por favor, intenta cerrar sesión y volver a entrar.");
      return;
    }

    // Toast de carga mientras se procesa
    const loadingToast = toast.loading("Publicando tu crónica...");

    try {
      await fetchApi('/chronicles', {
        method: 'POST',
        body: JSON.stringify({ 
            ...form, 
            userId: userId 
        }),
      });

      toast.dismiss(loadingToast);
      toast.success('¡Crónica creada con éxito!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      console.error("Error al enviar al backend:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al crear la crónica';

      toast.error(errorMessage);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center p-4">
  {/* Cambiamos bg-gray-900 por bg-gray-900/60 y añadimos backdrop-blur-xl */}
  <div className="w-full max-w-2xl p-8 bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10">
    <h1 className="text-3xl font-extrabold mb-6 text-white tracking-tight">Nueva Crónica</h1>
    
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400">Título</label>
        <input 
          required
          // Fondo del input también con transparencia para que sea coherente
          className="w-full mt-2 p-4 bg-gray-950/50 border border-white/10 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          placeholder="El misterio de la montaña..."
          value={form.title}
          onChange={(e) => setForm({...form, title: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">Autor</label>
        <input 
          required
          className="w-full mt-2 p-4 bg-gray-950/50 border border-white/10 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          placeholder="Tu nombre o seudónimo"
          value={form.author}
          onChange={(e) => setForm({...form, author: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">Contenido</label>
        <textarea 
          required
          rows={6}
          className="w-full mt-2 p-4 bg-gray-950/50 border border-white/10 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          placeholder="Escribe aquí tu crónica..."
          value={form.content}
          onChange={(e) => setForm({...form, content: e.target.value})}
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-indigo-600/90 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.01]"
      >
        Publicar Crónica
      </button>
    </form>
  </div>
</div>
    </ProtectedRoute>
  );
}
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';

export default function CreateChroniclePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', author: '', content: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Al no necesitar extraer el userId manualmente, el flujo es más seguro.
    // La identidad viaja automáticamente en la cookie.
    const loadingToast = toast.loading("Publicando tu crónica...");

    try {
      await fetchApi('/chronicles', {
        method: 'POST',
        body: JSON.stringify(form), // Solo enviamos los datos del formulario
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
        <div className="w-full max-w-2xl p-8 bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10">
          <h1 className="text-3xl font-extrabold mb-6 text-white tracking-tight">Nueva Crónica</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400">Título</label>
              <input 
                required
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
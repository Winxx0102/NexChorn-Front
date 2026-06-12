'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function CreateChroniclePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', author: '', content: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Publicando tu crónica...");

    try {
      await fetchApi('/chronicles', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      toast.dismiss(loadingToast);
      toast.success('¡Crónica creada con éxito!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la crónica';
      toast.error(errorMessage);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen  py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2">Escribe una nueva historia</h1>
            <p className="text-gray-400">Comparte tu visión con la comunidad. Cada detalle cuenta.</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-gray-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Título</label>
                <input 
                  required
                  className="w-full p-4 bg-gray-950 border border-white/10 text-white rounded-xl focus:border-indigo-500 focus:bg-gray-900 outline-none transition-all"
                  placeholder="El misterio de la montaña..."
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Autor</label>
                <input 
                  required
                  className="w-full p-4 bg-gray-950 border border-white/10 text-white rounded-xl focus:border-indigo-500 focus:bg-gray-900 outline-none transition-all"
                  placeholder="Tu nombre"
                  value={form.author}
                  onChange={(e) => setForm({...form, author: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Contenido</label>
              <textarea 
                required
                rows={10}
                className="w-full p-4 bg-gray-950 border border-white/10 text-white rounded-xl focus:border-indigo-500 focus:bg-gray-900 outline-none transition-all resize-none"
                placeholder="Empieza a escribir aquí..."
                value={form.content}
                onChange={(e) => setForm({...form, content: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
            >
              Publicar Crónica
            </button>
          </form>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function EditChroniclePage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      toast.error("No tienes permisos para editar.");
      router.push('/dashboard');
      return;
    }

    if (id) {
      fetchApi(`/chronicles/${id}`)
        .then((data) => {
          setFormData({ title: data.title, content: data.content });
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error al cargar los datos.");
          setLoading(false);
        });
    }
  }, [id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Guardando cambios...");

    try {
      await fetchApi(`/chronicles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      toast.dismiss(loadingToast);
      toast.success('¡Crónica actualizada con éxito!');
      router.push(`/chronicles/${id}`);
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      toast.error('Error al actualizar.');
    }
  };

  const handleDelete = () => {
    toast.warning('¿Estás seguro de eliminar esta crónica?', {
      description: "Esta acción es irreversible.",
      action: {
        label: "Eliminar definitivamente",
        onClick: async () => {
          try {
            await fetchApi(`/chronicles/${id}`, { method: 'DELETE' });
            toast.success('Crónica eliminada correctamente');
            router.push('/dashboard');
          } catch {
            toast.error("Error al eliminar.");
          }
        }
      },
      cancel: {
        label: "Cancelar",
        onClick: () => toast.dismiss(),
      }
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-400">Cargando editor...</div>;

  return (
    <div className="min-h-screen bg-gray-950 py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Editar Crónica</h1>
          <p className="text-gray-400">Modifica los detalles de esta historia.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Título</label>
            <input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-4 bg-gray-950 border border-white/10 text-white rounded-xl focus:border-indigo-500 focus:bg-gray-900 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Contenido</label>
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={12}
              className="w-full p-4 bg-gray-950 border border-white/10 text-white rounded-xl focus:border-indigo-500 focus:bg-gray-900 outline-none transition-all resize-none"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-black transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
            >
              Guardar Cambios
            </button>
            
            <button 
              type="button" 
              onClick={handleDelete}
              className="px-8 bg-red-900/20 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-all active:scale-[0.98]"
            >
              Eliminar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
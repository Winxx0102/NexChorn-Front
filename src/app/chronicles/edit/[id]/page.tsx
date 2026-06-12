'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';


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

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta crónica? Esta acción no se puede deshacer.")) {
      return;
    }

    const loadingToast = toast.loading("Eliminando...");

    try {
      await fetchApi(`/chronicles/${id}`, {
        method: 'DELETE',
      });

      toast.dismiss(loadingToast);
      toast.success('Crónica eliminada correctamente');
      router.push('/dashboard');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Error al intentar eliminar la crónica.");
    }
  };

  if (loading) return <div className="text-white p-8">Cargando...</div>;

  return (
    <div className="min-h-screen text-white">
      
      <main className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Editar Crónica</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Título</label>
            <input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Contenido</label>
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full bg-gray-900 border border-gray-800 p-4 rounded-xl h-64 focus:border-indigo-500 outline-none"
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              type="submit" 
              className="flex-1 bg-indigo-600 p-4 rounded-xl font-bold hover:bg-indigo-500 transition-all"
            >
              Guardar Cambios
            </button>
            
            <button 
              type="button" 
              onClick={handleDelete}
              className="px-6 bg-red-900/30 border border-red-500/50 text-red-500 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
            >
              Eliminar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
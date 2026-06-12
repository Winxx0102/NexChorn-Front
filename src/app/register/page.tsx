'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/services/api';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const loadingToast = toast.loading("Creando tu cuenta...");

    try {
      await fetchApi('/users/register', { 
        method: 'POST', 
        body: JSON.stringify(form) 
      });

      toast.dismiss(loadingToast);
      toast.success('¡Registro exitoso! Ya puedes iniciar sesión.');
      router.push('/login');
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      console.error(err);
      const message = err instanceof Error ? err.message : 'Error al registrar. Intenta nuevamente.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        
        {/* Contenedor de Bienvenida */}
        <div className="flex-1 text-left space-y-4">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Únete a NexChron
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Comienza a digitalizar tus mundos. Crea una cuenta gratuita y comienza a organizar tus historias, crónicas y notas en un solo lugar.
          </p>
          <div className="flex items-center gap-2 text-indigo-400 font-medium">
            <span>🚀</span>
            <span>Acceso ilimitado a tus crónicas</span>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">Crear cuenta</h2>
          
          <input 
            required
            className="w-full p-4 mb-4 bg-gray-950 text-white rounded-xl border border-gray-700 focus:border-indigo-500 outline-none transition-all" 
            placeholder="Nombre y Apellido" 
            onChange={e => setForm({...form, name: e.target.value})} 
          />
          
          <input 
            required
            type="email"
            className="w-full p-4 mb-4 bg-gray-950 text-white rounded-xl border border-gray-700 focus:border-indigo-500 outline-none transition-all" 
            placeholder="Email" 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          
          <input 
            required
            type="password" 
            className="w-full p-4 mb-6 bg-gray-950 text-white rounded-xl border border-gray-700 focus:border-indigo-500 outline-none transition-all" 
            placeholder="Contraseña" 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          
          <button 
            disabled={loading}
            type="submit"
            className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Registrarse'}
          </button>

          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">¿Ya tienes cuenta? </span>
            <Link href="/login" className="text-indigo-400 hover:underline font-bold">
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
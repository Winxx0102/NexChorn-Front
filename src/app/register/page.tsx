'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { toast } from 'sonner'; // Importamos sonner

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Toast de carga
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">Crear Cuenta</h2>
        
        <input 
          required
          className="w-full p-4 mb-4 bg-gray-950 text-white rounded-xl border border-gray-700 focus:border-blue-500 outline-none transition-all" 
          placeholder="Nombre y Apellido" 
          onChange={e => setForm({...form, name: e.target.value})} 
        />
        
        <input 
          required
          type="email"
          className="w-full p-4 mb-4 bg-gray-950 text-white rounded-xl border border-gray-700 focus:border-blue-500 outline-none transition-all" 
          placeholder="Email" 
          onChange={e => setForm({...form, email: e.target.value})} 
        />
        
        <input 
          required
          type="password" 
          className="w-full p-4 mb-6 bg-gray-950 text-white rounded-xl border border-gray-700 focus:border-blue-500 outline-none transition-all" 
          placeholder="Contraseña" 
          onChange={e => setForm({...form, password: e.target.value})} 
        />
        
        <button 
          disabled={loading}
          type="submit"
          className="w-full p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}
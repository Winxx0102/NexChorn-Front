'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetchApi('/auth/login', { 
        method: 'POST', 
        body: JSON.stringify(form) 
      });
      login(data.user || data); 
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error("Login fallido:", err);
      alert('Credenciales incorrectas o error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Cargando sesión...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        
        {/* Contenedor de Bienvenida */}
        <div className="flex-1 text-left space-y-4">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            NexChron
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Tu espacio personal para organizar, guardar y revivir tus historias. 
            Crea crónicas detalladas, estructura tus mundos y mantén cada detalle 
            a salvo en un entorno diseñado para la narrativa.
          </p>
          <div className="flex items-center gap-2 text-blue-400 font-medium">
            <span></span>
            <span>Seguridad y simplicidad en cada crónica</span>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">Iniciar Sesión</h2>
          
          <input 
            required
            type="email"
            value={form.email}
            className="w-full p-4 mb-4 bg-gray-950 text-white rounded-xl border border-gray-700 outline-none focus:border-blue-500 transition-colors" 
            placeholder="Email" 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          
          <input 
            required
            type="password"
            value={form.password}
            className="w-full p-4 mb-6 bg-gray-950 text-white rounded-xl border border-gray-700 outline-none focus:border-blue-500 transition-colors" 
            placeholder="Password" 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          
          <button 
            disabled={loading}
            type="submit"
            className="w-full p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Accediendo...' : 'Ingresar'}
          </button>

          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">¿No tienes cuenta? </span>
            <Link href="/register" className="text-blue-400 hover:underline font-bold">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
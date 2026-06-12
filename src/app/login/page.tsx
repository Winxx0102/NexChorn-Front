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
    // Si ya hay sesión (el backend nos reconoce por la cookie), enviamos al dashboard
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Al usar fetchApi con credentials: 'include', las cookies 
      // se envían y reciben automáticamente en esta petición.
      const data = await fetchApi('/auth/login', { 
        method: 'POST', 
        body: JSON.stringify(form) 
      });

      // YA NO NECESITAMOS localStorage.setItem('token', ...)
      // El navegador guarda la cookie por nosotros automáticamente.

      // Actualizamos el estado del contexto con los datos que devuelve el login
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">Bienvenido de nuevo</h2>
        
        <input 
          required
          type="email"
          value={form.email}
          className="w-full p-4 mb-4 bg-gray-950 text-white rounded-xl border border-gray-700 outline-none focus:border-blue-500" 
          placeholder="Email" 
          onChange={e => setForm({...form, email: e.target.value})} 
        />
        
        <input 
          required
          type="password"
          value={form.password}
          className="w-full p-4 mb-6 bg-gray-950 text-white rounded-xl border border-gray-700 outline-none focus:border-blue-500" 
          placeholder="Password" 
          onChange={e => setForm({...form, password: e.target.value})} 
        />
        
        <button 
          disabled={loading}
          type="submit"
          className="w-full p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loading ? 'Accediendo...' : 'Iniciar Sesión'}
        </button>

        <Link href="/register" className="block mt-3 text-center text-gray-400 hover:text-white">
          Crear cuenta nueva
        </Link>
      </form>
    </div>
  );
}
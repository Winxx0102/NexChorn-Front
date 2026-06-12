'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Usaremos useRouter para una navegación más fluida
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  // 1. Efecto para redirigir si ya hay un usuario logueado
  useEffect(() => {
    // Si la carga terminó y ya tenemos un usuario, vamos al dashboard
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

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }

      // Actualizamos el estado global
      login(data.user || data); 
      
      // En lugar de window.location, usamos router.push para mantener el estado de React
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error("Login fallido:", err);
      alert('Credenciales incorrectas o error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // 2. Si todavía estamos comprobando el token en AuthContext, no mostramos el login
  // Esto evita el "parpadeo" de ver el login por un segundo
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;
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
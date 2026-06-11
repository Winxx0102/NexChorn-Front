'use client';
import { useState } from 'react';
import Link from 'next/link'; // 1. Importa Link
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await fetchApi('/auth/login', { 
        method: 'POST', 
        body: JSON.stringify(form) 
      });
      await login(userData); 
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      console.error("Login fallido:", err);
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">Bienvenido de nuevo</h2>
        
        <input 
          required
          type="email"
          autoComplete="email"
          value={form.email}
          className="w-full p-4 mb-4 bg-gray-950 text-white rounded-xl border border-gray-700 focus:border-blue-500 outline-none transition" 
          placeholder="Email" 
          onChange={e => setForm({...form, email: e.target.value})} 
        />
        
        <input 
          required
          type="password"
          autoComplete="current-password"
          value={form.password}
          className="w-full p-4 mb-6 bg-gray-950 text-white rounded-xl border border-gray-700 focus:border-blue-500 outline-none transition" 
          placeholder="Password" 
          onChange={e => setForm({...form, password: e.target.value})} 
        />
        
        <div className="space-y-3">
          <button 
            disabled={loading}
            type="submit"
            className="w-full p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Accediendo...' : 'Iniciar Sesión'}
          </button>

          {/* 2. Botón de Registro */}
          <Link 
            href="/register" 
            className="block w-full p-4 text-center text-gray-400 hover:text-white font-medium border border-gray-700 hover:border-gray-500 rounded-xl transition-all"
          >
            Crear cuenta nueva
          </Link>
        </div>
      </form>
    </div>
  );
}
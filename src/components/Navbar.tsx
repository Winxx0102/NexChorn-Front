'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // 1. Importa el hook

export default function Navbar() {
  // 2. Extrae la función logout del contexto
  const { logout } = useAuth();

  const handleLogout = async () => {
    // 3. Ejecuta la función de logout que limpia todo
    await logout();
  };

  return (
    <nav className="w-full p-6 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
      <Link 
        href="/dashboard" 
        className="text-4xl font-extrabold text-white transition-colors duration-300 hover:text-indigo-400"
      >
        NexChron
      </Link>
      <div className="space-x-6">
        <Link href="/my-chronicles" className="text-gray-300 hover:text-white">
          Mis Crónicas
        </Link>
        <Link href="/chronicles/create" className="text-gray-300 hover:text-white">
          Nueva Crónica
        </Link>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-colors"
        >
          Salir
        </button>
      </div>
    </nav>
  );
}
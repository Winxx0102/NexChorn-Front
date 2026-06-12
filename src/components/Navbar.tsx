'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation'; // Necesario para detectar la ruta

export default function Navbar() {
  const { logout } = useAuth();
  const pathname = usePathname(); // Obtenemos la ruta actual

  // Si estamos en la página de login, no renderizamos la navbar
  if (pathname === '/login') return null;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="w-full p-6 bg-gray-900 border-b border-gray-800 flex justify-between items-center z-50">
      <Link 
        href="/dashboard" 
        className="text-4xl font-extrabold text-white transition-colors duration-300 hover:text-indigo-400"
      >
        NexChron
      </Link>
      
      <div className="space-x-6 flex items-center">
        <Link href="/my-chronicles" className="text-gray-300 hover:text-white transition-colors">
          Mis Crónicas
        </Link>
        <Link href="/chronicles/create" className="text-gray-300 hover:text-white transition-colors">
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
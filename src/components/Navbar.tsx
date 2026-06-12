'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/login' || pathname === '/register') return null;

  const isAdminOrSuper = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  return (
    <nav className="sticky top-0 w-full bg-gray-950/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href="/dashboard" className="text-2xl font-black text-white hover:text-indigo-400 transition-colors">
          NexChron
        </Link>

        {/* Botón Hamburguesa (Móvil) */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Menú PC */}
        <div className={`md:flex items-center space-x-8 ${isOpen ? 'absolute top-full left-0 w-full bg-gray-900 p-6 flex flex-col space-y-4' : 'hidden'}`}>
          <Link href="/my-chronicles" className="text-gray-300 hover:text-indigo-400 transition-all">Mis Crónicas</Link>
          <Link href="/chronicles/create" className="text-gray-300 hover:text-indigo-400 transition-all">Nueva</Link>
          
          {isAdminOrSuper && (
            <Link href="/admin" className="text-indigo-400 font-bold hover:scale-105 transition-transform">
              Admin
            </Link>
          )}
          
          <button 
            onClick={() => logout()} 
            className="bg-white/5 hover:bg-red-500/20 text-white border border-white/10 px-4 py-2 rounded-xl transition-all"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
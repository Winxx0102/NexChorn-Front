'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { logout, user, isLoading } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setIsOpen(false), 0);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  if (pathname === '/login' || pathname === '/register') return null;

  // Lógica de permisos
  const isAdminOrSuper = !isLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');
  const isBlocked = !isLoading && user?.isBlocked;

  return (
    <nav className="sticky top-0 w-full bg-gray-950/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href="/dashboard" className="text-2xl font-black text-white hover:text-indigo-400 transition-colors">
          NexChron
        </Link>

        <button 
          className="md:hidden text-white p-2" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? '✕' : '☰'}
        </button>

        <div className={`
          ${isOpen ? 'absolute top-full left-0 w-full bg-gray-900 border-b border-white/10 p-6 flex flex-col space-y-4' : 'hidden'}
          md:flex md:static md:w-auto md:bg-transparent md:p-0 md:flex-row md:space-y-0 md:space-x-8 items-center
        `}>
          <Link href="/my-chronicles" className="text-gray-300 hover:text-indigo-400 transition-all">Mis Crónicas</Link>
          
          {/* Solo se muestra si NO está bloqueado */}
          {!isBlocked && (
            <Link href="/chronicles/create" className="text-gray-300 hover:text-indigo-400 transition-all">Nueva</Link>
          )}
          
          {isAdminOrSuper && (
            <Link 
              href="/admin" 
              className="text-indigo-400 font-bold hover:scale-105 transition-transform border border-indigo-500/30 px-3 py-1 rounded-lg"
            >
              Admin Panel
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
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/services/api'; // Asegúrate de tener este import

export default function Navbar() {
  const { logout, user, isLoading } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // No mostrar navbar en login/registro
  if (pathname === '/login' || pathname === '/register') return null;

  const isAdminOrSuper = !isLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');
  const isBlocked = !isLoading && user?.isBlocked;

  const handleLogout = async () => {
    try {
      // 1. Llamada al backend para destruir la cookie 'jwt' en el servidor
      await fetchApi('/auth/logout', { method: 'GET' });
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor");
    } finally {
      // 2. Limpiar contexto y recargar para forzar estado limpio
      logout();
      setIsOpen(false);
      window.location.href = '/login';
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      className="sticky top-0 w-full bg-gray-950/60 backdrop-blur-xl border-b border-white/5 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/dashboard" className="text-2xl font-black text-white tracking-tighter">
          Nex<span className="text-indigo-500">Chron</span>
        </Link>

        {/* Botón Hamburguesa (Móvil) */}
        <button 
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Menú de navegación */}
        <AnimatePresence>
          {(isOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
            <motion.div 
              initial={isOpen ? { opacity: 0, height: 0 } : false}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`
                ${isOpen ? 'absolute top-full left-0 w-full bg-gray-950/95 border-b border-white/10 p-6 flex flex-col space-y-6' : 'hidden'}
                md:flex md:static md:w-auto md:bg-transparent md:p-0 md:flex-row md:space-y-0 md:space-x-8 items-center
              `}
            >
              <Link 
                href="/my-chronicles" 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
              >
                Crónicas
              </Link>
              
              {!isBlocked && (
                <Link 
                  href="/chronicles/create" 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
                >
                  Crear
                </Link>
              )}
              
              {isAdminOrSuper && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/50 px-4 py-2 rounded-xl transition-all font-bold text-xs"
                >
                  ADMIN PANEL
                </Link>
              )}
              
              <button 
                onClick={handleLogout} 
                className="bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-xl transition-all font-bold text-xs"
              >
                SALIR
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
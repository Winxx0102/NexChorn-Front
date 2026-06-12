'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  userRole: string;
  targetUser: { id: number; role: string; isBlocked: boolean };
  onAction: (id: number, action: 'block' | 'unblock' | 'role', role?: string) => void;
}

export default function UserActionMenu({ userRole, targetUser, onAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-sm transition-all hover:scale-105 active:scale-95"
      >
        Gestionar
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-2 z-50"
          >
            <button 
              onClick={() => { onAction(targetUser.id, targetUser.isBlocked ? 'unblock' : 'block'); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {targetUser.isBlocked ? 'Desbloquear usuario' : 'Bloquear usuario'}
            </button>

            {userRole === 'SUPERADMIN' && (
              <div className="border-t border-white/5 mt-2 pt-2">
                <p className="px-3 py-1 text-[10px] text-gray-500 uppercase tracking-wider font-bold">Cambiar Rol</p>
                {['USER', 'ADMIN', 'SUPERADMIN'].map((role) => (
                  <button 
                    key={role}
                    onClick={() => { onAction(targetUser.id, 'role', role); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors"
                  >
                    Asignar {role}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
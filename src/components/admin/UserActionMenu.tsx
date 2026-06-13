'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Props {
  userRole: string;
  targetUser: { id: number; role: string; isBlocked: boolean };
  // Añadimos el ID del usuario logueado para comparar
  currentUserId?: number; 
  onAction: (id: number, action: 'block' | 'unblock' | 'role', role?: string) => void;
}

export default function UserActionMenu({ userRole, targetUser, currentUserId, onAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSuperAdmin = userRole?.trim().toUpperCase() === 'SUPERADMIN';
  const isSelf = currentUserId === targetUser.id;

  const handleRoleChange = (role: string) => {
    setIsOpen(false);
    toast.warning(`¿Cambiar rol a ${role}?`, {
      description: "Esta acción modificará los permisos del usuario de forma inmediata.",
      action: {
        label: "Confirmar",
        onClick: () => onAction(targetUser.id, 'role', role)
      }
    });
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95"
      >
        Gestionar
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-[60] overflow-hidden"
          >
            {/* Bloqueo / Desbloqueo */}
            {!isSelf && (
              <button 
                onClick={() => { onAction(targetUser.id, targetUser.isBlocked ? 'unblock' : 'block'); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${targetUser.isBlocked ? 'text-emerald-400 hover:bg-emerald-900/20' : 'text-red-400 hover:bg-red-900/20'}`}
              >
                {targetUser.isBlocked ? 'Desbloquear usuario' : 'Bloquear usuario'}
              </button>
            )}

            {/* Gestión de Roles (Solo para Superadmins) */}
            {isSuperAdmin && !isSelf && (
              <div className="border-t border-white/5 mt-2 pt-2">
                <p className="px-3 py-1 text-[10px] text-gray-500 uppercase tracking-widest font-black">Asignar Rol</p>
                {['USER', 'ADMIN', 'SUPERADMIN'].map((role) => (
                  <button 
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className="w-full text-left px-3 py-2 text-sm text-indigo-300 hover:bg-indigo-900/30 rounded-lg transition-colors"
                  >
                    {role}
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
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/services/api';

export type User = {
  id: string;
  email?: string;
  role?: 'USER' | 'ADMIN' | 'SUPERADMIN' | string;
  [key: string]: unknown;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>; // <-- Nueva utilidad
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para re-verificar la sesión (útil tras cambios)
  const refreshUser = useCallback(async () => {
    try {
      const data = await fetchApi('/auth/verify-session');
      // Asegúrate de que aquí llega el objeto usuario correctamente
      setUser(data.user || data); 
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Call refreshUser asynchronously to avoid synchronous setState in effect
    const run = async () => {
      await refreshUser();
    };
    run();
  }, [refreshUser]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetchApi('/auth/logout');
    } catch (e) {
      console.error("Error al cerrar sesión");
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
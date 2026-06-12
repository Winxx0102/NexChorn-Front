'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '@/services/api';

export type User = {
  id: string;
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN' | 'SUPERADMIN' | string;
  [key: string]: unknown;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Al usar credentials: 'include' en fetchApi, 
        // el navegador envía la cookie automáticamente aquí.
        const data = await fetchApi('/auth/verify-session'); 
        setUser(data.user || data); 
      } catch (err) {
        // Si falla, es porque no hay sesión o la cookie expiró
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetchApi('/auth/logout'); 
    } catch (e) {
      console.error("Error al cerrar sesión en el servidor");
    } finally {
      // Ya no necesitamos eliminar localStorage.removeItem('token')
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
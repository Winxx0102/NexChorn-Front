'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '@/services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: async () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        // CORRECCIÓN: Usamos el endpoint correcto definido en tu AuthController
        const data = await fetchApi('/auth/verify-session'); 
        
        // CORRECCIÓN: Si tu backend devuelve { user: { ... } }, accedemos a la propiedad .user
        setUser(data.user || data); 
      } catch (err) {
        console.warn("Sesión no encontrada o expirada");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = (userData: User) => setUser(userData);

  const logout = async () => {
    try {
      await fetchApi('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
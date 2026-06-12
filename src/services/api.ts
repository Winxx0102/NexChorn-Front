// src/services/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://nexchorn-back.onrender.com';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // 1. Recuperamos el token del almacenamiento local
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config: RequestInit = {
    ...options,
    // 2. Quitamos 'credentials: include' porque ya no usamos cookies
    headers: {
      'Content-Type': 'application/json',
      // 3. Añadimos el token al header Authorization
    ...(token ? { 'Authorization': `${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    // Aquí podrías redirigir al login si el token es inválido
    throw new Error('Unauthorized');
  }

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) throw new Error(data.message || 'Error');
  return data;
};
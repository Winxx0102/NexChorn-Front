// src/services/api.ts

// Usamos la variable de entorno que configuraremos en Vercel.
// Si no existe (estamos en local), usamos localhost:3000 por defecto.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://nex-chorn-back.vercel.app';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  // Construimos la URL completa: https://tu-api.com/chronicles/1
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Necesario para enviar cookies de sesión
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    throw new Error('Unauthorized: Sesión expirada o no iniciada.');
  }

  // Intentamos leer el JSON. Si la respuesta está vacía, evitamos error.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
};
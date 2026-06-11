// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige automáticamente al usuario al login
  redirect('/login');
}
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // Si tienes lógica de logout, añádela aquí
    router.push('/login');
  };

  return (
    <nav className="w-full p-6 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
      <Link 
  href="/dashboard" 
  className="text-4xl font-extrabold text-white transition-colors duration-300 hover:text-indigo-400"
>
  NexChron
</Link>
      <div className="space-x-6">
        
       <Link href="/my-chronicles" className="text-gray-300 hover:text-white">
  Mis Crónicas
</Link>
        <Link href="/chronicles/create" className="text-gray-300 hover:text-white">
          Nueva Crónica
        </Link>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-colors"
        >
          Salir
        </button>
      </div>
    </nav>
  );
}
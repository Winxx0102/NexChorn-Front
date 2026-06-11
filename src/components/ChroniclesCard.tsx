'use client';
import { User } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importamos el router

type Chronicle = {
  id?: string;
  _id?: string;
  title?: string;
  author?: string;
  content?: string;
};

export default function ChronicleCard({ chronicle, user }: { chronicle: Chronicle | null, user: User | null }) {
  const router = useRouter(); // Inicializamos el router

  if (!chronicle) return null;

  const chronicleId = chronicle?.id || chronicle?._id;
  const canEdit = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que se dispare el Link del padre
    e.stopPropagation(); // Evita que el evento se propague al Link
    if (chronicleId) {
      router.push(`/chronicles/edit/${chronicleId}`);
    }
  };

  return (
    <Link href={chronicleId ? `/chronicles/${chronicleId}` : '#'} className="block h-full">
      {/* Aplicamos Glassmorphism para que combine con tu nuevo wallpaper */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {chronicle?.title || 'Sin título'}
            </h3>
            <p className="text-sm text-indigo-400 font-medium">
              Por: {chronicle?.author || 'Anónimo'}
            </p>
          </div>
          
          {canEdit && (
            <button 
              onClick={handleEdit}
              className="text-xs bg-indigo-600/80 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition-all"
            >
              Editar
            </button>
          )}
        </div>

        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {chronicle?.content || 'Sin contenido'}
        </p>
      </div>
    </Link>
  );
}
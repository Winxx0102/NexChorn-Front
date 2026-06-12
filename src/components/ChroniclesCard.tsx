'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Chronicle = {
  id?: string;
  _id?: string;
  title?: string;
  author?: string;
  authorEmail?: string; // <--- Agregamos este campo (asegúrate de que tu backend lo envíe)
  content?: string;
};

export default function ChronicleCard({ chronicle }: { chronicle: Chronicle | null }) {
  const router = useRouter();
  const { user, isLoading } = useAuth(); 

  if (!chronicle) return null;

  const chronicleId = chronicle?.id || chronicle?._id;
  const canEdit = !isLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (chronicleId) {
      router.push(`/chronicles/edit/${chronicleId}`);
    }
  };

  return (
    <Link href={chronicleId ? `/chronicles/${chronicleId}` : '#'} className="block h-full">
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {chronicle?.title || 'Sin título'}
            </h3>
            <div className="flex flex-col">
              <p className="text-sm text-indigo-400 font-medium">
                Por: {chronicle?.author || 'Anónimo'}
              </p>
              {/* Aquí mostramos el correo pequeñito */}
              {chronicle?.authorEmail && (
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {chronicle.authorEmail}
                </p>
              )}
            </div>
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
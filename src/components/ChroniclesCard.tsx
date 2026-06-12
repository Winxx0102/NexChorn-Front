'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';

type Chronicle = {
  id?: string;
  _id?: string;
  title?: string;
  author?: string;
  authorEmail?: string;
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
    if (chronicleId) router.push(`/chronicles/edit/${chronicleId}`);
  };

  const exportToPDF = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const doc = new jsPDF();
    
    // --- Header Estilizado con Marca ---
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('NEXCHRON', 15, 13);
    
    // --- Cuerpo del Documento ---
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(chronicle.title || 'Crónica', 20, 40);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Por: ${chronicle.author || 'Anónimo'}`, 20, 50);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 55, 190, 55);
    
    doc.setFontSize(11);
    const splitContent = doc.splitTextToSize(chronicle.content || '', 170);
    doc.text(splitContent, 20, 65);
    
    // --- Footer ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generado por NexChron | Plataforma de Gestión de Crónicas', 20, 290);
    
    doc.save(`${chronicle.title?.replace(/\s+/g, '_') || 'cronica'}.pdf`);
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
      <Link href={chronicleId ? `/chronicles/${chronicleId}` : '#'} className="block h-full">
        <div className="flex flex-col h-full bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all hover:border-indigo-500/30 hover:bg-gray-900/60 shadow-lg group">
          
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
                {chronicle?.title || 'Sin título'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                  {chronicle?.author || 'Anónimo'}
                </span>
              </div>
            </div>
            
            {canEdit && (
              <button onClick={handleEdit} className="text-[10px] uppercase font-black tracking-widest bg-white/5 hover:bg-indigo-600 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-all">
                Editar
              </button>
            )}
          </div>

          <div className="flex-grow">
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors">
              {chronicle?.content || 'Sin contenido disponible...'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest group-hover:text-indigo-500/50 transition-colors">
              Leer completa →
            </span>
            
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 hover:text-red-400 transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-red-500/30"
            >
              <FaFilePdf size={12} />
              PDF
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
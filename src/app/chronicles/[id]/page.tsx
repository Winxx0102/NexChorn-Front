'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaFilePdf, FaArrowLeft } from 'react-icons/fa';
import jsPDF from 'jspdf';

export default function ChronicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  interface Chronicle {
    id?: string; _id?: string; title?: string; author?: string; content?: string;
  }

  const [chronicle, setChronicle] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);

  const canEdit = !authLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    fetchApi(`/chronicles/${id}`)
      .then((data) => { setChronicle(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  const exportToPDF = () => {
    if (!chronicle) return;
    const doc = new jsPDF();
    
    // Header Estilizado
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('NEXCHRON', 15, 13);
    
    // Contenido
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.text(chronicle.title || 'Crónica', 20, 40);
    doc.setFontSize(12);
    doc.text(`Autor: ${chronicle.author || 'Anónimo'}`, 20, 50);
    doc.line(20, 55, 190, 55);
    
    doc.setFontSize(11);
    const splitContent = doc.splitTextToSize(chronicle.content || '', 170);
    doc.text(splitContent, 20, 65);
    
    // Footer
    doc.setFontSize(8);
    doc.text('Generado por NexChron | Plataforma de Gestión de Crónicas', 20, 290);
    doc.save(`${chronicle.title?.replace(/\s+/g, '_') || 'cronica'}.pdf`);
  };

  if (loading || authLoading) return <div className="min-h-screen flex items-center justify-center text-indigo-400">Cargando...</div>;
  if (!chronicle) return <div className="min-h-screen text-white flex items-center justify-center">Crónica no encontrada.</div>;

  return (
    <div className="min-h-screen py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-indigo-400 mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
          <FaArrowLeft size={12} /> Volver
        </button>

        <article className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{chronicle.title}</h1>
              <p className="text-lg text-indigo-400 font-medium">Por: {chronicle.author}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={exportToPDF} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-all text-sm font-bold text-gray-400">
                <FaFilePdf size={16} /> Exportar
              </button>
              {canEdit && (
                <button onClick={() => router.push(`/chronicles/edit/${chronicle.id || chronicle._id}`)} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all text-sm">
                  Editar
                </button>
              )}
            </div>
          </div>

          <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-line border-t border-white/5 pt-8">
            {chronicle.content}
          </div>
        </article>
      </motion.div>
    </div>
  );
}
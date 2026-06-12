'use client';
import { FaGithub, FaWhatsapp, FaEnvelope, FaUser } from 'react-icons/fa';

export default function Footer() {
  const contactLinks = [
    { name: 'WhatsApp', icon: FaWhatsapp, url: 'https://wa.me/584163670993', label: '+58 416 3670993', color: 'text-green-400' },
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/Winxx0102', label: '@Winxx0102', color: 'text-white' },
    { name: 'Email', icon: FaEnvelope, url: 'mailto:olowixtovar@gmail.com', label: 'olowixtovar@gmail.com', color: 'text-blue-400' },
  ];

  return (
    <footer className="relative bg-gray-950 border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Efecto decorativo de luz en el fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Columna 1: Info Creador */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black">
              N
            </div>
            <h3 className="text-white font-black text-2xl tracking-tighter">NexChron</h3>
          </div>
          
          <div className="inline-flex items-center gap-2 text-indigo-400/80 font-medium bg-indigo-500/5 px-3 py-1 rounded-full w-fit text-sm border border-indigo-500/10">
            <FaUser size={14} /> Jorge Tovar
          </div>
          
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            Plataforma de gestión de crónicas diseñada para narradores digitales. 
            Transformando ideas en historias organizadas en un entorno minimalista y fluido.
          </p>
        </div>

        {/* Columna 2: Contacto */}
        <div className="grid grid-cols-1 gap-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-widest text-gray-400 mb-2">Conectemos</h4>
          {contactLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              className="group flex items-center gap-4 p-4 bg-gray-900/40 border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300 hover:bg-gray-900/60"
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gray-950/50 ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">{item.name}</span>
                <span className="text-sm text-gray-200">{item.label}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      {/* Footer Inferior */}
      <div className="max-w-6xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs">
        <p>© {new Date().getFullYear()} NexChron. Todos los derechos reservados.</p>
        <p>Hecho con esfuerzo por Jorge Tovar</p>
      </div>
    </footer>
  );
}
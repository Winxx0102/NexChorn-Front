import { FaGithub, FaWhatsapp, FaEnvelope, FaUser } from 'react-icons/fa';

export default function Footer() {
  const contactLinks = [
    { name: 'WhatsApp', icon: FaWhatsapp, url: 'https://wa.me/584163670993', label: '+58 416 3670993', color: 'text-green-400' },
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/Winxx0102', label: '@Winxx0102', color: 'text-white' },
    { name: 'Email', icon: FaEnvelope, url: 'mailto:olowixtovar@gmail.com', label: 'olowixtovar@gmail.com', color: 'text-blue-400' },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-16 mt-auto">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Columna 1: Info Creador */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold text-2xl">NexChron</h3>
          <div className="flex items-center gap-2 text-indigo-400 font-medium">
            <FaUser size={18} /> Jorge Tovar
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Plataforma de gestión de crónicas diseñada para narradores digitales. 
            Transformando ideas en historias organizadas.
          </p>
        </div>

        {/* Columna 2: Contacto */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6">Conectemos</h3>
          <div className="grid grid-cols-1 gap-3">
            {contactLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                className="group flex items-center gap-3 p-3 bg-gray-950/50 border border-gray-800 rounded-xl hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div className={`p-2 rounded-lg bg-gray-900 ${item.color}`}>
                  <item.icon size={18} />
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Inferior */}
      <div className="max-w-5xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
        © {new Date().getFullYear()} NexChron. Hecho con pasión por Jorge Tovar.
      </div>
    </footer>
  );
}
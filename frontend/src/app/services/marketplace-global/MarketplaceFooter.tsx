export default function MarketplaceFooter() {
  return (
    <footer className="w-full bg-gray-900 text-white pt-10 pb-6 mt-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
        {/* Bloc logo & devenir vendeur */}
        <div>
          <div className="font-extrabold text-2xl text-black mb-2">Asmyne-group</div>
          <div className="text-gray-300 mb-4">Tu marketplace de confianza para comprar y vender fácilmente.</div>
          <a href="/services/marketplace-global/seller-login" className="inline-block px-6 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-black transition">Conviértete en vendedor</a>
        </div>
        {/* Bloc navigation */}
        <div>
          <div className="font-bold mb-2">Navigation</div>
          <ul className="space-y-1 text-gray-300">
            <li><a href="#" className="hover:text-black transition">Inicio</a></li>
            <li><a href="#collections" className="hover:text-black transition">Colecciones</a></li>
            <li><a href="#products" className="hover:text-black transition">Productos</a></li>
            <li><a href="#faq" className="hover:text-black transition">FAQ</a></li>
          </ul>
        </div>
        {/* Bloc contact */}
        <div>
          <div className="font-bold mb-2">Contacto</div>
          <div className="text-gray-300">Email : contact@asmyne-group.com</div>
          <div className="text-gray-300">Teléfono : +1 (809) 308-6370</div>
        </div>
        {/* Bloc réseaux sociaux */}
        <div>
          <div className="font-bold mb-2">Síguenos</div>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-black transition" title="Facebook"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12z"/></svg></a>
            <a href="#" className="hover:text-black transition" title="Twitter"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.9c-.37.63-.58 1.36-.58 2.14 0 1.48.75 2.78 1.89 3.54-.7-.02-1.36-.21-1.94-.53v.05c0 2.07 1.47 3.8 3.42 4.19-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.11 2.91 3.97 2.94A8.6 8.6 0 012 19.54 12.13 12.13 0 008.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022.46 6z"/></svg></a>
            <a href="#" className="hover:text-black transition" title="Instagram"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 110 10.5 5.25 5.25 0 010-10.5zm0 1.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm6.25 1.25a1 1 0 110 2 1 1 0 010-2z"/></svg></a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center pt-6 text-gray-400 text-sm">
        <div>© 2026 Asmyne-group. Todos los derechos reservados.</div>
        <div>Marketplace creado por Jorgensen Kervens</div>
      </div>
    </footer>
  );
}

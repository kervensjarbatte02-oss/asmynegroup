import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a174e] text-white pt-12 pb-4 px-4 md:px-16 mt-0 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row md:justify-between gap-12">
        {/* Bloc logo & contact (à gauche) */}
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-[#e6e85c] flex items-center justify-center font-bold text-2xl text-[#16213a]">A</div>
            <span className="text-3xl font-extrabold tracking-wide">Asmyne</span>
          </div>
          <div className="text-white/80 mb-2">Nuestra Dirección:</div>
          <div className="mb-2 font-semibold">Casa 12 Calle primera Urb Mirador Isabela Sector Villa Mella Próximo a la avenida Jacobo Majluta Santo Domingo Norte Rep. Dom.</div>
          <div className="mb-2 text-white/80">Soporte 24/7: <span className="font-semibold text-white">1-(809) 308-6370</span></div>
          <div className="mb-2 text-white/80">Correo electrónico: <span className="font-semibold text-white">contact@asmyne.com</span></div>
        </div>
        {/* Bloc newsletter (à droite) */}
        <div className="flex-1 min-w-[220px]">
          <div className="font-bold mb-3 text-lg">Suscríbete a nuestro boletín</div>
          <div className="text-white/80 mb-3">Regístrate para recibir actualizaciones sobre nuestras últimas noticias.</div>
          <form className="flex items-center mb-2">
            <input type="email" placeholder="Introduce tu correo electrónico" className="rounded-full px-5 py-3 w-full text-black focus:outline-none" />
            <button type="submit" className="-ml-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-[#e6e85c] transition">
              <svg width="22" height="22" fill="none" stroke="#111216" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </form>
          <div className="text-xs text-white/60">Al suscribirte, aceptas los <a href="#" className="underline">Términos de Servicio</a> y la <a href="#" className="underline">Política de Privacidad</a>.</div>
        </div>
        {/* Bloc liens entreprise */}
        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Nuestros Servicios</div>
          <ul className="space-y-2 text-white/80">
            <li><a href="/services/asesoria-migratoria" className="hover:text-accent">Asesoría Migratoria</a></li>
            <li><a href="/services/empresa" className="hover:text-accent">Servicios Empresariales</a></li>
            <li><a href="/services/marketplace-global" className="hover:text-accent">Marketplace Global</a></li>
            <li><a href="/services/agence-voyage" className="hover:text-accent">Agencia de Viajes</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-accent">Soluciones Capilares</a></li>
            <li><a href="/services/reseau-social" className="hover:text-accent">Red Social</a></li>
          </ul>
        </div>
        {/* Bloc quick links */}
        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Enlaces Rápidos</div>
          <ul className="space-y-2 text-white/80">
            <li><a href="/" className="hover:text-accent">Inicio</a></li>
            <li><a href="/blog" className="hover:text-accent">Blog</a></li>
            <li><a href="/contact" className="hover:text-accent">Contáctanos</a></li>
            <li><a href="/faq" className="hover:text-accent">Preguntas Frecuentes</a></li>
            <li><a href="/about" className="hover:text-[#e6e85c]">Sobre Nosotros</a></li>
          </ul>
        </div>
      </div>
      <hr className="my-8 border-white/10" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4 text-white/70 text-sm">
        <div>©2026 Asmyne. Todos los derechos reservados.</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          {/* Facebook */}
          <a href="#" className="hover:text-white" aria-label="Facebook">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M15 8h-2a1 1 0 0 0-1 1v2h3l-.5 2H12v6h-2v-6H8v-2h2V9a3 3 0 0 1 3-3h2v2z" fill="currentColor"/></svg>
          </a>
          {/* X/ */}
          <a href="#" className="hover:text-white" aria-label="">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2"/></svg>
          </a>
          {/* Instagram */}
          <a href="#" className="hover:text-white" aria-label="Instagram">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
          </a>
          {/* TikTok */}
          <a href="#" className="hover:text-white" aria-label="TikTok">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M15 8v5.5a2.5 2.5 0 1 1-2.5-2.5" stroke="currentColor" strokeWidth="2"/><circle cx="16.5" cy="7.5" r="1.5" fill="currentColor"/></svg>
          </a>
        </div>
        <a href="#" className="ml-4 bg-[#e6e85c] text-[#16213a] rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-[#ffe082] transition"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>
      </div>
    </footer>
  );
}

import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaWhatsapp } from "react-icons/fa";

export default function HairSolutionsFooter() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#2d2a1f] to-[#f7e1b5] text-black pt-12 pb-4 px-4 md:px-16 mt-0 border-t border-yellow-200/20">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row md:justify-between gap-12">
        {/* Bloque logo y contacto */}
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-yellow-400 flex items-center justify-center font-bold text-2xl text-[#2d2a1f]">S</div>
            <span className="text-3xl font-extrabold tracking-wide">SHEBAS</span>
          </div>
          <div className="text-black/80 mb-2">Dirección:</div>
          <div className="mb-2 font-semibold">Casa 12 Calle primera Urb Mirador Isabela Sector Villa Mella Pr3ximo a la avenida Jacobo Majluta Santo Domingo Norte Rep. Dom.</div>
          <div className="mb-2 text-black/80">Soporte 24/7: <span className="font-semibold text-black">1-(809) 308-6370</span></div>
          <div className="mb-2 text-black/80">Correo: <span className="font-semibold text-black">contact@asmyne.com</span></div>
        </div>
        {/* Bloque boletín */}
        <div className="flex-1 min-w-[220px]">
          <div className="font-bold mb-3 text-lg">Boletín</div>
          <div className="text-black/80 mb-3">Recibe nuestros consejos y ofertas capilares exclusivas.</div>
          <form className="flex items-center mb-2">
            <input type="email" placeholder="Tu correo" className="rounded-full px-5 py-3 w-full text-black focus:outline-none" />
            <button type="submit" className="-ml-10 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-yellow-500 transition">
              <svg width="22" height="22" fill="none" stroke="#111216" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </form>
          <div className="text-xs text-black/60">Al suscribirte, aceptas los <a href="#" className="underline">Términos de uso</a> y la <a href="#" className="underline">Política de privacidad</a>.</div>
        </div>
        {/* Bloque productos */}
        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Nuestros Productos</div>
          <ul className="space-y-2 text-black/80">
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Cuidado capilar</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Aceites naturales</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Cremas moldeadoras</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Champús</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Accesorios</a></li>
          </ul>
        </div>
        {/* Bloque enlaces rápidos */}
        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Enlaces rápidos</div>
          <ul className="space-y-2 text-black/80">
            <li><a href="/" className="hover:text-yellow-600">Inicio</a></li>
            <li><a href="/blog" className="hover:text-yellow-600">Blog</a></li>
            <li><a href="/contact" className="hover:text-yellow-600">Contacto</a></li>
            <li><a href="/faq" className="hover:text-yellow-600">FAQ</a></li>
            <li><a href="/about" className="hover:text-yellow-600">Acerca de</a></li>
          </ul>
        </div>
      </div>
      <hr className="my-8 border-yellow-200/20" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4 text-black/70 text-sm">
        <div>©2026 SHEBAS. Todos los derechos reservados.</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="https://www.instagram.com/asmynegroup?igsh=M3FpNzA2dTZzdXl4" className="hover:text-black" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={22} />
          </a>
          <a href="https://www.facebook.com/share/1KGpFstMcy/" className="hover:text-black" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <FaFacebookF size={22} />
          </a>
          <a href="https://www.tiktok.com/@asmynegroup?_r=1&_t=ZS-98GMg7lSOjB" className="hover:text-black" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
            <FaTiktok size={22} />
          </a>
          <a href="https://www.youtube.com/@asmynegroup" className="hover:text-black" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <FaYoutube size={22} />
          </a>
          <a href="https://whatsapp.com/channel/0029Vb77mjJLtOjIa8b3Bn3x" className="hover:text-black" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}

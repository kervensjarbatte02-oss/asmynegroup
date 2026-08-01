"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

export default function FooterSection() {
  return (
    <footer className="w-full mt-0">
      {/* Suscribirse */}
      <div className="w-full py-10 flex flex-col items-center" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
        <div className="uppercase tracking-widest text-gray-700 mb-2">Boletín</div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6 text-center">OFERTAS EXCLUSIVAS Y NOVEDADES.</h2>
        <form className="w-full max-w-xl flex items-center">
          <input
            type="email"
            placeholder="CORREO ELECTRÓNICO"
            className="flex-1 px-6 py-3 rounded-l-full border border-gray-300 focus:outline-none text-lg bg-white"
          />
          <button type="submit" className="px-6 py-3 rounded-r-full bg-[#21594d] text-white font-bold text-lg border border-l-0 border-gray-300 hover:bg-[#174138] transition-all">
            →
          </button>
        </form>
      </div>
      {/* Footer */}
      <div className="w-full text-white py-10 px-4 flex flex-col md:flex-row md:justify-between md:items-start gap-8" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
        <div>
          <div className="text-xl font-bold mb-2">CUIDADO NATURAL,<br />RESULTADOS REALES</div>
          <div className="text-3xl font-extrabold tracking-widest mb-4 opacity-80">SHEBAS</div>
          {/* Ligne supprimée */}
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="text-lg font-bold mb-2">SÍGUENOS</div>
          <div className="text-sm mb-2">Sigue nuestras aventuras en redes sociales:</div>
          <div className="flex gap-4 text-2xl">
            <a href="https://www.instagram.com/asmynegroup?igsh=M3FpNzA2dTZzdXl4" aria-label="Instagram" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/share/1KGpFstMcy/" aria-label="Facebook" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.youtube.com/@asmynegroup" aria-label="YouTube" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
            <a href="https://www.tiktok.com/@asmynegroup?_r=1&_t=ZS-98GMg7lSOjB" aria-label="TikTok" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full text-white text-xs py-4 px-4 flex flex-col md:flex-row md:justify-between items-center" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
        <div className="mb-2 md:mb-0">© 2026 SHEBAS. Todos los derechos reservados.</div>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="underline hover:text-yellow-400">Política de privacidad</a>
          <a href="#" className="underline hover:text-yellow-400">Política de reembolso</a>
          <a href="#" className="underline hover:text-yellow-400">Términos del servicio</a>
          <a href="#" className="underline hover:text-yellow-400">Política de envíos</a>
          <a href="#" className="underline hover:text-yellow-400">Información de contacto</a>
        </div>
      </div>
    </footer>
  );
}

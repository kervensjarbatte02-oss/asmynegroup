import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaWhatsapp } from "react-icons/fa";

export default function HomeFooter() {
  return (
    <footer className="w-full bg-[#0a174e] text-white pt-12 pb-4 px-4 md:px-16 mt-0 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row md:justify-between gap-12">
        {/* Bloc logo & contact */}
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-[#e6e85c] flex items-center justify-center font-bold text-2xl text-[#16213a]">A</div>
            <span className="text-3xl font-extrabold tracking-wide">Asmyne Group</span>
          </div>
          <div className="text-white/80 mb-2">Adresse :</div>
          <div className="mb-2 font-semibold">Casa 12 Calle primera Urb Mirador Isabela Sector Villa Mella Pr3ximo a la avenida Jacobo Majluta Santo Domingo Norte Rep. Dom.</div>
          <div className="mb-2 text-white/80">Support 24/7 : <span className="font-semibold text-white">1-(809) 308-6370</span></div>
          <div className="mb-2 text-white/80">Email : <span className="font-semibold text-white">contact@asmyne.com</span></div>
        </div>
        {/* Bloc newsletter */}
        <div className="flex-1 min-w-[220px]">
          <div className="font-bold mb-3 text-lg">Newsletter</div>
          <div className="text-white/80 mb-3">Inscrivez-vous pour recevoir nos dernières actualités.</div>
          <form className="flex items-center mb-2">
            <input type="email" placeholder="Votre email" className="rounded-full px-5 py-3 w-full text-black focus:outline-none" />
            <button type="submit" className="-ml-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-[#e6e85c] transition">
              <svg width="22" height="22" fill="none" stroke="#111216" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </form>
          <div className="text-xs text-white/60">En vous inscrivant, vous acceptez les <a href="#" className="underline">Conditions d'utilisation</a> et la <a href="#" className="underline">Politique de confidentialité</a>.</div>
        </div>
        {/* Bloc liens */}
        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Nos Services</div>
          <ul className="space-y-2 text-white/80">
            <li><a href="/services/asesoria-migratoria" className="hover:text-accent">Conseil Migratoire</a></li>
            <li><a href="/services/empresa" className="hover:text-accent">Services aux Entreprises</a></li>
            <li><a href="/marketplace" className="hover:text-accent">Marketplace</a></li>
            <li><a href="/services/agence-voyage" className="hover:text-accent">Agence de Voyage</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-accent">Soluciones Capilares</a></li>
            <li><a href="/services/reseau-social" className="hover:text-accent">Réseau Social</a></li>
          </ul>
        </div>
        {/* Bloc liens rapides */}
        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Liens Rapides</div>
          <ul className="space-y-2 text-white/80">
            <li><a href="/" className="hover:text-accent">Accueil</a></li>
            <li><a href="/blog" className="hover:text-accent">Blog</a></li>
            <li><a href="/contact" className="hover:text-accent">Contact</a></li>
            <li><a href="/faq" className="hover:text-accent">FAQ</a></li>
            <li><a href="/about" className="hover:text-[#e6e85c]">À propos</a></li>
          </ul>
        </div>
      </div>
      <hr className="my-8 border-white/10" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4 text-white/70 text-sm">
        <div>©2026 Asmyne Group. Tous droits réservés.</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="https://www.facebook.com/share/1KGpFstMcy/" className="hover:text-white" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <FaFacebookF size={22} />
          </a>
          <a href="https://www.instagram.com/asmynegroup?igsh=M3FpNzA2dTZzdXl4" className="hover:text-white" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={22} />
          </a>
          <a href="https://www.tiktok.com/@asmynegroup?_r=1&_t=ZS-98GMg7lSOjB" className="hover:text-white" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
            <FaTiktok size={22} />
          </a>
          <a href="https://www.youtube.com/@asmynegroup" className="hover:text-white" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <FaYoutube size={22} />
          </a>
          <a href="https://whatsapp.com/channel/0029Vb77mjJLtOjIa8b3Bn3x" className="hover:text-white" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}

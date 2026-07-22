import React from "react";

export default function HairSolutionsFooter() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#2d2a1f] to-[#f7e1b5] text-black pt-12 pb-4 px-4 md:px-16 mt-0 border-t border-yellow-200/20">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row md:justify-between gap-12">
        {/* Bloc logo & contact */}
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-yellow-400 flex items-center justify-center font-bold text-2xl text-[#2d2a1f]">S</div>
            <span className="text-3xl font-extrabold tracking-wide">SHEBAS</span>
          </div>
          <div className="text-black/80 mb-2">Adresse :</div>
          <div className="mb-2 font-semibold">Casa 12 Calle primera Urb Mirador Isabela Sector Villa Mella Pr3ximo a la avenida Jacobo Majluta Santo Domingo Norte Rep. Dom.</div>
          <div className="mb-2 text-black/80">Support 24/7 : <span className="font-semibold text-black">1-(809) 308-6370</span></div>
          <div className="mb-2 text-black/80">Email : <span className="font-semibold text-black">contact@asmyne.com</span></div>
        </div>
        {/* Bloc newsletter */}
        <div className="flex-1 min-w-[220px]">
          <div className="font-bold mb-3 text-lg">Newsletter</div>
          <div className="text-black/80 mb-3">Recevez nos conseils et offres capillaires exclusives.</div>
          <form className="flex items-center mb-2">
            <input type="email" placeholder="Votre email" className="rounded-full px-5 py-3 w-full text-black focus:outline-none" />
            <button type="submit" className="-ml-10 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-yellow-500 transition">
              <svg width="22" height="22" fill="none" stroke="#111216" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </form>
          <div className="text-xs text-black/60">En vous inscrivant, vous acceptez les <a href="#" className="underline">Conditions d'utilisation</a> et la <a href="#" className="underline">Politique de confidentialité</a>.</div>
        </div>
        {/* Bloc liens */}
        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Nos Produits</div>
          <ul className="space-y-2 text-black/80">
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Soins capillaires</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Huiles naturelles</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Crèmes coiffantes</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Shampooings</a></li>
            <li><a href="/services/hair-solutions" className="hover:text-yellow-600">Accessoires</a></li>
          </ul>
        </div>
        {/* Bloc liens rapides */}
        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Liens Rapides</div>
          <ul className="space-y-2 text-black/80">
            <li><a href="/" className="hover:text-yellow-600">Accueil</a></li>
            <li><a href="/blog" className="hover:text-yellow-600">Blog</a></li>
            <li><a href="/contact" className="hover:text-yellow-600">Contact</a></li>
            <li><a href="/faq" className="hover:text-yellow-600">FAQ</a></li>
            <li><a href="/about" className="hover:text-yellow-600">À propos</a></li>
          </ul>
        </div>
      </div>
      <hr className="my-8 border-yellow-200/20" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4 text-black/70 text-sm">
        <div>©2026 SHEBAS. Tous droits réservés.</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-black" aria-label="Instagram">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
          </a>
          <a href="#" className="hover:text-black" aria-label="Facebook">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M16 8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2V6a2 2 0 1 1 4 0v2h2z"/><path d="M12 16v-4"/><path d="M10 12h4"/></svg>
          </a>
          <a href="#" className="hover:text-black" aria-label="TikTok">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 17a4 4 0 1 1 0-8v8zm0 0a4 4 0 0 0 4-4V3h3a5 5 0 0 0 5 5"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

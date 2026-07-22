"use client";

import React from "react";
import MagazineMarquee from "./MagazineMarquee";
import HairSolutionsNavbar from "./HairSolutionsNavbar";
import HairSolutionsFooter from "./HairSolutionsFooter";

export default function HairSolutionsPage() {
  return (
    <div className="min-h-screen w-full font-sans flex flex-col items-center" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
      {/* Navbar Shebas dynamique */}
      <HairSolutionsNavbar />


      {/* Hero Shebas */}
      <section className="w-full flex flex-col items-center justify-center min-h-[100vh] px-0 relative overflow-hidden">
        <img src="/images/hair-hero.png" alt="Shebas Hair Products" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{zIndex:0}} />
        {/* Hero sans images de produits */}
        <div className="relative z-10 w-full h-0" />
      </section>

      {/* Bandeau magazines défilant */}
      <MagazineMarquee />

      {/* Section services (conserve l'existant) */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-4">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-xl border border-yellow-300">
          <div className="text-5xl mb-4">🧴</div>
          <div className="font-bold text-2xl mb-2 text-yellow-800">Diagnóstico Personalizado</div>
          <div className="text-yellow-900/80 text-center">Análisis de su cuero cabelludo y recomendaciones personalizadas para una rutina adaptada.
</div>
        </div>
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-xl border border-yellow-300">
          <div className="text-5xl mb-4">💆‍♀️</div>
          <div className="font-bold text-2xl mb-2 text-yellow-800">Cuidados y Tratamientos</div>
          <div className="text-yellow-900/80 text-center">Cuidados capilares profesionales, tratamientos anticaída, hidratación y reparación.
.</div>
        </div>
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-xl border border-yellow-300">
          <div className="text-5xl mb-4">🌱</div>
          <div className="font-bold text-2xl mb-2 text-yellow-800">Acompañamiento experto</div>
          <div className="text-yellow-900/80 text-center">Seguimiento personalizado y consejos de expertos para lograr resultados duraderos.</div>
        </div>
      </section>
      {/* Bandeau magazines défilant inversé en bas */}
      <div className="mt-16 w-full">
        {/* Bandeau magazines défilant inversé juste avant la section Beautiful Hair */}
        <div className="w-full">
          <MagazineMarqueeReverse />
        </div>
        {/* Section Beautiful Hair */}
        <BeautifulHairSection />
        {/* Section Best Sellers */}
        <BestSellersSection />
        {/* Section Power of Nature */}
        <PowerOfNatureSection />
        {/* Section Reviews défilants */}
        <ReviewsMarqueeSection />
        {/* Section FAQ */}
        <FaqSection />

      </div>
      <FooterSection />
    </div>
  );
}
import MagazineMarqueeReverse from "./MagazineMarqueeReverse";
import BeautifulHairSection from "./BeautifulHairSection";
import BestSellersSection from "./BestSellersSection";
import PowerOfNatureSection from "./PowerOfNatureSection";
import ReviewsMarqueeSection from "./ReviewsMarqueeSection";
import FaqSection from "./FaqSection";
import FooterSection from "./FooterSection";

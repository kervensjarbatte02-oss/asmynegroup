import React from "react";

export default function HairSolutionsHero() {
  return (
    <section className="w-full flex flex-col items-center justify-center min-h-[100vh] px-0 relative overflow-hidden">
      <img src="/images/hair-hero.png" alt="Shebas Hair Products" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{zIndex:0}} />
      {/* Hero sans images de produits */}
      <div className="relative z-10 w-full h-0" />
    </section>
  );
}

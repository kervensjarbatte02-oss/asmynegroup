import React from "react";

export default function Shop() {
  return (
    <section className="w-full max-w-4xl mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-[#2d72d9]">Boutique & Livres</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exemple de livre */}
        <div className="bg-white rounded-2xl p-6 shadow border border-[#e0e7ef] flex flex-col">
          <img src="/images/livre-exemple.jpg" alt="Livre" className="w-32 h-44 object-cover rounded mb-4 self-center" />
          <h3 className="text-lg font-bold text-[#2d72d9] mb-2">Titre du livre</h3>
          <p className="text-gray-700 mb-2">Description courte du livre à vendre.</p>
          <button className="bg-[#2d72d9] text-white font-bold px-4 py-2 rounded-full shadow hover:bg-blue-500 transition mt-auto">Acheter</button>
        </div>
        {/* Exemple d’exposition */}
        <div className="bg-white rounded-2xl p-6 shadow border border-[#e0e7ef] flex flex-col">
          <img src="/images/expo-exemple.jpg" alt="Exposition" className="w-full h-44 object-cover rounded mb-4" />
          <h3 className="text-lg font-bold text-[#2d72d9] mb-2">Exposition en vedette</h3>
          <p className="text-gray-700 mb-2">Présentation ou affiche d’une exposition à venir ou en cours.</p>
          <button className="bg-[#2d72d9] text-white font-bold px-4 py-2 rounded-full shadow hover:bg-blue-500 transition mt-auto">Découvrir</button>
        </div>
      </div>
    </section>
  );
}

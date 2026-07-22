"use client";
import React, { useRef, useState } from "react";
import { useCart } from "@/app/shared/CartContext";
import HairSolutionsNavbar from "../../HairSolutionsNavbar";
import HairSolutionsFooter from "../../HairSolutionsFooter";

const product = {
  name: "Shebas Hair Solutions ✨ (Aceite)",
  price: "RD$850",
  image: "/uploads/cover/aceite.png",
  description: (
    <>
      <ul className="text-left list-disc ml-6 mb-2">
        <li>✔️ Ayuda al crecimiento del cabello</li>
        <li>✔️ Regenera y fortalece el pelo</li>
        <li>✔️ Ayuda a frenar la caída</li>
        <li>✔️ Nutre profundamente desde la raíz</li>
        <li>✔️ Protege y da brillo natural</li>
      </ul>
      <div className="italic text-yellow-900 font-semibold text-center mt-2">“Shebas Hair Solutions — Crecimiento, fuerza y belleza natural.”</div>
    </>
  ),
};

export default function ShebasAceitePage() {
  const qtyRef = useRef<HTMLInputElement | null>(null);
  const { addToCart } = useCart();
  const router = require('next/navigation').useRouter();
  function handleAddToCart() {
    const quantity = qtyRef.current ? Number(qtyRef.current.value) : 1;
    addToCart({
      id: "shebas-hair-solutions-aceite",
      name: product.name,
      price: 850,
      quantity,
      image: product.image,
      source: "shebas",
    });
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-yellow-50 font-sans">
      <HairSolutionsNavbar />
      <main className="flex-1 flex flex-col items-center w-full px-2 md:px-0 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-4xl w-full flex flex-col md:flex-row items-stretch">
          {/* Image à gauche */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-l-2xl p-8 min-h-[340px]">
            <img src={product.image} alt={product.name} className="rounded-xl object-contain w-full max-w-[340px] h-[340px]" style={{background:'#fff'}} />
          </div>
          {/* Infos à droite */}
          <div className="flex-1 flex flex-col p-8 gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-yellow-800">{product.name}</span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">En stock</span>
            </div>
            <div className="mb-2 text-yellow-900/80">{product.description}</div>
            <div className="text-3xl font-extrabold text-yellow-700 mb-4">{product.price}</div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-700 font-semibold">Quantité :</span>
              <input ref={qtyRef} type="number" min={1} defaultValue={1} className="w-16 border border-yellow-300 rounded px-2 py-1 text-yellow-900 placeholder-yellow-300 font-bold bg-white" />
            </div>
            <textarea className="w-full border border-yellow-300 rounded-lg p-2 mb-4 text-yellow-900 placeholder-yellow-300 font-semibold bg-white" placeholder="Votre commentaire..." rows={2} />
            <div className="flex gap-4 mb-4">
              <button
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg"
                onClick={e => { e.preventDefault(); handleAddToCart(); }}
              >
                Ajouter au panier
              </button>
              <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg" onClick={() => router.push("/services/hair-solutions/panier")}>Payer</button>
            </div>
            {/* Erreur supprimée, la gestion réseau est côté contexte panier */}
            <ul className="text-sm text-gray-500 space-y-1 mt-2">
              <li>✔️ Paiement sécurisé</li>
              <li>✔️ Livraison rapide</li>
              <li>✔️ Conseils personnalisés</li>
            </ul>
          </div>
        </div>
      </main>
      <HairSolutionsFooter />
    </div>
  );
}

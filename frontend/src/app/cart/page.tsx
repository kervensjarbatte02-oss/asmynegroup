"use client";

import { useCart } from "../shared/CartContext";
import Navbar from "../services/marketplace-global/Navbar";
import { FaHeart, FaTimes } from "react-icons/fa";
import ProductCard from "../services/marketplace-global/ProductCard";

// Mock collections pour la barre de recherche du navbar
const mockCollections = [
  { name: "Appareils Photo" },
  { name: "Téléphones" },
  { name: "iPad Pro" },
  { name: "PC & Laptop" },
  { name: "Sweat à capuche" },
  { name: "Chaussures" },
  { name: "Casquette" },
  { name: "Sacs de voyage" },
  { name: "Cosmétiques" },
  { name: "Xbox & Jeux" },
  { name: "Horloges & Décoration" },
  { name: "Ustensiles Cuisine" },
  { name: "Smartphones" },
  { name: "Consoles" },
  { name: "Audio" },
  { name: "Accessoires" },
];

// Produits recommandés mockés (repris du marketplace)
const recommendedProducts = [
  { name: "Apple Watch Series 9", price: 499.99, image: "/images/apple-watch.jpg" },
  { name: "Sony WH-1000XM5", price: 399.99, image: "/images/sony-xm5.jpg" },
];
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, syncing } = useCart();
  const [promo, setPromo] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const router = useRouter();
  // Vérification d'authentification utilisateur
  useEffect(() => {
    // Vérifie la présence du cookie asmyne_auth
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const hasAuth = cookies.some(c => c.startsWith("asmyne_auth="));
      if (!hasAuth) {
        router.push("/services/hair-solutions/connexion");
      }
    }
  }, [router]);
  // Simule les valeurs pour l'exemple
  const discount = cart.length > 0 ? 5.4 : 0;
  const delivery = cart.length > 0 ? 9 : 0;
  const tax = cart.length > 0 ? 3.9 : 0;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = (subtotal - discount + delivery + tax).toFixed(2);
  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/marketplace/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerEmail,
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error || "Erreur lors de la commande.");
      } else {
        clearCart();
        try {
          // clear server cart immediately
          await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: [] }),
          });
        } catch (e) {
          // ignore
        }
        router.push(`/cart/confirmation?orderId=${data.orderId}`);
      }
    } catch {
      setCheckoutError("Erreur réseau. Réessayez.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar collections={mockCollections} />
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Bloc gauche : liste produits */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Your cart</h1>
                <div className="text-gray-500 mb-4">{cart.length} Product{cart.length > 1 ? "s" : ""} in Your cart</div>
              </div>
              <div className="text-sm text-gray-500">{syncing ? "Synchronisation..." : "Synchronisé"}</div>
            </div>
            <div className="bg-white/90 rounded-xl shadow p-4 md:p-6 border border-yellow-300">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-12">Your cart is empty.</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.id} className="flex flex-col md:flex-row items-center md:items-stretch gap-4 py-4">
                      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-16 h-16 bg-yellow-100 rounded-full border border-yellow-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg text-yellow-800">{item.name}</div>
                        <div className="text-yellow-900/80 text-sm">Size: medium</div>
                        <div className="text-yellow-900/80 text-sm">Material: Plastic</div>
                        <div className="text-yellow-900/80 text-sm">Color: blue</div>
                      </div>
                      <div className="flex flex-col gap-2 items-end justify-between">
                        <div className="flex gap-2 items-center">
                          <label htmlFor={`qty-${item.id}`} className="text-sm font-medium">Qty:</label>
                          <select
                            id={`qty-${item.id}`}
                            value={item.quantity}
                            onChange={e => updateQuantity(item.id, Number(e.target.value))}
                            className="border rounded px-2 py-1 focus:ring focus:border-blue-400"
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500" title="Favorite"><FaHeart /></button>
                          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500" title="Remove" onClick={() => removeFromCart(item.id)}><FaTimes /></button>
                        </div>
                      </div>
                      <div className="font-semibold text-lg text-right min-w-[80px] text-yellow-700">{item.price.toFixed(2)} USD</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Bloc droit : résumé */}
            <div className="w-full md:w-96 flex-shrink-0">
            <div className="bg-white/90 rounded-xl shadow p-6 mb-4 border border-yellow-300">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter Promocode"
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  className="flex-1 border rounded px-3 py-2 focus:ring focus:border-blue-400"
                />
                <button className="px-4 py-2 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600">Apply</button>
              </div>
              <div className="text-gray-600 text-sm mb-2">{cart.length} item{cart.length > 1 ? "s" : ""}:</div>
              <div className="flex justify-between mb-1"><span className="text-yellow-900">Subtotal</span><span className="text-yellow-900">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between mb-1"><span className="text-yellow-900">Discount</span><span className="text-yellow-700">- ${discount.toFixed(2)}</span></div>
              <div className="flex justify-between mb-1"><span className="text-yellow-900">Delivery cost</span><span className="text-yellow-900">${delivery.toFixed(2)}</span></div>
              <div className="flex justify-between mb-1"><span className="text-yellow-900">Tax</span><span className="text-yellow-900">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg mt-2 text-yellow-800"><span>Total:</span><span>${grandTotal}</span></div>
              <div className="mt-3">
                <label className="block text-xs font-semibold text-yellow-900 mb-1">Votre email *</label>
                <input type="email" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="w-full border border-yellow-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              {checkoutError && (
                <div className="mt-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{checkoutError}</div>
              )}
              <button
                className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded text-lg"
                onClick={handleCheckout}
                disabled={cart.length === 0 || !buyerEmail || checkoutLoading}
              >
                {checkoutLoading ? "Traitement..." : "Confirmer la commande"}
              </button>
              <div className="flex items-center gap-2 mt-4 text-yellow-900 text-sm bg-yellow-100 rounded p-2 border border-yellow-300">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                Delivered by <span className="font-semibold text-yellow-800">Fri, May 20, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section produits recommandés */}
      <section className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-xl font-bold text-black mb-4">Recommandés pour vous</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recommendedProducts.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </div>
      </section>

      {footerMarketplace()}
    </div>
  );

// Footer Marketplace Global (copié du marketplace)
function footerMarketplace() {
  return (
    <footer className="w-full bg-gray-900 text-white pt-10 pb-6 mt-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
        {/* Bloc logo & devenir vendeur */}
        <div>
          <div className="font-extrabold text-2xl text-black mb-2">Asmyne-group</div>
          <div className="text-gray-300 mb-4">Votre marketplace de confiance pour tout acheter et vendre facilement.</div>
          <a href="#" className="inline-block px-6 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-black transition">Devenir vendeur</a>
        </div>
        {/* Bloc navigation */}
        <div>
          <div className="font-bold mb-2">Navigation</div>
          <ul className="space-y-1 text-gray-300">
            <li><a href="#" className="hover:text-black transition">Accueil</a></li>
            <li><a href="#collections" className="hover:text-black transition">Collections</a></li>
            <li><a href="#products" className="hover:text-black transition">Produits</a></li>
            <li><a href="#faq" className="hover:text-black transition">FAQ</a></li>
          </ul>
        </div>
        {/* Bloc contact */}
        <div>
          <div className="font-bold mb-2">Contact</div>
          <div className="text-gray-300">Email : contact@asmyne-group.com</div>
          <div className="text-gray-300">Téléphone : +1 (809) 308-6370</div>
        </div>
        {/* Bloc réseaux sociaux */}
        <div>
          <div className="font-bold mb-2">Suivez-nous</div>
            <div className="flex gap-4 mt-2">
              <a href="#" className="hover:text-black transition" title="Facebook"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12z"/></svg></a>
              <a href="#" className="hover:text-black transition" title="Twitter"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.9c-.37.63-.58 1.36-.58 2.14 0 1.48.75 2.78 1.89 3.54-.7-.02-1.36-.21-1.94-.53v.05c0 2.07 1.47 3.8 3.42 4.19-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.11 2.91 3.97 2.94A8.6 8.6 0 012 19.54 12.13 12.13 0 008.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022.46 6z"/></svg></a>
              <a href="#" className="hover:text-black transition" title="Instagram"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 110 10.5 5.25 5.25 0 010-10.5zm0 1.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm6.25 1.25a1 1 0 110 2 1 1 0 010-2z"/></svg></a>
            </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center pt-6 text-gray-400 text-sm">
        <div>© 2026 Asmyne-group. Tous droits réservés.</div>
        <div>Marketplace réalisé Jorgensen Kervens </div>
      </div>
    </footer>
  );
}
}

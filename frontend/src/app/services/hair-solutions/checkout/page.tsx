"use client";
import React, { useEffect, useState } from "react";
import HairSolutionsNavbar from "../HairSolutionsNavbar";
import HairSolutionsFooter from "../HairSolutionsFooter";
import { useCart } from "@/app/shared/CartContext";
import { StripeCheckout } from "../StripeCheckout";

type CartItem = {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
  source?: string;
};

export default function CheckoutPage() {
  const { cart } = useCart();
  const hairCart = cart.filter((i) => i.source === "shebas");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("US");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const total = hairCart.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0);

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !postal) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setProcessing(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-yellow-50 font-sans">
      <HairSolutionsNavbar />
      <main className="flex-1 w-full px-4 md:px-0 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Titre */}
          <h1 className="text-3xl font-bold text-yellow-800 mb-8 text-center">Finaliza tu pedido</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda: formulario */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
              {/* Paso 1: Dirección de envío */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center gap-2">
                  <span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Dirección de envío
                </h2>
                <form onSubmit={handleSubmitCheckout} className="space-y-4">
                  <div>
                    <label className="block text-yellow-900 font-semibold mb-2">Correo electrónico *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-yellow-900 font-semibold mb-2">Nombre *</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Juan"
                        className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-yellow-900 font-semibold mb-2">Apellido *</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Pérez"
                        className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-yellow-900 font-semibold mb-2">Teléfono *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-yellow-900 font-semibold mb-2">Dirección *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Calle de la Paz"
                      className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-yellow-900 font-semibold mb-2">Ciudad *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Madrid"
                        className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-yellow-900 font-semibold mb-2">Código postal *</label>
                      <input
                        type="text"
                        value={postal}
                        onChange={(e) => setPostal(e.target.value)}
                        placeholder="28001"
                        className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-yellow-900 font-semibold mb-2">País *</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-yellow-900 ring-1 ring-yellow-50 relative z-50"
                      style={{ color: '#4a2900', zIndex: 9999, position: 'relative' }}
                    >
                      <option value="US">Estados Unidos</option>
                      <option value="CA">Canadá</option>
                      <option value="FR">Francia</option>
                      <option value="DR">República Dominicana</option>
                      <option value="GB">Reino Unido</option>
                    </select>
                  </div>

                  {error && <div className="text-red-600 font-semibold p-3 bg-red-50 rounded-lg">{error}</div>}

                  {!processing && (
                    <button
                      type="submit"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg mt-6"
                    >
                      Continuar al pago
                    </button>
                  )}
                </form>
              </div>

              {/* Paso 2: Pago (mostrar condicionalmente) */}
              {processing && (
                <div className="border-t-2 border-yellow-300 pt-8">
                  <h2 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center gap-2">
                    <span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Pago
                  </h2>
                  <StripeCheckout
                    items={hairCart}
                    total={total}
                    onSuccess={() => {
                      setProcessing(false);
                      // Redirection vers confirmation
                      window.location.href = '/services/hair-solutions/confirmation';
                    }}
                    setError={setError}
                  />
                  <button
                    onClick={() => setProcessing(false)}
                    className="mt-4 w-full text-gray-600 hover:text-gray-800 font-semibold py-2 border border-gray-300 rounded-lg"
                  >
                    Volver
                  </button>
                </div>
              )}
            </div>

            {/* Colonne droite : Résumé de commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-yellow-900 mb-6">Resumen del pedido</h2>

                {/* Artículos */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {hairCart.map((item) => (
                    <div key={`${item.id}-${item.source ?? 'shebas'}`} className="flex items-center gap-3 pb-4 border-b border-yellow-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded border border-yellow-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-yellow-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">Qté: {item.quantity}</p>
                        <p className="text-sm font-bold text-yellow-700">
                          {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)} $
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totaux */}
                <div className="border-t-2 border-yellow-300 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">{total.toFixed(2)} $</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Envío</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-yellow-900 bg-yellow-50 -mx-6 px-6 py-3">
                    <span>Total</span>
                    <span>{total.toFixed(2)} $</span>
                  </div>
                </div>

                {/* Badge de sécurité */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 text-center">
                    🔒 Pago seguro con Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <HairSolutionsFooter />
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import HairSolutionsNavbar from "../HairSolutionsNavbar";
import HairSolutionsFooter from "../HairSolutionsFooter";
import { useCart } from "@/app/shared/CartContext";

type CartItem = {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
  source?: string;
};

type CartData = {
  cart: CartItem[];
};

export default function PanierPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cart: contextCart } = useCart();

  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("shebas_token");

        if (!token) {
          setCart({ cart: contextCart });
          setLoading(false);
          return;
        }

        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setCart({ cart: contextCart });
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data && Array.isArray(data.cart)) {
          setCart({ cart: data.cart });
        } else {
          setCart({ cart: contextCart });
        }
      } catch (err) {
        setCart({ cart: contextCart });
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [contextCart]);

  const allCart = cart?.cart ?? contextCart;
  const displayedCart = allCart.filter((item) => item.source === "shebas");
  const total = displayedCart.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0);

  return (
    <div className="min-h-screen w-full flex flex-col bg-yellow-50 font-sans">
      <HairSolutionsNavbar />
      <main className="flex-1 flex flex-col items-center w-full px-2 md:px-0 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl w-full flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <h1 className="text-2xl font-bold text-yellow-800 mb-6">Mi carrito</h1>
            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="text-red-600 font-semibold">{error}</div>
            ) : displayedCart.length === 0 ? (
              <div className="text-gray-500">Tu carrito está vacío.</div>
            ) : (
              <ul className="w-full divide-y divide-gray-100">
                {displayedCart.map((item) => (
                  <li key={`${item.id}-${item.source ?? "shebas"}`} className="flex flex-col md:flex-row items-center gap-4 py-4">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded-lg border border-yellow-100 bg-white" />
                    <div className="flex-1 flex flex-col items-start w-full">
                      <span className="text-yellow-900 font-bold text-lg mb-1">{item.name ?? "Producto"}</span>
                      <span className="text-gray-500 text-sm mb-2">ID: {item.id}</span>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-800 font-semibold">Cantidad:</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity ?? 1}
                          onChange={async (e) => {
                            const q = Math.max(1, Number(e.target.value));
                            setCart((prev) => {
                              if (!prev) return prev;
                              const newCart = {
                                ...prev,
                                cart: prev.cart.map((it) => (it.id === item.id && it.source === item.source ? { ...it, quantity: q } : it)),
                              };
                              (async () => {
                                try {
                                  await fetch("/api/cart", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ cart: newCart.cart }),
                                  });
                                } catch {}
                              })();
                              return newCart;
                            });
                          }}
                          className="w-16 border border-yellow-300 rounded px-2 py-1 text-yellow-900 font-bold"
                        />
                        <button
                          className="ml-2 text-red-600 hover:text-red-800 font-bold text-lg"
                          title="Eliminar"
                          onClick={async () => {
                            if (!item.id) return;
                            setCart((prev) => {
                              if (!prev) return prev;
                              const newCart = {
                                ...prev,
                                cart: prev.cart.filter((it) => !(it.id === item.id && it.source === item.source)),
                              };
                              (async () => {
                                try {
                                  await fetch("/api/cart", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ cart: newCart.cart }),
                                  });
                                } catch {}
                              })();
                              return newCart;
                            });
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end min-w-[100px]">
                      <span className="text-yellow-700 font-extrabold text-lg">{item.price ?? 0} RD$</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {displayedCart.length > 0 && (
            <div className="w-full md:w-80 bg-yellow-50 rounded-xl shadow p-6 flex flex-col gap-4 border border-yellow-100">
              <h2 className="text-xl font-bold text-yellow-900 mb-2">Résumé</h2>
              <div className="flex justify-between text-gray-700 font-semibold">
                <span>Artículos</span>
                <span>{displayedCart.reduce((sum, item) => sum + (item.quantity ?? 0), 0)}</span>
              </div>
              <div className="flex justify-between text-gray-700 font-semibold">
                <span>Total</span>
                <span className="text-yellow-700 font-extrabold">{total.toFixed(2)} $</span>
              </div>
              <button
                onClick={() => window.location.href = "/services/hair-solutions/checkout"}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg w-full"
              >
                Procéder au paiement
              </button>
            </div>
          )}
        </div>
      </main>
      <HairSolutionsFooter />
    </div>
  );
}

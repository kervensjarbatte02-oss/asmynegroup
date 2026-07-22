"use client";
import React, { useEffect, useState } from "react";
import HairSolutionsNavbar from "../HairSolutionsNavbar";
import HairSolutionsFooter from "../HairSolutionsFooter";

type OrderItem = {
  product?: {
    name?: string;
    price?: string | number;
  };
  quantity?: number;
};

type Order = {
  _id?: string;
  createdAt?: string;
  items?: OrderItem[];
  total?: string | number;
};

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("shebas_token");
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          setError("Impossible de charger les commandes.");
          setOrders(null);
        } else {
          const data = await res.json();
          setOrders(data);
        }
      } catch {
        setError("Erreur réseau.");
        setOrders(null);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-yellow-50 font-sans">
      <HairSolutionsNavbar />
      <main className="flex-1 flex flex-col items-center w-full px-2 md:px-0 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold text-yellow-800 mb-6">Mes commandes</h1>
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="text-red-600 font-semibold">{error}</div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-gray-500">Aucune commande trouvée.</div>
          ) : (
            <ul className="w-full mb-6">
              {orders.map((order, idx) => (
                <li key={order._id || idx} className="flex flex-col border-b border-gray-100 py-3 mb-2">
                  <div className="font-bold text-yellow-700">Commande n°{order._id?.slice(-6) || idx+1}</div>
                  <div className="text-sm text-gray-600 mb-1">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date inconnue"}</div>
                  <ul className="ml-4 mb-1">
                    {order.items?.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{item.product?.name || "Produit"}</span>
                        <span>x{item.quantity}</span>
                        <span className="text-yellow-700 font-bold">{item.product?.price} RD$</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right text-pink-700 font-bold">Total : {order.total || "-"} RD$</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <HairSolutionsFooter />
    </div>
  );
}

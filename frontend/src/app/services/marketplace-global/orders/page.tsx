"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Link from "next/link";

type OrderSummary = {
  id: string;
  buyerEmail?: string;
  createdAt?: string;
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  channel?: string;
  itemsCount?: number;
  grandTotal?: number;
  lines?: Array<{ productId: string; name: string; price: number; quantity: number; total: number }>;
};

export default function MarketplaceGlobalOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/marketplace/orders", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudieron cargar los pedidos.");
      setOrders(data.orders ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Tus pedidos</h1>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">Enviar comprobante de pago</button>
              <Link href="/services/marketplace-global" className="inline-flex rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700">
                Volver al Marketplace
              </Link>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-700">Cargando pedidos...</div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
            ) : orders.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center gap-6 py-12 text-center">
                <div className="h-32 w-32 rounded-full bg-white p-6 shadow-sm">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-gray-300">
                    <path d="M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 3h10v4H7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Aún no hay pedidos</h2>
                <p className="text-sm text-gray-700">Ve a la página principal o haz clic abajo para empezar.</p>
                <div className="mt-4 flex gap-3">
                  <Link href="/" className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800">Ir al inicio</Link>
                  <Link href="/cart" className="inline-flex items-center justify-center rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white">Ver carrito</Link>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-2xl border p-4 shadow-sm">
                    <div>
                      <div className="text-sm text-gray-700">Pedido #{order.id}</div>
                      <div className="font-semibold text-gray-900">{new Date(order.createdAt ?? "").toLocaleString()}</div>
                      <div className="text-sm text-gray-700">{order.itemsCount ?? 0} artículos · {order.channel ?? "en línea"}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-700">Total</div>
                        <div className="font-semibold text-gray-900">{typeof order.grandTotal === "number" ? `${order.grandTotal.toFixed(2)} USD` : "-"}</div>
                      </div>
                      <div className="text-sm text-gray-800 px-3 py-1 rounded-full border border-gray-200 bg-gray-50">{order.status ?? "pendiente"}</div>
                      <Link href={`/services/marketplace-global/orders/${order.id}`} className="inline-flex items-center rounded-full bg-pink-50 text-pink-700 px-3 py-2 text-sm font-semibold border border-pink-100">Ver</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

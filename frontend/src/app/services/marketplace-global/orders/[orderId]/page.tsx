"use client";

import { useEffect, useState } from "react";
import Navbar from "../../Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrderLine = { productId: string; name: string; price: number; quantity: number; total: number };

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const [order, setOrder] = useState<null | { id: string; createdAt: string; status?: string; paymentStatus?: string; fulfillmentStatus?: string; lines: OrderLine[]; grandTotal?: number }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/marketplace/orders/${orderId}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar el pedido.");
        setOrder(data.order ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [orderId]);

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Pedido #{orderId}</h1>
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50">Volver</button>
              <Link href="/services/marketplace-global/orders" className="inline-flex rounded-full bg-pink-600 px-3 py-2 text-sm font-semibold text-white">Todos los pedidos</Link>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="p-6 text-sm text-gray-700">Cargando...</div>
            ) : error ? (
              <div className="p-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded">{error}</div>
            ) : !order ? (
              <div className="p-6 text-sm text-gray-700">Pedido no encontrado.</div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border p-4">
                  <div className="text-sm text-gray-700">Fecha</div>
                  <div className="font-semibold">{new Date(order.createdAt).toLocaleString()}</div>
                  <div className="mt-2">Estado: <span className="font-semibold text-gray-800">{order.status ?? "-"}</span></div>
                </div>

                <div className="rounded-2xl border p-4">
                  <h2 className="font-semibold mb-3 text-gray-900">Items</h2>
                  <ul className="divide-y">
                    {order.lines.map((line, idx) => (
                      <li key={idx} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{line.name}</div>
                          <div className="text-sm text-gray-700">Cant: {line.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${line.total.toFixed(2)}</div>
                          <div className="text-sm text-gray-700">${line.price.toFixed(2)} cada uno</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border p-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">Total</div>
                  <div className="font-semibold">${(order.grandTotal ?? 0).toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

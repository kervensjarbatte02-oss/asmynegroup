"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Navbar from "../../../marketplace-global/Navbar";

type OrderLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

type OrderDetails = {
  id: string;
  buyerEmail: string;
  createdAt: string | null;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  channel: string;
  grandTotal: number;
  lines: OrderLine[];
};

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Aucun identifiant de commande trouvé.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/marketplace/orders/${orderId}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.order) {
          throw new Error(data.error || "No se pudieron recuperar los detalles del pedido.");
        }
        setOrder(data.order as OrderDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el pedido.");
      } finally {
        setLoading(false);
      }
    };

    void fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10 max-w-3xl w-full">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Commande confirmée !</h1>
              <p className="mt-3 text-gray-600">Votre commande Marketplace Global a bien été enregistrée.</p>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">Cargando detalles del pedido…</div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
            ) : order ? (
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">N° de commande</p>
                    <p className="font-mono text-lg font-semibold text-gray-900">{order.id}</p>
                  </div>
                  <div className="grid gap-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Etat de la commande</span>
                      <span className="font-semibold text-gray-900">{order.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Statut paiement</span>
                      <span className="font-semibold text-gray-900">{order.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email client</span>
                      <span className="font-semibold text-gray-900">{order.buyerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date</span>
                      <span className="font-semibold text-gray-900">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="font-semibold text-gray-900">{order.grandTotal.toFixed(2)} $</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenu de la commande</h2>
                  <div className="space-y-4">
                    {order.lines.map((line) => (
                      <div key={`${line.productId}-${line.name}`} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-gray-900">{line.name}</p>
                            <p className="text-xs text-gray-500">Quantité {line.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{line.total.toFixed(2)} $</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">Commande introuvable.</div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/services/marketplace-global"
                className="rounded-3xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                Retour au marketplace
              </Link>
              {orderId ? (
                <Link
                  href={`/services/marketplace-global/orders/${orderId}`}
                  className="rounded-3xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Voir les détails de la commande
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplaceConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}

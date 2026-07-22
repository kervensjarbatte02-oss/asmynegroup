"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-yellow-200 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="32" height="32" fill="none" stroke="#16a34a" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Commande confirmée !</h1>
        <p className="text-gray-600 mb-4">Merci pour votre achat. Votre commande a été enregistrée avec succès.</p>
        {orderId && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6 text-sm text-gray-700">
            N° de commande : <span className="font-mono font-bold text-gray-900">{orderId}</span>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <Link href="/services/marketplace-global"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl py-3 text-base transition">
            Continuer les achats
          </Link>
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}

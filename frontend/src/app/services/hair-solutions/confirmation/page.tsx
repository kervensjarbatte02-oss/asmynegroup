"use client";
import React from "react";
import HairSolutionsNavbar from "../HairSolutionsNavbar";
import HairSolutionsFooter from "../HairSolutionsFooter";
import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-yellow-50 font-sans">
      <HairSolutionsNavbar />
      <main className="flex-1 flex items-center justify-center w-full px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          {/* Icône de succès */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-yellow-900 mb-2">Commande confirmée!</h1>
          <p className="text-gray-600 mb-6">
            Merci pour votre achat. Votre commande a été traitée avec succès.
          </p>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <p className="text-sm text-gray-600 mb-2">Numéro de commande</p>
            <p className="text-xl font-bold text-yellow-900">#SHEBAS-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>

          <div className="space-y-2 mb-8 text-left text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Un email de confirmation a été envoyé
            </p>
            <p className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Vous recevrez votre commande dans 5-7 jours
            </p>
            <p className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Suivez votre commande par email
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/services/hair-solutions"
              className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg text-center"
            >
              Continuer vos achats
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg text-center"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      <HairSolutionsFooter />
    </div>
  );
}

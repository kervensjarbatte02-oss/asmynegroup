"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../shared/CartContext";

export default function HairSolutionsNavbar() {
  const { cart } = useCart();
  const [isLogged, setIsLogged] = useState(false);
  const shebasCount = cart ? cart.filter(i => i.source === 'shebas').reduce((sum, it) => sum + (it.quantity ?? 0), 0) : 0;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLogged(!!localStorage.getItem("shebas_token"));
    }
    const listener = () => {
      setIsLogged(!!localStorage.getItem("shebas_token"));
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 shadow-md border-b border-gray-200" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-extrabold text-yellow-700 tracking-widest">SHEBAS</span>
      </div>
      <ul className="flex gap-8 text-lg font-semibold">
        <li>
          <Link href="/services/hair-solutions" className="hover:text-yellow-600 cursor-pointer">HOME</Link>
        </li>
        <li className="hover:text-yellow-600 cursor-pointer">PRODUCT</li>
        <li className="hover:text-yellow-600 cursor-pointer">CONTACT</li>
      </ul>
      <div className="flex items-center gap-4 relative">
        {!isLogged ? (
          <Link href="/services/hair-solutions/connexion">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-yellow-100 border border-yellow-300">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </button>
          </Link>
        ) : (
          <>
            <Link href="/services/hair-solutions/panier" className="relative">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-600 hover:bg-yellow-700 border border-yellow-300 relative">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {shebasCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full px-2 py-0.5 border-2 border-white shadow">
                    {shebasCount}
                  </span>
                )}
              </button>
            </Link>
            <button
              className="ml-2 flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-red-200 border border-gray-300"
              title="Déconnexion"
              onClick={() => {
                localStorage.removeItem("shebas_token");
                document.cookie = "asmyne_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.reload();
              }}
            >
              <svg width="22" height="22" fill="none" stroke="#b91c1c" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
                <path d="M12 19a9 9 0 1 1 0-14" />
              </svg>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

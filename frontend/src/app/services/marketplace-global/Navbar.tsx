
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type NavbarProps = {
  collections?: { name: string }[];
  selectedCollection?: string;
  onCollectionChange?: (name: string) => void;
};

export default function Navbar({ collections = [], selectedCollection = "", onCollectionChange }: NavbarProps) {
  // Mock: remplacer par vrai état utilisateur
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <nav className="w-full bg-white shadow h-16 flex items-center px-4 sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 mr-6">
        <a href="/services/marketplace-global" className="focus:outline-none">
          <span className="font-extrabold text-2xl text-black tracking-tight">Asmyne-group</span>
        </a>
      </div>
      {/* Grande barre de recherche (desktop) */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <form className="w-full max-w-xl flex items-center bg-white border border-gray-300 rounded-full shadow px-4 py-2">
          <select
            className="bg-transparent outline-none text-black font-semibold mr-3"
            value={selectedCollection}
            onChange={e => onCollectionChange?.(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {collections.map((col, idx) => (
              <option key={idx} value={col.name}>{col.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Buscar productos..."
            className="flex-1 bg-transparent outline-none text-black placeholder-gray-400 px-2"
          />
          <button type="submit" className="ml-2 bg-black text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-900 transition" title="Rechercher">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
          </button>
        </form>
      </div>
      {/* Icônes à droite */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Bouton profil */}
        <div className="relative" ref={profileRef}>
          <button
            className="text-gray-700 hover:text-black flex items-center justify-center w-10 h-10 rounded-full transition focus:outline-none"
            title="Profil"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 4h.01M17.657 16.657A8 8 0 1112 4a8 8 0 015.657 12.657z" /></svg>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 animate-fade-in">
              {isLoggedIn ? (
                <>
                  <Link href="/services/marketplace-global/profile/me" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Mi perfil</Link>
                  <Link href="/services/marketplace-global/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Mis pedidos</Link>
                  <Link href="/services/marketplace-global/messages" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Mensajes</Link>
                  <Link href="/services/marketplace-global/recently-viewed" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Vistos recientemente</Link>
                </>
              ) : (
                <>
                  <span className="block px-4 py-2 text-gray-400 cursor-not-allowed select-none">Mi perfil</span>
                  <span className="block px-4 py-2 text-gray-400 cursor-not-allowed select-none">Mis pedidos</span>
                  <span className="block px-4 py-2 text-gray-400 cursor-not-allowed select-none">Mensajes</span>
                  <span className="block px-4 py-2 text-gray-400 cursor-not-allowed select-none">Vistos recientemente</span>
                </>
              )}
              <div className="border-t my-2" />
              {isLoggedIn ? (
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={() => { setIsLoggedIn(false); setProfileOpen(false); }}
                >Cerrar sesión</button>
              ) : (
                <Link
                  href="/services/marketplace-global/login"
                  className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >Iniciar sesión</Link>
              )}
            </div>
          )}
        </div>
        {/* Bouton panier */}
        <Link href="/services/marketplace-global/cart" className="relative text-gray-700 hover:text-black flex items-center justify-center w-10 h-10 rounded-full transition focus:outline-none" title="Carrito">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L21 13M7 13V6a1 1 0 011-1h3m4 0h2a1 1 0 011 1v7" /></svg>
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1">0</span>
        </Link>
      </div>
      {/* Menu hamburger (mobile) */}
      <div className="md:hidden ml-2">
        <button className="text-2xl text-black focus:outline-none" title="Menu" aria-label="Menu">
          {/* Icône menu, à personnaliser si besoin */}
        </button>
      </div>
    </nav>
  );
}

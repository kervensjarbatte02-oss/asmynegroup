"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { useToast } from "./ToastContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sellerId?: string;
  source?: string;
  variant?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, source?: string, variant?: string) => void;
  updateQuantity: (id: string, quantity: number, source?: string, variant?: string) => void;
  clearCart: (source?: string) => void;
  syncing: boolean;
}

type CartProviderProps = {
  children: ReactNode;
  storageKey?: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children, storageKey = "cart:guest" }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const isInitialLoad = useRef(true);
  const syncTimer = useRef<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        // try to load server cart for authenticated users
        const res = await fetch("/api/cart", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.cart)) {
            setCart(data.cart);
            // switch storage key to user to avoid clobbering guest cart
            try { localStorage.setItem(storageKey, JSON.stringify(data.cart)); } catch {}
            isInitialLoad.current = false;
            return;
          }
        }
      } catch (e) {
        // ignore server errors, fall back to local
      }

      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setCart(JSON.parse(stored));
          isInitialLoad.current = false;
          return;
        }

        if (storageKey === "cart:guest") {
          const legacyCart = localStorage.getItem("cart");
          if (legacyCart) {
            setCart(JSON.parse(legacyCart));
            localStorage.setItem(storageKey, legacyCart);
            localStorage.removeItem("cart");
            isInitialLoad.current = false;
            return;
          }
        }

        setCart([]);
      } catch {
        setCart([]);
      }
      isInitialLoad.current = false;
    })();
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (e: any) {
      // Suppression du toast d'erreur pour quota dépassé : on ignore l'erreur pour ne jamais afficher ce message
    }
  }, [cart, storageKey]);

  // sync cart to server (debounced) when user is authenticated
  useEffect(() => {
    if (isInitialLoad.current) return;

    // clear previous timer
    if (syncTimer.current) window.clearTimeout(syncTimer.current);

    syncTimer.current = window.setTimeout(async () => {
      setSyncing(true);
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart }),
        });
      } catch (e) {
        // show a non-blocking toast on sync error
        try { toast.addToast({ type: "error", message: "Erreur de synchronisation du panier." }); } catch {}
      } finally {
        setSyncing(false);
      }
    }, 600);

    return () => {
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
    };
  }, [cart]);

  const addToCart = (item: CartItem) => {
    if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
      try { toast.addToast({ type: "error", message: "Produit invalide : identifiant manquant." }); } catch {}
      return;
    }
    // On ne garde que les champs essentiels pour éviter quota exceeded
    const minimalItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      sellerId: item.sellerId,
      source: item.source,
      variant: item.variant,
    };
    const matchItem = (cartItem: CartItem) =>
      cartItem.id === item.id && cartItem.source === item.source && cartItem.variant === item.variant;

    setCart(prev => {
      const found = prev.find(matchItem);
      if (found) {
        return prev.map(i =>
          matchItem(i) ? { ...i, quantity: item.quantity } : i
        );
      }
      return [...prev, minimalItem];
    });
  };

  const removeFromCart = (id: string, source?: string, variant?: string) =>
    setCart(prev => prev.filter((i) =>
      i.id !== id || (source ? i.source !== source : false) || (variant ? i.variant !== variant : false)
    ));

  const updateQuantity = (id: string, quantity: number, source?: string, variant?: string) =>
    setCart(prev => prev.map((i) =>
      i.id === id && (!source || i.source === source) && (!variant || i.variant === variant)
        ? { ...i, quantity }
        : i
    ));

  const clearCart = (source?: string) =>
    setCart(prev => (source ? prev.filter((i) => i.source !== source) : []));

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, syncing }}>
      {children}
    </CartContext.Provider>
  );
}

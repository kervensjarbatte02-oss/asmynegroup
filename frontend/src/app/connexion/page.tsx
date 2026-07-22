"use client";

import { FormEvent, useState } from "react";
import { useToast } from "@/app/shared/ToastContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginResult = {
  message?: string;
  error?: string;
};

export default function ConnexionPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const toast = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResult;

      if (!response.ok) {
        setError(data.error ?? "Connexion impossible.");
        return;
      }

      // fusionner le panier local (guest) vers le panier serveur
      try {
        const guest = localStorage.getItem("cart:guest") ?? localStorage.getItem("cart");
        const guestCart = guest ? JSON.parse(guest) : [];

        // récupérer le panier serveur actuel
        const serverRes = await fetch("/api/cart", { cache: "no-store" });
        let serverCart: any[] = [];
        if (serverRes.ok) {
          const sd = await serverRes.json();
          serverCart = Array.isArray(sd?.cart) ? sd.cart : [];
        }

        // fusion basique: sommer les quantités par product id
        const map = new Map<string, any>();
        for (const it of serverCart) map.set(it.id, { ...it });
        for (const it of guestCart) {
          const existing = map.get(it.id);
          if (existing) existing.quantity = (existing.quantity || 0) + (it.quantity || 0);
          else map.set(it.id, { ...it });
        }
        const merged = Array.from(map.values());

        // envoyer le panier fusionné au serveur
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: merged }),
        });

        // nettoyer le panier local guest
        try { localStorage.removeItem("cart:guest"); localStorage.removeItem("cart"); } catch {}
        // show success toast
        try { toast.addToast({ type: "success", message: "Panier fusionné avec succès." }); } catch {}
      } catch (e) {
        // affiche un toast d'erreur de fusion (non bloquant)
        try { toast.addToast({ type: "error", message: "Échec de la fusion du panier." }); } catch {}
        console.warn("Cart merge failed", e);
      }

      setSuccess(data.message ?? "Connexion reussie.");
      setTimeout(() => {
        router.push("/espace-client");
      }, 900);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setError("Serveur trop lent. Reessaie dans quelques secondes.");
      } else {
        setError("Erreur reseau. Reessaie.");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#18091d] via-[#2b1034] to-[#ffd9ef] px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#b11374]">Connexion</h1>
          <p className="mt-2 text-sm text-[#5b2a4e]">
            Entre dans ton compte pour continuer sur Asmyne Dating.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="nom@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Ton mot de passe"
            />
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          {success ? <p className="text-sm font-medium text-green-700">{success}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#ea2e96] px-5 py-3 text-base font-bold text-white shadow-lg transition hover:bg-[#c71c7d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#5b2a4e]">
          Pas encore de compte?{" "}
          <Link href="/inscription" className="font-bold text-[#b11374] hover:underline">
            S inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}

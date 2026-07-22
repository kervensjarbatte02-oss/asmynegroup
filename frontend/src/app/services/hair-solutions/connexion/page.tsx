"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HairSolutionsConnexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // Remplacer par votre logique d'authentification
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Identifiants invalides.");
        return;
      }
      const data = await res.json();
      // Stocker le token JWT pour les requêtes sécurisées
      localStorage.setItem("shebas_token", data.token);
      // Mettre aussi le token dans le cookie pour l'API
      document.cookie = `asmyne_auth=${data.token}; path=/; SameSite=Lax`;
      router.push("/services/hair-solutions");
    } catch {
      setError("Erreur réseau. Réessayez.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50" style={{background: 'linear-gradient(120deg, #f7e1b5 0%, #fffbe6 100%)'}}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 border border-yellow-200">
        <h1 className="text-2xl font-bold text-yellow-800 mb-2 text-center">Connexion SHEBAS</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
        {error && <div className="text-red-600 text-sm font-semibold text-center">{error}</div>}
        <button
          type="submit"
          className="bg-yellow-700 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-800 mt-2"
        >
          Se connecter
        </button>
        <div className="text-center mt-2">
          <a href="/services/hair-solutions/register" className="text-yellow-700 hover:underline font-semibold">Créer un compte</a>
        </div>
      </form>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HairSolutionsRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password || !confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Erreur lors de l'inscription.");
        return;
      }
      setSuccess("Compte créé avec succès ! Vous pouvez vous connecter.");
      setTimeout(() => router.push("/services/hair-solutions/connexion"), 1200);
    } catch {
      setError("Erreur réseau. Réessayez.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50" style={{background: 'linear-gradient(120deg, #f7e1b5 0%, #fffbe6 100%)'}}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 border border-yellow-200">
        <h1 className="text-2xl font-bold text-yellow-800 mb-2 text-center">Créer un compte SHEBAS</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900 placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900 placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900 placeholder-gray-400"
        />
        {error && <div className="text-red-600 text-sm font-semibold text-center">{error}</div>}
        {success && <div className="text-green-700 text-sm font-semibold text-center">{success}</div>}
        <button
          type="submit"
          className="bg-yellow-700 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-800 mt-2"
        >
          Créer mon compte
        </button>
      </form>
    </div>
  );
}

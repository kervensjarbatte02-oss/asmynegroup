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
      setError("Por favor completa todos los campos.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
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
        setError(data.error || "Error en el registro.");
        return;
      }
      setSuccess("¡Cuenta creada con éxito! Puedes iniciar sesión.");
      setTimeout(() => router.push("/services/hair-solutions/connexion"), 1200);
    } catch {
      setError("Error de red. Intenta de nuevo.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50" style={{background: 'linear-gradient(120deg, #f7e1b5 0%, #fffbe6 100%)'}}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 border border-yellow-200">
        <h1 className="text-2xl font-bold text-yellow-800 mb-2 text-center">Crear cuenta SHEBAS</h1>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900 placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900 placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
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
          Crear cuenta
        </button>
      </form>
    </div>
  );
}

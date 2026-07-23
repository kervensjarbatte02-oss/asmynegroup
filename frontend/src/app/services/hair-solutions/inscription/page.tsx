"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HairSolutionsInscription() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirm) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Error en el registro.");
        return;
      }
      // Si el backend devuelve un token, guárdalo también en la cookie
      const data = await res.json().catch(() => ({}));
      if (data.token) {
        localStorage.setItem("shebas_token", data.token);
        document.cookie = `asmyne_auth=${data.token}; path=/; SameSite=Lax`;
      }
      router.push("/services/hair-solutions");
    } catch {
      setError("Error de red. Intenta de nuevo.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50" style={{background: 'linear-gradient(120deg, #f7e1b5 0%, #fffbe6 100%)'}}>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-yellow-800">Crear cuenta</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded"
        />
        <button type="submit" className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">Registrarse</button>
        <div className="mt-4 text-center">
          <a href="/services/hair-solutions/connexion" className="text-yellow-700 hover:underline">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </form>
    </div>
  );
}

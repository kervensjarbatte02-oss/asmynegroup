"use client";
import { useState } from "react";

export default function SellerRegisterPage() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    boutique: "",
    pays: "",
    password: "",
    otp: ""
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [testCode, setTestCode] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && (!form.nom || !form.prenom || !form.email || !form.boutique)) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTestCode(null);

    try {
      const response = await fetch("/api/auth/vendor-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          boutique: form.boutique,
          pays: form.pays,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No fue posible enviar el código OTP.");
        setLoading(false);
        return;
      }

      if (data.testCode) {
        setTestCode(String(data.testCode));
      }

      setOtpSent(true);
      setStep(3);
    } catch (err) {
      setError("Error de red. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/vendor-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Código OTP incorrecto.");
        setLoading(false);
        return;
      }

      window.location.href = "/services/marketplace-global/seller-login";
    } catch (err) {
      setError("Error de red. Inténtalo de nuevo más tarde.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    setTestCode(null);

    try {
      const response = await fetch("/api/auth/vendor-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No fue posible reenviar el código OTP.");
        setLoading(false);
        return;
      }

      if (data.testCode) {
        setTestCode(String(data.testCode));
      }
    } catch (err) {
      setError("Error de red. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Registro de vendedor</h1>
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Nombre</label>
              <input name="nom" value={form.nom} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Apellido</label>
              <input name="prenom" value={form.prenom} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Correo electrónico</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Nombre de la tienda</label>
              <input name="boutique" value={form.boutique} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition font-semibold">Siguiente</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">País</label>
              <input name="pays" value={form.pays} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition font-semibold" disabled={loading}>{loading ? "Enviando el código..." : "Registrarme"}</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleOtp} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Código OTP enviado por correo</label>
              <input name="otp" value={form.otp} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white tracking-widest text-lg text-center" maxLength={6} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition font-semibold" disabled={loading}>{loading ? "Verificando..." : "Validar código"}</button>
            {testCode && (
              <div className="text-center text-gray-500 text-sm mt-2">
                Código de prueba: <span className="font-mono">{testCode}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleResend}
              className="w-full border border-gray-300 text-gray-700 dark:text-white dark:border-gray-700 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition font-semibold"
              disabled={loading}
            >
              {loading ? "Reenviando..." : "Reenviar el código"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

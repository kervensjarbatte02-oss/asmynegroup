"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterResult = {
  message?: string;
  error?: string;
};

export default function InscriptionPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");




  function validateForm() {
    if (!firstName || !lastName || !phone || !email) {
      return "Veuillez remplir tous les champs obligatoires.";
    }
    if (!password || !confirmPassword) {
      return "Veuillez renseigner le mot de passe et sa confirmation.";
    }
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (password !== confirmPassword) {
      return "Les mots de passe ne correspondent pas.";
    }
    return "";
  }



  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email,
          password,
        }),
      });

      const data = (await response.json()) as RegisterResult;

      if (!response.ok) {
        setError(data.error ?? "Impossible de terminer l'inscription.");
        return;
      }

      setSuccess(data.message ?? "Inscription terminée avec succès.");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/espace-client");
      }, 1200);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#16081a] via-[#2a0f31] to-[#ffe6f6] px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#b11374]">Inscription client</h1>
          <p className="mt-2 text-sm text-[#5b2a4e]">
            Créez votre compte pour accéder à nos services.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Nom
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Nom de famille"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Prénom
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Prénom"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Téléphone"
            />
          </div>
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
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Minimum 8 caractères"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={8}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Confirmer le mot de passe"
            />
          </div>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          {success ? <p className="text-sm font-medium text-green-700">{success}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#ea2e96] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#c71c7d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Création du compte..." : "Terminer inscription"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#5b2a4e]">
          Déjà un compte ? {" "}
          <Link href="/connexion" className="font-bold text-[#b11374] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}

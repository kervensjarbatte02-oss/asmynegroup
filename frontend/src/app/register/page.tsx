"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterResult = {
  message?: string;
  error?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  // const [step, setStep] = useState(1); // plus utilisé
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
      return "Please fill all required fields.";
    }
    if (!password || !confirmPassword) {
      return "Please enter your password and confirm it.";
    }
    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
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
        setError(data.error ?? "Unable to complete registration.");
        return;
      }

      setSuccess(data.message ?? "Registration completed successfully.");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/services/marketplace-global");
      }, 1200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#16081a] via-[#2a0f31] to-[#ffe6f6] px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#b11374]">Buyer Sign Up</h1>
          <p className="mt-2 text-sm text-[#5b2a4e]">
            Create your account to access our services.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Last name"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Phone number"
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
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Create a password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-semibold text-[#4a183a]">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-[#e7b7d6] bg-white px-4 py-3 text-[#230e1b] outline-none ring-pink-400 transition focus:ring-2"
              placeholder="Confirm your password"
            />
          </div>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          {success ? <p className="text-sm font-medium text-green-700">{success}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#ea2e96] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#c71c7d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Registering..." : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#5b2a4e]">
          Already have a buyer account?{" "}
          <Link href="/login" className="font-bold text-[#b11374] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

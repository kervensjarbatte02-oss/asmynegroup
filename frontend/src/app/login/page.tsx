"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginResult = {
  message?: string;
  error?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setError(data.error ?? "Unable to sign in.");
        return;
      }

      setSuccess(data.message ?? "Signed in successfully.");
      setTimeout(() => {
        router.push("/services/marketplace-global");
      }, 900);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setError("Server took too long. Please try again.");
      } else {
        setError("Network error. Please try again.");
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
          <h1 className="text-3xl font-extrabold text-[#b11374]">Buyers Sign In</h1>
          <p className="mt-2 text-sm text-[#5b2a4e]">
            Sign in to your buyer account and continue shopping on Asmyne.
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
              placeholder="Your password"
            />
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          {success ? <p className="text-sm font-medium text-green-700">{success}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#ea2e96] px-5 py-3 text-base font-bold text-white shadow-lg transition hover:bg-[#c71c7d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#5b2a4e]">
          Don’t have a buyer account?{" "}
          <Link href="/register" className="font-bold text-[#b11374] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}

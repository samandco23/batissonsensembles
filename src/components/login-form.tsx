"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Email ou mot de passe incorrect.");
        setPending(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Connexion impossible. Réessayez.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="field-label">
          Email administrateur
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field"
          placeholder="admin@batissonsensemble.tech"
        />
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="field"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-sm border border-clay/25 bg-clay/8 px-4 py-3 text-[13px] text-clay"
        >
          {error}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3.5">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

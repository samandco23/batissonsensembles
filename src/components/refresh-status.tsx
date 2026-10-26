"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function RefreshStatus({ reference }: { reference: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function check() {
    setChecking(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/fapshi/verify?ref=${encodeURIComponent(reference)}`,
        { cache: "no-store" },
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Vérification impossible pour le moment.");
        return;
      }
      startTransition(() => router.refresh());
    } catch {
      setError("Connexion impossible. Réessayez dans un instant.");
    } finally {
      setChecking(false);
    }
  }

  const busy = checking || pending;

  return (
    <div>
      <button type="button" onClick={check} disabled={busy} className="btn-ghost px-5 py-2.5 text-[13px]">
        {busy ? (
          <>
            <span
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/25 border-t-ink"
              aria-hidden="true"
            />
            Vérification…
          </>
        ) : (
          <>Actualiser le statut</>
        )}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-center text-[12px] text-clay">
          {error}
        </p>
      )}
    </div>
  );
}

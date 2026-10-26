"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatFcfa } from "@/lib/format";

type Props = {
  participantCount: number;
  totalCollected: number;
  prizeBudget: number;
  prizeCount: number;
  prizeAmount: number;
};

export function DrawPanel({
  participantCount,
  totalCollected,
  prizeBudget,
  prizeCount,
  prizeAmount,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const underfunded = totalCollected < prizeBudget;
  const enoughParticipants = participantCount >= prizeCount;
  const canConfirm =
    enoughParticipants &&
    (!underfunded || confirmation.trim().toUpperCase() === "TIRAGE");

  async function run() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allowUnderfunded: underfunded }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error || "Le tirage a échoué.");
        setPending(false);
        return;
      }

      setOpen(false);
      setPending(false);
      router.refresh();
    } catch {
      setError("Connexion impossible. Le tirage n'a pas été effectué.");
      setPending(false);
    }
  }

  return (
    <div className="rounded-sm border border-ink/10 bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-ink">Lancer le tirage</h2>
          <p className="mt-1.5 max-w-md text-[13px] leading-6 text-ink-muted">
            {prizeCount} gagnants seront désignés aléatoirement parmi les{" "}
            {participantCount} contributions confirmées. Cette action est{" "}
            <strong className="font-semibold text-ink">définitive</strong> : elle
            ne peut être effectuée qu&apos;une seule fois.
          </p>
        </div>
        <span className="badge">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          Verrouillé après exécution
        </span>
      </div>

      {!enoughParticipants && (
        <p className="mt-4 rounded-sm border border-clay/25 bg-clay/8 px-4 py-3 text-[13px] text-clay">
          Il faut au moins {prizeCount} contributions confirmées pour lancer le
          tirage.
        </p>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={!enoughParticipants}
          className="btn-primary mt-5 px-6 py-3"
        >
          Lancer le tirage au sort
        </button>
      ) : (
        <div className="mt-5 rounded-sm border border-clay/25 bg-clay/[0.04] p-5">
          <p className="text-[13.5px] font-semibold text-ink">
            Confirmez-vous le tirage ? Il ne pourra plus être relancé.
          </p>
          <p className="mt-1.5 text-[12.5px] leading-5 text-ink-muted">
            {prizeCount} gains de {formatFcfa(prizeAmount)} seront attribués
            immédiatement et publiés sur la page Résultats.
          </p>

          {underfunded && (
            <div className="mt-4 rounded-sm border border-clay/30 bg-white px-4 py-3">
              <p className="text-[12.5px] leading-5 text-clay">
                Attention : le montant collecté ({formatFcfa(totalCollected)}) est
                inférieur au budget des gains ({formatFcfa(prizeBudget)}).
                Tapez <strong>TIRAGE</strong> pour confirmer malgré tout.
              </p>
              <input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="TIRAGE"
                className="field mt-2 py-2 text-[13px]"
                aria-label="Saisir TIRAGE pour confirmer"
              />
            </div>
          )}

          {error && (
            <p role="alert" className="mt-3 text-[12.5px] text-clay">
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={run}
              disabled={!canConfirm || pending}
              className="btn bg-clay px-5 py-2.5 text-[13px] text-white hover:bg-[#8f3f24]"
            >
              {pending ? "Tirage en cours…" : "Oui, effectuer le tirage"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              disabled={pending}
              className="btn-ghost px-5 py-2.5 text-[13px]"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

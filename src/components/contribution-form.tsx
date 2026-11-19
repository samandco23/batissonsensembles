"use client";

import { useState } from "react";
import { EXPERIENCE } from "@/lib/config";
import { formatFcfa } from "@/lib/format";

const PRESETS = [100, 500, 1_000, 5_000];

export function ContributionForm() {
  const [amount, setAmount] = useState<number>(EXPERIENCE.minContribution);
  const [customAmount, setCustomAmount] = useState("");
  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function selectPreset(value: number) {
    setAmount(value);
    setCustomAmount("");
    setError(null);
  }

  function onCustomChange(raw: string) {
    setCustomAmount(raw);
    const parsed = Number(raw.replace(/[^\d]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) setAmount(parsed);
    setError(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!Number.isInteger(amount) || amount < EXPERIENCE.minContribution) {
      setError(`Le montant minimum est de ${formatFcfa(EXPERIENCE.minContribution)}.`);
      return;
    }
    if (amount > EXPERIENCE.maxContribution) {
      setError(`Le montant maximum en une fois est de ${formatFcfa(EXPERIENCE.maxContribution)}.`);
      return;
    }
    if (!contact.trim()) {
      setError("Indique un email ou un numéro de téléphone pour participer au tirage.");
      return;
    }
    if (!isAnonymous && !firstName.trim()) {
      setError("Indique ton prénom, ou coche « Je souhaite rester anonyme ».");
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/fapshi/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          firstName: isAnonymous ? null : firstName,
          lastName: null,
          contact,
          isAnonymous,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { link?: string; error?: string }
        | null;

      if (!response.ok || !data?.link) {
        setError(data?.error || "Le paiement n'a pas pu démarrer. Réessayez.");
        setPending(false);
        return;
      }

      window.location.assign(data.link);
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset>
        <legend className="field-label">Montant</legend>

        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((value) => {
            const active = !customAmount && amount === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => selectPreset(value)}
                aria-pressed={active}
                className={`rounded-sm border px-2 py-3 text-[13px] font-semibold transition ${
                  active
                    ? "border-brand bg-brand text-cream shadow-sm"
                    : "border-ink/12 bg-white text-ink-soft hover:border-ink/30"
                }`}
              >
                {value.toLocaleString("fr-FR")}
                <span className="ml-1 text-[11px] font-normal opacity-70">FCFA</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3">
          <label htmlFor="custom-amount" className="sr-only">
            Autre montant en FCFA
          </label>
          <div className="relative">
            <input
              id="custom-amount"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Autre montant (ex. 2 000)"
              value={customAmount}
              onChange={(event) => onCustomChange(event.target.value)}
              className="field pr-16"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-ink-muted">
              FCFA
            </span>
          </div>
        </div>

        <p className="mt-2 text-[12px] text-ink-muted">
          Minimum {formatFcfa(EXPERIENCE.minContribution)}.
        </p>
      </fieldset>

      <div className="h-px bg-ink/10" />

      <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-ink/12 bg-sand/30 p-4">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(event) => setIsAnonymous(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
        />
        <span>
          <span className="block text-[14px] font-semibold text-ink">
            Je reste anonyme
          </span>
          <span className="mt-0.5 block text-[12.5px] leading-5 text-ink-muted">
            Mon nom ne sera pas affiché.
          </span>
        </span>
      </label>

      {!isAnonymous && (
        <div>
          <label htmlFor="firstName" className="field-label">
            Prénom <span className="text-clay">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Votre prénom"
            maxLength={60}
            className="field"
          />
        </div>
      )}

      <div>
        <label htmlFor="contact" className="field-label">
          Email ou téléphone <span className="text-clay">*</span>
        </label>
        <input
          id="contact"
          name="contact"
          autoComplete="email"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder="Email ou numéro de téléphone"
          className="field"
          aria-describedby="contact-help"
        />
        <p id="contact-help" className="mt-1.5 text-[12px] leading-5 text-ink-muted">
          Privé. Utilisé pour vous contacter si vous gagnez.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-sm border border-clay/25 bg-clay/8 px-4 py-3 text-[13px] leading-5 text-clay"
        >
          {error}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-4 text-[15px]">
        {pending ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
              aria-hidden="true"
            />
            Ouverture du paiement…
          </>
        ) : (
          <>
            Continuer · {formatFcfa(amount)}
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>

      <div className="space-y-2 text-center">
        <p className="text-[11.5px] text-ink-muted">
          Paiement via Fapshi · MTN MoMo ou Orange Money ·{" "}
          <a href="/reglement" className="underline underline-offset-2 hover:text-ink">
            Règlement
          </a>
        </p>
      </div>
    </form>
  );
}

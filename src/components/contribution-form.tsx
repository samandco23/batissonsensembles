"use client";

import { useState } from "react";
import { EXPERIENCE } from "@/lib/config";
import { formatFcfa } from "@/lib/format";

const PRESETS = [100, 500, 1_000, 5_000];

export function ContributionForm() {
  const [amount, setAmount] = useState<number>(EXPERIENCE.minContribution);
  const [customAmount, setCustomAmount] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
          lastName: isAnonymous ? null : lastName,
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
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <fieldset>
        <legend className="field-label">Montant de votre contribution</legend>

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
          Minimum {formatFcfa(EXPERIENCE.minContribution)} · Vous pouvez donner
          davantage, et contribuer plusieurs fois.
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
            Je souhaite rester anonyme
          </span>
          <span className="mt-0.5 block text-[12.5px] leading-5 text-ink-muted">
            Votre nom ne sera jamais affiché. Vous restez éligible au tirage via
            un identifiant interne.
          </span>
        </span>
      </label>

      {!isAnonymous && (
        <div className="grid gap-4 sm:grid-cols-2">
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
              placeholder="Awa"
              maxLength={60}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="field-label">
              Nom <span className="font-normal text-ink-muted">(optionnel)</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Ndiaye"
              maxLength={60}
              className="field"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="contact" className="field-label">
          Email ou numéro de téléphone <span className="text-clay">*</span>
        </label>
        <input
          id="contact"
          name="contact"
          autoComplete="email"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder="awa@exemple.com ou +237 6XX XX XX XX"
          className="field"
          aria-describedby="contact-help"
        />
        <p id="contact-help" className="mt-1.5 text-[12px] leading-5 text-ink-muted">
          Obligatoire pour vous contacter si vous gagnez. Jamais affiché
          publiquement.
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
            Contribuer {formatFcfa(amount)} via Mobile Money
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>

      <div className="space-y-2 text-center">
        <p className="text-[11.5px] text-ink-muted">
          Paiement sécurisé par Fapshi — MTN MoMo & Orange Money
        </p>
        <p className="text-[11px] leading-5 text-ink-muted/80">
          En contribuant, vous acceptez le{" "}
          <a href="/reglement" className="underline underline-offset-2 hover:text-ink">
            règlement du tirage
          </a>
          .
        </p>
      </div>
    </form>
  );
}

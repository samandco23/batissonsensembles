import { EXPERIENCE } from "@/lib/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s.-]{7,19}$/;

export type ContributionInput = {
  firstName: string | null;
  lastName: string | null;
  contact: string;
  amount: number;
  isAnonymous: boolean;
};

export type ValidationResult =
  | { ok: true; value: ContributionInput }
  | { ok: false; error: string };

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(value.trim());
}

/** Nettoie un nom : espaces compactés, longueur bornée. */
function cleanName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.replace(/\s+/g, " ").trim().slice(0, 60);
  return value || null;
}

export function validateContribution(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Requête invalide." };
  }

  const body = payload as Record<string, unknown>;

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) {
    return { ok: false, error: "Le montant doit être un nombre entier de FCFA." };
  }
  if (amount < EXPERIENCE.minContribution) {
    return {
      ok: false,
      error: `Le don minimum est de ${EXPERIENCE.minContribution} FCFA.`,
    };
  }
  if (amount > EXPERIENCE.maxContribution) {
    return {
      ok: false,
      error: `Le montant maximum accepté en une fois est de ${EXPERIENCE.maxContribution} FCFA.`,
    };
  }

  const contact =
    typeof body.contact === "string" ? body.contact.trim().slice(0, 120) : "";
  if (!contact) {
    return {
      ok: false,
      error:
        "Un email ou un numéro de téléphone est obligatoire pour participer au tirage.",
    };
  }
  if (!isValidEmail(contact) && !isValidPhone(contact)) {
    return {
      ok: false,
      error: "Indique un email valide ou un numéro de téléphone valide.",
    };
  }

  const isAnonymous = body.isAnonymous === true;
  const firstName = cleanName(body.firstName);
  const lastName = cleanName(body.lastName);

  // Contributeur anonyme : les noms ne sont ni stockés ni nécessaires.
  if (isAnonymous) {
    return {
      ok: true,
      value: {
        firstName: null,
        lastName: null,
        contact,
        amount,
        isAnonymous: true,
      },
    };
  }

  if (!firstName) {
    return {
      ok: false,
      error:
        "Indique ton prénom, ou coche « Je souhaite rester anonyme » pour contribuer sans nom.",
    };
  }

  return {
    ok: true,
    value: { firstName, lastName, contact, amount, isAnonymous: false },
  };
}

/**
 * Constantes publiques du projet.
 * La mécanique (objectif, gains, tirage) est publique dès l'ouverture du site.
 */

export const SITE = {
  name: "Bâtissons Ensemble",
  tagline: "Une expérience sociale, pas une collecte ordinaire.",
  organizer: "Alpha Omega Corporation",
  domain: "batissonsensemble.tech",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@batissonsensemble.tech",
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000",
} as const;

/** Mécanique de l'expérience. */
export const EXPERIENCE = {
  goalAmount: 1_000_000,
  goalContributors: 10_000,
  minContribution: 100,
  maxContribution: 500_000,
  prizeCount: 5,
  prizeAmount: 100_000,
  jobsTarget: 10,
  jobsMonths: 6,
} as const;

/** 5 × 100 000 FCFA — la part redistribuée sous forme de gains. */
export const PRIZE_BUDGET = EXPERIENCE.prizeCount * EXPERIENCE.prizeAmount;

/** 1 000 000 − 500 000 — la part qui finance le lancement de la start-up. */
export const STARTUP_BUDGET = EXPERIENCE.goalAmount - PRIZE_BUDGET;

/** Identifiant unique de la session de tirage (garantit un tirage unique). */
export const DRAW_ID = "draw-v1";

/** Date et heure du tirage au sort (ISO 8601). */
export const DRAW_DATE = new Date(
  process.env.NEXT_PUBLIC_DRAW_DATE || "2027-03-31T18:00:00+01:00",
);

export const DRAW_DATE_LABEL = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
})
  .format(DRAW_DATE)
  .replace(/(\d{2}):(\d{2})/, "$1\u00A0h\u00A0$2");

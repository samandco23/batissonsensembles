import { SITE } from "@/lib/config";

/**
 * Identité légale de l'organisateur.
 * ⚠️ À vérifier / compléter avec les informations officielles de la société
 * (forme juridique, adresse exacte, RCCM, NIU) avant la mise en ligne publique.
 */
export const LEGAL = {
  entity: "Alpha Omega Corporation",
  form: "société de droit camerounais",
  address: "Douala, Cameroun",
  registration: "RCCM et NIU communiqués sur demande écrite",
  publisher: "La direction d'Alpha Omega Corporation",
  contactEmail: SITE.contactEmail,
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    url: "https://vercel.com",
  },
  database: {
    name: "Neon Inc.",
    description: "base de données PostgreSQL hébergée (Union européenne)",
  },
  payment: {
    name: "Fapshi",
    description: "agrégateur de paiement Mobile Money (MTN MoMo, Orange Money)",
  },
} as const;

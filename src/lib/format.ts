const numberFormatter = new Intl.NumberFormat("fr-FR");

/** 1000 → « 1 000 FCFA » */
export function formatFcfa(amount: number): string {
  return `${numberFormatter.format(Math.round(amount))} FCFA`;
}

/** 1000 → « 1 000 » (nombre seul, l'unité est affichée à côté) */
export function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value));
}

/** 0.3471 → « 34,7 % » */
export function formatPercent(ratio: number, digits = 1): string {
  const value = Number.isFinite(ratio) ? Math.min(ratio, 1) * 100 : 0;
  return `${value.toFixed(digits).replace(".", ",")} %`;
}

/**
 * Nom affiché publiquement.
 * - non anonyme : « Emma D. »
 * - anonyme : « Contributeur Anonyme #A1B2C »
 */
export function publicDisplayName(contribution: {
  id: string;
  firstName: string | null;
  lastName: string | null;
  isAnonymous: boolean;
}): string {
  if (contribution.isAnonymous) {
    return `Contributeur Anonyme #${idSuffix(contribution.id)}`;
  }
  const first = (contribution.firstName || "").trim();
  const last = (contribution.lastName || "").trim();
  if (!first && !last) return `Contributeur #${idSuffix(contribution.id)}`;
  if (!last) return first;
  return `${first} ${last.charAt(0).toUpperCase()}.`;
}

/** 5 derniers caractères de l'identifiant, en majuscules. */
export function idSuffix(id: string): string {
  return id.slice(-5).toUpperCase();
}

/** Référence courte montrée au contributeur (ex. #K3M9P2). */
export function referenceCode(id: string): string {
  return id.slice(-6).toUpperCase();
}

import { prisma } from "@/lib/prisma";
import {
  getPaymentStatus,
  isFapshiConfigured,
  toInternalStatus,
} from "@/lib/fapshi";

export type SyncResult =
  | { ok: true; status: string }
  | { ok: false; error: string };

/**
 * Réconcilie une contribution avec Fapshi.
 *
 * On ne fait jamais confiance au retour navigateur : c'est l'API
 * `payment-status` (authentifiée côté serveur) qui fait foi. Le montant est
 * revérifié avant de marquer une contribution comme réussie.
 */
export async function syncContribution(
  contributionId: string,
): Promise<SyncResult> {
  const contribution = await prisma.contribution.findUnique({
    where: { id: contributionId },
  });

  if (!contribution) return { ok: false, error: "Contribution introuvable." };

  if (contribution.status !== "pending") {
    return { ok: true, status: contribution.status };
  }

  if (!contribution.fapshiTxId) {
    return { ok: false, error: "Aucune transaction Fapshi associée." };
  }

  if (!isFapshiConfigured()) {
    return { ok: false, error: "Paiement non configuré." };
  }

  try {
    const transaction = await getPaymentStatus(contribution.fapshiTxId);
    const status = toInternalStatus(transaction.status);

    if (status === "pending") {
      return { ok: true, status: contribution.status };
    }

    if (status === "successful") {
      if (
        typeof transaction.amount === "number" &&
        transaction.amount !== contribution.amount
      ) {
        // Anomalie : on ne valide pas, on laisse en pending pour vérification.
        console.error(
          `syncContribution : montant incohérent pour ${contribution.id} ` +
            `(attendu ${contribution.amount}, reçu ${transaction.amount})`,
        );
        return { ok: false, error: "Montant incohérent — vérification requise." };
      }

      if (
        transaction.externalId &&
        transaction.externalId !== contribution.id
      ) {
        console.error(
          `syncContribution : externalId incohérent pour ${contribution.id}.`,
        );
        return { ok: false, error: "Référence incohérente — vérification requise." };
      }
    }

    const updated = await prisma.contribution.update({
      where: { id: contribution.id },
      data: { status },
    });

    return { ok: true, status: updated.status };
  } catch (error) {
    console.error(
      "syncContribution :",
      error instanceof Error ? error.message : error,
    );
    return { ok: false, error: "Statut indisponible pour le moment." };
  }
}

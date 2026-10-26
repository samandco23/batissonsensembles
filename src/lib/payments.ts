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
      console.info(
        `syncContribution ${contribution.id}: ` +
          `always_pending txStatus=${transaction.status} ` +
          `fapshi=${baseUrlForLog()}`,
      );
      return { ok: true, status: contribution.status };
    }

    if (status === "successful") {
      if (
        typeof transaction.amount === "number" &&
        transaction.amount !== contribution.amount
      ) {
        console.error(
          `syncContribution ${contribution.id}: AMOUNT_MISMATCH ` +
            `expected=${contribution.amount} received=${transaction.amount} ` +
            `tx=${transaction.transId} fapshi=${baseUrlForLog()}`,
        );
        return { ok: false, error: "Montant incohérent — vérification requise." };
      }

      if (
        transaction.externalId &&
        transaction.externalId !== contribution.id
      ) {
        console.error(
          `syncContribution ${contribution.id}: EXTERNAL_ID_MISMATCH ` +
            `expected=${contribution.id} received=${transaction.externalId} ` +
            `tx=${transaction.transId}`,
        );
        return { ok: false, error: "Référence incohérente — vérification requise." };
      }
    }

    const updated = await prisma.contribution.update({
      where: { id: contribution.id },
      data: { status },
    });

    console.info(
      `syncContribution ${contribution.id}: done status=${updated.status} ` +
        `fapshiTx=${transaction.transId ?? "(none)"}`,
    );

    return { ok: true, status: updated.status };
  } catch (error) {
    console.error(
      `syncContribution ${contribution.id}: FAIL ` +
        `fapshiTx=${contribution.fapshiTxId ?? "(none)"} ` +
        `${(error as Error).message ?? String(error)}`,
    );
    return { ok: false, error: "Statut indisponible pour le moment." };
  }
}

// Copie interne de baseUrl pour les logs, sans exporter la fonction depuis fapshi.
function baseUrlForLog(): string {
  return (process.env.FAPSHI_BASE_URL || "https://sandbox.fapshi.com").replace(/\/+$/, "");
}

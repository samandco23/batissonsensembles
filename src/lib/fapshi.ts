/**
 * Client Fapshi — Mobile Money (MTN MoMo / Orange Money).
 * Docs : https://docs.fapshi.com/en/api-reference/endpoint/initiate-pay
 *
 * Serveur uniquement : FAPSHI_API_USER / FAPSHI_API_KEY ne doivent jamais
 * atteindre le navigateur.
 */

const DEFAULT_BASE_URL = "https://sandbox.fapshi.com";

export type FapshiInitiatePayload = {
  amount: number;
  email?: string;
  redirectUrl?: string;
  userId?: string;
  externalId?: string;
  message?: string;
};

export type FapshiInitiateResponse = {
  message: string;
  link: string;
  transId: string;
  dateInitiated: string;
};

export type FapshiTransactionStatus =
  | "CREATED"
  | "PENDING"
  | "SUCCESSFUL"
  | "FAILED"
  | "EXPIRED";

export type FapshiTransaction = {
  transId: string;
  status: FapshiTransactionStatus;
  medium?: string;
  amount?: number;
  email?: string | null;
  externalId?: string | null;
  userId?: string | null;
  dateInitiated?: string;
  dateConfirmed?: string | null;
};

export function isFapshiConfigured(): boolean {
  return Boolean(process.env.FAPSHI_API_USER && process.env.FAPSHI_API_KEY);
}

function baseUrl(): string {
  return (process.env.FAPSHI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function authHeaders(): Record<string, string> {
  const user = process.env.FAPSHI_API_USER;
  const key = process.env.FAPSHI_API_KEY;
  if (!user || !key) {
    throw new Error("Fapshi : FAPSHI_API_USER / FAPSHI_API_KEY manquants.");
  }
  return {
    apiuser: user,
    apikey: key,
    "Content-Type": "application/json",
  };
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 300) };
  }
}

/** Crée un lien de paiement hébergé Fapshi (« Initiate Pay »). */
export async function initiatePay(
  payload: FapshiInitiatePayload,
): Promise<FapshiInitiateResponse> {
  const response = await fetch(`${baseUrl()}/initiate-pay`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await readJson(response)) as Partial<FapshiInitiateResponse> & {
    message?: string;
  };

  if (!response.ok || !data?.link || !data?.transId) {
    throw new Error(
      data?.message ||
        `Fapshi a refusé la demande (HTTP ${response.status}).`,
    );
  }

  return {
    message: data.message ?? "Lien de paiement créé",
    link: data.link,
    transId: data.transId,
    dateInitiated: data.dateInitiated ?? new Date().toISOString(),
  };
}

/** Statut d'une transaction. Limite Fapshi : 6 appels / minute / transaction. */
export async function getPaymentStatus(
  transId: string,
): Promise<FapshiTransaction> {
  const response = await fetch(
    `${baseUrl()}/payment-status/${encodeURIComponent(transId)}`,
    { headers: authHeaders(), cache: "no-store" },
  );

  const data = (await readJson(response)) as Partial<FapshiTransaction> & {
    message?: string;
  };

  if (!response.ok || !data?.status) {
    throw new Error(
      data?.message || `Statut Fapshi indisponible (HTTP ${response.status}).`,
    );
  }

  return data as FapshiTransaction;
}

/** Traduit un statut Fapshi vers nos statuts internes. */
export function toInternalStatus(
  status: FapshiTransactionStatus,
): "pending" | "successful" | "failed" {
  if (status === "SUCCESSFUL") return "successful";
  if (status === "FAILED" || status === "EXPIRED") return "failed";
  return "pending";
}

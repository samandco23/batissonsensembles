/**
 * Erreurs structurées pour les routes API.
 *
 * Chaque handler peut lever ou retourner une ApiError ; le message public est ce
 * que voit le client, les détails ne sont jamais envoyés en production.
 */

export type ErrorCode =
  | "CONTRIBUTION_INVALID"
  | "CONTRIBUTION_MISSING"
  | "PAYMENT_NOT_CONFIGURED"
  | "PAYMENT_INIT_FAILED"
  | "PAYMENT_STATUS_UNAVAILABLE"
  | "WEBHOOK_NOT_CONFIGURED"
  | "WEBHOOK_BAD_SIGNATURE"
  | "WEBHOOK_PAYLOAD_INVALID"
  | "WEBHOOK_UNKNOWN_CONTRIBUTION"
  | "DRAW_ALREADY_CONDUCTED"
  | "DRAW_NOT_AUTHORIZED"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  CONTRIBUTION_INVALID: "Données de contribution invalides.",
  CONTRIBUTION_MISSING: "Contribution introuvable.",
  PAYMENT_NOT_CONFIGURED:
    "Le paiement Mobile Money n'est pas encore activé.",
  PAYMENT_INIT_FAILED:
    "Impossible de démarrer le paiement. Réessayez.",
  PAYMENT_STATUS_UNAVAILABLE:
    "Statut de paiement indisponible pour le moment.",
  WEBHOOK_NOT_CONFIGURED: "Webhook non configuré.",
  WEBHOOK_BAD_SIGNATURE: "Signature invalide.",
  WEBHOOK_PAYLOAD_INVALID: "Payload invalide.",
  WEBHOOK_UNKNOWN_CONTRIBUTION:
    "Contribution inconnue (annonce reçue, aucune action).",
  DRAW_ALREADY_CONDUCTED: "Le tirage a déjà été effectué.",
  DRAW_NOT_AUTHORIZED: "Non autorisé.",
  RATE_LIMITED: "Trop de tentatives. Réessayez dans une minute.",
  INTERNAL_ERROR: "Une erreur interne est survenue.",
};

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly publicMessage: string;
  public readonly debugDetails?: unknown;

  constructor(
    code: ErrorCode,
    messageOverride?: string,
    options?: {
      statusCode?: number;
      debugDetails?: unknown;
    },
  ) {
    super(messageOverride ?? ERROR_MESSAGES[code]);
    this.name = "ApiError";
    this.code = code;
    this.publicMessage = messageOverride ?? ERROR_MESSAGES[code];
    this.statusCode = options?.statusCode ?? 500;
    this.debugDetails = options?.debugDetails;
  }

  toResponse(
    includeDebug = process.env.NODE_ENV === "development",
  ): { error: string; code: ErrorCode; details?: unknown } {
    if (includeDebug && this.debugDetails) {
      return {
        error: this.publicMessage,
        code: this.code,
        details: this.debugDetails,
      };
    }
    return { error: this.publicMessage, code: this.code };
  }
}

import { NextResponse } from "next/server";
import { isFapshiConfigured } from "@/lib/fapshi";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Endpoint de debug : lecture seule, aucun secret exposé.
 * Accessible uniquement en développement local.
 */
function isDebugAllowed(request: Request): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  const host = request.headers.get("host") ?? "";
  return host === "localhost:3100" || host === "127.0.0.1:3100";
}

const mask = (value?: string | null): string =>
  value ? `${value.slice(0, 4)}…(${value.length})` : "(absent)";

function fapshiStatus(): Record<string, unknown> {
  const user = process.env.FAPSHI_API_USER ?? undefined;
  const key = process.env.FAPSHI_API_KEY ?? undefined;
  const base = process.env.FAPSHI_BASE_URL ?? undefined;
  const wh = process.env.FAPSHI_WEBHOOK_SECRET ?? undefined;

  return {
    configured: Boolean(user && key && base),
    baseUrl: base ?? "(absent)",
    credentials: {
      user: user ? mask(user) : "(absent)",
      key: key ? mask(key) : "(absent)",
    },
    webhookSecret: wh ? mask(wh) : "(absent)",
  };
}

function nextauthStatus(): Record<string, unknown> {
  return {
    secret: process.env.NEXTAUTH_SECRET
      ? "présent (masqué)"
      : "(absent)",
    url: process.env.NEXTAUTH_URL ?? "(absente)",
  };
}

function envBanner() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "(non défini)",
    filtered: [
      "FAPSHI_API_USER",
      "FAPSHI_API_KEY",
      "FAPSHI_WEBHOOK_SECRET",
      "NEXTAUTH_SECRET",
      "ADMIN_PASSWORD_HASH",
    ],
    note: "Les valeurs sensibles sont masquées volontairement.",
  };
}

export async function GET(request: Request) {
  if (!isDebugAllowed(request)) {
    return NextResponse.json(
      { error: "Debug non disponible dans cet environnement." },
      { status: 403 },
    );
  }

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      env: envBanner(),
      fapshi: fapshiStatus(),
      nextauth: nextauthStatus(),
      checks: {
        paymentCanInitiate: isFapshiConfigured(),
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

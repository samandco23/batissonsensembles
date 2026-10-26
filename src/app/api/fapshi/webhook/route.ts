import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncContribution } from "@/lib/payments";
import { isFapshiConfigured } from "@/lib/fapshi";

function requestId(request: Request): string {
  return (request.headers.get("x-request-id") ?? randomUUID()).slice(0, 12);
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Comparaison à temps constant, tolérante aux longueurs différentes. */
function secretMatches(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expectedSecret = process.env.FAPSHI_WEBHOOK_SECRET;

  const rid = requestId(request);

  if (!expectedSecret) {
    console.error(
      `[${rid}] webhook 503 WEBHOOK_NOT_CONFIGURED ` +
        `remote=${request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown"}`,
    );
    return NextResponse.json(
      { error: "Webhook non configuré.", code: "WEBHOOK_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const providedSecret = request.headers.get("x-wh-secret") ?? "";
  if (!providedSecret || !secretMatches(providedSecret, expectedSecret)) {
    console.warn(
      `[${rid}] webhook 401 WEBHOOK_BAD_SIGNATURE ` +
        `remote=${request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown"}`,
    );
    return NextResponse.json(
      { error: "Signature invalide.", code: "WEBHOOK_BAD_SIGNATURE" },
      { status: 401 },
    );
  }

  if (!isFapshiConfigured()) {
    console.error(`[${rid}] webhook 503 PAYMENT_NOT_CONFIGURED`);
    return NextResponse.json(
      { error: "Paiement non configuré.", code: "PAYMENT_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    console.warn(`[${rid}] webhook 400 WEBHOOK_PAYLOAD_INVALID`);
    return NextResponse.json(
      { error: "Payload invalide.", code: "WEBHOOK_PAYLOAD_INVALID" },
      { status: 400 },
    );
  }

  const transId = typeof payload.transId === "string" ? payload.transId : null;
  const externalId =
    typeof payload.externalId === "string" ? payload.externalId : null;

  if (!transId && !externalId) {
    console.warn(
      `[${rid}] webhook 400 missing_identity ` +
        `payload=${JSON.stringify({ transId, externalId }).slice(0, 200)}`,
    );
    return NextResponse.json(
      { error: "transId ou externalId requis.", code: "WEBHOOK_PAYLOAD_INVALID" },
      { status: 400 },
    );
  }

  const contribution = externalId
    ? await prisma.contribution.findUnique({ where: { id: externalId } })
    : await prisma.contribution.findFirst({ where: { fapshiTxId: transId } });

  if (!contribution) {
    // On répond 200 : inutile que Fapshi réessaie pour une contribution inconnue.
    console.warn(
      `[${rid}] webhook 200 WEBHOOK_UNKNOWN_CONTRIBUTION matched=false ` +
        `transId=${transId ?? "(none)"} externalId=${externalId ?? "(none)"}`,
    );
    return NextResponse.json({ received: true, matched: false });
  }

  if (transId && contribution.fapshiTxId !== transId) {
    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { fapshiTxId: transId },
    });
  }

  const resolvedTxId = transId ?? contribution.fapshiTxId;

  // Le payload n'est jamais cru sur parole : on revérifie via l'API Fapshi.
  const result = await syncContribution(contribution.id);

  const resolvedStatus = result.ok ? result.status : "unverified";

  console.info(
    `[${rid}] webhook 200 handled matched=true ` +
      `contrib=${contribution.id} resolvedTx=${resolvedTxId} ` +
      `fapshiStatus=${resolvedStatus} ok=${result.ok}`,
  );

  return NextResponse.json({
    received: true,
    matched: true,
    status: resolvedStatus,
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "Méthode non autorisée." },
    { status: 405, headers: { Allow: "POST" } },
  );
}

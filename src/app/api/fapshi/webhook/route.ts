import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncContribution } from "@/lib/payments";
import { isFapshiConfigured } from "@/lib/fapshi";

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

  if (!expectedSecret) {
    console.error("Webhook Fapshi : FAPSHI_WEBHOOK_SECRET non configuré.");
    return NextResponse.json(
      { error: "Webhook non configuré." },
      { status: 503 },
    );
  }

  const providedSecret = request.headers.get("x-wh-secret") ?? "";
  if (!providedSecret || !secretMatches(providedSecret, expectedSecret)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 401 });
  }

  if (!isFapshiConfigured()) {
    return NextResponse.json(
      { error: "Paiement non configuré." },
      { status: 503 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  const transId = typeof payload.transId === "string" ? payload.transId : null;
  const externalId =
    typeof payload.externalId === "string" ? payload.externalId : null;

  if (!transId && !externalId) {
    return NextResponse.json(
      { error: "transId ou externalId requis." },
      { status: 400 },
    );
  }

  const contribution = externalId
    ? await prisma.contribution.findUnique({ where: { id: externalId } })
    : await prisma.contribution.findFirst({ where: { fapshiTxId: transId } });

  if (!contribution) {
    // On répond 200 : inutile que Fapshi réessaie pour une contribution inconnue.
    console.warn("Webhook Fapshi : contribution inconnue", {
      transId,
      externalId,
    });
    return NextResponse.json({ received: true, matched: false });
  }

  if (transId && contribution.fapshiTxId !== transId) {
    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { fapshiTxId: transId },
    });
  }

  // Le payload n'est jamais cru sur parole : on revérifie via l'API Fapshi.
  const result = await syncContribution(contribution.id);

  return NextResponse.json({
    received: true,
    matched: true,
    status: result.ok ? result.status : "unverified",
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "Méthode non autorisée." },
    { status: 405, headers: { Allow: "POST" } },
  );
}

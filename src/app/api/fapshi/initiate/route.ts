import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateContribution, isValidEmail } from "@/lib/validation";
import { initiatePay, isFapshiConfigured } from "@/lib/fapshi";
import { referenceCode } from "@/lib/format";

function requestId(request: Request): string {
  return (request.headers.get("x-request-id") ?? randomUUID()).slice(0, 12);
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Limite simple : 8 initiations / 60 s / IP (mémoire d'instance). */
const attempts = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((ts) => now - ts < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);

  if (attempts.size > 5_000) attempts.clear();

  return recent.length > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  const rid = requestId(request);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    console.warn(`[${rid}] initiate 429 RATE_LIMITED ip=${ip}`);
    return NextResponse.json(
      {
        error: "Trop de tentatives. Réessayez dans une minute.",
        code: "RATE_LIMITED",
      },
      { status: 429 },
    );
  }

  if (!isFapshiConfigured()) {
    console.error(
      `[${rid}] initiate 503 PAYMENT_NOT_CONFIGURED ` +
        `base=${process.env.FAPSHI_BASE_URL ?? "(absent)"} ip=${ip}`,
    );
    return NextResponse.json(
      {
        error:
          "Le paiement Mobile Money n'est pas encore activé. Merci de réessayer plus tard.",
        code: "PAYMENT_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide.", code: "CONTRIBUTION_INVALID" },
      { status: 400 },
    );
  }

  const parsed = validateContribution(payload);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { firstName, lastName, contact, amount, isAnonymous } =
    parsed.value;

  const contribution = await prisma.contribution.create({
    data: {
      firstName,
      lastName,
      contact,
      amount,
      isAnonymous,
      status: "pending",
    },
    select: { id: true },
  });

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const redirectUrl = `${origin}/confirm?ref=${contribution.id}`;

  try {
    const payment = await initiatePay({
      amount,
      email: isValidEmail(contact) ? contact : undefined,
      externalId: contribution.id,
      userId: `contrib_${referenceCode(contribution.id)}`,
      redirectUrl,
      message: `Bâtissons Ensemble — contribution ${referenceCode(contribution.id)}`,
    });

    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { fapshiTxId: payment.transId },
    });

    return NextResponse.json({
      link: payment.link,
      transId: payment.transId,
      reference: referenceCode(contribution.id),
    });
  } catch (error) {
    console.error(
      `[${rid}] initiate 502 PAYMENT_INIT_FAILED ` +
        `contrib=${contribution.id} amount=${amount} ` +
        `fapshi=${process.env.FAPSHI_BASE_URL ?? "(absent)"} ` +
        `ip=${ip} ` +
        `${(error as Error).message ?? String(error)}`,
    );

    await prisma.contribution
      .update({ where: { id: contribution.id }, data: { status: "failed" } })
      .catch(() => undefined);

    return NextResponse.json(
      {
        error:
          "Impossible de démarrer le paiement Mobile Money. Vérifiez votre connexion et réessayez.",
        code: "PAYMENT_INIT_FAILED",
      },
      { status: 502 },
    );
  }
}

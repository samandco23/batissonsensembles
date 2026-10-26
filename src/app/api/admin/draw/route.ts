import { createHash, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { DRAW_ID, EXPERIENCE, PRIZE_BUDGET } from "@/lib/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Mélange de Fisher-Yates avec une source cryptographique. */
function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i + 1);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/** Clé d'unicité « personne » : un même contact ne peut gagner qu'une fois. */
function personKey(contribution: {
  contact: string;
  isAnonymous: boolean;
  id: string;
}): string {
  const normalized = contribution.contact
    .toLowerCase()
    .replace(/[\s.\-()]/g, "");
  return normalized || contribution.id;
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  const allowUnderfunded = body.allowUnderfunded === true;

  const existing = await prisma.drawSession.findUnique({ where: { id: DRAW_ID } });
  if (existing) {
    return NextResponse.json(
      { error: "Le tirage a déjà été effectué. Cette action est définitive." },
      { status: 409 },
    );
  }

  const contributions = await prisma.contribution.findMany({
    where: { status: "successful" },
    select: { id: true, amount: true, contact: true, isAnonymous: true },
    orderBy: { createdAt: "asc" },
  });

  if (contributions.length < EXPERIENCE.prizeCount) {
    return NextResponse.json(
      {
        error: `Il faut au moins ${EXPERIENCE.prizeCount} contributions confirmées pour lancer le tirage (actuellement ${contributions.length}).`,
      },
      { status: 409 },
    );
  }

  const totalCollected = contributions.reduce((sum, item) => sum + item.amount, 0);

  if (totalCollected < PRIZE_BUDGET && !allowUnderfunded) {
    return NextResponse.json(
      {
        error:
          "Le montant collecté est inférieur au budget des gains. Confirmez explicitement le tirage pour continuer.",
        code: "underfunded",
        totalCollected,
        prizeBudget: PRIZE_BUDGET,
      },
      { status: 409 },
    );
  }

  // Mélange cryptographique, puis sélection sans doublon de personne.
  const shuffled = shuffle(contributions);
  const selected: typeof shuffled = [];
  const seen = new Set<string>();

  for (const contribution of shuffled) {
    const key = personKey(contribution);
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push(contribution);
    if (selected.length === EXPERIENCE.prizeCount) break;
  }

  if (selected.length < EXPERIENCE.prizeCount) {
    return NextResponse.json(
      {
        error: `Pas assez de participants distincts pour ${EXPERIENCE.prizeCount} gagnants (${selected.length} éligibles).`,
      },
      { status: 409 },
    );
  }

  const drawnAt = new Date();
  const seedHash = createHash("sha256")
    .update(`${drawnAt.toISOString()}|${selected.map((item) => item.id).join("|")}`)
    .digest("hex");

  try {
    await prisma.$transaction(async (tx) => {
      await tx.drawSession.create({
        data: {
          id: DRAW_ID,
          conductedAt: drawnAt,
          totalParticipants: contributions.length,
          totalCollected,
          seedHash,
        },
      });

      for (let index = 0; index < selected.length; index += 1) {
        await tx.contribution.update({
          where: { id: selected[index].id },
          data: { isWinner: true, winnerRank: index + 1 },
        });
      }
    });
  } catch (error) {
    console.error("Tirage : échec de la transaction —", error);
    return NextResponse.json(
      {
        error:
          "Le tirage n'a pas pu être enregistré. Aucun gagnant n'a été désigné.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    conductedAt: drawnAt.toISOString(),
    totalParticipants: contributions.length,
    totalCollected,
    seedHash,
    winners: selected.map((item, index) => ({
      rank: index + 1,
      id: item.id,
      isAnonymous: item.isAnonymous,
    })),
  });
}

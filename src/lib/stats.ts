import { prisma } from "@/lib/prisma";
import { EXPERIENCE } from "@/lib/config";

export type PublicStats = {
  totalAmount: number;
  contributorCount: number;
  goalAmount: number;
  goalContributors: number;
  drawDone: boolean;
  /** true si la base n'a pas pu être interrogée (build, panne, mauvaise URL) */
  unavailable: boolean;
};

const EMPTY: PublicStats = {
  totalAmount: 0,
  contributorCount: 0,
  goalAmount: EXPERIENCE.goalAmount,
  goalContributors: EXPERIENCE.goalContributors,
  drawDone: false,
  unavailable: false,
};

/**
 * Chiffres publics. Ne jette jamais : si la base est injoignable (build sans
 * DATABASE_URL, coupure réseau), le site affiche zéro plutôt que de planter.
 */
export async function getPublicStats(): Promise<PublicStats> {
  try {
    const [aggregate, contributorCount, draw] = await Promise.all([
      prisma.contribution.aggregate({
        where: { status: "successful" },
        _sum: { amount: true },
      }),
      prisma.contribution.count({ where: { status: "successful" } }),
      prisma.drawSession.findFirst({ select: { id: true } }),
    ]);

    return {
      ...EMPTY,
      totalAmount: aggregate._sum.amount ?? 0,
      contributorCount,
      drawDone: Boolean(draw),
    };
  } catch (error) {
    console.error(
      "getPublicStats : base injoignable —",
      error instanceof Error ? error.message : error,
    );
    return { ...EMPTY, unavailable: true };
  }
}

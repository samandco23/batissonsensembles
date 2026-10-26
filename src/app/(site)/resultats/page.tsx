import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPublicStats, type PublicStats } from "@/lib/stats";
import { DRAW_DATE, DRAW_DATE_LABEL, EXPERIENCE, PRIZE_BUDGET } from "@/lib/config";
import { formatFcfa, formatNumber, publicDisplayName } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Résultats du tirage",
  description:
    "Résultats publics du tirage au sort de Bâtissons Ensemble : les 5 contributeurs gagnants de 100 000 FCFA chacun.",
};

type Winner = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  isAnonymous: boolean;
  winnerRank: number | null;
  amount: number;
};

type PageData = {
  stats: PublicStats;
  drawnAt: Date | null;
  participants: number;
  collected: number;
  winners: Winner[];
  failed: boolean;
};

async function loadData(): Promise<PageData> {
  const stats = await getPublicStats();
  try {
    const draw = await prisma.drawSession.findFirst({
      orderBy: { conductedAt: "desc" },
      select: { conductedAt: true, totalParticipants: true, totalCollected: true },
    });

    if (!draw) {
      return { stats, drawnAt: null, participants: 0, collected: 0, winners: [], failed: false };
    }

    const winners = await prisma.contribution.findMany({
      where: { isWinner: true },
      orderBy: { winnerRank: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        isAnonymous: true,
        winnerRank: true,
        amount: true,
      },
    });

    return {
      stats,
      drawnAt: draw.conductedAt,
      participants: draw.totalParticipants,
      collected: draw.totalCollected,
      winners,
      failed: false,
    };
  } catch (error) {
    console.error(
      "Resultats : lecture impossible —",
      error instanceof Error ? error.message : error,
    );
    return { stats, drawnAt: null, participants: 0, collected: 0, winners: [], failed: true };
  }
}

const drawDateLabel = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});

function frenchTime(value: Date): string {
  return drawDateLabel.format(value).replace(/(\d{2}):(\d{2})/, "$1\u00A0h\u00A0$2");
}

export default async function ResultatsPage() {
  const { stats, drawnAt, participants, collected, winners, failed } = await loadData();
  const drawHeld = Boolean(drawnAt) && winners.length > 0;
  const drawUpcoming = !drawHeld && DRAW_DATE.getTime() > Date.now();

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <nav aria-label="Fil d'ariane" className="text-[12.5px] text-ink-muted">
          <Link href="/" className="hover:text-brand">
            Accueil
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-ink">Résultats</span>
        </nav>

        <header className="mt-8">
          <p className="eyebrow">
            <span className="inline-block h-px w-8 bg-brand/30" aria-hidden="true" />
            Transparence
          </p>
          <h1 className="display-lg mt-4 text-balance">Résultats du tirage</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-ink-soft">
            Le tirage est effectué une seule fois, parmi les contributions
            confirmées. Les résultats sont publiés ici, avec le nombre de
            participants et le montant collecté au moment du tirage.
          </p>
        </header>

        {failed && (
          <div className="mt-8 rounded-sm border border-clay/25 bg-clay/8 px-5 py-4 text-[13.5px] text-clay">
            Les résultats ne peuvent pas être chargés pour le moment. Merci de
            réessayer dans quelques instants.
          </div>
        )}

        {drawHeld && drawnAt && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-sm border border-ink/10 bg-white px-5 py-4">
                <p className="text-[10.5px] uppercase tracking-wider text-ink-muted">
                  Tirage effectué le
                </p>
                <p className="mt-1 text-[14px] font-semibold text-ink">
                  {frenchTime(drawnAt)}
                </p>
              </div>
              <div className="rounded-sm border border-ink/10 bg-white px-5 py-4">
                <p className="text-[10.5px] uppercase tracking-wider text-ink-muted">
                  Participants
                </p>
                <p className="mt-1 text-[14px] font-semibold text-ink">
                  {formatNumber(participants)}
                </p>
              </div>
              <div className="rounded-sm border border-ink/10 bg-white px-5 py-4">
                <p className="text-[10.5px] uppercase tracking-wider text-ink-muted">
                  Collecté au tirage
                </p>
                <p className="mt-1 text-[14px] font-semibold text-ink">
                  {formatFcfa(collected)}
                </p>
              </div>
            </div>

            <h2 className="mt-12 font-display text-2xl text-ink">
              Les {EXPERIENCE.prizeCount} gagnants
            </h2>
            <p className="mt-2 text-[13.5px] leading-6 text-ink-muted">
              Chaque gagnant reçoit {formatFcfa(EXPERIENCE.prizeAmount)}. Les
              contributeurs anonymes apparaissent sous leur identifiant interne.
            </p>

            <ol className="mt-6 space-y-3">
              {winners.map((winner) => (
                <li
                  key={winner.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-ink/10 bg-white px-5 py-4 shadow-card sm:px-6"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/20 font-display text-[15px] text-[#D65C17]">
                      {winner.winnerRank ?? "•"}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">
                        {publicDisplayName(winner)}
                      </p>
                      <p className="text-[12px] text-ink-muted">
                        {winner.isAnonymous
                          ? "Contribution anonyme"
                          : "Contributeur identifié"}
                      </p>
                    </div>
                  </div>
                  <p className="font-display text-lg text-brand">
                    {formatFcfa(EXPERIENCE.prizeAmount)}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-sm bg-sand/50 p-5 text-[13px] leading-6 text-ink-soft">
              Les gagnants sont contactés dans les 7 jours suivant le tirage, aux
              coordonnées fournies lors de leur contribution. Le versement est
              effectué par Mobile Money après vérification de l&apos;identité.{" "}
              <Link href="/reglement" className="text-leaf underline underline-offset-2">
                Voir les modalités de versement
              </Link>
              .
            </div>
          </>
        )}

        {!drawHeld && !failed && (
          <>
            <div className="mt-8 overflow-hidden rounded-sm border border-ink/10 bg-white shadow-card">
              <div className="border-b border-ink/10 bg-sand/35 px-6 py-8 text-center sm:px-10">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/8">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="#F2762E" strokeWidth="1.5" />
                    <path d="M12 7v5.2l3.2 2" stroke="#F2762E" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="mt-5 font-display text-2xl text-ink">
                  {drawUpcoming ? "Le tirage n'a pas encore eu lieu" : "Le tirage est en préparation"}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-ink-soft">
                  {drawUpcoming
                    ? `Le tirage est prévu le ${DRAW_DATE_LABEL}. Les ${EXPERIENCE.prizeCount} gagnants de ${formatFcfa(EXPERIENCE.prizeAmount)} seront publiés sur cette page dès qu'il aura eu lieu.`
                    : "Les résultats seront publiés sur cette page dès que le tirage aura été effectué."}
                </p>
              </div>

              <dl className="grid grid-cols-2 divide-x divide-ink/8 sm:grid-cols-4">
                <div className="px-5 py-5">
                  <dt className="text-[10.5px] uppercase tracking-wider text-ink-muted">
                    Contributeurs
                  </dt>
                  <dd className="mt-1 font-display text-xl text-ink">
                    {formatNumber(stats.contributorCount)}
                  </dd>
                </div>
                <div className="px-5 py-5">
                  <dt className="text-[10.5px] uppercase tracking-wider text-ink-muted">
                    Objectif
                  </dt>
                  <dd className="mt-1 font-display text-xl text-ink">
                    {formatNumber(EXPERIENCE.goalContributors)}
                  </dd>
                </div>
                <div className="px-5 py-5">
                  <dt className="text-[10.5px] uppercase tracking-wider text-ink-muted">
                    Collecté
                  </dt>
                  <dd className="mt-1 font-display text-xl text-ink">
                    {formatFcfa(stats.totalAmount)}
                  </dd>
                </div>
                <div className="px-5 py-5">
                  <dt className="text-[10.5px] uppercase tracking-wider text-ink-muted">
                    Dotations
                  </dt>
                  <dd className="mt-1 font-display text-xl text-ink">
                    {formatFcfa(PRIZE_BUDGET)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-sm border border-ink/10 bg-white/60 px-5 py-4 sm:flex-row sm:items-center">
              <p className="text-[13px] leading-6 text-ink-soft">
                Vous pouvez encore rejoindre l&apos;expérience et être éligible
                au tirage.
              </p>
              <Link href="/contribute" className="btn-primary shrink-0 px-6 py-2.5 text-[13px]">
                Je contribue
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

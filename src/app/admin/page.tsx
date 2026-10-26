import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { DrawPanel } from "@/components/draw-panel";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import {
  buildWhere,
  filtersToQuery,
  PAGE_SIZE,
  parseFilters,
  STATUS_LABELS,
} from "@/lib/admin-queries";
import {
  DRAW_ID,
  EXPERIENCE,
  PRIZE_BUDGET,
  STARTUP_BUDGET,
} from "@/lib/config";
import { formatFcfa, formatNumber, formatPercent, referenceCode } from "@/lib/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Tableau de bord",
  robots: { index: false, follow: false },
};

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});

const STATUS_STYLES: Record<string, string> = {
  successful: "bg-leaf/12 text-leaf",
  pending: "bg-brand/20 text-[#D65C17]",
  failed: "bg-clay/12 text-clay",
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { status?: string; from?: string; to?: string; page?: string };
}) {
  let session = null;
  try {
    session = await getAdminSession();
  } catch {
    session = null;
  }

  if (!session?.user) redirect("/admin/login");

  const filters = parseFilters(searchParams);
  const requestedPage = Number.parseInt(searchParams.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const where = buildWhere(filters);

  let rows: Array<{
    id: string;
    createdAt: Date;
    firstName: string | null;
    lastName: string | null;
    contact: string;
    amount: number;
    status: string;
    isAnonymous: boolean;
    isWinner: boolean;
    winnerRank: number | null;
  }> = [];
  let filteredCount = 0;
  let totalCollected = 0;
  let confirmedCount = 0;
  let pendingCount = 0;
  let failedCount = 0;
  let draw: {
    conductedAt: Date;
    totalParticipants: number;
    totalCollected: number;
    seedHash: string | null;
  } | null = null;
  let winners: typeof rows = [];
  let loadError: string | null = null;

  try {
    const [
      rowsResult,
      countResult,
      aggregateResult,
      confirmedResult,
      pendingResult,
      failedResult,
      drawResult,
    ] = await Promise.all([
      prisma.contribution.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          contact: true,
          amount: true,
          status: true,
          isAnonymous: true,
          isWinner: true,
          winnerRank: true,
        },
      }),
      prisma.contribution.count({ where }),
      prisma.contribution.aggregate({
        where: { status: "successful" },
        _sum: { amount: true },
      }),
      prisma.contribution.count({ where: { status: "successful" } }),
      prisma.contribution.count({ where: { status: "pending" } }),
      prisma.contribution.count({ where: { status: "failed" } }),
      prisma.drawSession.findUnique({ where: { id: DRAW_ID } }),
    ]);

    rows = rowsResult;
    filteredCount = countResult;
    totalCollected = aggregateResult._sum.amount ?? 0;
    confirmedCount = confirmedResult;
    pendingCount = pendingResult;
    failedCount = failedResult;
    draw = drawResult;

    if (draw) {
      winners = await prisma.contribution.findMany({
        where: { isWinner: true },
        orderBy: { winnerRank: "asc" },
        select: {
          id: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          contact: true,
          amount: true,
          status: true,
          isAnonymous: true,
          isWinner: true,
          winnerRank: true,
        },
      });
    }
  } catch (error) {
    console.error(
      "Admin : lecture impossible —",
      error instanceof Error ? error.message : error,
    );
    loadError =
      "Impossible de lire la base de données. Vérifiez DATABASE_URL sur Vercel puis rechargez la page.";
  }

  const ratio = Math.min(totalCollected / EXPERIENCE.goalAmount, 1);
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const exportHref = `/api/admin/export${filtersToQuery(filters)}`;
  const hasFilters = filters.status !== "all" || Boolean(filters.from) || Boolean(filters.to);

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-ink/10 bg-ink text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo inverted />
            <span className="hidden h-5 w-px bg-cream/20 sm:block" aria-hidden="true" />
            <span className="text-[12px] uppercase tracking-[0.14em] text-cream/50">
              Administration
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[12.5px] text-cream/60 hover:text-cream">
              Voir le site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">Tableau de bord</h1>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              Suivi des contributions et pilotage du tirage au sort.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a href={exportHref} className="btn-ghost px-5 py-2.5 text-[13px]">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export CSV
            </a>
          </div>
        </div>

        {loadError && (
          <div className="mt-6 rounded-sm border border-clay/25 bg-clay/8 px-5 py-4 text-[13.5px] text-clay">
            {loadError}
          </div>
        )}

        {/* KPIs */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-sm border border-ink/10 bg-white p-5 shadow-card">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Total collecté
            </p>
            <p className="mt-2 font-display text-[26px] leading-none text-ink">
              {formatFcfa(totalCollected)}
            </p>
            <p className="mt-2 text-[12px] text-ink-muted">
              sur {formatFcfa(EXPERIENCE.goalAmount)} · {formatPercent(ratio)}
            </p>
          </div>

          <div className="rounded-sm border border-ink/10 bg-white p-5 shadow-card">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Contributeurs
            </p>
            <p className="mt-2 font-display text-[26px] leading-none text-ink">
              {formatNumber(confirmedCount)}
            </p>
            <p className="mt-2 text-[12px] text-ink-muted">
              sur {formatNumber(EXPERIENCE.goalContributors)} objectif
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
              <div
                className="h-full rounded-full bg-leaf"
                style={{
                  width: `${Math.min(
                    (confirmedCount / EXPERIENCE.goalContributors) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-sm border border-ink/10 bg-white p-5 shadow-card">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Progression
            </p>
            <p className="mt-2 font-display text-[26px] leading-none text-ink">
              {formatPercent(ratio)}
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
            <p className="mt-2 text-[12px] text-ink-muted">
              Budget gains : {formatFcfa(PRIZE_BUDGET)}
            </p>
          </div>

          <div className="rounded-sm border border-ink/10 bg-white p-5 shadow-card">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Paiements en attente
            </p>
            <p className="mt-2 font-display text-[26px] leading-none text-ink">
              {formatNumber(pendingCount)}
            </p>
            <p className="mt-2 text-[12px] text-ink-muted">
              {formatNumber(failedCount)} échoué{failedCount > 1 ? "s" : ""} · à
              vérifier
            </p>
          </div>
        </div>

        {/* Tirage */}
        <div className="mt-6">
          {draw ? (
            <div className="rounded-sm border border-brand/25 bg-brand/[0.05] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl text-ink">Tirage effectué</h2>
                  <p className="mt-1.5 text-[13px] leading-6 text-ink-muted">
                    Le {dateTimeFormatter.format(draw.conductedAt)} ·{" "}
                    {formatNumber(draw.totalParticipants)} participants ·{" "}
                    {formatFcfa(draw.totalCollected)} collectés
                  </p>
                  {draw.seedHash && (
                    <p className="mt-2 break-all font-mono text-[10.5px] text-ink-muted/80">
                      Empreinte : {draw.seedHash}
                    </p>
                  )}
                </div>
                <span className="badge border-brand/20 bg-white text-brand">
                  Verrouillé définitivement
                </span>
              </div>

              <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {winners.map((winner) => (
                  <li
                    key={winner.id}
                    className="rounded-sm border border-ink/10 bg-white px-4 py-3"
                  >
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted">
                      Rang {winner.winnerRank}
                    </p>
                    <p className="mt-1 truncate text-[13.5px] font-semibold text-ink">
                      {winner.isAnonymous
                        ? `Anonyme #${winner.id.slice(-5).toUpperCase()}`
                        : `${winner.firstName ?? ""} ${winner.lastName ?? ""}`.trim() ||
                          `#${referenceCode(winner.id)}`}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-ink-muted">
                      {winner.contact}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <DrawPanel
              participantCount={confirmedCount}
              totalCollected={totalCollected}
              prizeBudget={PRIZE_BUDGET}
              prizeCount={EXPERIENCE.prizeCount}
              prizeAmount={EXPERIENCE.prizeAmount}
            />
          )}
        </div>

        {/* Filtres */}
        <form
          method="get"
          action="/admin"
          className="mt-8 flex flex-wrap items-end gap-3 rounded-sm border border-ink/10 bg-white p-4"
        >
          <div>
            <label htmlFor="status" className="field-label text-[12px]">
              Statut
            </label>
            <select
              id="status"
              name="status"
              defaultValue={filters.status}
              className="field w-44 py-2 text-[13px]"
            >
              <option value="all">Tous</option>
              <option value="successful">Confirmé</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoué</option>
            </select>
          </div>
          <div>
            <label htmlFor="from" className="field-label text-[12px]">
              Du
            </label>
            <input
              id="from"
              type="date"
              name="from"
              defaultValue={filters.from}
              className="field w-40 py-2 text-[13px]"
            />
          </div>
          <div>
            <label htmlFor="to" className="field-label text-[12px]">
              Au
            </label>
            <input
              id="to"
              type="date"
              name="to"
              defaultValue={filters.to}
              className="field w-40 py-2 text-[13px]"
            />
          </div>
          <button type="submit" className="btn-primary px-5 py-2.5 text-[13px]">
            Filtrer
          </button>
          {hasFilters && (
            <Link href="/admin" className="px-2 py-2.5 text-[13px] text-ink-muted hover:text-ink">
              Réinitialiser
            </Link>
          )}
          <span className="ml-auto text-[12px] text-ink-muted">
            {formatNumber(filteredCount)} contribution{filteredCount > 1 ? "s" : ""}
          </span>
        </form>

        {/* Tableau */}
        <div className="mt-4 overflow-hidden rounded-sm border border-ink/10 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-ink/10 bg-cream/60 text-[10.5px] uppercase tracking-[0.12em] text-ink-muted">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Réf.</th>
                  <th className="px-4 py-3 font-semibold">Contributeur</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 text-right font-semibold">Montant</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Tirage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/6 text-[13px]">
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-ink-muted">
                      Aucune contribution pour ces critères.
                    </td>
                  </tr>
                )}
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-cream/40">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                      {dateTimeFormatter.format(row.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-ink-soft">
                      {referenceCode(row.id)}
                    </td>
                    <td className="px-4 py-3">
                      {row.isAnonymous ? (
                        <span className="inline-flex items-center gap-1.5 text-ink-soft">
                          <span className="rounded bg-ink/8 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-muted">
                            Anonyme
                          </span>
                          #{row.id.slice(-5).toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-ink">
                          {[row.firstName, row.lastName].filter(Boolean).join(" ") || "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{row.contact}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-ink">
                      {formatFcfa(row.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          STATUS_STYLES[row.status] ?? "bg-ink/8 text-ink-muted"
                        }`}
                      >
                        {STATUS_LABELS[row.status] ?? row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {row.isWinner ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand/20 px-2.5 py-1 text-[11px] font-semibold text-[#D65C17]">
                          Gagnant · {row.winnerRank}
                        </span>
                      ) : (
                        <span className="text-ink-muted/60">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-4 py-3 text-[12.5px] text-ink-muted">
            <p>
              Page {page} / {totalPages} · {formatNumber(PAGE_SIZE)} par page
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={`/admin${filtersToQuery(filters)}${
                    filtersToQuery(filters) ? "&" : "?"
                  }page=${page - 1}`}
                  className="rounded-full border border-ink/15 px-3.5 py-1.5 text-ink-soft hover:border-ink/35"
                >
                  Précédent
                </Link>
              ) : (
                <span className="rounded-full border border-ink/8 px-3.5 py-1.5 text-ink-muted/50">
                  Précédent
                </span>
              )}
              {page < totalPages ? (
                <Link
                  href={`/admin${filtersToQuery(filters)}${
                    filtersToQuery(filters) ? "&" : "?"
                  }page=${page + 1}`}
                  className="rounded-full border border-ink/15 px-3.5 py-1.5 text-ink-soft hover:border-ink/35"
                >
                  Suivant
                </Link>
              ) : (
                <span className="rounded-full border border-ink/8 px-3.5 py-1.5 text-ink-muted/50">
                  Suivant
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[11.5px] leading-5 text-ink-muted">
          Répartition prévue : {formatFcfa(PRIZE_BUDGET)} de gains ·{" "}
          {formatFcfa(STARTUP_BUDGET)} pour la start-up. Le tirage est
          définitif : une seule session peut exister en base.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { PublicStats } from "@/lib/stats";
import { EXPERIENCE, PRIZE_BUDGET } from "@/lib/config";
import { formatFcfa, formatNumber, formatPercent } from "@/lib/format";

export function StatsBand({ initial }: { initial: PublicStats }) {
  const [stats, setStats] = useState<PublicStats>(initial);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setGrown(true), 150);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const response = await fetch("/api/stats", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as PublicStats;
        if (!cancelled) setStats(data);
      } catch {
        /* on garde les chiffres affichés */
      }
    }

    const interval = window.setInterval(refresh, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const ratio = stats.totalAmount / stats.goalAmount;

  return (
    <section className="border-b border-line bg-sand/60">
      <div className="container-page py-10">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-baseline justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
            <span>Objectif {formatFcfa(stats.goalAmount)}</span>
            <span className="font-semibold text-brand">{formatPercent(ratio)}</span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full border border-line bg-white"
            role="progressbar"
            aria-valuenow={Math.round(Math.min(ratio, 1) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression de la collecte"
          >
            <div
              className="h-full bg-brand transition-[width] duration-[1200ms] ease-out"
              style={{ width: grown ? `${Math.min(Math.max(ratio, 0.006), 1) * 100}%` : "0%" }}
            />
          </div>
        </div>

        <dl className="mt-9 grid gap-8 text-center sm:grid-cols-3 sm:divide-x sm:divide-line">
          <div className="px-4">
            <dd className="font-display text-[2rem] font-bold leading-none text-brand sm:text-[2.4rem]">
              {formatNumber(stats.totalAmount)}
              <span className="ml-1.5 align-middle text-[13px] font-semibold text-brand/80">FCFA</span>
            </dd>
            <dt className="mt-2 text-[12px] uppercase tracking-[0.1em] text-ink-muted">
              collectés sur {formatNumber(EXPERIENCE.goalAmount)}
            </dt>
          </div>
          <div className="px-4">
            <dd className="font-display text-[2rem] font-bold leading-none text-brand sm:text-[2.4rem]">
              {formatNumber(stats.contributorCount)}
            </dd>
            <dt className="mt-2 text-[12px] uppercase tracking-[0.1em] text-ink-muted">
              contributeurs sur {formatNumber(EXPERIENCE.goalContributors)}
            </dt>
          </div>
          <div className="px-4">
            <dd className="font-display text-[2rem] font-bold leading-none text-brand sm:text-[2.4rem]">
              {formatNumber(PRIZE_BUDGET)}
              <span className="ml-1.5 align-middle text-[13px] font-semibold text-brand/80">FCFA</span>
            </dd>
            <dt className="mt-2 text-[12px] uppercase tracking-[0.1em] text-ink-muted">
              redistribués en {EXPERIENCE.prizeCount} gains
            </dt>
          </div>
        </dl>
      </div>
    </section>
  );
}

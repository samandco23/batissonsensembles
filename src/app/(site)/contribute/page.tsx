import type { Metadata } from "next";
import Link from "next/link";
import { ContributionForm } from "@/components/contribution-form";
import {
  DRAW_DATE_LABEL,
  EXPERIENCE,
  PRIZE_BUDGET,
  STARTUP_BUDGET,
} from "@/lib/config";
import { formatFcfa } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contribuer — 100 FCFA minimum",
  description:
    "Contribuez à Bâtissons Ensemble par MTN MoMo ou Orange Money. Don minimum 100 FCFA, anonymat possible, éligibilité automatique au tirage.",
};

const GUARANTEES = [
  {
    title: "Aucun nom affiché sans votre accord",
    body: "Les contributeurs anonymes apparaissent uniquement sous un identifiant interne.",
  },
  {
    title: "Éligibilité automatique au tirage",
    body: `Chaque contribution confirmée participe au tirage du ${DRAW_DATE_LABEL}.`,
  },
  {
    title: "Paiement direct, sans intermédiaire",
    body: "Le paiement est traité par Fapshi, sur votre téléphone, en Mobile Money.",
  },
];

export default function ContributePage() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-dots opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />

      <div className="container-page relative py-12 lg:py-16">
        <nav aria-label="Fil d'ariane" className="text-[12.5px] text-ink-muted">
          <Link href="/" className="hover:text-brand">
            Accueil
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-ink">Contribuer</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Colonne gauche */}
          <div>
            <p className="eyebrow">
              <span className="inline-block h-px w-8 bg-brand/30" aria-hidden="true" />
              Votre contribution
            </p>
            <h1 className="display-lg mt-4 text-balance">
              100 FCFA pour bâtir ensemble.
            </h1>
            <p className="mt-4 max-w-lg text-pretty text-[15.5px] leading-7 text-ink-soft">
              Votre contribution vous inscrit au tirage et finance le lancement
              d&apos;une start-up tech. Elle est comptabilisée dès que le
              paiement Mobile Money est confirmé.
            </p>

            <div className="mt-8 rounded-sm border border-ink/10 bg-white/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Ce que finance 1 000 000 FCFA
              </p>
              <dl className="mt-4 space-y-3 text-[13.5px]">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-soft">
                    Gains — {EXPERIENCE.prizeCount} × {formatFcfa(EXPERIENCE.prizeAmount)}
                  </dt>
                  <dd className="font-semibold text-ink">{formatFcfa(PRIZE_BUDGET)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-soft">Lancement de la start-up</dt>
                  <dd className="font-semibold text-ink">{formatFcfa(STARTUP_BUDGET)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-3">
                  <dt className="text-ink-soft">
                    {EXPERIENCE.jobsTarget} emplois visés
                  </dt>
                  <dd className="font-semibold text-ink">
                    {EXPERIENCE.jobsMonths} mois
                  </dd>
                </div>
              </dl>
            </div>

            <ul className="mt-8 space-y-4">
              {GUARANTEES.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="9" r="8.2" stroke="#F2762E" strokeOpacity="0.3" />
                    <path
                      d="M5.4 9.2l2.4 2.4 4.8-5"
                      stroke="#F2762E"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-[13px] leading-6 text-ink-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[12.5px] leading-6 text-ink-muted">
              Le tirage ne peut avoir lieu qu&apos;une seule fois et ne concerne
              que les contributions confirmées.{" "}
              <Link href="/reglement" className="text-leaf underline underline-offset-2">
                Lire le règlement complet
              </Link>
              .
            </p>
          </div>

          {/* Colonne droite : formulaire */}
          <div className="lg:pt-6">
            <div className="rounded-sm border border-ink/10 bg-white p-6 shadow-lift sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="font-display text-2xl text-ink">Je contribue</h2>
                <span className="badge">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                  Mobile Money
                </span>
              </div>
              <ContributionForm />
            </div>

            <p className="mt-4 px-2 text-center text-[11.5px] leading-5 text-ink-muted">
              Vous serez redirigé vers la page de paiement hébergée par Fapshi
              pour finaliser votre contribution en toute sécurité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

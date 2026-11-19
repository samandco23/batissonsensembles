import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StatsBand } from "@/components/stats-band";
import { getPublicStats } from "@/lib/stats";
import {
  DRAW_DATE_LABEL,
  EXPERIENCE,
  PRIZE_BUDGET,
  STARTUP_BUDGET,
} from "@/lib/config";
import { formatFcfa } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Une contribution à la fois — bâtissons ensemble",
  description:
    "Participez à partir de 100 FCFA au lancement d’un projet tech camerounais. Objectif, règlement et résultats publiés.",
};

const STEPS = [
  { title: "Choisissez un montant", body: "À partir de 100 FCFA." },
  { title: "Payez par Mobile Money", body: "MTN MoMo ou Orange Money." },
  { title: "Suivez le projet", body: "Les résultats seront publiés ici." },
];

const FAQ = [
  {
    q: "À quoi sert l’objectif ?",
    a: `${formatFcfa(STARTUP_BUDGET)} sont prévus pour le lancement du projet et ${formatFcfa(PRIZE_BUDGET)} pour les 5 gains. Les modalités figurent dans le règlement.`,
  },
  {
    q: "Mon nom sera-t-il affiché ?",
    a: "Non. Vous pouvez contribuer anonymement. Vos coordonnées restent privées et servent à vous contacter si vous gagnez.",
  },
  {
    q: "Quand aura lieu le tirage ?",
    a: `La date prévue est le ${DRAW_DATE_LABEL}. Consultez le règlement pour connaître les conditions.`,
  },
];

export default async function HomePage() {
  const stats = await getPublicStats();

  return (
    <>
      <section className="bg-cream">
        <div className="grid min-h-[560px] lg:min-h-[620px] lg:grid-cols-[1.03fr_0.97fr]">
          <div className="container-page flex flex-col justify-center py-14 sm:py-20 lg:py-20 lg:pl-[max(2rem,calc((100vw-1200px)/2))] lg:pr-12">
            <p className="eyebrow">Une initiative collective au Cameroun</p>
            <h1 className="display-xl mt-4 max-w-[680px] text-balance">
              Une contribution à la fois. Un projet tech à bâtir ensemble.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-7 text-ink-soft sm:text-base">
              Participez à partir de 100 FCFA au lancement d’une start-up numérique.
              Les montants et les règles sont publics.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/contribute" className="btn-primary px-6 py-3.5 text-sm">
                Contribuer dès 100 FCFA <span aria-hidden="true">→</span>
              </Link>
              <Link href="#projet" className="font-semibold text-ink underline decoration-brand underline-offset-4 hover:text-brand-dark">
                Comprendre le projet
              </Link>
            </div>
            <p className="mt-6 text-[12.5px] text-ink-muted">
              Mobile Money <span aria-hidden="true">·</span> Anonymat possible{" "}
              <span aria-hidden="true">·</span> Règlement public
            </p>
          </div>

          <div className="relative min-h-[300px] overflow-hidden sm:min-h-[400px] lg:min-h-full">
            <Image
              src="/images/hero-tech.jpg"
              alt="Visuel d’illustration autour du travail numérique"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-x-5 inset-y-5 rounded-t-full border-[5px] border-brand sm:inset-x-8 sm:inset-y-8 sm:border-[7px]" aria-hidden="true" />
            <span className="absolute bottom-5 left-5 bg-white px-4 py-2 text-xs font-semibold text-ink shadow-card sm:bottom-8 sm:left-8">
              Visuel d’illustration
            </span>
          </div>
        </div>
      </section>

      <StatsBand initial={stats} />

      <section id="projet" className="scroll-mt-24 bg-white">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <div>
            <p className="eyebrow">Le projet</p>
            <h2 className="display-lg mt-3 text-balance">Un objectif clair, une répartition annoncée.</h2>
            <p className="mt-4 max-w-lg text-[14px] leading-7 text-ink-muted">
              Si l’objectif est atteint, les fonds sont répartis comme indiqué dans le règlement.
            </p>
            <Link href="/reglement" className="btn-outline mt-6 px-5 py-2.5">
              Lire le règlement
            </Link>
          </div>

          <div className="border-y border-line">
            <div className="flex flex-wrap items-end justify-between gap-3 py-6">
              <div>
                <p className="text-sm font-semibold text-ink">Lancement du projet tech</p>
                <p className="mt-1 text-xs text-ink-muted">Développement et démarrage</p>
              </div>
              <p className="font-display text-2xl font-bold text-ink">{formatFcfa(STARTUP_BUDGET)}</p>
            </div>
            <div className="h-2 overflow-hidden bg-sand" aria-hidden="true">
              <div className="h-full w-1/2 bg-brand" />
            </div>
            <div className="flex flex-wrap items-end justify-between gap-3 py-6">
              <div>
                <p className="text-sm font-semibold text-ink">5 gains prévus</p>
                <p className="mt-1 text-xs text-ink-muted">{EXPERIENCE.prizeCount} × {formatFcfa(EXPERIENCE.prizeAmount)}</p>
              </div>
              <p className="font-display text-2xl font-bold text-ink">{formatFcfa(PRIZE_BUDGET)}</p>
            </div>
            <div className="h-2 overflow-hidden bg-sand" aria-hidden="true">
              <div className="h-full w-1/2 bg-ink" />
            </div>
            <p className="py-3 text-right text-[11px] text-ink-muted">
              Objectif total · {formatFcfa(EXPERIENCE.goalAmount)}
            </p>
          </div>
        </div>
      </section>

      <section id="comment" className="scroll-mt-24 bg-sand/55">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">En trois étapes</p>
              <h2 className="display-lg mt-3">Simple et transparent.</h2>
            </div>
            <Link href="/contribute" className="font-semibold text-brand-dark underline underline-offset-4">
              Participer <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ol className="mt-8 grid gap-0 divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex items-start gap-4 py-5 md:px-6 md:first:pl-0 md:last:pr-0">
                <span className="font-display text-2xl font-bold text-brand">0{index + 1}</span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-[13px] text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow">Questions fréquentes</p>
            <h2 className="display-lg mt-3">L’essentiel, simplement.</h2>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink marker:hidden">
                  {item.q}
                  <span className="text-lg font-normal text-brand transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pt-3 pr-8 text-[13px] leading-6 text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-page flex flex-col gap-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div>
            <h2 className="font-display text-2xl font-semibold">Participez à votre mesure.</h2>
            <p className="mt-2 text-sm text-white/70">Dès {formatFcfa(EXPERIENCE.minContribution)}.</p>
          </div>
          <Link href="/contribute" className="btn-primary w-full px-6 py-3 sm:w-auto">
            Contribuer <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

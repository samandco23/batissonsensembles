import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StatsBand } from "@/components/stats-band";
import { ContributionForm } from "@/components/contribution-form";
import { getPublicStats } from "@/lib/stats";
import {
  DRAW_DATE_LABEL,
  EXPERIENCE,
  PRIZE_BUDGET,
  SITE,
  STARTUP_BUDGET,
} from "@/lib/config";
import { formatFcfa, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "10 000 personnes, 100 FCFA chacune — une start-up tech",
  description:
    "Bâtissons Ensemble : une expérience sociale ouverte à tous. 100 FCFA minimum, 5 gains de 100 000 FCFA, et 500 000 FCFA pour lancer une start-up tech qui créera 10 emplois.",
};

const PILLARS = [
  {
    title: "100 FCFA, pas plus",
    body: "Le don minimum tient dans une poche. La force vient du nombre, pas du montant.",
    icon: (
      <path
        d="M12 3v18M8 7.5h6.2a2.8 2.8 0 010 5.6H9.6a2.9 2.9 0 000 5.8H16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "5 × 100 000 FCFA",
    body: "Cinq contributeurs tirés au sort reçoivent 100 000 FCFA chacun, par Mobile Money.",
    icon: (
      <>
        <path d="M4 10.5h16v9H4z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 6.5h18v4H3zM12 6.5V19.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 6.5C10.5 3.6 7 3 7 5.2c0 1.3 2 1.3 5 1.3zm0 0c1.5-2.9 5-3.5 5-1.3 0 1.3-2 1.3-5 1.3z" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  {
    title: "10 emplois en 6 mois",
    body: "500 000 FCFA financent le lancement de la start-up et ses premiers recrutements.",
    icon: (
      <>
        <path d="M4 9h16v10H4z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 9V6.5h6V9M4 13.5h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Transparence totale",
    body: "Compteur public, règlement public, résultats publics. Aucune zone d'ombre.",
    icon: (
      <>
        <path d="M12 3l7 3v5.5c0 4.2-2.9 7.4-7 8.5-4.1-1.1-7-4.3-7-8.5V6l7-3z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8.8 12l2.2 2.2 4.2-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

const STEPS = [
  {
    title: "Vous contribuez",
    body: "100 FCFA minimum par Mobile Money. Vous pouvez rester anonyme : votre nom n'est jamais affiché.",
    image: "/images/pay.jpg",
    alt: "Paiement Mobile Money sur un téléphone",
  },
  {
    title: "Le tirage désigne 5 gagnants",
    body: "Tirage aléatoire cryptographique, effectué une seule fois parmi les contributions confirmées.",
    image: "/images/progress.jpg",
    alt: "Courbe de progression d'un projet",
  },
  {
    title: "La start-up démarre",
    body: "500 000 FCFA financent le lancement et 10 emplois dans le numérique en 6 mois.",
    image: "/images/devs.jpg",
    alt: "Deux développeurs au travail",
  },
];

const MILESTONES = [
  {
    date: DRAW_DATE_LABEL,
    title: "Tirage au sort",
    body: "5 gains de 100 000 FCFA tirés parmi les contributions confirmées.",
    image: "/images/team.jpg",
    alt: "Une équipe réunie autour de son projet",
    position: "object-center",
  },
  {
    date: "Sous 7 jours",
    title: "Publication des résultats",
    body: "Les gagnants sont publiés et contactés par Mobile Money.",
    image: "/images/progress.jpg",
    alt: "Courbe de progression d'un projet",
    position: "object-top",
  },
  {
    date: "2027",
    title: "Lancement de la start-up",
    body: `500 000 FCFA pour le produit et ${EXPERIENCE.jobsTarget} emplois visés en ${EXPERIENCE.jobsMonths} mois.`,
    image: "/images/devs.jpg",
    alt: "Équipe de développement",
    position: "object-[center_30%]",
  },
];

const FAQ = [
  {
    q: "Ma contribution est-elle vraiment anonyme ?",
    a: "Oui, côté public. Si vous cochez l'option, votre nom n'est ni collecté ni affiché : vous apparaissez comme « Contributeur Anonyme » suivi d'un identifiant. Votre email ou téléphone reste privé, uniquement pour vous contacter si vous gagnez.",
  },
  {
    q: "Comment sont versés les gains ?",
    a: `Les ${EXPERIENCE.prizeCount} gagnants sont contactés dans les 7 jours suivant le tirage, puis payés par Mobile Money après vérification de leur identité.`,
  },
  {
    q: "Que se passe-t-il si l'objectif n'est pas atteint ?",
    a: `Si la collecte est inférieure à ${formatFcfa(PRIZE_BUDGET)} à la date du tirage, celui-ci est reporté. Chaque contributeur peut demander un remboursement jusqu'à 7 jours avant le tirage.`,
  },
  {
    q: "Puis-je contribuer plusieurs fois ?",
    a: "Oui. Chaque contribution confirmée compte comme une participation distincte au tirage, dans la limite prévue par le règlement.",
  },
];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.12" />
      <path d="M5.8 10.2l2.7 2.7 5.7-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function HomePage() {
  const stats = await getPublicStats();

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Image
          src="/images/hero-tech.jpg"
          alt="Des mains qui travaillent sur un ordinateur portable"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55 grayscale-[35%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 to-ink/30"
          aria-hidden="true"
        />
        <div className="container-page relative py-20 lg:py-28">
          <p className="eyebrow text-[#FFC29C]">Expérience sociale · ouverte à tous</p>
          <h1 className="display-xl mt-4 max-w-2xl text-balance text-white">
            Tendons la main
            <br className="hidden sm:block" /> pour bâtir ensemble.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-[14.5px] leading-7 text-white/80 sm:text-[15.5px]">
            10 000 personnes, 100 FCFA chacune, une start-up tech qui créera{" "}
            {EXPERIENCE.jobsTarget} emplois dans le numérique en{" "}
            {EXPERIENCE.jobsMonths} mois. Une expérience collective, à visage
            découvert, avec un règlement public.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/contribute" className="btn-primary px-7 py-3.5 text-[14px]">
              Je contribue maintenant
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/reglement" className="btn-light px-7 py-3.5 text-[14px]">
              Lire le règlement
            </Link>
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white/60">
            <span>Don minimum {EXPERIENCE.minContribution} FCFA</span>
            <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden="true" />
            <span>MTN MoMo & Orange Money</span>
            <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden="true" />
            <span>Anonymat possible</span>
          </p>
        </div>
      </section>

      <StatsBand initial={stats} />

      {/* NOTRE OBJECTIF */}
      <section id="projet" className="scroll-mt-28 bg-white">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="relative">
            <div
              className="absolute -left-3 -top-3 hidden h-full w-full border-2 border-brand sm:block"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden bg-sand">
              <Image
                src="/images/about-team.jpg"
                alt="Une équipe de start-up au travail"
                width={760}
                height={900}
                className="h-[360px] w-full object-cover sm:h-[460px]"
              />
            </div>
            <div
              className="absolute -bottom-5 -left-5 hidden h-28 w-28 bg-dots opacity-80 sm:block"
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="eyebrow">Notre objectif</p>
            <h2 className="display-lg mt-3 text-balance">
              Notre objectif : créer des emplois dans le numérique.
            </h2>
            <p className="mt-5 text-[14.5px] leading-7 text-ink-soft">
              Bâtissons Ensemble n&apos;est pas une cagnotte anonyme. C&apos;est
              une expérience à ciel ouvert : chaque contribution est comptée,
              chaque franc a une destination annoncée, et le tirage est encadré
              par un règlement public.
            </p>

            <ul className="mt-7 space-y-5">
              <li className="flex gap-3">
                <Check className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <p className="text-[14px] font-semibold text-ink">
                    Un lancement réellement financé
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-ink-muted">
                    {formatFcfa(STARTUP_BUDGET)} financent le développement
                    produit et les {EXPERIENCE.jobsTarget} premiers emplois.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <p className="text-[14px] font-semibold text-ink">
                    Une redistribution annoncée d&apos;avance
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-ink-muted">
                    {EXPERIENCE.prizeCount} contributeurs tirés au sort reçoivent{" "}
                    {formatFcfa(EXPERIENCE.prizeAmount)} chacun, soit{" "}
                    {formatFcfa(PRIZE_BUDGET)}.
                  </p>
                </div>
              </li>
            </ul>

            <p className="mt-7 border-t border-line pt-5 font-display text-[15px] italic text-ink-muted">
              « Ce n&apos;est pas un don. C&apos;est une construction. »
            </p>

            <Link href="/reglement" className="btn-outline mt-6 px-6 py-3">
              Découvrir le règlement
            </Link>
          </div>
        </div>
      </section>

      {/* PILIERS */}
      <section className="border-y border-line bg-sand/50">
        <div className="container-page py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Bienvenue dans l&apos;expérience</p>
            <h2 className="display-lg mt-3 text-balance">Quatre raisons de participer</h2>
            <p className="mt-4 text-[14px] leading-7 text-ink-muted">
              Un petit geste individuel, multiplié par {formatNumber(EXPERIENCE.goalContributors)}{" "}
              personnes, devient un projet collectif.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="group border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    {pillar.icon}
                  </svg>
                </span>
                <h3 className="mt-5 font-display text-[16px] font-semibold text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-ink-muted">{pillar.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/contribute" className="btn-primary px-7 py-3.5">
              Rejoindre l&apos;expérience
            </Link>
          </div>
        </div>
      </section>

      {/* BANDE SOURIRE */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="order-2 flex items-center lg:order-1">
            <div className="relative w-full px-5 py-14 sm:px-10 lg:px-14 lg:py-20">
              <div className="absolute left-0 top-6 hidden h-24 w-24 bg-dots opacity-70 lg:block" aria-hidden="true" />
              <div className="relative max-w-lg lg:ml-auto">
                <p className="eyebrow">Bâtir, concrètement</p>
                <h2 className="display-lg mt-3 text-balance">
                  Soyons la raison du sourire d&apos;une nouvelle génération.
                </h2>
                <p className="mt-5 text-[14.5px] leading-7 text-ink-soft">
                  Derrière chaque contribution, il y a un emploi possible, une
                  compétence transmise, une trajectoire qui change. C&apos;est
                  exactement ce que nous testons ensemble.
                </p>
                <Link href="/contribute" className="btn-primary mt-7 px-6 py-3">
                  Contribuer à l&apos;expérience
                </Link>
              </div>
            </div>
          </div>
          <div className="order-1 h-[300px] lg:order-2 lg:h-auto">
            <Image
              src="/images/portrait.jpg"
              alt="Une jeune femme souriante"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment" className="scroll-mt-28 bg-sand/50">
        <div className="container-page py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Comment ça marche</p>
            <h2 className="display-lg mt-3 text-balance">Trois étapes, aucune zone d&apos;ombre</h2>
          </div>

          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border border-line bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-[14px] font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted/70">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[17px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] text-ink-muted">
            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-brand" /> Paiement confirmé par Fapshi
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-brand" /> Aucun nom affiché sans accord
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-brand" /> Tirage aléatoire cryptographique
            </span>
          </div>
        </div>
      </section>

      {/* CALENDRIER */}
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Le calendrier</p>
            <h2 className="display-lg mt-3 text-balance">Les prochaines étapes</h2>
            <p className="mt-4 text-[14px] leading-7 text-ink-muted">
              Tout est annoncé à l&apos;avance : la date du tirage, le mode de
              désignation des gagnants et l&apos;affectation des fonds.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {MILESTONES.map((item) => (
              <article key={item.title} className="group overflow-hidden border border-line bg-white">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={800}
                    height={600}
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] ${item.position}`}
                  />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                    {item.date}
                  </p>
                  <h3 className="mt-2 font-display text-[17px] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-ink-muted">{item.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/reglement" className="btn-outline px-7 py-3.5">
              Voir le règlement complet
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-line bg-sand/50">
        <div className="container-page py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Questions fréquentes</p>
            <h2 className="display-lg mt-3 text-balance">Ce qu&apos;il faut savoir avant de contribuer</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {FAQ.map((item) => (
              <article key={item.q} className="border border-line bg-white p-6">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-brand/30">
                  <path d="M7 6h6.5a3.5 3.5 0 010 7H10l-3 4V6z" fill="currentColor" />
                </svg>
                <h3 className="mt-3 font-display text-[15.5px] font-semibold text-ink">{item.q}</h3>
                <p className="mt-2 text-[13px] leading-6 text-ink-muted">{item.a}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-[12.5px] text-ink-muted">
            Une question plus précise ?{" "}
            <Link href="/reglement" className="font-medium text-brand underline underline-offset-2">
              Le règlement complet
            </Link>{" "}
            ou{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="font-medium text-brand underline underline-offset-2">
              écrivez-nous
            </a>
            .
          </p>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section id="contribuer" className="relative isolate overflow-hidden bg-ink">
        <Image
          src="/images/team.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/85 to-ink/60" aria-hidden="true" />

        <div className="container-page relative grid gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14 lg:py-20">
          <div className="border border-line bg-white p-6 shadow-lift sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-4">
              <h2 className="font-display text-xl font-semibold text-ink">Faire une contribution</h2>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">
                Mobile Money
              </span>
            </div>
            <ContributionForm />
          </div>

          <div className="text-white">
            <p className="eyebrow text-[#FFC29C]">Contribuer</p>
            <h2 className="display-lg mt-3 text-balance text-white">
              Votre contribution peut changer une trajectoire.
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-7 text-white/70">
              Chaque contribution de 100 FCFA rejoint un objectif commun de{" "}
              {formatFcfa(EXPERIENCE.goalAmount)}. Le compteur est public, les
              gagnants sont annoncés, et les fonds financent une start-up réelle.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                "Paiement sécurisé par Fapshi (MTN MoMo, Orange Money)",
                "Éligible au tirage dès la confirmation du paiement",
                "Remboursement possible jusqu'à 7 jours avant le tirage",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] leading-6 text-white/80">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
                    <circle cx="10" cy="10" r="9" stroke="#F2762E" strokeWidth="1.4" />
                    <path d="M6 10.2l2.6 2.6L14 6.8" stroke="#F2762E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-7 text-[11.5px] leading-5 text-white/45">
              L&apos;expérience est portée par {SITE.organizer}. Contribution
              minimum {formatFcfa(EXPERIENCE.minContribution)}. Le tirage ne peut
              avoir lieu qu&apos;une seule fois.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

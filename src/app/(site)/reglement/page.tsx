import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import {
  DRAW_DATE_LABEL,
  EXPERIENCE,
  PRIZE_BUDGET,
  STARTUP_BUDGET,
} from "@/lib/config";
import { formatFcfa, formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Règlement du tirage au sort",
  description:
    "Règlement complet de l'expérience sociale Bâtissons Ensemble et de son tirage au sort : participation, éligibilité, dotations, modalités de tirage et de versement.",
};

const SECTIONS = [
  { id: "organisateur", title: "1. Organisateur" },
  { id: "objet", title: "2. Objet de l'expérience" },
  { id: "participation", title: "3. Participation" },
  { id: "eligibilite", title: "4. Éligibilité au tirage" },
  { id: "dotations", title: "5. Dotations" },
  { id: "tirage", title: "6. Modalités du tirage" },
  { id: "versement", title: "7. Annonce et versement des gains" },
  { id: "fonds", title: "8. Affectation des fonds" },
  { id: "report", title: "9. Report, remboursement, annulation" },
  { id: "donnees", title: "10. Données personnelles" },
  { id: "fraude", title: "11. Fraude et tricherie" },
  { id: "droit", title: "12. Droit applicable et réclamations" },
];

export default function ReglementPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Fil d'ariane" className="text-[12.5px] text-ink-muted">
          <Link href="/" className="hover:text-brand">
            Accueil
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-ink">Règlement</span>
        </nav>

        <header className="mt-8 border-b border-ink/10 pb-8">
          <p className="eyebrow">
            <span className="inline-block h-px w-8 bg-brand/30" aria-hidden="true" />
            Document public
          </p>
          <h1 className="display-lg mt-4 max-w-3xl text-balance">
            Règlement du tirage au sort
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-ink-soft">
            Ce règlement encadre l&apos;expérience sociale « Bâtissons Ensemble »
            et le tirage au sort qui lui est associé. Il est public, consultable
            avant toute contribution, et applicable dès l&apos;ouverture du site.
          </p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[12.5px]">
            <div>
              <dt className="text-ink-muted">Version</dt>
              <dd className="font-semibold text-ink">1.0 — en vigueur</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Date du tirage</dt>
              <dd className="font-semibold text-ink">{DRAW_DATE_LABEL}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Dotations</dt>
              <dd className="font-semibold text-ink">
                {formatFcfa(PRIZE_BUDGET)} ({EXPERIENCE.prizeCount} ×{" "}
                {formatFcfa(EXPERIENCE.prizeAmount)})
              </dd>
            </div>
          </dl>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Sommaire
              </p>
              <nav aria-label="Sommaire du règlement" className="mt-3 space-y-2">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-[12.5px] leading-5 text-ink-muted transition hover:text-brand"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="prose-legal max-w-none">
            <h2 id="organisateur" className="scroll-mt-24">
              1. Organisateur
            </h2>
            <p>
              L&apos;expérience sociale « Bâtissons Ensemble » et le tirage au
              sort associé sont organisés par <strong>{LEGAL.entity}</strong>,{" "}
              {LEGAL.form}, dont le siège est situé à {LEGAL.address}. Les
              coordonnées de contact sont :{" "}
              <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
            </p>
            <p>
              L&apos;organisateur agit en qualité d&apos;organisateur de
              l&apos;expérience et de responsable du traitement des données
              personnelles collectées dans ce cadre.
            </p>

            <h2 id="objet" className="scroll-mt-24">
              2. Objet de l&apos;expérience
            </h2>
            <p>
              L&apos;expérience consiste à vérifier si {formatNumber(EXPERIENCE.goalContributors)}{" "}
              personnes peuvent se mobiliser ensemble, chacune par une
              contribution minimum de {formatFcfa(EXPERIENCE.minContribution)},
              pour atteindre un objectif collectif de{" "}
              {formatFcfa(EXPERIENCE.goalAmount)}. Ce montant est destiné à :
            </p>
            <ul>
              <li>
                récompenser {EXPERIENCE.prizeCount} contributeurs par un gain de{" "}
                {formatFcfa(EXPERIENCE.prizeAmount)} chacun, soit{" "}
                {formatFcfa(PRIZE_BUDGET)} ;
              </li>
              <li>
                financer le lancement d&apos;une start-up technologique à hauteur de{" "}
                {formatFcfa(STARTUP_BUDGET)}, avec pour objectif la création de{" "}
                {EXPERIENCE.jobsTarget} emplois dans le numérique en{" "}
                {EXPERIENCE.jobsMonths} mois.
              </li>
            </ul>
            <p>
              La participation à l&apos;expérience est ouverte à toute personne
              physique remplissant les conditions de l&apos;article 3. Elle
              emporte adhésion pleine et entière au présent règlement.
            </p>

            <h2 id="participation" className="scroll-mt-24">
              3. Participation
            </h2>
            <h3>3.1 Conditions</h3>
            <ul>
              <li>Être âgé de 18 ans révolus à la date de la contribution.</li>
              <li>
                Disposer d&apos;un compte Mobile Money actif (MTN MoMo ou Orange
                Money) ou contribuer depuis un numéro permettant le paiement.
              </li>
              <li>
                Fournir une adresse email ou un numéro de téléphone valide,
                indispensable pour l&apos;identification et la remise des gains.
              </li>
            </ul>

            <h3>3.2 Montant</h3>
            <p>
              La contribution minimale est de{" "}
              {formatFcfa(EXPERIENCE.minContribution)}. Il est possible de
              contribuer plusieurs fois et pour un montant supérieur, dans la
              limite de {formatFcfa(EXPERIENCE.maxContribution)} par transaction.
              Chaque contribution confirmée constitue une participation distincte
              au tirage.
            </p>

            <h3>3.3 Modalités de paiement</h3>
            <p>
              Les paiements sont traités par notre prestataire de paiement
              Mobile Money. Une contribution est réputée reçue uniquement
              lorsque le prestataire confirme la transaction comme réussie. Une
              tentative interrompue, annulée ou échouée n&apos;est ni
              comptabilisée, ni éligible au tirage.
            </p>

            <h3>3.4 Anonymat</h3>
            <p>
              Le contributeur peut demander à rester anonyme au moment de sa
              contribution. Dans ce cas, son nom n&apos;est pas collecté et
              n&apos;apparaît jamais publiquement : il est identifié, en cas de
              gain, par un identifiant interne du type « Contributeur Anonyme
              #A1B2C ». La contribution demeure éligible au tirage. L&apos;email
              ou le numéro de téléphone reste enregistré de manière privée et
              exclusivement destiné à la gestion du tirage et à la remise du gain.
            </p>

            <h3>3.5 Absence de contrepartie</h3>
            <p>
              La contribution ne constitue ni un achat, ni une souscription, ni
              un placement. Elle ne donne droit à aucune part, aucun intérêt, ni
              aucune contrepartie financière autre que l&apos;éligibilité au
              tirage décrite ci-après.
            </p>

            <h2 id="eligibilite" className="scroll-mt-24">
              4. Éligibilité au tirage
            </h2>
            <p>
              Sont éligibles toutes les contributions enregistrées avec le statut
              « confirmée » avant la clôture des participations, soit le{" "}
              {DRAW_DATE_LABEL} à l&apos;heure du tirage. Les contributions en
              attente de confirmation, échouées, annulées ou remboursées sont
              exclues du tirage.
            </p>
            <p>
              Une même personne peut être tirée au sort une seule fois : si
              plusieurs de ses contributions sortent, seule la première est
              retenue et un nouveau tirage est effectué pour les places
              restantes.
            </p>

            <h2 id="dotations" className="scroll-mt-24">
              5. Dotations
            </h2>
            <p>
              Le tirage attribue {EXPERIENCE.prizeCount} gains d&apos;un montant
              unitaire de {formatFcfa(EXPERIENCE.prizeAmount)}, soit un total de{" "}
              {formatFcfa(PRIZE_BUDGET)}. Les gains ne sont ni échangeables, ni
              cessibles, ni remboursables en nature. Ils sont versés en francs
              CFA (XAF) par Mobile Money.
            </p>
            <p>
              Les éventuels frais de transaction liés au versement des gains sont
              supportés par l&apos;organisateur.
            </p>

            <h2 id="tirage" className="scroll-mt-24">
              6. Modalités du tirage
            </h2>
            <ul>
              <li>
                <strong>Date :</strong> le tirage est prévu le {DRAW_DATE_LABEL},
                heure d&apos;Afrique centrale. Toute modification de date est
                annoncée sur le site avant sa tenue.
              </li>
              <li>
                <strong>Méthode :</strong> la liste des contributions confirmées
                est mélangée à l&apos;aide d&apos;un générateur aléatoire
                cryptographique. Les {EXPERIENCE.prizeCount} premières
                contributions obtenues sont déclarées gagnantes.
              </li>
              <li>
                <strong>Unicité :</strong> le tirage ne peut être effectué
                qu&apos;une seule et unique fois. Cette contrainte est appliquée
                techniquement : une fois le tirage réalisé, la fonction est
                verrouillée définitivement.
              </li>
              <li>
                <strong>Publication :</strong> les résultats sont publiés sur la
                page « Résultats » du site, avec la date du tirage, le nombre de
                participants et l&apos;identifiant des gagnants.
              </li>
            </ul>
            <p>
              Le tirage n&apos;est pas un jeu de hasard payant au sens d&apos;une
              loterie commerciale : il s&apos;agit d&apos;une contrepartie
              symbolique destinée à remercier les participants d&apos;une
              expérience collective, et il est annoncé publiquement dès
              l&apos;ouverture du site.
            </p>

            <h2 id="versement" className="scroll-mt-24">
              7. Annonce et versement des gains
            </h2>
            <ul>
              <li>
                Les gagnants sont contactés par email ou téléphone, aux
                coordonnées fournies lors de la contribution, dans un délai de 7
                jours suivant le tirage.
              </li>
              <li>
                Le versement est effectué par Mobile Money dans un délai de 30
                jours après confirmation de l&apos;identité du gagnant et de ses
                coordonnées de paiement.
              </li>
              <li>
                Le gagnant peut être invité à fournir une pièce d&apos;identité
                et à confirmer le numéro Mobile Money bénéficiaire.
              </li>
              <li>
                Si un gagnant ne répond pas dans un délai de 30 jours après la
                première sollicitation, ou refuse le gain, son gain est
                définitivement perdu et n&apos;est pas réattribué.
              </li>
              <li>
                Les gains sont versés nets : aucun frais n&apos;est déduit du
                montant annoncé.
              </li>
            </ul>

            <h2 id="fonds" className="scroll-mt-24">
              8. Affectation des fonds
            </h2>
            <p>
              Sur les {formatFcfa(EXPERIENCE.goalAmount)} collectés,{" "}
              {formatFcfa(PRIZE_BUDGET)} sont affectés aux gains du tirage et{" "}
              {formatFcfa(STARTUP_BUDGET)} au lancement de la start-up
              technologique. Les frais techniques de collecte sont supportés par
              l&apos;organisateur et ne réduisent pas ces montants.
            </p>
            <p>
              L&apos;organisateur s&apos;engage à publier sur le site un point
              d&apos;avancement du projet (développement produit, recrutements,
              emplois créés) au moins tous les trois mois pendant la première
              année suivant le tirage.
            </p>

            <h2 id="report" className="scroll-mt-24">
              9. Report, remboursement, annulation
            </h2>
            <p>
              Si, à la date prévue, le montant total des contributions
              confirmées est inférieur à {formatFcfa(PRIZE_BUDGET)} — montant
              nécessaire au versement des {EXPERIENCE.prizeCount} gains — le
              tirage est reporté à une date ultérieure, annoncée sur le site au
              moins 7 jours à l&apos;avance.
            </p>
            <p>
              Jusqu&apos;à 7 jours avant la tenue effective du tirage, tout
              contributeur peut demander le remboursement intégral de sa
              contribution, en écrivant à{" "}
              <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>{" "}
              avec sa référence de contribution. Le remboursement est effectué
              par Mobile Money dans un délai de 30 jours, et la contribution est
              alors retirée du tirage.
            </p>
            <p>
              En cas d&apos;impossibilité d&apos;organiser le tirage (force
              majeure, obligation légale), l&apos;organisateur en informe les
              contributeurs et procède au remboursement des contributions sur
              demande, dans les mêmes conditions.
            </p>

            <h2 id="donnees" className="scroll-mt-24">
              10. Données personnelles
            </h2>
            <p>
              Les données collectées (nom si non anonyme, email ou téléphone,
              montant et statut de la contribution, identifiant de transaction)
              sont utilisées exclusivement pour : gérer la contribution,
              établir la liste des participants au tirage, contacter et payer les
              gagnants, produire des statistiques agrégées et anonymes, et
              satisfaire aux obligations comptables et légales.
            </p>
            <p>
              Elles ne sont ni vendues, ni louées, ni cédées à des fins
              commerciales. Elles sont conservées le temps nécessaire à ces
              finalités et, pour les pièces comptables, pendant la durée légale
              de conservation. Les prestataires techniques (hébergement, base de
              données, paiement) agissent en qualité de sous-traitants.
            </p>
            <p>
              Chaque personne dispose d&apos;un droit d&apos;accès, de
              rectification, d&apos;effacement et d&apos;opposition, exerçable à
              l&apos;adresse{" "}
              <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
              Les contributeurs anonymes ne peuvent être identifiés publiquement ;
              leurs coordonnées restent accessibles à l&apos;organisateur pour la
              seule gestion du tirage.
            </p>

            <h2 id="fraude" className="scroll-mt-24">
              11. Fraude et tricherie
            </h2>
            <p>
              Toute tentative de fraude, d&apos;automatisation abusive, de
              manipulation du tirage ou d&apos;usurpation d&apos;identité entraîne
              l&apos;exclusion immédiate du participant et l&apos;annulation de ses
              contributions, sans préjudice de poursuites. L&apos;organisateur
              peut demander les justificatifs nécessaires à la vérification
              d&apos;une contribution.
            </p>

            <h2 id="droit" className="scroll-mt-24">
              12. Droit applicable et réclamations
            </h2>
            <p>
              Le présent règlement est soumis au droit camerounais. Toute
              réclamation doit être adressée par écrit à{" "}
              <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>{" "}
              dans un délai de 30 jours suivant l&apos;événement concerné.
              L&apos;organisateur s&apos;engage à répondre dans un délai de 15
              jours ouvrés.
            </p>
            <p>
              L&apos;organisateur se réserve le droit de modifier le présent
              règlement avant le tirage, notamment pour corriger une erreur
              matérielle ou se conformer à une obligation légale. Toute
              modification est publiée sur cette page, avec sa date de mise à
              jour, et ne peut remettre en cause les droits acquis des
              participants déjà inscrits.
            </p>

            <div className="mt-12 rounded-sm border border-ink/12 bg-sand/40 p-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Besoin d&apos;une précision ?
              </p>
              <p className="mt-2 text-[14px] leading-6 text-ink-soft">
                Écrivez à{" "}
                <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>{" "}
                en précisant votre référence de contribution. Les{" "}
                <Link href="/mentions-legales">mentions légales</Link> détaillent
                l&apos;éditeur du site et l&apos;hébergement.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

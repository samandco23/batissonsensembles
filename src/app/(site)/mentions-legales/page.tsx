import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de Bâtissons Ensemble : éditeur du site, hébergement, données personnelles et propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Fil d'ariane" className="text-[12.5px] text-ink-muted">
          <Link href="/" className="hover:text-brand">
            Accueil
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-ink">Mentions légales</span>
        </nav>

        <header className="mt-8 border-b border-ink/10 pb-8">
          <p className="eyebrow">
            <span className="inline-block h-px w-8 bg-brand/30" aria-hidden="true" />
            Informations
          </p>
          <h1 className="display-lg mt-4">Mentions légales</h1>
          <p className="mt-4 text-[15px] leading-7 text-ink-soft">
            Informations relatives à l&apos;éditeur du site {SITE.name},{" "}
            accessible à l&apos;adresse {SITE.domain}, à son hébergement et au
            traitement des données personnelles.
          </p>
        </header>

        <article className="prose-legal mt-10">
          <h2>1. Éditeur du site</h2>
          <p>
            Le site {SITE.name} est édité par <strong>{LEGAL.entity}</strong>,{" "}
            {LEGAL.form}, dont le siège est situé à {LEGAL.address}.
          </p>
          <ul>
            <li>Immatriculation : {LEGAL.registration}</li>
            <li>
              Contact :{" "}
              <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
            </li>
            <li>Responsable de la publication : {LEGAL.publisher}</li>
          </ul>
          <p>
            L&apos;expérience sociale {SITE.name} et son tirage au sort sont
            encadrés par un{" "}
            <Link href="/reglement">règlement public</Link>, consultable avant
            toute contribution.
          </p>

          <h2>2. Hébergement</h2>
          <p>
            Le site est hébergé par <strong>{LEGAL.host.name}</strong>,{" "}
            {LEGAL.host.address} —{" "}
            <a href={LEGAL.host.url} target="_blank" rel="noopener noreferrer">
              {LEGAL.host.url}
            </a>
            .
          </p>
          <p>
            Les données sont stockées dans une base de données PostgreSQL opérée
            par <strong>{LEGAL.database.name}</strong> ({LEGAL.database.description}).
            Les paiements Mobile Money sont traités par{" "}
            <strong>{LEGAL.payment.name}</strong> ({LEGAL.payment.description}).
          </p>

          <h2>3. Objet du site</h2>
          <p>
            Le site présente une expérience sociale collective, permet d&apos;y
            contribuer par Mobile Money, publie les résultats du tirage au sort
            associé et informe sur l&apos;affectation des fonds collectés. Il ne
            propose aucun produit ou service payant : la contribution est un
            soutien volontaire et n&apos;ouvre droit à aucune contrepartie
            financière en dehors de l&apos;éligibilité au tirage décrite dans le
            règlement.
          </p>

          <h2>4. Données personnelles</h2>
          <p>
            Les données collectées lors d&apos;une contribution sont : le nom
            (facultatif, et jamais collecté en cas de contribution anonyme), une
            adresse email ou un numéro de téléphone, le montant et le statut de
            la contribution, ainsi que l&apos;identifiant de transaction fourni
            par le prestataire de paiement.
          </p>
          <p>
            Ces données sont utilisées uniquement pour gérer la contribution,
            établir la liste des participants, contacter et rémunérer les
            gagnants, et produire des statistiques agrégées anonymes. Elles ne
            sont ni vendues, ni cédées à des tiers à des fins commerciales.
          </p>
          <p>
            Les contributeurs anonymes ne sont jamais identifiés publiquement.
            Leurs coordonnées restent accessibles à l&apos;organisateur pour la
            seule gestion du tirage, conformément au{" "}
            <Link href="/reglement#donnees">règlement</Link>.
          </p>
          <p>
            Pour exercer un droit d&apos;accès, de rectification, d&apos;effacement
            ou d&apos;opposition, écrivez à{" "}
            <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> en
            précisant votre référence de contribution.
          </p>

          <h2>5. Cookies</h2>
          <p>
            Le site n&apos;utilise aucun cookie publicitaire ni traceur
            marketing. Seul un cookie technique de session est déposé lors de la
            connexion à l&apos;espace d&apos;administration, afin de maintenir la
            session ouverte. Il expire automatiquement à la déconnexion ou au
            bout de 8 heures.
          </p>

          <h2>6. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus du site (textes, identité visuelle,
            éléments graphiques, code) est protégé. Toute reproduction ou
            représentation, totale ou partielle, sans autorisation écrite de
            l&apos;éditeur est interdite, à l&apos;exception des citations courtes
            accompagnées d&apos;un lien vers la source.
          </p>

          <h2>7. Responsabilité</h2>
          <p>
            L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des
            informations publiées et la disponibilité du site. Il ne peut être
            tenu responsable des interruptions dues à des prestataires tiers
            (hébergement, opérateurs Mobile Money) ni des dommages résultant
            d&apos;une utilisation non conforme du site.
          </p>
          <p>
            Les montants affichés proviennent directement des paiements confirmés
            par le prestataire. En cas d&apos;écart constaté, écrivez à{" "}
            <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> :
            une correction est apportée après vérification.
          </p>

          <h2>8. Droit applicable</h2>
          <p>
            Le présent site et les relations entre l&apos;éditeur et les
            utilisateurs sont soumis au droit camerounais. Tout litige relève des
            juridictions compétentes de {LEGAL.address}, après tentative de
            résolution amiable.
          </p>
        </article>
      </div>
    </div>
  );
}

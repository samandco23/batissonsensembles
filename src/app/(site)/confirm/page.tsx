import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { syncContribution } from "@/lib/payments";
import { RefreshStatus } from "@/components/refresh-status";
import { ShareButtons } from "@/components/share-buttons";
import { DRAW_DATE_LABEL, EXPERIENCE } from "@/lib/config";
import { formatFcfa, referenceCode } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Confirmation de contribution",
  robots: { index: false, follow: false },
};

type Contribution = {
  id: string;
  amount: number;
  status: string;
  firstName: string | null;
  isAnonymous: boolean;
  createdAt: Date;
};

async function loadContribution(id: string): Promise<Contribution | null> {
  try {
    await syncContribution(id);
    return await prisma.contribution.findUnique({
      where: { id },
      select: {
        id: true,
        amount: true,
        status: true,
        firstName: true,
        isAnonymous: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error(
      "Confirm : lecture impossible —",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

function StatusIcon({ status }: { status: "successful" | "pending" | "failed" }) {
  if (status === "successful") {
    return (
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
          <path
            d="M7 15.4l5.2 5.2L23 8.8"
            stroke="#F2762E"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-clay/12">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M8 8l12 12M20 8L8 20" stroke="#a64a2b" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/20">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <circle cx="15" cy="15" r="10.5" stroke="#D65C17" strokeWidth="1.8" />
        <path d="M15 9.5V15l3.6 2.4" stroke="#D65C17" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const reference = searchParams.ref;

  if (!reference) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md rounded-sm border border-ink/10 bg-white p-8 text-center shadow-card">
          <h1 className="font-display text-2xl text-ink">Référence manquante</h1>
          <p className="mt-3 text-[14px] leading-6 text-ink-soft">
            Cette page s&apos;affiche après un paiement Mobile Money. Si vous
            venez de contribuer, vérifiez le lien reçu ou reprenez la procédure.
          </p>
          <Link href="/contribute" className="btn-primary mt-6">
            Contribuer
          </Link>
        </div>
      </div>
    );
  }

  const contribution = await loadContribution(reference);

  if (!contribution) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md rounded-sm border border-ink/10 bg-white p-8 text-center shadow-card">
          <h1 className="font-display text-2xl text-ink">Contribution introuvable</h1>
          <p className="mt-3 text-[14px] leading-6 text-ink-soft">
            Nous ne retrouvons pas cette référence. Si vous avez été débité,
            contactez-nous en précisant l&apos;heure et le montant du paiement.
          </p>
          <Link href="/contribute" className="btn-primary mt-6">
            Réessayer
          </Link>
        </div>
      </div>
    );
  }

  const status =
    contribution.status === "successful"
      ? "successful"
      : contribution.status === "failed"
        ? "failed"
        : "pending";

  const code = referenceCode(contribution.id);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-dots opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />

      <div className="container-page relative py-12 lg:py-16">
        <div className="mx-auto max-w-xl">
          <div className="rounded-sm border border-ink/10 bg-white p-7 text-center shadow-lift sm:p-10">
            <StatusIcon status={status} />

            <h1 className="mt-6 display-lg text-[2rem] sm:text-4xl">
              {status === "successful" && "Merci, c'est confirmé."}
              {status === "pending" && "Paiement en cours de confirmation."}
              {status === "failed" && "Le paiement n'a pas abouti."}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-6 text-ink-soft">
              {status === "successful" &&
                `Votre contribution de ${formatFcfa(contribution.amount)} rejoint la construction collective. Vous êtes éligible au tirage.`}
              {status === "pending" &&
                "Votre opérateur Mobile Money n'a pas encore validé la transaction. La confirmation arrive généralement en quelques secondes — actualisez le statut ci-dessous."}
              {status === "failed" &&
                "Aucun montant n'a été comptabilisé. Vous pouvez relancer une contribution : le paiement précédent n'a pas été validé."}
            </p>

            <div className="mt-7 rounded-sm border border-dashed border-ink/20 bg-cream/60 px-5 py-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Référence de contribution
              </p>
              <p className="mt-1 font-display text-2xl tracking-[0.08em] text-ink">#{code}</p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-left sm:grid-cols-3">
              <div className="rounded-sm border border-ink/10 px-4 py-3">
                <dt className="text-[10.5px] uppercase tracking-wider text-ink-muted">Montant</dt>
                <dd className="mt-0.5 text-[14px] font-semibold text-ink">
                  {formatFcfa(contribution.amount)}
                </dd>
              </div>
              <div className="rounded-sm border border-ink/10 px-4 py-3">
                <dt className="text-[10.5px] uppercase tracking-wider text-ink-muted">Statut</dt>
                <dd className="mt-0.5 text-[14px] font-semibold text-ink">
                  {status === "successful" ? "Confirmé" : status === "pending" ? "En attente" : "Échoué"}
                </dd>
              </div>
              <div className="col-span-2 rounded-sm border border-ink/10 px-4 py-3 sm:col-span-1">
                <dt className="text-[10.5px] uppercase tracking-wider text-ink-muted">Tirage</dt>
                <dd className="mt-0.5 text-[14px] font-semibold text-ink">
                  {status === "successful" ? "Inscrit" : "En attente"}
                </dd>
              </div>
            </dl>

            {status === "pending" && (
              <div className="mt-6">
                <RefreshStatus reference={contribution.id} />
              </div>
            )}

            {status === "successful" && (
              <>
                <div className="mt-7 rounded-sm bg-sand/50 p-5 text-left">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                    Et maintenant ?
                  </p>
                  <ul className="mt-3 space-y-2 text-[13px] leading-6 text-ink-soft">
                    <li>
                      Votre participation est enregistrée sous l&apos;identifiant{" "}
                      <span className="font-mono text-[12px]">#{code}</span>{" "}
                      {contribution.isAnonymous ? "(anonyme)" : ""}.
                    </li>
                    <li>
                      {EXPERIENCE.prizeCount} gagnants seront tirés au sort le {DRAW_DATE_LABEL}.
                    </li>
                    <li>
                      Si vous gagnez, nous vous contactons via l&apos;email ou le
                      numéro fourni lors de la contribution.
                    </li>
                  </ul>
                </div>

                <div className="mt-7">
                  <ShareButtons path="/" />
                </div>
              </>
            )}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/" className="btn-primary">
                Retour à l&apos;accueil
              </Link>
              {status === "failed" ? (
                <Link href="/contribute" className="btn-ghost">
                  Réessayer
                </Link>
              ) : (
                <Link href="/resultats" className="btn-ghost">
                  Voir les résultats
                </Link>
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-[11.5px] leading-5 text-ink-muted">
            Conservez cette référence : elle permet de retrouver votre
            contribution. Besoin d&apos;aide ?{" "}
            <Link href="/mentions-legales" className="underline underline-offset-2">
              Contact
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

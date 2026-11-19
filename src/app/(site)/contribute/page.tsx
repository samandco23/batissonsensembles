import type { Metadata } from "next";
import Link from "next/link";
import { ContributionForm } from "@/components/contribution-form";
import { EXPERIENCE } from "@/lib/config";
import { formatFcfa } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contribuer",
  description:
    "Participez à Bâtissons Ensemble à partir de 100 FCFA par MTN MoMo ou Orange Money.",
};

export default function ContributePage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-[560px]">
        <Link href="/" className="text-xs font-medium text-ink-muted hover:text-brand-dark">
          ← Accueil
        </Link>

        <header className="mt-6">
          <h1 className="display-lg">Je contribue</h1>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Dès {formatFcfa(EXPERIENCE.minContribution)} · MTN MoMo ou Orange Money
          </p>
        </header>

        <section className="mt-6 border border-line bg-white p-5 shadow-card sm:p-7" aria-label="Formulaire de contribution">
          <ContributionForm />
        </section>

      </div>
    </div>
  );
}

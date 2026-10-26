import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">
        <span className="inline-block h-px w-8 bg-brand/30" aria-hidden="true" />
        Erreur 404
      </p>
      <h1 className="display-lg mt-4 max-w-lg text-balance">
        Cette page n&apos;existe pas — mais le projet, si.
      </h1>
      <p className="mt-4 max-w-md text-[14.5px] leading-7 text-ink-soft">
        Le lien est peut-être incomplet ou la page a été déplacée. Revenez à
        l&apos;essentiel : contribuer, comprendre, ou suivre les résultats.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
        <Link href="/contribute" className="btn-ghost">
          Contribuer
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getAdminSession } from "@/lib/auth";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion administration",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  let session = null;
  try {
    session = await getAdminSession();
  } catch {
    session = null;
  }

  if (session?.user) redirect("/admin");

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-5 py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm">
        <div className="rounded-sm border border-ink/10 bg-white p-7 shadow-lift sm:p-8">
          <Logo />
          <h1 className="mt-6 font-display text-2xl text-ink">Administration</h1>
          <p className="mt-1.5 text-[13px] leading-5 text-ink-muted">
            Espace réservé à l&apos;organisateur : suivi des contributions et
            tirage au sort.
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <p className="mt-5 text-center text-[12px] text-ink-muted">
          <Link href="/" className="hover:text-brand">
            ← Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}

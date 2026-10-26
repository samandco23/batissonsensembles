import Link from "next/link";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/logout-button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <header className="bg-ink text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo inverted />
            <span className="hidden h-5 w-px bg-white/20 sm:block" aria-hidden="true" />
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-white/50 sm:block">
              Administration
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[12.5px] text-white/65 hover:text-white">
              Voir le site
            </Link>
            <span className="text-white/25" aria-hidden="true">
              |
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/#projet", label: "Le projet" },
  { href: "/#comment", label: "Comment ça marche" },
  { href: "/reglement", label: "Règlement" },
  { href: "/resultats", label: "Résultats" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(236,225,216,1)]">
      <div className="bg-brand text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-1.5 text-[11px] font-medium tracking-wide">
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" aria-hidden="true" />
            Expérience sociale — Bâtissons Ensemble
          </p>
          <Link href="/reglement" className="text-white/85 underline-offset-2 hover:underline">
            Le règlement du tirage est public →
          </Link>
        </div>
      </div>

      <div className="container-page flex h-[68px] items-center justify-between gap-4">
        <Link href="/" aria-label="Bâtissons Ensemble — accueil">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13.5px] font-medium text-ink-soft transition hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contribute" className="btn-primary hidden sm:inline-flex">
            Contribuer
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-mobile" className="border-t border-line bg-white md:hidden">
          <nav className="container-page flex flex-col py-3" aria-label="Navigation mobile">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="py-2.5 text-[15px] font-medium text-ink-soft">
                {item.label}
              </Link>
            ))}
            <Link href="/contribute" className="btn-primary mt-3 mb-2">
              Contribuer maintenant
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

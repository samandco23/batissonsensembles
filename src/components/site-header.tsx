"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    drawerCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setOpen(false);
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    closeOnDesktop();
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className={`sticky top-0 ${open ? "z-[60]" : "z-40"} bg-white shadow-[0_1px_0_rgba(236,225,216,1)]`}>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Bâtissons Ensemble — accueil">
          <Logo className="hidden lg:inline-flex" />
          <Logo className="lg:hidden" showWordmark={false} />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-ink-soft transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/mentions-legales"
            className="whitespace-nowrap text-sm font-medium text-ink-soft transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4"
          >
            Mentions légales
          </Link>
          <Link href="/contribute" className="btn-primary whitespace-nowrap px-5 py-2.5 text-sm">
            Contribuer
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white text-ink"
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
        <div id="menu-mobile" className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-ink/45"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          />
          <aside
            className="drawer-panel absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col bg-white px-6 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const items = event.currentTarget.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled])',
              );
              const first = items[0];
              const last = items[items.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }}
          >
            <div className="flex items-center justify-between border-b border-line pb-5">
              <span className="font-display text-lg font-semibold text-ink">Navigation</span>
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink"
                aria-label="Fermer le menu"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 py-5" aria-label="Navigation mobile">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-base font-medium text-ink-soft hover:bg-sand/60">
                  {item.label}
                </Link>
              ))}
              <Link href="/mentions-legales" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-base font-medium text-ink-soft hover:bg-sand/60">
                Mentions légales
              </Link>
            </nav>
            <Link href="/contribute" onClick={() => setOpen(false)} className="btn-primary w-full py-4">
              Contribuer maintenant
            </Link>
          </aside>
        </div>
      )}
    </header>
  );
}

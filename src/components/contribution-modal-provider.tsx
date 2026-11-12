"use client";

import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { ContributionForm } from "@/components/contribution-form";

export function ContributionModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      const trigger = triggerRef.current;
      if (trigger?.isConnected) trigger.focus();
      else if (trigger) {
        document.querySelector<HTMLElement>('[aria-label="Ouvrir le menu"]')?.focus();
      }
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest("a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== "/contribute") return;

    event.preventDefault();
    triggerRef.current = link;
    setOpen(true);
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
  }

  return (
    <div onClickCapture={handleClickCapture}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contribution-dialog-title"
            onKeyDown={handleDialogKeyDown}
            className="contribution-dialog relative max-h-[94dvh] w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-cream shadow-2xl sm:max-w-[620px] sm:rounded-xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-cream/95 px-5 py-4 backdrop-blur sm:px-7">
              <div>
                <p className="eyebrow">Bâtissons ensemble</p>
                <h2
                  id="contribution-dialog-title"
                  className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl"
                >
                  Je contribue
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-sand"
                aria-label="Fermer le formulaire"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-5 sm:px-7 sm:py-7">
              <p className="mb-5 text-sm leading-6 text-ink-soft">
                Choisissez votre montant et vos coordonnées. Le paiement sera
                finalisé sur Mobile Money.
              </p>
              <ContributionForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

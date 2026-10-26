import Link from "next/link";
import { Logo } from "@/components/logo";
import { SITE, DRAW_DATE_LABEL } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[13px] leading-6 text-ink-muted">
            Une expérience sociale pour tester si nous pouvons bâtir ensemble une
            start-up tech — 100 FCFA à la fois.
          </p>
          <p className="mt-4 text-[12px] leading-5 text-ink-muted">
            Tirage au sort prévu le {DRAW_DATE_LABEL}.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              {
                label: "WhatsApp",
                href: "https://wa.me/?text=B%C3%A2tissons%20Ensemble",
                path: "M10 3a7 7 0 00-6 10.5L3 17l3.6-1a7 7 0 103.4-13zM7.2 7.6c.2-.4.3-.4.6-.4h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6.4.7 1.1 1.4 1.9 1.8.3.2.4.1.6 0l.5-.5c.2-.2.3-.2.5-.1l1.5.7c.2.1.4.2.4.4 0 .5-.3 1.2-.7 1.4-.4.2-1 .3-1.6.1-1.1-.4-2.2-1-3.1-1.9-.9-.9-1.6-2-1.9-3-.2-.6-.1-1.2.1-1.6z",
              },
              {
                label: "Facebook",
                href: "https://www.facebook.com/sharer/sharer.php?u=" + SITE.baseUrl,
                path: "M12.8 10.5h2.3l.4-3h-2.7V5.7c0-.9.3-1.5 1.6-1.5h1.2V1.5c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.4v2.7H8v3h2.5V18h2.3v-7.5z",
              },
              {
                label: "X",
                href: "https://twitter.com/intent/tweet?text=B%C3%A2tissons%20Ensemble",
                path: "M3 3h4.3l3.5 4.8L15 3h2l-5 5.9L17.4 17H13l-3.7-5L4.8 17H3l5.3-6.2L3 3zm2.4 1.4l8.1 11.2h1.5L7 4.4H5.4z",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-muted transition hover:border-brand hover:text-brand"
                aria-label={social.label}
              >
                <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
                  <path d={social.path} fill="currentColor" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-ink">Le projet</h2>
          <ul className="mt-4 space-y-2.5 text-[12.5px] text-ink-muted">
            <li><Link href="/#projet" className="hover:text-brand">Pourquoi contribuer</Link></li>
            <li><Link href="/#comment" className="hover:text-brand">Comment ça marche</Link></li>
            <li><Link href="/reglement" className="hover:text-brand">Règlement du tirage</Link></li>
            <li><Link href="/resultats" className="hover:text-brand">Résultats</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-ink">Contribuer</h2>
          <ul className="mt-4 space-y-2.5 text-[12.5px] text-ink-muted">
            <li><Link href="/contribute" className="hover:text-brand">Contribuer</Link></li>
            <li><Link href="/#comment" className="hover:text-brand">Le tirage</Link></li>
            <li><Link href="/reglement#versement" className="hover:text-brand">Versement des gains</Link></li>
            <li><Link href="/reglement#donnees" className="hover:text-brand">Données personnelles</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-ink">Informations</h2>
          <ul className="mt-4 space-y-2.5 text-[12.5px] text-ink-muted">
            <li><Link href="/mentions-legales" className="hover:text-brand">Mentions légales</Link></li>
            <li><a href={`mailto:${SITE.contactEmail}`} className="hover:text-brand">Contact</a></li>
            <li><Link href="/admin/login" className="hover:text-brand">Administration</Link></li>
            <li><span className="text-ink-muted/70">{SITE.domain}</span></li>
          </ul>
        </div>
      </div>

      <div className="bg-brand">
        <div className="container-page flex flex-col items-center justify-between gap-1 py-4 text-[11.5px] text-white/90 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name} — un projet porté par{" "}
            <span className="font-semibold text-white">{SITE.organizer}</span>.
          </p>
          <p>Expérience sociale · Règlement public</p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: `${SITE.name} — 10 000 personnes, 100 FCFA, une start-up`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Bâtissons Ensemble est une expérience sociale : 10 000 personnes, 100 FCFA chacune, pour financer le lancement d'une start-up tech et créer 10 emplois dans le numérique en 6 mois.",
  keywords: [
    "Bâtissons Ensemble",
    "expérience sociale",
    "100 FCFA",
    "start-up tech",
    "emplois numériques",
    "Mobile Money",
    "tirage au sort",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    title: `${SITE.name} — 10 000 personnes, 100 FCFA, une start-up`,
    description:
      "Une expérience sociale ouverte à tous : 100 FCFA minimum, 5 gains de 100 000 FCFA à gagner, et une start-up tech financée.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}`,
    description:
      "10 000 personnes × 100 FCFA = une start-up tech. Expérience sociale, règlement public.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F2762E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="flex min-h-dvh flex-col bg-cream">{children}</body>
    </html>
  );
}

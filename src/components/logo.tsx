import { SITE } from "@/lib/config";

/**
 * Marque Bâtissons Ensemble : une arche (bâtir) posée sur une brique
 * (la contribution individuelle), dans un carré orange.
 */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label={SITE.name}
      className="shrink-0"
    >
      <rect width="40" height="40" rx="9" fill="#F2762E" />
      <path
        d="M9.5 30.5V19.5a10.5 10.5 0 0121 0v11"
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <rect x="15.5" y="21.5" width="9" height="9" rx="1.2" fill="#FFFFFF" />
      <rect x="15.5" y="21.5" width="9" height="4" rx="1.2" fill="#FFD9C2" />
    </svg>
  );
}

export function Logo({
  className = "",
  inverted = false,
  showWordmark = true,
}: {
  className?: string;
  inverted?: boolean;
  showWordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display text-[15.5px] font-bold leading-none tracking-[-0.01em] ${
              inverted ? "text-white" : "text-ink"
            }`}
          >
            Bâtissons
          </span>
          <span
            className={`mt-[3px] text-[8.5px] font-semibold uppercase leading-none tracking-[0.26em] ${
              inverted ? "text-white/70" : "text-brand"
            }`}
          >
            Ensemble
          </span>
        </span>
      )}
    </span>
  );
}

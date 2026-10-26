"use client";

const MESSAGE =
  "Je viens de contribuer à Bâtissons Ensemble : 10 000 personnes, 100 FCFA chacune, pour lancer une start-up tech. Rejoins l'expérience sociale 👇";

function shareTargets(url: string) {
  const text = `${MESSAGE} ${url}`;
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(MESSAGE)}&url=${encodeURIComponent(url)}`,
  };
}

export function ShareButtons({ path = "/" }: { path?: string }) {
  function open(network: "whatsapp" | "facebook" | "x") {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}${path}`;
    const target = shareTargets(url)[network];
    window.open(target, "_blank", "noopener,noreferrer,width=640,height=640");
  }

  const items = [
    {
      key: "whatsapp" as const,
      label: "WhatsApp",
      icon: (
        <path
          d="M10 3a7 7 0 00-6 10.5L3 17l3.6-1a7 7 0 103.4-13zM7.2 7.6c.2-.4.3-.4.6-.4h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6.4.7 1.1 1.4 1.9 1.8.3.2.4.1.6 0l.5-.5c.2-.2.3-.2.5-.1l1.5.7c.2.1.4.2.4.4 0 .5-.3 1.2-.7 1.4-.4.2-1 .3-1.6.1-1.1-.4-2.2-1-3.1-1.9-.9-.9-1.6-2-1.9-3-.2-.6-.1-1.2.1-1.6z"
          fill="currentColor"
        />
      ),
    },
    {
      key: "facebook" as const,
      label: "Facebook",
      icon: (
        <path
          d="M12.8 10.5h2.3l.4-3h-2.7V5.7c0-.9.3-1.5 1.6-1.5h1.2V1.5c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.4v2.7H8v3h2.5V18h2.3v-7.5z"
          fill="currentColor"
        />
      ),
    },
    {
      key: "x" as const,
      label: "X",
      icon: (
        <path
          d="M3 3h4.3l3.5 4.8L15 3h2l-5 5.9L17.4 17H13l-3.7-5L4.8 17H3l5.3-6.2L3 3zm2.4 1.4l8.1 11.2h1.5L7 4.4H5.4z"
          fill="currentColor"
        />
      ),
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="mr-1 text-[12px] text-ink-muted">Partager :</span>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => open(item.key)}
          className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-3.5 py-2 text-[12.5px] font-medium text-ink-soft transition hover:border-ink/30 hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
            {item.icon}
          </svg>
          {item.label}
        </button>
      ))}
    </div>
  );
}

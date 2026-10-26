"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-full border border-ink/15 px-4 py-2 text-[12.5px] font-medium text-ink-soft transition hover:border-ink/35 hover:text-ink"
    >
      Déconnexion
    </button>
  );
}

import type { Prisma } from "@prisma/client";

export const PAGE_SIZE = 20;

export type AdminFilters = {
  status: "all" | "pending" | "successful" | "failed";
  from: string;
  to: string;
};

export function parseFilters(params: {
  status?: string;
  from?: string;
  to?: string;
}): AdminFilters {
  const status =
    params.status === "pending" ||
    params.status === "successful" ||
    params.status === "failed"
      ? params.status
      : "all";

  return {
    status,
    from: isIsoDate(params.from) ? params.from! : "",
    to: isIsoDate(params.to) ? params.to! : "",
  };
}

function isIsoDate(value?: string): boolean {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

/** Construit le filtre Prisma commun au tableau et à l'export CSV. */
export function buildWhere(filters: AdminFilters): Prisma.ContributionWhereInput {
  const where: Prisma.ContributionWhereInput = {};

  if (filters.status !== "all") where.status = filters.status;

  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) {
      const start = new Date(`${filters.from}T00:00:00.000Z`);
      if (!Number.isNaN(start.getTime())) where.createdAt.gte = start;
    }
    if (filters.to) {
      const end = new Date(`${filters.to}T23:59:59.999Z`);
      if (!Number.isNaN(end.getTime())) where.createdAt.lte = end;
    }
  }

  return where;
}

export function filtersToQuery(filters: AdminFilters): string {
  const params = new URLSearchParams();
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** Échappe une valeur pour un CSV (RFC 4180). */
export function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r;]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  successful: "Confirmé",
  failed: "Échoué",
};

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import {
  buildWhere,
  csvCell,
  parseFilters,
  STATUS_LABELS,
} from "@/lib/admin-queries";
import { referenceCode } from "@/lib/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const url = new URL(request.url);
  const filters = parseFilters({
    status: url.searchParams.get("status") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  });

  const rows = await prisma.contribution.findMany({
    where: buildWhere(filters),
    orderBy: { createdAt: "desc" },
    take: 20_000,
  });

  const header = [
    "Reference",
    "Date",
    "Prenom",
    "Nom",
    "Contact",
    "Montant FCFA",
    "Statut",
    "Anonyme",
    "Gagnant",
    "Rang",
    "Transaction Fapshi",
  ];

  const lines = rows.map((row) =>
    [
      referenceCode(row.id),
      row.createdAt.toISOString(),
      row.firstName ?? "",
      row.lastName ?? "",
      row.contact,
      row.amount,
      STATUS_LABELS[row.status] ?? row.status,
      row.isAnonymous ? "Oui" : "Non",
      row.isWinner ? "Oui" : "Non",
      row.winnerRank ?? "",
      row.fapshiTxId ?? "",
    ]
      .map(csvCell)
      .join(","),
  );

  // BOM UTF-8 pour qu'Excel affiche correctement les accents.
  const csv = `\uFEFF${[header.map(csvCell).join(","), ...lines].join("\r\n")}\r\n`;
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contributions-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

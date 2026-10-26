import { NextResponse } from "next/server";
import { syncContribution } from "@/lib/payments";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("ref");
  if (!id) {
    return NextResponse.json({ error: "Référence manquante." }, { status: 400 });
  }

  const result = await syncContribution(id);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(
    { status: result.status },
    { headers: { "Cache-Control": "no-store" } },
  );
}

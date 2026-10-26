#!/usr/bin/env node
// Serveur de simulation Fapshi — UNIQUEMENT pour le développement local.
// Il ne doit jamais être utilisé en production : FAPSHI_BASE_URL doit pointer
// vers https://sandbox.fapshi.com ou https://live.fapshi.com.
//
// Usage : node scripts/mock-fapshi.mjs
// Puis dans .env : FAPSHI_BASE_URL="http://localhost:4010"
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.MOCK_FAPSHI_PORT || 4010);
const transactions = new Map();

function json(response, status, body) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  response.end(payload);
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function checkoutPage(transaction) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Paiement simulé — ${transaction.amount} FCFA</title>
<style>
  body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#0b4430;font-family:system-ui,sans-serif;color:#0f2318}
  .card{background:#faf6ec;border-radius:24px;padding:32px;max-width:380px;width:calc(100% - 40px);box-shadow:0 30px 60px -20px rgba(0,0,0,.45)}
  h1{font-size:20px;margin:0 0 4px} p{color:#4a6152;font-size:13px;line-height:1.6}
  .amount{font-size:34px;font-weight:700;margin:18px 0}
  button{width:100%;border:0;border-radius:999px;padding:14px;background:#0b4430;color:#faf6ec;font-weight:600;font-size:14px;cursor:pointer}
  .warn{margin-top:14px;background:#efe3cc;border-radius:12px;padding:10px;font-size:11px;color:#7a5a1f}
  code{font-size:11px}
</style></head>
<body><div class="card">
  <p style="text-transform:uppercase;letter-spacing:.14em;font-size:10px;margin:0">Fapshi · sandbox locale</p>
  <h1>Paiement Mobile Money</h1>
  <p style="margin:2px 0 0">Transaction <code>${transaction.transId}</code></p>
  <div class="amount">${transaction.amount.toLocaleString("fr-FR")} FCFA</div>
  <p>${transaction.message || "Contribution Bâtissons Ensemble"}</p>
  <form method="POST" action="/mock/pay/${transaction.transId}">
    <button type="submit">Payer maintenant</button>
  </form>
  <div class="warn">Ceci est un faux checkout, généré localement pour les tests. Aucun argent réel n'est débité.</div>
</div></body></html>`;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  if (request.method === "POST" && path === "/initiate-pay") {
    if (!request.headers.apiuser || !request.headers.apikey) {
      return json(response, 401, { message: "Missing API credentials" });
    }
    const body = await readBody(request);
    if (!Number.isInteger(body.amount) || body.amount < 100) {
      return json(response, 400, { message: "Invalid amount (min 100 XAF)" });
    }

    const transId = `mock_${randomUUID().slice(0, 8)}`;
    transactions.set(transId, {
      transId,
      status: "CREATED",
      amount: body.amount,
      email: body.email ?? null,
      externalId: body.externalId ?? null,
      redirectUrl: body.redirectUrl ?? "http://localhost:3100/",
      message: body.message ?? "",
      dateInitiated: new Date().toISOString().slice(0, 10),
    });

    console.log(`[mock-fapshi] initiate ${transId} — ${body.amount} FCFA`);
    return json(response, 200, {
      message: "Payment initiated",
      link: `http://localhost:${PORT}/pay/${transId}`,
      transId,
      dateInitiated: new Date().toISOString().slice(0, 10),
    });
  }

  if (request.method === "GET" && path.startsWith("/pay/")) {
    const transId = path.split("/")[2];
    const transaction = transactions.get(transId);
    if (!transaction) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      return response.end("Transaction inconnue");
    }
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return response.end(checkoutPage(transaction));
  }

  if (request.method === "POST" && path.startsWith("/mock/pay/")) {
    const transId = path.split("/")[3];
    const transaction = transactions.get(transId);
    if (!transaction) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      return response.end("Transaction inconnue");
    }
    transaction.status = "SUCCESSFUL";
    transaction.dateConfirmed = new Date().toISOString().slice(0, 10);

    // Fapshi notifie le marchand en arrière-plan ; le site revérifie ensuite
    // le statut via l'API, donc un webhook manqué n'empêche pas la validation.
    fetch(process.env.MOCK_WEBHOOK_URL || "http://localhost:3100/api/fapshi/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wh-secret": process.env.FAPSHI_WEBHOOK_SECRET || "local-webhook-secret",
      },
      body: JSON.stringify(transaction),
    }).catch((error) => console.warn("[mock-fapshi] webhook:", error.message));

    console.log(`[mock-fapshi] paid ${transId}`);
    response.writeHead(302, { Location: transaction.redirectUrl });
    return response.end();
  }

  if (request.method === "GET" && path.startsWith("/payment-status/")) {
    const transId = path.split("/")[2];
    const transaction = transactions.get(transId);
    if (!transaction) return json(response, 404, { message: "Transaction not found" });
    return json(response, 200, transaction);
  }

  return json(response, 404, { message: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[mock-fapshi] prêt sur http://localhost:${PORT}`);
});

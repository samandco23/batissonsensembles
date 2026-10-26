#!/usr/bin/env node
/**
 * Script de test du webhook Fapshi (sandbox).
 * Il simule un payload de webhook avec transId et externalId,
 * appelle le fichier de config Next.js .env pour charger les vars d'env,
 * puis retourne le résultat de l'appel à /api/fapshi/webhook.
 *
 * Usage : node scripts/test-webhook.mjs
 */

import { createHash, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname + "/..";

// Charge les variables d'environnement depuis /batissons-ensemble/.env
const dotenvPath = projectRoot + "/.env";
if (!existsSync(dotenvPath)) {
  console.error("ERREUR: fichier .env absent.");
  process.exit(1);
}
const dotenvContent = readFileSync(dotenvPath, "utf8");
const dotenvLines = dotenvContent.split("\n");
for (const line of dotenvLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  if (val === "") continue;
  // Retire les guillemets si présents
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  // Interpolation simple ? ${FOO} — pour simplifier, on ignore l'interpolation et on garde la valeur brute.
  process.env[key] = val;
}

const SIGNATURE_HEADER = "x-wh-secret";
// On considère que le secret est configuré dans .env comme FAPSHI_WEBHOOK_SECRET
const webhookSecret = process.env["FAPSHI_WEBHOOK_SECRET"] || "local-webhook-secret-abcdef";

// Payload de webhook réaliste avec externalId (ID de la contribution) et fapshiTxId (si présent)
// Status: SUCCESSFUL → on marque la contribution comme réussie.
const payload = {
  transId: "tx_test_001",
  externalId: "c8a7e5b2-1a3c-4b5d-9e8f-0a1b2c3d4e5f", // ID contribution supposé existant
  status: "SUCCESSFUL",
  amount: 100,
  dateInitiated: new Date().toISOString(),
  dateConfirmed: new Date().toISOString(),
  customerName: "Testeur",
  customerEmail: "test@example.com",
  // etc.
};

// Construction de la signature attendue (même algo que le webhook Fapshi)
function signature(secret, payload) {
  return createHash("sha256")
    .update(secret)
    .update(JSON.stringify(payload))
    .digest("base64");
}

const expectedSig = signature(webhookSecret, payload);

const response = await fetch("http://localhost:3100/api/fapshi/webhook", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    [SIGNATURE_HEADER]: expectedSig,
  },
  body: JSON.stringify(payload),
});

const responseBody = await response.json().catch(() => null);
console.log("Statut HTTP :", response.status);
console.log("Réponse :", JSON.stringify(responseBody, null, 2));
NODE
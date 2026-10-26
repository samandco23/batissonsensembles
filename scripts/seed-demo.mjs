#!/usr/bin/env node
// Données de démonstration pour tester le site en local.
// Usage : node scripts/seed-demo.mjs [--reset] [--count=120]
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const reset = args.includes("--reset");
const countArg = args.find((arg) => arg.startsWith("--count="));
const count = countArg ? Number.parseInt(countArg.split("=")[1], 10) : 120;

const FIRST_NAMES = [
  "Awa", "Moussa", "Léa", "Kwame", "Fatou", "Éric", "Nadia", "Serge",
  "Aïcha", "Boris", "Chantal", "David", "Estelle", "Franck", "Grâce",
  "Hervé", "Ines", "Joseph", "Kadiatou", "Landry", "Mireille", "Nathan",
  "Olive", "Patrice", "Rosine", "Samuel", "Tania", "Urbain", "Viviane", "Yannick",
];

const LAST_NAMES = [
  "Ndiaye", "Mbarga", "Tchoumi", "Bello", "Dupont", "Kamga", "Ouedraogo",
  "Fotso", "Nkolo", "Traoré", "Mbah", "Sow", "Essomba", "Diallo", "Atangana",
];

const PRESETS = [100, 100, 100, 200, 500, 500, 1_000, 2_000, 5_000, 10_000];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomAmount() {
  return Math.random() < 0.65
    ? 100
    : randomItem(PRESETS);
}

async function main() {
  if (reset) {
    await prisma.contribution.deleteMany();
    await prisma.drawSession.deleteMany();
    console.log("Tables Contribution / DrawSession vidées.");
  }

  const rows = Array.from({ length: count }, (_, index) => {
    const isAnonymous = Math.random() < 0.28;
    const roll = Math.random();
    const status = roll < 0.9 ? "successful" : roll < 0.96 ? "pending" : "failed";
    const daysAgo = Math.floor(Math.random() * 21);
    const createdAt = new Date(Date.now() - daysAgo * 86_400_000 - index * 60_000);
    const phone = `+237 6${randomItem(["5", "7", "9"])}${Math.floor(1000000 + Math.random() * 8999999)}`;

    return {
      createdAt,
      firstName: isAnonymous ? null : randomItem(FIRST_NAMES),
      lastName: isAnonymous ? null : randomItem(LAST_NAMES),
      contact:
        Math.random() < 0.5
          ? phone
          : `contributeur${index + 1}@exemple.com`,
      amount: randomAmount(),
      isAnonymous,
      status,
      fapshiTxId: status === "failed" ? null : `demo_${index}_${Date.now()}`,
    };
  });

  await prisma.contribution.createMany({ data: rows });

  const total = rows
    .filter((row) => row.status === "successful")
    .reduce((sum, row) => sum + row.amount, 0);

  console.log(
    `${rows.length} contributions de démonstration créées — ${total.toLocaleString("fr-FR")} FCFA confirmés.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

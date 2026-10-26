#!/usr/bin/env node
// Génère le hash bcrypt à mettre dans ADMIN_PASSWORD_HASH.
// Usage : npm run hash -- 'MonMotDePasse'
import bcrypt from "bcryptjs";

const { hashSync } = bcrypt;

const password = process.argv.slice(2).join(" ").trim();

if (!password) {
  console.error("Usage : npm run hash -- 'MonMotDePasse'");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Le mot de passe doit contenir au moins 8 caractères.");
  process.exit(1);
}

const hash = hashSync(password, 12);
console.log("\nAjoute cette ligne à ton .env (et sur Vercel) :\n");
console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);

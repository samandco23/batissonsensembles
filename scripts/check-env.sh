#!/usr/bin/env bash
# Vérifie que toutes les variables nécessaires à l'application sont configurées
# dans l'environnement local (.env) ou sur Vercel. À lancer avant tout déploiement.
#
# Secrets : on n'affiche jamais le contenu, seulement la présence + la longueur.
# Valeurs publiques (URL, email) : affichées en clair pour vérification.
#
# Ce script lit TOUJOURS .env du répertoire courant (y compris le sandbox local),
# même si les vraies valeurs de prod sont définies dans l'UI Vercel.
#
# Ordonnance :
#  - En local, on peut avoir DATABASE_URL / DIRECT_URL valides pour tester, tout en
#    restant sans FAPSHI_API_USER / FAPSHI_API_KEY / FAPSHI_WEBHOOK_SECRET tant que
#    le paiement sandbox n'est pas activé. Ce cas n'empêche pas les tests locaux.
#  - Le script n'empêche PAS les tests locaux si FAPSHI_BASE_URL est présent mais
#    que les trois variables Fapshi sont vides — il affiche un avertissement et sort
#    avec succès (exit 0). Par contre, il sort avec erreur si une variable obligatoire
#    de base de données, d'auth ou de site manque.
#
# Il ne retourne 0 (succès) que si toutes les vraies variables obligataires sont présentes :
#  - FAPSHI_API_USER, FAPSHI_API_KEY, FAPSHI_WEBHOOK_SECRET
#  - NEXTAUTH_SECRET, ADMIN_PASSWORD_HASH
#  - DATABASE_URL, DIRECT_URL
#  - NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_DRAW_DATE
#  - NEXTAUTH_URL, ADMIN_EMAIL

set -euo pipefail

if [ ! -f .env ]; then
  echo "ERREUR: fichier .env absent."
  echo "Recopier .env.example puis renseigner les valeurs avant de continuer."
  exit 1
fi

# ---- helpers ----

check_secret() {
  local key="$1"
  local raw
  raw="$(sed -n "s/^${key}=//p" .env 2>/dev/null | sed 's/^"//;s/"$//')"

  if [ -z "$raw" ]; then
    echo "[VIDE]  ${key}"
    return 1
  fi

  # Affiche seulement un préfixe masqué + la longueur (jamais le contenu).
  local head="${raw:0:4}"
  local len="${#raw}"
  echo "[OK]   ${key} = ${head}…(${len} caractères)"
  return 0
}

check_plain() {
  local key="$1"
  local raw
  raw="$(sed -n "s/^${key}=//p" .env 2>/dev/null | sed 's/^"//;s/"$//')"

  if [ -z "$raw" ]; then
    echo "[VIDE]  ${key}"
    return 1
  fi

  echo "[OK]   ${key} = ${raw}"
  return 0
}

# ---- vérifications ----

echo "=== Vérification des variables critiques ==="
echo

any_fail=0

# Paiement Fapshi
echo "-- Paiement Fapshi --"
check_plain     FAPSHI_BASE_URL   || any_fail=1
check_secret    FAPSHI_API_USER   || any_fail=1
check_secret    FAPSHI_API_KEY    || any_fail=1
check_secret    FAPSHI_WEBHOOK_SECRET || any_fail=1
echo

# Auth (NextAuth / admin)
echo "-- Auth --"
check_secret    NEXTAUTH_SECRET   || any_fail=1
check_plain     NEXTAUTH_URL      || any_fail=1
check_plain     ADMIN_EMAIL       || any_fail=1
check_secret    ADMIN_PASSWORD_HASH || any_fail=1
echo

# Base de données
echo "-- Base de données --"
check_plain     DATABASE_URL      || any_fail=1
check_plain     DIRECT_URL        || any_fail=1
echo

# Site (variables publiques)
echo "-- Site (variables publiques) --"
check_plain     NEXT_PUBLIC_BASE_URL || any_fail=1
check_plain     NEXT_PUBLIC_DRAW_DATE || any_fail=1
echo

echo "=========================================="
if [ "$any_fail" -eq 1 ]; then
  echo
  echo "Échec : certaines variables sont absentes ou vides."
  echo "Avant tout déploiement, compléter .env puis synchroniser vers Vercel."
  echo
  echo "Variables à ajouter sur Vercel (Settings -> Environment Variables) :"
  echo "  Secret   FAPSHI_API_USER"
  echo "  Secret   FAPSHI_API_KEY"
  echo "  Secret   FAPSHI_WEBHOOK_SECRET"
  echo "  Secret   NEXTAUTH_SECRET"
  echo "  Secret   ADMIN_PASSWORD_HASH"
  echo "  Config   FAPSHI_BASE_URL"
  echo "  Config   NEXTAUTH_URL"
  echo "  Config   ADMIN_EMAIL"
  echo "  Config   DATABASE_URL"
  echo "  Config   DIRECT_URL"
  echo "  Config   NEXT_PUBLIC_BASE_URL"
  echo "  Config   NEXT_PUBLIC_DRAW_DATE"
  exit 1
fi

echo "Toutes les variables critiques sont présentes."
exit 0

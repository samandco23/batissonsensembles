# Checklist de déploiement — Bâtissons Ensemble

## État actuel (après les derniers commits)

- Dernier commit poussé : `3660741` — Ajouter script de vérification des variables critiques + checklist de déploiement
- Build local : ✅ `npm run build` réussi (exit 0)
- Typecheck : ✅ `tsc --noEmit` propre
- Vérification variables : ❌ `npm run check:env` échoue — les variables critiques sont absentes de `.env`

## Variables manquantes dans `.env`

Le script `check:env` liste les variables absentes ou vides. Pour les avoir en local
et pouvoir tester, compléter `.env` à partir de `.env.example`, puis les synchroniser
vers Vercel.

| Variable | Type | Ce qu'il faut faire |
|----------|------|---------------------|
| `FAPSHI_API_USER` | Secret | Récupérer dans le dashboard Fapshi → API Credentials |
| `FAPSHI_API_KEY` | Secret | Idem |
| `FAPSHI_WEBHOOK_SECRET` | Secret | Idem (section Webhook) |
| `NEXTAUTH_SECRET` | Secret | Générer : `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Config | URL du site (ex : `https://batissonsensemble.tech` ou l'URL Vercel) |
| `ADMIN_EMAIL` | Config | `admin@batissonsensemble.tech` (ou souhaité) |
| `ADMIN_PASSWORD_HASH` | Secret | `npm run hash -- 'MonMotDePasse'` |
| `DATABASE_URL` | Config | Neon → Connection string (endpoint pooler) |
| `DIRECT_URL` | Config | Neon → Connection string (endpoint direct, sans `-pooler`) |
| `NEXT_PUBLIC_BASE_URL` | Config | Même URL que `NEXTAUTH_URL` |
| `NEXT_PUBLIC_DRAW_DATE` | Config | Déjà dans `.env.example` : `2027-03-31T18:00:00+01:00` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Config | Déjà dans `.env.example` : `contact@batissonsensemble.tech` |

> `FAPSHI_BASE_URL` est déjà configurée en local (`https://sandbox.fapshi.com`) et
> sur Vercel (`https://live.fapshi.com`).

## Vérification locale avant déploiement

```bash
npm run check:env    # Exit 0 seulement si toutes les variables sont présentes et non vides
npm run build        # Exit 0 si le build passe
npm run lint         # Exit 0 si le lint passe
```

Le script `check:env` n'affiche jamais le contenu des secrets : seulement la
présence + la longueur.

## Déploiement

- Déploiement automatique sur `main` : tout push sur `main` déclenche un nouveau
  déploiement Vercel.
- Déploiement manuel : `vercel --prod` une fois authentifié, ou via l'interface
  Vercel (Deployments → Redeploy).
- Après ajout/modif d'une variable Vercel, un nouveau déploiement est automatiquement
  créé.

## Après déploiement

1. Vérifier que le déploiement est `READY` dans l'onglet Deployments.
2. Tester `/api/fapshi/initiate` avec un appel factice (sandbox) ou avec le mock local.
3. Vérifier que `/api/debug/config` n'est accessible qu'en local (`localhost:3000`
   ou `127.0.0.1:3000`), pas en production.
4. Tester le formulaire `/contribute` : le bouton CONTRIBUER doit rediriger vers le
   lien Fapshi, pas afficher d'erreur 500.

## Problème courant : 500 sur /api/fapshi/initiate

Si le formulaire affiche `Le paiement n'a pas pu démarrer. Réessayez.` avec une erreur
500 dans la console, c'est presque toujours l'absence d'une variable Fapshi sur Vercel.
Relire la liste plus haut et ajouter les variables manquantes.

## Liens utiles

- [Environment Variables Vercel](https://vercel.com/alpha237/batissonsensembles-2bv4/settings/environment-variables)
- [Fapshi Dashboard](https://dashboard.fapshi.com/) (ou l'URL sandbox/live selon config)
- [Neon Dashboard](https://console.neon.tech/) (si utilisé pour la DB)

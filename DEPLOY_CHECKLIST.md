# Checklist de déploiement

## Variables Vercel requises

| Variable | Type | Où la trouver | URL de config |
|----------|------|---------------|---------------|
| `FAPSHI_BASE_URL` | Secret | Déjà configurée (`https://live.fapshi.com` en prod) | [Settings → Environment Variables](https://vercel.com/alpha237/batissonsensembles-2bv4/settings/environment-variables) |
| `FAPSHI_API_USER` | Secret | Fapshi dashboard → API Credentials | Idem |
| `FAPSHI_API_KEY` | Secret | Fapshi dashboard → API Credentials | Idem |
| `FAPSHI_WEBHOOK_SECRET` | Secret | Fapshi dashboard → Webhook Secret (à régénérer si needed) | Idem |
| `NEXTAUTH_SECRET` | Secret | `openssl rand -base64 32` ou équivalent | Idem |
| `NEXTAUTH_URL` | Config | `https://batissonsensemble.tech` (ou URL Vercel) | Idem |
| `NEXT_PUBLIC_BASE_URL` | Config | Même URL que `NEXTAUTH_URL` | Idem |
| `DATABASE_URL` | Config | Neon → Connection string (endpoint pooler) | Idem |
| `DIRECT_URL` | Config | Neon → Connection string (endpoint direct, sans `-pooler`) | Idem |
| `ADMIN_EMAIL` | Config | `admin@batissonsensemble.tech` (ou souhaité) | Idem |
| `ADMIN_PASSWORD_HASH` | Secret | `npm run hash -- 'MonMotDePasse'` | Idem |

## Vérification locale avant déploiement

```bash
npm run check:env       # Exit 1 si une variable critique est absente/vide
npm run build           # Exit 0 si le build passe
npm run lint            # Exit 0 si le lint passe
```

Le script `check:env` ne montre jamais les valeurs réelles : pour les secrets il affiche only `XXXX…(n caractères)`.

## Déploiement

- Déploiement automatique sur `main` : tout push sur `main` déclenche un nouveau déploiement Vercel.
- Déploiement manuel : `vercel --prod` une fois authentifié, ou via l'interface Vercel (Bootstrap / Deployments → Redeploy).
- Après ajout/modif d'une variable Vercel, un nouveau déploiement est automatiquement créé.

## Après déploiement

1. Vérifier que le déploiement est `READY` dans l'onglet Deployments.
2. Tester `/api/fapshi/initiate` avec un appel factice (sandbox) ou avec le mock local.
3. Vérifier que `/api/debug/config` n'est accessible qu'en local (`localhost:3000` ou `127.0.0.1:3000`), pas en production.

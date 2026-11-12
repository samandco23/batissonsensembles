# Vérification navigateur — Bâtissons Ensemble

**Cible :** `https://batissonsensembles-2bv4.vercel.app/`
**Date :** 13 novembre 2026
**Outil :** Playwright pilotant Chrome. Contrôle manuel des routes et interactions, sans créer de fichiers de tests.

## Routes publiques

| Route | HTTP | Observation |
|---|---:|---|
| `/` | 200 | Page d’accueil affichée |
| `/contribute` | 200 | Formulaire de contribution autonome affiché |
| `/confirm` | 200 | Affiche « Référence manquante » sans référence de paiement, attendu pour cette URL directe |
| `/reglement` | 200 | Règlement affiché |
| `/resultats` | 200 | Page des résultats affichée |
| `/mentions-legales` | 200 | Mentions légales affichées |

## Parcours et affichage

- Sur la page d’accueil, « Je contribue maintenant » ouvre le formulaire dans une fenêtre modale, sans quitter la page.
- Sur mobile (393 × 852), le menu burger ouvre un drawer et « Contribuer maintenant » ouvre aussi la fenêtre modale.
- La fenêtre modale porte `aria-modal=true`, affiche cinq champs de formulaire, se ferme avec le bouton de fermeture et avec Échap.
- La fenêtre modale tient dans la largeur mobile (environ 391 px) et défile verticalement. Aucun débordement horizontal n’a été mesuré sur les six routes publiques.
- À 1440 px, la modale reste centrée et mesure environ 614 px de large.
- Aucune erreur JavaScript ou erreur de console n’a été observée.

Captures : [formulaire mobile](./contribute-modal-mobile.png), [menu drawer](./mobile-drawer.png).

## En-tête responsive — version locale

Après modification de l’en-tête, j’ai contrôlé le site local à 393, 768, 1024, 1280 et 1440 px : pas de débordement horizontal. Le burger et le drawer restent visibles à 393/768 px. À partir de 1024 px, la barre de navigation prend la place du drawer; le burger disparaît. Le bouton « Contribuer » de cette barre ouvre le formulaire modal.

Captures locales : [navbar desktop](./navbar-desktop.png), [drawer mobile stabilisé](./mobile-drawer-local.png). Ces fichiers reflètent le code local; la version Vercel consultée ne contient pas encore ce changement.

## Point à corriger avant diffusion publique

Le pied de page affiche `batissonsensemble.tech` sur les routes vérifiées. Le propriétaire indique que le domaine souhaité `batissonsensemble.org` n’est pas encore acheté. L’adresse Vercel ci-dessus est la seule adresse de prévisualisation confirmée dans ce contrôle. Mettre le pied de page et les créations promotionnelles en cohérence avec l’adresse effectivement active avant d’annoncer le site.

Le formulaire n’a pas été soumis : aucun paiement mobile ni aucune demande de transaction réelle n’a été lancé. Ce contrôle valide les routes et l’interface, pas l’intégration du prestataire de paiement.

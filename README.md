# puichaud.com — portfolio « console hyperviseur »

Site portfolio statique déguisé en console Proxmox VE. Chaque projet et chaque service du
homelab est présenté comme un conteneur dans une arborescence de datacenter ; l'onglet
« Décisions » expose le journal de décisions et postmortems.

## Stack

- **Astro** (statique, zéro framework côté client — un seul script vanilla pour l'interactivité)
- **Content collections** Markdown : `src/content/projects/` (fiches) et `src/content/decisions/` (timeline)
- **Thème Proxmox** en variables CSS : `src/styles/theme.css`
- **Données live** : `fetch` client d'un `stats.json` public (mock dans `public/`, export réel
  documenté dans `scripts/stats-export/`)

## Commandes

```sh
npm install
npm run dev        # serveur local
npm run build      # build statique → dist/
npm run preview    # prévisualiser le build
```

## Éditer le contenu

| Quoi | Où |
|------|-----|
| Fiche projet (Problème → Stack → Résultat → Leçons) | `src/content/projects/*.md` (frontmatter) |
| Entrée Décisions/postmortems | `src/content/decisions/*.md` (frontmatter + corps) |
| Arbre infra (nodes, LXC, notes) | `src/data/infrastructure.ts` |
| Profil / compétences / contact | `src/data/profile.ts` |
| Documents téléchargeables (storage docs) | `src/data/documents.ts` + fichiers dans `public/docs/` |
| Texte « À propos » (onglet Notes) | `src/components/panels/NotesPanel.astro` |

## Règles de confidentialité (bloquantes)

Ne jamais faire apparaître — contenu **et** code source : adresses IP, noms d'hôtes complets,
domaines internes, numéros de port, versions logicielles précises de l'infra, secrets,
données personnelles (catégorie OK, donnée non), ni le service hébergeant les mots de passe.
Vérification suggérée avant déploiement :

```sh
grep -rEn "([0-9]{1,3}\.){3}[0-9]{1,3}" dist/ --include="*.html"   # aucune IP
```

## Déploiement (Cloudflare Pages)

1. Pousser ce repo sur GitHub.
2. Cloudflare Pages → nouveau projet → connecter le repo. Build : `npm run build`,
   output : `dist`.
3. Domaine custom : `puichaud.com` (migration DNS OVH → Cloudflare pour l'apex).
4. Rebuild quotidien : créer un *deploy hook* et l'appeler via un cron (GitHub Actions
   `schedule` ou tâche côté infra).

## Branchement des données live (plus tard)

Voir `scripts/stats-export/README.md`. Une fois le `stats.json` réel publié sur le domaine
de la passerelle, changer `STATS_URL` dans `src/scripts/console.ts`. La garde de fraîcheur
(> 1 h → « données du \<date\> ») est déjà en place.

# puichaud.com — portfolio Ianis Puichaud

Site portfolio statique : landing page thème "parchemin" avec sections Hero, Métriques
homelab, Timeline, Projets, Infra, Compétences et Contact.

## Stack

- **Astro** (statique, zéro framework côté client)
- **CSS** global dans `src/styles/global.css` — variables thème dans `:root`
- **Données projets** : `src/data/projects.js` (JS plain exporté, branché dans `Projects.astro`)
- **Stats live** : le composant `Metrics.astro` consomme `public/stats.json` (mock) ; voir
  `scripts/stats-export/` pour brancher les vraies données depuis le homelab

## Commandes

```sh
npm install
npm run dev        # serveur local
npm run build      # build statique → dist/
npm run preview    # prévisualiser le build
npm run check      # vérification TypeScript/Astro
```

## Structure

```
src/
  layouts/Base.astro          # HTML, SEO (canonical, OG, JSON-LD), import CSS global
  pages/
    index.astro               # page principale — assemble tous les composants
    404.astro                 # page d'erreur
  components/
    Header.astro              # nav sticky + burger mobile
    Hero.astro                # nom, titre, badge dispo, CTA CV/contact
    Metrics.astro             # métriques homelab (stats.json)
    Timeline.astro            # timeline expérience/formation
    Projects.astro            # cartes projets + modales — données depuis src/data/projects.js
    Infra.astro               # spec sheet infrastructure homelab
    Skills.astro              # grille compétences
    Contact.astro             # formulaire / liens contact
    Footer.astro
  styles/global.css           # variables CSS, reset, layout, tous les composants
  data/projects.js            # données projets (cards + modales)
public/
  favicon.svg
  og-image.png
  robots.txt
  cv.pdf
  stats.json                  # mock — remplacer par l'URL publique quand branché
scripts/stats-export/         # script Python à faire tourner côté infra (voir son README)
```

## Éditer le contenu

| Quoi | Où |
|------|-----|
| Projets (cards + modales) | `src/data/projects.js` |
| Hero / badge dispo | `src/components/Hero.astro` |
| Infra spec sheet | `src/components/Infra.astro` |
| Compétences | `src/components/Skills.astro` |
| Expérience / formation | `src/components/Timeline.astro` |
| Contact | `src/components/Contact.astro` |
| Métriques (données mock) | `public/stats.json` |

## Règles de confidentialité (bloquantes)

Ne jamais faire apparaître — contenu **et** code source : adresses IP, noms d'hôtes complets,
domaines internes, numéros de port, versions logicielles précises de l'infra, secrets,
données personnelles (catégorie OK, donnée non). Vérification avant déploiement :

```sh
grep -rEn "([0-9]{1,3}\.){3}[0-9]{1,3}" dist/ --include="*.html"
```

## Déploiement (Cloudflare Pages)

CI configurée dans `.github/workflows/` : push sur `master` → `npm run check` + `npm run build`
→ deploy Cloudflare Pages automatique.

Secrets requis dans le repo GitHub :
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Domaine : `puichaud.com` (DNS Cloudflare, apex).

## Branchement stats live (à faire côté infra)

Voir `scripts/stats-export/README.md`. Une fois le `stats.json` réel publié sur la passerelle,
remplacer `public/stats.json` par un fetch vers l'URL publique dans `Metrics.astro`.

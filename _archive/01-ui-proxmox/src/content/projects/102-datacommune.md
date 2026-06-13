---
vmid: 102
name: "DataCommune"
node: node-portfolio
status: running
flagship: true
tagline: "Plateforme d'agrégation des données publiques françaises — 27 jeux de données, ~575M lignes."
probleme: "Rendre interrogeables des dizaines de jeux de données publics hétérogènes (valeurs foncières, cadastre, INSEE, risques, etc.) via une API unique et fiable."
stack:
  - FastAPI
  - PostgreSQL 17
  - PostGIS
  - SvelteKit
  - Docker
resultat: "87 routes REST sur ~575M lignes partitionnées par département, 21 pipelines d'intégration de données avec un échange de tables atomique et résistant aux pannes (trois phases dans une seule transaction), et un harnais de qualité générique qui audite 27 jeux de données depuis une configuration déclarative — ajouter un jeu de données = 10 lignes de config. Milestone « data-confidence » livré avec 90 tests verts, et les grandes orientations tracées dans des ADR versionnés."
lecons: "Un pipeline de données à forte volumétrie doit isoler la charge du risque transactionnel ; sans bascule atomique, une panne en plein chargement laisse la base de production dans un état incohérent."
repo: "github.com/DataCommune/datacommune"
repoPublic: false
commits: 1710
activeSince: "02/2026"
order: 3
---

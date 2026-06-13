---
vmid: 103
name: "Poliscope"
node: node-portfolio
status: running
flagship: false
tagline: "Les débats parlementaires français (Assemblée + Sénat) en fils de discussion lisibles."
probleme: "Rendre lisibles des débats parlementaires éparpillés dans des sources officielles hétérogènes (XML, fichiers de scrutins, etc.)."
stack:
  - Nuxt 4
  - Vue 3
  - Drizzle ORM
  - PostgreSQL 17
  - Playwright
resultat: "Version 2.0 en production sur le homelab — 500 séances, 300 000 interventions, 925 parlementaires (Assemblée + Sénat), 7 062 scrutins et 1,3 million de votes ingérés et normalisés dans un schéma unifié. Recherche plein-texte en français, API REST documentée, migration de schéma sans perte de données."
lecons: "Normaliser trois sources officielles différentes dans un schéma commun — 80 % du travail est dans le nettoyage et la migration, pas dans l'ingestion initiale."
repo: "github.com/AnythingLegalConsidered/Poliscope"
repoPublic: true
commits: 181
activeSince: "03/2026"
order: 4
---

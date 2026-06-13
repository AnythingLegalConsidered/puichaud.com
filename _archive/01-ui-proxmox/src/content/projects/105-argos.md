---
vmid: 105
name: "Argos"
node: node-portfolio
status: paused
flagship: false
tagline: "Plateforme de veille — agrégation multi-sources et recherche plein-texte."
probleme: "Centraliser plusieurs sources de veille hétérogènes avec une isolation stricte des données par utilisateur."
stack:
  - FastAPI
  - React 18
  - Supabase
  - PostgreSQL (RLS)
  - Docker
resultat: "Agrégation multi-sources, isolation par utilisateur via la sécurité au niveau des lignes (RLS) de PostgreSQL, limitation de débit, recherche plein-texte."
lecons: "La RLS pousse la sécurité dans la base de données elle-même — l'isolation ne dépend plus d'un code applicatif qui pourrait oublier une clause de filtrage."
repo: "github.com/AnythingLegalConsidered/Argos"
repoPublic: true
activeSince: "01/2026"
order: 6
---

---
vmid: 9003
name: "MSPR3 — BDD WMS"
node: node-school
status: template
flagship: false
tagline: "Conception de la base d'un système de gestion d'entrepôt sous contraintes de production."
probleme: "Concevoir la base d'un système de gestion d'entrepôt pour une PME logistique, avec des objectifs de continuité chiffrés (reprise en 1 h, perte de données max 15 min)."
stack:
  - MariaDB 11.4 LTS
  - Réplication Galera
  - Méthode Merise
  - SQL
resultat: "12 décisions d'architecture tranchées et argumentées (choix du SGBD, réplication à 3 nœuds, modèle séparant le stock courant de l'historique des mouvements, 9 index ciblés). Revue externe → 3 points bloquants résolus."
lecons: "Modéliser, c'est arbitrer — séparer le stock (lecture rapide) de l'historique des mouvements (audit horodaté) plutôt que tout dénormaliser, et savoir refuser une hypothèse non justifiée par le sujet."
repo: "github.com/AnythingLegalConsidered/MSPR3-NTL-WMS-DB"
repoPublic: true
order: 9
---

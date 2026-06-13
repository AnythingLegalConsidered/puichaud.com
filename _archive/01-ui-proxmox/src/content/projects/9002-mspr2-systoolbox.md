---
vmid: 9002
name: "MSPR2 — SysToolbox"
node: node-school
status: template
flagship: false
tagline: "CLI Python de diagnostic et d'exploitation pour l'infrastructure NordTransit."
probleme: "Industrialiser l'exploitation de l'infrastructure conçue en MSPR1 : vérifications croisées annuaire/DNS/base de données, sauvegardes vérifiées, audit d'obsolescence du parc — le tout utilisable par un technicien comme par une supervision."
stack:
  - Python
  - Active Directory · DNS
  - MySQL
  - Audit réseau
  - GitHub Actions (CI)
resultat: "Trois modules (diagnostic, sauvegarde avec empreinte de contrôle, audit réseau avec détection de fin de support), des codes de sortie normalisés pour l'intégration dans une supervision, des sorties JSON horodatées, et une chaîne d'intégration continue (lint, typage, tests) exécutée sur trois versions de Python. Validé sur un lab de 5 machines virtuelles — rôle tenu : lead."
lecons: "Un outil d'exploitation s'écrit pour les machines autant que pour les humains : codes de sortie normalisés et sorties JSON le rendent intégrable dans une supervision, pas seulement lisible dans un terminal."
repo: "github.com/AnythingLegalConsidered/MSPR2-NTL-SysToolbox"
repoPublic: true
order: 8
---

---
vmid: 104
name: "ARRmada"
node: node-portfolio
status: running
flagship: false
tagline: "Stack de services auto-hébergés, déployée et auto-configurée en une commande."
probleme: "Déployer une dizaine de services interconnectés et les câbler entre eux automatiquement, sans configuration manuelle."
stack:
  - Python
  - Textual (TUI)
  - Jinja2
  - Docker Compose
resultat: "Un installeur en ligne de commande (interface interactive) qui génère les fichiers compose, attend que les services démarrent, récupère les clés d'API et câble les services entre eux automatiquement — une centaine d'interconnexions configurées sans intervention humaine."
lecons: "L'auto-câblage inter-services (échange des clés d'API entre conteneurs) est ce qui distingue un vrai déploiement « en une commande » d'un simple docker compose up."
repo: "github.com/AnythingLegalConsidered/ARRmada"
repoPublic: true
commits: 110
activeSince: "02/2026"
order: 5
---

---
vmid: 100
name: "01-homelab"
node: node-portfolio
status: running
flagship: true
tagline: "Refonte complète du homelab en Infrastructure-as-Code — auditée, testée, restaurable."
probleme: "Reprendre un homelab vieillissant dont l'état réel (environ 60 % des services fonctionnels) divergeait de la documentation, et le reconstruire proprement : chaque conteneur défini dans le code, chaque sauvegarde prouvée par une restauration réelle, sans perdre une seule donnée."
stack:
  - Terraform
  - Ansible
  - Proxmox VE
  - Grafana · Prometheus · Loki
  - SOPS · age
  - Tailscale
  - Caddy
resultat: "Reconstruction en 6 phases avec gates de validation : 11 conteneurs provisionnés par un module Terraform réutilisable, 24 rôles Ansible, sauvegardes 3-2-1 avec test de restauration mesuré (71 secondes, 7 sous-tests), authentification unique par passkey, observabilité complète (métriques, logs, alertes en temps réel) et détection hebdomadaire de dérive entre le code et l'infrastructure réelle. 200 commits en 13 jours, 30 plans d'exécution documentés."
lecons: "Auditer l'existant avant de le remplacer — la documentation mentait, pas l'API. Et une sauvegarde n'existe que restaurée-testée : le gate de la phase 1 a transformé cette règle en contrôle bloquant."
repo: "github.com/AnythingLegalConsidered/01-Homelab"
repoPublic: false
commits: 200
activeSince: "05/2026"
order: 1
---

---
vmid: 101
name: "hexalith-lab"
node: node-portfolio
status: running
flagship: true
tagline: "Lab GitOps complet — l'architecture SI d'une ESN fictive, en Infrastructure-as-Code."
probleme: "Démontrer une architecture d'entreprise cohérente et reproductible (gestion d'identité, gestion de parc, supervision, orchestration) dans le cadre du dossier de validation RNCP — sans configuration manuelle."
stack:
  - Terraform
  - Ansible
  - GitHub Actions
  - Proxmox
  - Azure Entra ID
  - Authentik
  - GLPI
  - SOPS · age
resultat: "Stack multi-couches provisionnée par le code — gestion d'identité (OIDC/SAML/SCIM), gestion de parc, observabilité, automatisation de l'onboarding, un tenant Azure M365 avec 10 utilisateurs provisionnés en Terraform, un état Terraform distant durci, un runner d'intégration continue auto-hébergé. Pipeline GitOps complet monté en une journée (8 pull requests mergées), temps de restauration mesuré à environ 19 secondes, et une revue de code externe dont les 7 constats ont été triés et corrigés."
lecons: "Séparer le provisioning (Terraform) de la configuration (Ansible) dès le départ, et chiffrer les secrets (SOPS+age) avant la première ligne d'IaC — pas après."
repo: "github.com/AnythingLegalConsidered/hexalith-lab"
repoPublic: false
commits: 61
activeSince: "05/2026"
order: 2
---

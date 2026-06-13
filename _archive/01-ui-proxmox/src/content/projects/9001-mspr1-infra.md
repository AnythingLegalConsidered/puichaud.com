---
vmid: 9001
name: "MSPR1 — Infra NordTransit"
node: node-school
status: template
flagship: false
tagline: "Modernisation du SI d'une PME logistique — architecture, sécurité, PRA."
probleme: "Concevoir la modernisation complète du système d'information d'une PME logistique fictive (240 employés, 4 sites) : haute disponibilité pour l'application métier critique, interconnexion sécurisée des sites, plan de reprise d'activité et téléphonie d'entreprise."
stack:
  - Pare-feu FortiGate
  - VPN IPsec
  - Active Directory
  - Cluster HA · SAN
  - PRA cloud (Azure)
  - VoIP · QoS
resultat: "Architecture cible chiffrée à 137 k€ pour un budget maximal de 150 k€, validée par une maquette de 7 machines virtuelles : bascule automatique de l'application métier en 20 secondes, réplication d'annuaire multi-sites immédiate, tunnel de reprise d'activité vers le cloud opérationnel, qualité de service voix mesurée sous charge. Six livrables techniques rédigés en équipe de cinq — rôle tenu : lead et intégrateur."
lecons: "Une architecture ne vaut que testée : les quatre scénarios critiques de la maquette (bascules, reprise d'activité, qualité de service) ont été mesurés, pas supposés."
repo: "github.com/AnythingLegalConsidered/MSPR-NordTransit"
repoPublic: true
order: 7
---

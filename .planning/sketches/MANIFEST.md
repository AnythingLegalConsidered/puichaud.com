# Sketch Manifest

## Design Direction
Portfolio SysOps déguisé en console d'hyperviseur Proxmox VE : chaque projet est
un LXC dans une arborescence datacenter, le CV est le "Summary" du datacenter,
les métriques réelles du homelab alimentent les gauges (JSON poussé par cron,
mocké pour l'instant). Dark theme gris/bleu + orange Proxmox, mono pour les
valeurs. Contrainte forte : rester lisible pour un recruteur non-technique —
l'enveloppe est thématique, les fiches projets restent du texte clair
(Problème → Stack → Résultat → Leçons). Cible d'implémentation : Astro statique,
déployé sur Cloudflare Pages (puichaud.com), métriques servies par le VPS OVH.

## Reference Points
Interface Proxmox VE (dark mode), dashboards Grafana, terminal portfolios.
Concepts écartés : carte grand strategy EU (gardé pour une page secondaire
"side quests"), dashboard Grafana pur, bureau rétro.

## Sketches

| # | Name | Design Question | Winner | Tags |
|---|------|----------------|--------|------|
| 001 | console-hyperviseur | Quel dosage entre réplique Proxmox fidèle et lisibilité recruteur ? | **C — Landing hybride** | layout, concept, theme, portfolio |

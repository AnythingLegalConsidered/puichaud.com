---
date: "2026-05-28"
kind: decision
project: "hexalith-lab"
title: "Un secret affiché en clair → rotation immédiate"
---
Pendant un provisioning, un secret s'est affiché en clair dans une sortie de terminal. Réflexe appliqué sans attendre : rotation immédiate, puis bascule de tous les secrets vers un stockage chiffré. Un secret vu est un secret compromis.

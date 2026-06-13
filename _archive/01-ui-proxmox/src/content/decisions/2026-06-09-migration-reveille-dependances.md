---
date: "2026-06-09"
kind: postmortem
project: "Refonte homelab"
title: "La migration qui réveille les dépendances"
---
En migrant un service de localisation, découverte qu'un collecteur en aval était en erreur depuis une semaine, silencieusement. Une fois repointé, les clients mobiles ont re-poussé leur tampon local — aucune donnée perdue. Une migration est aussi un test d'intégration grandeur nature de tout ce qui dépend du service.

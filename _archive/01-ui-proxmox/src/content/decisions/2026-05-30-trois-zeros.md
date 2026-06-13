---
date: "2026-05-30"
kind: decision
project: "Refonte homelab"
title: "Reconstruire n'est pas effacer : trois « zéros » distincts"
---
En relançant l'infra de zéro, j'ai explicitement séparé trois choses qu'on confond souvent : repartir de zéro côté code (oui), redéployer les conteneurs (oui, mais après une sauvegarde restaurée-testée), et effacer les données (jamais). Sans cette distinction, « rebuild propre » devient « perte de données ».

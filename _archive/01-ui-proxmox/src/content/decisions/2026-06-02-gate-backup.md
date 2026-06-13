---
date: "2026-06-02"
kind: gate
project: "Refonte homelab"
title: "Un backup n'existe que restauré-testé"
---
Plutôt que de cocher « sauvegardes en place », j'ai écrit un contrôle non contournable : un script qui restaure réellement les sauvegardes sur des conteneurs temporaires et vérifie que les services démarrent et que les données sont intègres (7 sous-tests, restauration complète mesurée à 71 secondes). La phase ne pouvait pas se clore sans un résultat OK. Découverte au passage : un service qui tournait à vide depuis des mois.

---
date: "2026-06-11"
kind: postmortem
project: "Refonte homelab"
title: "Un serveur qui chauffe… à 2 % de charge"
---
Ventilateur à fond, machine chaude, mais 2,5 % de CPU sur 7 jours. Cause : le profil de gestion d'énergie était réglé sur « performance » — les cœurs montaient à pleine fréquence même au repos. Passage en « économie d'énergie » : −3,7 °C en deux minutes. Diagnostiquer avant de remplacer.

---
date: "2026-06-08"
kind: postmortem
project: "Refonte homelab"
title: "Le DNS à double visage"
---
Pendant une migration, un service répondait correctement depuis l'intérieur du réseau mais servait l'ancienne version depuis l'extérieur : un enregistrement générique pointait encore vers l'ancienne topologie. Correctif : des enregistrements explicites par service, posés via l'API du registrar. Le même trou existait sur deux autres services — corrigés dans la foulée.

---
date: "2026-06-10"
kind: postmortem
project: "DataCommune"
title: "97 % des points géographiques hors de leur zone"
---
Après ingestion, presque tous les points tombaient hors de leur département. Cause racine : coordonnées dans une projection cartographique différente de celle attendue, et axes inversés. Correctif : reprojection systématique + un contrôle géométrique qui rejette tout point hors des limites attendues.

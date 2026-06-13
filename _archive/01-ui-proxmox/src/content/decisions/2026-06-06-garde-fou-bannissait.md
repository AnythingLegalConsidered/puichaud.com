---
date: "2026-06-06"
kind: postmortem
project: "Refonte homelab"
title: "Le garde-fou qui bannissait les habitants"
---
Le filtre anti-intrusion de la passerelle comptait les redirections normales du flux de connexion par passkey comme des tentatives échouées — et finissait par bannir les utilisateurs légitimes après leur connexion réussie. Correctif : exclusion explicite du motif légitime. Un outil de sécurité mal calibré est une panne comme une autre.

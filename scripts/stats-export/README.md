# stats-export — générateur du `stats.json` public

> **Livrable documenté, non branché.** Ce script tourne **côté infra** (jamais sur le site) :
> le site est statique et ne contacte jamais le homelab. Il lit uniquement le fichier
> `stats.json` publié sur le domaine de la passerelle (ex. `stats.puichaud.com`).

## Architecture

```
[tâche planifiée ~10 min, sur une machine du LAN]
        │
        ├─ scan API Proxmox      (lecture seule, token dédié à droits minimaux)
        ├─ scan API Uptime Kuma  (interrogé en local, jamais exposé)
        │
        ▼
  filtre par LISTE BLANCHE (whitelist.yml) + renommage
        │
        ▼
  stats.json  ──(copie vers la passerelle)──►  servi en HTTPS public
```

Principes de sécurité :

- **Liste blanche explicite** : seuls les services nommés dans `whitelist.yml` sortent.
  Tout le reste est ignoré par défaut (deny-by-default).
- **Agrégats uniquement** : pourcentages CPU/RAM agrégés au niveau cluster, uptime — jamais
  d'adresse, de port, de version, ni de détail par machine au-delà du nom court autorisé.
- **Jeton API en lecture seule**, à périmètre minimal, stocké chiffré (SOPS) côté infra.
- **Garde de fraîcheur côté site** : si `generated_at` dépasse 1 h, le site affiche
  « données du \<date\> » au lieu de faire passer des chiffres figés pour du temps réel.

## Forme du JSON produit

```json
{
  "generated_at": "2026-06-12T06:30:00Z",
  "cluster": { "uptime_30d": 99.2, "cpu_pct": 3, "ram_pct": 48, "iac_lxc": 12 },
  "nodes": [ { "id": "pve02", "online": true }, { "id": "pve01", "online": false } ],
  "services": [ { "name": "obs", "uptime_30d": 99.9 } ]
}
```

## Mise en service (étapes à réaliser côté infra, hors de ce repo)

1. Créer un token API Proxmox en lecture seule (audit), périmètre minimal.
2. Copier `whitelist.example.yml` → `whitelist.yml` et lister les services publiables.
3. Renseigner les variables d'environnement (voir en-tête de `export_stats.py`) —
   jamais en clair dans le repo : utiliser le gestionnaire de secrets de l'infra.
4. Planifier l'exécution (timer systemd, toutes les ~10 min) sur une machine du LAN.
5. Publier le fichier produit sur la passerelle (copie vers le docroot servi en HTTPS),
   avec l'en-tête `Access-Control-Allow-Origin: https://puichaud.com`.
6. Côté site : changer `STATS_URL` dans `src/scripts/console.ts` vers l'URL publique.

Tant que ce branchement n'est pas fait, le site sert le mock `public/stats.json`
(daté du build → la garde de fraîcheur affichera honnêtement la date).

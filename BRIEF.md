# BRIEF — Site portfolio « console hyperviseur » d'Ianis Puichaud

> **Document autonome.** Tout le contexte nécessaire pour construire le site est ici.
> **Tu n'as pas besoin de lire d'autres dépôts ou dossiers** — ce brief contient les
> données déjà sélectionnées, réécrites et anonymisées. Construis à partir de ce fichier
> et du sketch HTML de référence (`.planning/sketches/001-console-hyperviseur/index.html`).

---

## 1. Mission

Construire un **site portfolio statique** pour un profil **SysOps / administrateur systèmes**
(junior, en alternance, visant un Master Infrastructure & Cloud). Le site est déguisé en
**console d'hyperviseur Proxmox VE** : chaque projet et chaque service d'infra y est présenté
comme un conteneur dans une arborescence de datacenter. L'objectif est de montrer à un
recruteur ou un jury que le candidat raisonne comme un ingénieur d'infrastructure — pas
seulement *ce qu'il a fait*, mais *pourquoi* et *ce qu'il a appris*.

**Public visé** : recruteurs (techniques et RH non-techniques) et jury de Master. Contrainte
permanente : l'enveloppe est thématique, mais **les fiches de contenu doivent rester lisibles
par un non-technicien**.

---

## 2. Concept retenu (variante validée : « Landing hybride »)

Un sketch HTML jouable existe déjà à
`.planning/sketches/001-console-hyperviseur/index.html` — **utilise-le comme référence
visuelle et structurelle**. La variante retenue est la **C (Landing hybride)** :

1. **Hero** lisible par tout le monde : nom, titre, une phrase de positionnement, un bandeau
   de statut (« homelab 99.2% · 2 nodes · 12 LXC sous Terraform · 0 port exposé »), deux CTA
   (Télécharger le CV, GitHub).
2. **Console Proxmox embarquée** dessous, en pièce centrale :
   - **Arbre de gauche** : Datacenter → nodes → conteneurs (réels + virtuels).
   - **Panneau central à onglets** : `Summary` (le CV au niveau datacenter, la fiche au niveau
     d'un item), `Décisions` (timeline de décisions et postmortems), `>_ Console` (easter egg,
     un faux terminal).
3. **Footer** contact.

Le sketch implémente déjà : l'arbre cliquable, les onglets, les fiches projet, la timeline
dépliable, des gauges de métriques animées (mockées), le thème Proxmox. **Reprends cette
structure**, transpose-la proprement dans la stack cible, et branche les vraies données.

---

## 3. Stack technique cible

| Élément | Choix | Raison |
|---------|-------|--------|
| Framework | **Astro** (statique, zéro JS par défaut, îlots si besoin) | Parfait pour un site contenu+perf, SEO, Lighthouse élevé |
| Styling | CSS variables (thème partagé) + CSS scoped Astro | Le thème Proxmox est déjà défini (voir §8) |
| Contenu | **Content collections** Astro (Markdown/MDX) pour projets + décisions | Édition simple, typée |
| Données live | `fetch` côté client d'un **`stats.json`** servi par un domaine séparé | Voir §9 |
| Déploiement | **Cloudflare Pages** (build sur push GitHub + deploy hook cron quotidien) | Le site reste up même si l'infra perso tombe |
| Domaine | **puichaud.com** (DNS à migrer OVH → Cloudflare pour l'apex) | Domaine pro, déjà possédé |
| CI | GitHub → Cloudflare Pages (build auto). Lint + build gate. | — |

**Principes de build** : statique d'abord, accessible (contraste, navigation clavier,
`prefers-reduced-motion`), responsive (l'arbre passe au-dessus du panneau en mobile),
performant (Lighthouse > 90). Le site ne fait **jamais** d'appel direct à l'infra perso :
il lit seulement un fichier JSON public déjà filtré.

---

## 4. Profil (contenu du `Summary` au niveau Datacenter = le CV)

**Ianis Puichaud — SysOps / futur DevOps**

- Alternant Administrateur Systèmes chez EQUANS — support technique niveau 2 (Active Directory,
  Intune, SAP, parc Windows).
- BAC+3 SYSOPS à EPSI Nantes. Objectif : **Master Infrastructure & Cloud en alternance dès
  septembre 2026**, puis poste SysAdmin, et à moyen terme une orientation DevOps / automatisation.
- Son homelab est un **cluster Proxmox 2 nœuds reconstruit de zéro en Infrastructure-as-Code**
  (Terraform + Ansible), monitoré, sauvegardé selon la règle 3-2-1 (et restauré-testé), et
  accessible partout sans exposer un seul port public. Il sert de terrain d'expérimentation
  pour ce qu'il ne peut pas se permettre de casser au travail.

**Contact** : ianis@puichaud.com · GitHub : github.com/AnythingLegalConsidered · puichaud.com

**Compétences (badges)** : Proxmox VE · Terraform · Ansible · Docker · GitHub Actions ·
Windows Server / Active Directory · Linux (Debian) · Grafana · Loki · Prometheus ·
Caddy / reverse proxy · Tailscale · SOPS · age · PostgreSQL / PostGIS · PowerShell · Python · Bash

---

## 5. Projets vitrine (fiches — format : Problème → Stack → Résultat → Leçons)

Présentés dans l'arbre sous un **node virtuel `node-portfolio`**. Deux « projets phares » (★).

### ★ hexalith-lab — LXC 101 — *flagship*
**Tagline** : Lab GitOps complet — l'architecture SI d'une ESN fictive, en Infrastructure-as-Code.
- **Problème** : démontrer une architecture d'entreprise cohérente et reproductible (gestion
  d'identité, gestion de parc, supervision, orchestration) dans le cadre du dossier de
  validation RNCP — sans configuration manuelle.
- **Stack** : Terraform · Ansible · GitHub Actions · Proxmox · Azure Entra ID · Authentik · GLPI · SOPS+age.
- **Résultat** : stack multi-couches provisionnée par le code — gestion d'identité (OIDC/SAML/SCIM),
  gestion de parc, observabilité, automatisation de l'onboarding, un tenant Azure M365 avec
  10 utilisateurs provisionnés en Terraform, un état Terraform distant durci, un runner
  d'intégration continue auto-hébergé. Temps de restauration mesuré à environ 19 secondes.
- **Leçons** : séparer le provisioning (Terraform) de la configuration (Ansible) dès le départ,
  et chiffrer les secrets (SOPS+age) avant la première ligne d'IaC — pas après.
- **Lien** : github.com/AnythingLegalConsidered/hexalith-lab

### ★ DataCommune — LXC 102 — *flagship*
**Tagline** : Plateforme d'agrégation des données publiques françaises — 27 jeux de données, ~575M lignes.
- **Problème** : rendre interrogeables des dizaines de jeux de données publics hétérogènes
  (valeurs foncières, cadastre, INSEE, risques, etc.) via une API unique et fiable.
- **Stack** : FastAPI · PostgreSQL 17 · PostGIS · SvelteKit · Docker.
- **Résultat** : 87 routes REST sur ~575M lignes, 21 pipelines d'intégration de données avec
  un **échange de tables atomique et résistant aux pannes** (trois phases dans une seule
  transaction), et un **harnais de qualité générique** qui audite 27 jeux de données depuis
  une configuration déclarative — ajouter un jeu de données = 10 lignes de config.
- **Leçons** : un pipeline de données à forte volumétrie doit isoler la charge du risque
  transactionnel ; sans bascule atomique, une panne en plein chargement laisse la base
  de production dans un état incohérent.
- **Lien** : github.com/AnythingLegalConsidered/datacommune-mcp

### Poliscope — LXC 103
**Tagline** : Les débats parlementaires français (Assemblée + Sénat) en fils de discussion lisibles.
- **Problème** : rendre lisibles des débats parlementaires éparpillés dans des sources
  officielles hétérogènes (XML, fichiers de scrutins, etc.).
- **Stack** : Nuxt 4 · Vue 3 · Drizzle ORM · PostgreSQL 17 · Playwright.
- **Résultat** : version 2.0 en production sur le homelab — 500 séances, 300 000 interventions,
  1,3 million de votes ingérés et normalisés dans un schéma unifié. Recherche plein-texte en
  français, API REST documentée, migration de schéma sans perte de données.
- **Leçons** : normaliser trois sources officielles différentes dans un schéma commun — 80 %
  du travail est dans le nettoyage et la migration, pas dans l'ingestion initiale.
- **Lien** : github.com/AnythingLegalConsidered/Poliscope

### ARRmada — LXC 104
**Tagline** : Stack de services auto-hébergés, déployée et auto-configurée en une commande.
- **Problème** : déployer une dizaine de services interconnectés et les câbler entre eux
  automatiquement, sans configuration manuelle.
- **Stack** : Python · interface TUI (Textual) · Jinja2 · Docker Compose.
- **Résultat** : un installeur en ligne de commande (interface interactive) qui génère les
  fichiers compose, attend que les services démarrent, récupère les clés d'API et câble les
  services entre eux automatiquement.
- **Leçons** : l'auto-câblage inter-services (échange des clés d'API entre conteneurs) est ce
  qui distingue un vrai déploiement « en une commande » d'un simple `docker compose up`.
- **Lien** : github.com/AnythingLegalConsidered/ARRmada

### Argos — LXC 105
**Tagline** : Plateforme de veille — agrégation multi-sources et recherche plein-texte.
- **Problème** : centraliser plusieurs sources de veille hétérogènes avec une isolation
  stricte des données par utilisateur.
- **Stack** : FastAPI · React 18 · Supabase · PostgreSQL (Row-Level Security) · Docker.
- **Résultat** : agrégation multi-sources, isolation par utilisateur via la sécurité au niveau
  des lignes (RLS) de PostgreSQL, limitation de débit, recherche plein-texte. Version 2.0 en cours.
- **Leçons** : la RLS pousse la sécurité dans la base de données elle-même — l'isolation ne
  dépend plus d'un code applicatif qui pourrait oublier une clause de filtrage.
- **Lien** : github.com/AnythingLegalConsidered/Argos

### Projets académiques (node virtuel `node-school`)

**MSPR — NordTransit (conception de base de données WMS)** — modèle 9001
- **Problème** : concevoir la base d'un système de gestion d'entrepôt pour une PME logistique,
  avec des objectifs de continuité chiffrés (reprise en 1 h, perte de données max 15 min).
- **Stack** : MariaDB 11.4 LTS · réplication Galera · méthode Merise · SQL.
- **Résultat** : 12 décisions d'architecture tranchées et argumentées (choix du SGBD,
  réplication à 3 nœuds, modèle séparant le stock courant de l'historique des mouvements,
  9 index ciblés). Revue externe → 3 points bloquants résolus.
- **Leçons** : modéliser, c'est arbitrer — séparer le stock (lecture rapide) de l'historique
  des mouvements (audit horodaté) plutôt que tout dénormaliser, et savoir refuser une
  hypothèse non justifiée par le sujet.
- **Lien** : github.com/AnythingLegalConsidered/MSPR3-NTL-WMS-DB

**Déploiement Kubernetes (projet Scrum)** — modèle 9002
- **Problème** : livrer un déploiement Kubernetes en méthode Scrum, en équipe, avec les
  contraintes d'un vrai projet agile (rôles, sprints, rétrospectives).
- **Stack** : K3s · Symfony · React · Scrum.
- **Résultat** : déploiement livré en sprints, en tant que Product Owner (backlog, Definition
  of Ready/Done, planning poker, rétrospectives).
- **Leçons** : la méthode pèse autant que la technique — un sprint mal découpé coûte plus cher
  qu'un manifeste YAML raté.
- **Lien** : github.com/AnythingLegalConsidered/EPSI-B3-ASRBD-Agile-G2

---

## 6. Infrastructure homelab à afficher (arbre, curé)

Reproduire fidèlement une console Proxmox **mais avec uniquement les données ci-dessous**
(déjà filtrées). Les conteneurs gérés par Terraform portent un badge **⚙**.

### Node `pve02` — hyperviseur principal (réel)
*Résumé* : porte aujourd'hui toute l'infra reconstruite ; la plage 350-360 est entièrement
gérée par Terraform. DNS, reverse proxy interne et bascule automatique assurent la continuité.

| ID | Nom | Statut | IaC | Note (affichable) |
|----|-----|--------|-----|-------------------|
| 355 | obs | running | ⚙ | Stack d'observabilité unifiée (Grafana, Prometheus, Loki, Alertmanager, Alloy, Uptime Kuma). C'est elle qui alimentera les métriques live du site. |
| 350 | pbs-01 | running | ⚙ | Serveur de sauvegarde — datastore dédié. |
| 351 | backrest-01 | running | ⚙ | Sauvegardes dual-repo : local + copie distante chiffrée. Pilier de la règle 3-2-1. |
| 353 | sso | running | ⚙ | Authentification unique par passkey pour tous les services. |
| 352 | adguard-iac | running | ⚙ | DNS filtrant, géré en IaC. |
| 354 | bastion | running | ⚙ | Point de rebond d'administration durci. |
| 356 | homepage | running | ⚙ | Tableau de bord des services, derrière l'authentification unique. |
| 357 | fava | running | ⚙ | Finances personnelles plain-text. *Données privées — non exposées.* |
| 358 | caldav | running | ⚙ | Agenda et contacts auto-hébergés. |
| 359 | dawarich | running | ⚙ | Service personnel (PostGIS). *Données privées.* |
| 360 | immich | running | ⚙ | Photos auto-hébergées (PostGIS). *Données privées.* |
| 252 | adguard-02 | running | — | DNS en haute disponibilité — conservé pour la continuité. |
| 290 | media-stack | running | — | Stack de services auto-hébergés (cf. projet ARRmada). |
| 200 | poliscope-db | running | — | Base PostgreSQL du projet Poliscope. |
| 9020 | hex-authentik | running | ⚙ | Lab Hexalith — gestion d'identité. |
| 9024 | hex-supervision | running | ⚙ | Lab Hexalith — supervision. |

### Node `pve01` — hyperviseur secondaire (réel)
*Résumé* : second nœud du cluster, dédié à la haute disponibilité. Actuellement hors-ligne
(affiché `stopped`) — réanimation planifiée. Afficher honnêtement le statut.

### Node `edge-vps` — passerelle publique (réel)
*Résumé* : seul point d'entrée public. Reverse proxy + TLS (Caddy), réseau maillé chiffré
(Tailscale) vers le réseau local, filtrage des accès. Tout le trafic externe transite ici ;
les ports publics du homelab sont fermés. C'est aussi cette machine qui servira le `stats.json`
du portfolio.

---

## 7. Onglet « Décisions » (timeline de décisions et postmortems)

C'est la section différenciante. Format : une liste chronologique d'entrées dépliables, chacune
avec une **date**, un **type** (Décision / Postmortem / Gate / Preuve), un **titre** et un
**corps de 2-4 phrases**. Ton : factuel, pédagogique, première personne. Contenu de départ
(à enrichir ensuite, déjà anonymisé) :

1. **2026-06-02 · Gate** — *Un backup n'existe que restauré-testé.* Plutôt que de cocher
   « sauvegardes en place », j'ai écrit un contrôle non contournable : un script qui restaure
   réellement les sauvegardes sur des conteneurs temporaires et vérifie que les services
   démarrent et que les données sont intègres (7 sous-tests). La phase ne pouvait pas se clore
   sans un résultat OK. Découverte au passage : un service qui tournait à vide depuis des mois.
2. **2026-05-30 · Décision** — *Reconstruire n'est pas effacer : trois « zéros » distincts.*
   En relançant l'infra de zéro, j'ai explicitement séparé trois choses qu'on confond souvent :
   repartir de zéro côté code (oui), redéployer les conteneurs (oui, mais après une sauvegarde
   restaurée-testée), et effacer les données (jamais).
3. **2026-06-04 · Postmortem** — *La clé générée dans le mauvais réseau.* Une journée entière
   de symptômes contradictoires pour une seule cause racine : une clé d'authentification réseau
   avait été générée dans le mauvais réseau. Leçon : quand plusieurs symptômes n'ont aucun lien
   apparent, remonter à la cause commune avant de traiter chaque symptôme.
4. **2026-06-11 · Postmortem** — *Un serveur qui chauffe… à 2 % de charge.* Ventilateur à fond,
   machine chaude, mais 2,5 % de CPU sur 7 jours. Cause : le profil de gestion d'énergie était
   réglé sur « performance » — les cœurs montaient à pleine fréquence même au repos. Passage en
   « économie d'énergie » : −3,7 °C en deux minutes. Diagnostiquer avant de remplacer.
5. **2026-06-06 · Preuve** — *L'observabilité a rattrapé une sauvegarde morte en silence.*
   Une métrique sur la fraîcheur des sauvegardes a révélé que la copie distante était cassée
   depuis plusieurs jours — un durcissement de la configuration d'accès l'avait silencieusement
   coupée. Détecté et réparé en 48 h. C'est exactement à cela que sert l'observabilité.
6. **2026-06-10 · Postmortem** — *L'intégration continue était morte depuis des semaines.*
   Un audit croisé sur 286 fichiers a révélé que les workflows d'intégration continue étaient
   rangés dans les mauvais dossiers : ils n'étaient jamais exécutés. Résultat : des dizaines
   d'erreurs et 8 tests cassés passés inaperçus. Correctif : un workflow à la racine avec les
   bons filtres de chemin.
7. **2026-06-10 · Postmortem** — *97 % des points géographiques hors de leur zone.* Après
   ingestion, presque tous les points tombaient hors de leur département. Cause racine :
   coordonnées dans une projection cartographique différente de celle attendue, et axes
   inversés. Correctif : reprojection systématique + un contrôle géométrique qui rejette tout
   point hors des limites attendues.
8. **2026-05-28 · Décision** — *Un secret affiché en clair → rotation immédiate.* Pendant un
   provisioning, un secret s'est affiché en clair dans une sortie de terminal. Réflexe appliqué
   sans attendre : rotation immédiate, puis bascule de tous les secrets vers un stockage
   chiffré. Un secret vu est un secret compromis.

---

## 8. Design system (thème Proxmox)

Reprendre les variables CSS du sketch (`.planning/sketches/themes/default.css`). Essentiel :

```
Fond            #1e1e1e / #141414       Surfaces  #252526 #2d2d30 #333337
Bordures        #3e3e42                 Texte     #d4d4d4 (muted #9d9d9d)
Primaire        #e57000  (orange Proxmox, hover #ff8a1f)
Accent          #3892d4  (bleu sélection)
Succès #5cb85c   Alerte #e6a23c   Danger #e05f5f
Police texte    Segoe UI / system-ui
Police mono     Cascadia Mono / JetBrains Mono / Consolas  (pour toutes les valeurs techniques)
Rayons 3/6/10px   Ombres douces noires
```

Indicateurs de statut : pastille pleine verte (running), orange (paused), grise (stopped),
carré gris (template). Les valeurs techniques (ID, métriques, chemins) sont **toujours** en
police mono.

---

## 9. Architecture des données « live »

Le site est statique et **ne contacte jamais le homelab**. Un fichier **`stats.json`** est
généré côté infra par une tâche planifiée (toutes les ~10 min), filtré par une liste blanche
explicite, puis publié sur le domaine de la passerelle (ex. `stats.puichaud.com`). Le site le
récupère côté client et hydrate : les gauges (CPU/RAM agrégés, uptime, nombre de conteneurs
sous IaC), le statut des nodes, et l'uptime par service (issu d'Uptime Kuma, interrogé
localement par la tâche, jamais exposé directement).

**Forme indicative du JSON** (à finaliser) :

```json
{
  "generated_at": "2026-06-12T06:30:00Z",
  "cluster": { "uptime_30d": 99.2, "cpu_pct": 3, "ram_pct": 48, "iac_lxc": 12 },
  "nodes": [ { "id": "pve02", "online": true }, { "id": "pve01", "online": false } ],
  "services": [ { "name": "obs", "uptime_30d": 99.9 } ]
}
```

Règle de fraîcheur : si `generated_at` a plus d'1 h, afficher « données du \<date\> » plutôt
que de faire passer des chiffres figés pour du temps réel. Pour le build initial, **mocker ce
JSON** (le sketch contient déjà des valeurs plausibles) ; le branchement réel viendra après.

---

## 10. Règles de confidentialité (à respecter dans tout le rendu)

Ne **jamais** afficher, dans le code source comme dans le contenu :

- **Adresses IP** internes ou publiques, noms d'hôtes complets, domaines internes, numéros de
  port, versions logicielles précises (évite le fingerprinting).
- **Secrets** sous toute forme (clés, jetons, mots de passe, identifiants).
- Toute donnée liée à **l'employeur** du candidat (tickets, noms de personnes, outils internes).
- **Données personnelles** : le contenu des services personnels (photos, finances,
  localisation) — on nomme la *catégorie* de service, jamais la donnée.
- Le service qui héberge les **mots de passe / secrets** du homelab : ne pas le faire figurer
  dans l'arbre public.

Tout le contenu de ce brief est **déjà filtré** selon ces règles : reprends-le tel quel, ne le
ré-enrichis pas avec des détails qui n'y figurent pas.

---

## 11. Périmètre de construction (pour rester focalisé)

Ce brief est **suffisant et complet** pour construire le site. Il n'est pas nécessaire — et
c'est déconseillé — d'aller explorer les dépôts ou dossiers sources du candidat pour récupérer
davantage de détails : tout ce qui doit apparaître est déjà ici, sélectionné et reformulé. Si
une information manque pour une décision de construction, choisis une valeur par défaut
raisonnable et signale-la, plutôt que d'aller chercher dans des sources externes.

### Ordre de construction suggéré

1. Projet Astro + thème (variables CSS du §8) + layout console (hero + arbre + panneau à onglets).
2. Content collections : `projects` (§5) et `decisions` (§7). Données seed = ce brief.
3. Arbre de navigation depuis les données des §5 et §6 (nodes réels + virtuels, badges IaC).
4. Onglet `Summary` (CV §4 + gauges mockées §9), onglet `Décisions`, onglet `>_ Console` (easter egg).
5. Responsive + accessibilité + `prefers-reduced-motion`. Lighthouse > 90.
6. `stats.json` mocké en `public/`, fetch client-side avec garde de fraîcheur.
7. Build + déploiement Cloudflare Pages, domaine puichaud.com.

**Verify final** : `npm run build` passe sans erreur ; le site est navigable au clavier ;
aucune des données interdites du §10 n'apparaît dans le HTML généré.
```

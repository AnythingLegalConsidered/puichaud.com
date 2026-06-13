# Prompt — Construction du site portfolio « console hyperviseur »

> À coller dans une nouvelle session Claude Fable 5, dans le dossier
> `c:\Users\Dharma\Documents\Pro\Perso\Site Web`.

---

Tu vas construire mon **site portfolio**, un site vitrine statique déguisé en **console
d'hyperviseur Proxmox VE**, qui présente mes projets et mon infrastructure homelab et se
connecte (en lecture seule, via un export) à mes vrais conteneurs et machines. Je suis un
profil **SysOps / administrateur systèmes** en alternance, je vise un Master Infrastructure
& Cloud, et ce site doit le démontrer à des recruteurs et à un jury.

## Étape 0 — Lis le socle

Commence par lire **`BRIEF.md`** dans ce dossier : il contient le concept retenu, le design
system, les fiches projets déjà sélectionnées et anonymisées, l'arbre Proxmox curé, les
entrées de la timeline de décisions, l'architecture des données live et les règles de
confidentialité. **C'est ta source de vérité.** Lis aussi le sketch HTML de référence
`.planning/sketches/001-console-hyperviseur/index.html` (variante C « Landing hybride »
validée) — il implémente déjà la structure visuelle à reprendre.

## Étape 1 — Enrichis le contexte (analyse, ne code pas encore)

Le BRIEF est volontairement condensé. Pour faire un site vraiment riche, **explore mes
sources** et remonte tout ce qui est pertinent et publiable (en respectant les exclusions
ci-dessous). Sois exhaustif sur ce qui sert le portfolio :

- **Repos GitHub** (`gh repo list`, compte `AnythingLegalConsidered`) : descriptions, langages,
  dates d'activité, et pour les plus intéressants l'historique de commits (fréquence, volume,
  ampleur) — utile pour montrer que les projets sont vivants.
- **Projets locaux** : `C:\Users\Dharma\Documents\Pro\Perso` et `C:\Users\Dharma\Documents\Pro\Ecole`.
  Pour chaque projet intéressant : README, dossier `.planning/` (PROJECT.md, ROADMAP.md,
  SUMMARYs, décisions/ADR), docs. Cherche : architecture, chiffres/métriques, choix techniques
  argumentés, incidents résolus, preuves.
- **Vault Obsidian** : `C:\Users\Dharma\Documents\Pro\Perso\Projet Obsidian\Obsidian-Main`.
  En particulier les fiches projets dans `02 Projets/Active/*.md` (section `## Log`) et les
  journaux de session dans `01 Journal/Daily/`. C'est là que je consigne mes grandes décisions
  et mon cheminement de travail — la matière première de la timeline « Décisions & postmortems ».
- **Mon homelab reconstruit** : le dépôt `01-Homelab` (Terraform + Ansible) en est la source.
  Son `docs/infrastructure.md` (état scanné de l'API Proxmox) et son `.planning/STATE.md`
  donnent l'état réel des conteneurs et l'historique des phases de la refonte.

À partir de cette analyse, **propose-moi** (avant de coder) :
1. Les projets à mettre en vitrine et l'ordre, avec une courte justification.
2. Les entrées de décisions/postmortems les plus parlantes à ajouter à celles du BRIEF (datées,
   réécrites lisibles, anonymisées).
3. Toute amélioration de structure, de contenu ou d'interaction que mon matériel rend possible
   et que le BRIEF n'a pas anticipée.
4. Les points où il me faut trancher (domaine, contenu sensible, choix de présentation).

Présente ça comme une proposition que je valide ou ajuste — **ne commence pas à construire le
site avant mon accord sur cette analyse.**

## Périmètre et exclusions (important — à respecter strictement)

Le périmètre d'exploration a déjà été nettoyé : les projets hors-sujet ont été sortis des
dossiers que tu vas explorer. Par sécurité, **n'analyse pas et n'inclus pas** les dépôts ou
dossiers dont le cœur est la **sécurité offensive / le test d'intrusion / l'exploitation**
(par exemple un framework de pentest, une VM « kali », d'anciens dépôts de ce type). Ils ne
font pas partie de la vitrine et n'ont aucune valeur pour ce portfolio orienté infrastructure.
Si tu en croises un pendant l'exploration, **ignore-le et passe au suivant** — ne le lis pas.

De même, **n'inclus rien lié à mon employeur** (tickets, noms, outils internes) : un projet
d'automatisation que j'ai fait dans ce cadre peut être mentionné en termes génériques, sans
contenu interne ni code.

Traite la sécurité **uniquement sous l'angle défensif** — c'est le métier normal d'un
administrateur systèmes (authentification unique, durcissement, sauvegardes restaurées-testées,
segmentation réseau, gestion chiffrée des secrets, observabilité). C'est largement suffisant
pour démontrer le niveau attendu.

## Règles de confidentialité (dans tout le rendu)

Ne jamais faire apparaître, ni dans le contenu ni dans le code source : adresses IP, noms
d'hôtes complets, domaines internes, numéros de port, versions logicielles précises, secrets
sous toute forme, données personnelles (le contenu des services photo/finance/localisation —
on nomme la catégorie, jamais la donnée), et le service qui héberge les mots de passe du
homelab. Le BRIEF est déjà filtré selon ces règles ; applique-les à tout ajout issu de ton
exploration.

## Concept, stack et connexion « live » (détaillés dans le BRIEF §2, §3, §9)

- **Concept** : variante C — hero lisible par tous + console Proxmox embarquée (arbre de
  navigation à gauche : nodes réels `pve02`/`pve01`/`edge-vps` + nodes virtuels
  `node-portfolio`/`node-school` ; panneau central à onglets : `Summary` = CV / fiche,
  `Décisions` = timeline, `>_ Console` = easter egg terminal). Badge ⚙ sur les conteneurs
  gérés par Terraform.
- **Stack** : Astro statique, content collections Markdown pour projets et décisions, thème
  CSS Proxmox (variables du §8 du BRIEF), responsive + accessible (clavier,
  `prefers-reduced-motion`), Lighthouse > 90.
- **Connexion live** : le site **ne contacte jamais le homelab directement**. Il lit un fichier
  **`stats.json`** public (métriques agrégées CPU/RAM/uptime, statut des nodes, uptime par
  service via Uptime Kuma) généré côté infra par une tâche planifiée, filtré par liste blanche,
  publié sur le domaine de la passerelle. Garde de fraîcheur : au-delà d'1 h, afficher « données
  du \<date\> ». Pour le build, **mocke ce JSON** (valeurs plausibles déjà dans le sketch) ;
  prévois aussi le **script d'export** (tâche planifiée → scan API Proxmox + Uptime Kuma →
  liste blanche/renommage → `stats.json` → publication) comme livrable documenté, sans le
  brancher sur le vrai homelab pour l'instant.
- **Déploiement** : Cloudflare Pages (build sur push GitHub + rebuild quotidien), domaine
  `puichaud.com`.

## Méthode de travail

Procède par étapes, montre-moi tes propositions aux points de décision, et écris du code propre
et commenté en anglais. Quand l'analyse de l'étape 1 est validée, construis le site dans ce
dossier, puis vérifie : `npm run build` passe sans erreur, le site est navigable au clavier, et
**aucune donnée interdite n'apparaît dans le HTML généré**.

Si une information te manque pour une décision de construction, choisis une valeur par défaut
raisonnable et signale-la — ne va pas chercher dans des sources hors du périmètre défini ci-dessus.

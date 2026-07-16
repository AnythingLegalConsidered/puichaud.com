export const projects = [
  {
    slug: 'datacommune',
    name: 'DataCommune',
    number: '01',
    status: 'En ligne',
    meta: 'Produit data · 2025 →',
    summary:
      'Une plateforme de données publiques que je conçois, développe et exploite seul : ingestion, API, interface et chaîne de déploiement.',
    outcome:
      '27 jeux de données réunis dans une API unique. L’instance auditée contient 37,5 millions de lignes et expose 85 chemins OpenAPI sur deux départements.',
    tags: ['FastAPI', 'PostGIS', 'SvelteKit', 'ETL', 'GitHub Actions'],
    facts: [
      { value: '27', label: 'jeux de données' },
      { value: '37,5 M', label: 'lignes auditées' },
      { value: '85', label: 'chemins OpenAPI' },
    ],
    challenge:
      'Réunir des sources publiques hétérogènes sans masquer leurs limites : millésimes, couverture, schémas et volumes varient fortement selon les producteurs.',
    work: [
      '21 pipelines ETL avec contrôles de volume, de schéma et de couverture avant mise en production.',
      'API FastAPI sur PostgreSQL et PostGIS, authentification hybride, quotas et réponses d’erreur normalisées.',
      'Frontend SvelteKit 5 déployé sur Cloudflare Workers ; API conteneurisée sur mon homelab et publiée par tunnel sortant.',
      'CI/CD GitHub Actions avec runner auto-hébergé, migrations contrôlées, images immuables et procédure de retour arrière testée.',
    ],
    results: [
      'Instance publique active sur la Loire-Atlantique et la Vendée.',
      'Matrice de qualité certifiée sur 21 pipelines et 6 proxys de données.',
      'Fiches Commune rendues côté serveur et indexables par les moteurs de recherche.',
    ],
    limits: [
      'Le périmètre France entière est une cible d’architecture, pas le volume de la démo publique.',
      'La facturation est volontairement désactivée tant que la qualité des données et l’usage terrain ne sont pas validés.',
    ],
    image: '/projects/datacommune-homepage.png',
    imageAlt: 'Page d’accueil de DataCommune',
    accent: 'var(--bronze-dark)',
    domain: 'datacommune.fr',
    gallery: [
      { src: '/projects/datacommune-datasets.png', alt: 'Catalogue des jeux de données DataCommune' },
      { src: '/projects/datacommune-api.png', alt: 'Documentation interactive de l’API DataCommune' },
    ],
    external: { href: 'https://datacommune.fr', label: 'Ouvrir DataCommune' },
  },
  {
    slug: 'hexalith',
    name: 'Hexalith',
    number: '02',
    status: 'Lab validé',
    meta: 'GitOps & IAM · 2026',
    summary:
      'Un laboratoire complémentaire à mon expérience professionnelle, construit pour pratiquer l’IaC, l’IAM, l’observabilité et la reprise après sinistre de bout en bout.',
    outcome:
      'Six LXC réellement provisionnés. Les scénarios SSO, cycle de vie des comptes, alerte et restauration ont été exécutés et documentés.',
    tags: ['Terraform', 'Ansible', 'Authentik', 'Grafana', 'GitHub Actions'],
    facts: [
      { value: '27', label: 'PR fusionnées' },
      { value: '6', label: 'LXC provisionnés' },
      { value: '15–133 s', label: 'RTO mesuré' },
    ],
    challenge:
      'Sortir du support poste de travail pour construire une chaîne complète et vérifiable, sans confondre le scénario d’entreprise fictive avec une mission réelle.',
    work: [
      'Provisionnement Proxmox par Terraform, configuration des services par Ansible et application automatisée depuis un runner GitHub Actions auto-hébergé.',
      'SSO validé en SAML avec GLPI et en OpenID Connect avec Grafana.',
      'Onboarding automatisé : création d’identité, ticket ITSM, notification, puis désactivation lors de l’offboarding.',
      'Supervision Prometheus, Loki et Grafana ; exercice d’incident volontaire avec alerte puis retour à l’état nominal.',
    ],
    results: [
      '10 sondes sur 10 et 18 cibles sur 18 disponibles lors du contrôle nominal.',
      'Alerte reçue après environ 102 secondes, résolution détectée environ 61 secondes après reprise.',
      'Restaurations destructives réussies : environ 15 s pour n8n et 133 s pour Authentik, intégrité contrôlée.',
    ],
    limits: [
      'Les mesures correspondent à un lab sur hôte existant ; elles ne constituent pas un engagement de production.',
      'Le budget et le planning sur treize semaines relèvent de la conception du scénario, pas d’un déploiement client.',
    ],
    image: '/projects/hexalith-gitops.png',
    imageAlt: 'Pipeline Terraform Hexalith réussi dans GitHub Actions',
    accent: 'var(--gold-dark)',
    domain: 'github.com',
    gallery: [
      { src: '/projects/hexalith-sso.png', alt: 'Connexion GLPI proposée par le fournisseur d’identité Authentik' },
    ],
  },
  {
    slug: 'homelab',
    name: 'Homelab',
    number: '03',
    status: 'Exploité 24/7',
    meta: 'Infrastructure personnelle · 2024 →',
    summary:
      'Mon terrain d’exploitation réel : des services personnels migrés progressivement vers une base reproductible, privée et restaurable.',
    outcome:
      'Treize LXC sont décrits par Terraform et configurés avec Ansible. Les données critiques suivent une stratégie 3-2-1 dont la restauration est testée.',
    tags: ['Proxmox', 'Terraform', 'Ansible', 'Tailscale', 'SOPS'],
    facts: [
      { value: '13', label: 'LXC en IaC' },
      { value: '3-2-1', label: 'sauvegardes' },
      { value: '24/7', label: 'exploitation' },
    ],
    challenge:
      'Reconstruire une infrastructure devenue hétérogène sans perdre les données, tout en gardant un retour arrière possible à chaque migration.',
    work: [
      'Une source de vérité par information et génération automatique de la documentation depuis le code Terraform.',
      'Migration service par service : créer, configurer, restaurer, tester, basculer puis observer avant décommission.',
      'Accès distant privé par Tailscale, authentification par passkey et exposition publique réduite au strict nécessaire.',
      'Observabilité centralisée, durcissement SSH et secrets chiffrés avec SOPS/age.',
    ],
    results: [
      'Treize conteneurs déclarés en IaC, protégés contre la suppression accidentelle.',
      'Sauvegardes locales et hors site ; exercices de restauration documentés.',
      'Bascule LAN-only effectuée par vagues avec contrôles fonctionnels avant chaque étape.',
    ],
    limits: [
      'Un seul nœud Proxmox porte aujourd’hui l’essentiel de la charge : la sauvegarde est prouvée, la haute disponibilité ne l’est pas.',
      'Le dépôt et la topologie détaillée restent privés pour ne pas exposer les accès internes.',
    ],
    accent: 'var(--terracotta-dark)',
  },
  {
    slug: 'automatisation-ad',
    name: 'Automatisation AD',
    number: '04',
    status: 'Utilisé en entreprise',
    meta: 'PowerShell · 2025',
    summary:
      'Trois outils PowerShell pour fiabiliser des opérations Active Directory répétitives dans un environnement très contraint.',
    outcome:
      'Gestion en masse, audit des droits et sortie du personnel avec simulation préalable, sauvegardes et validation explicite avant écriture.',
    tags: ['PowerShell', 'Active Directory', 'IAM', 'Guardrails'],
    facts: [
      { value: '3', label: 'outils ciblés' },
      { value: '21 000+', label: 'postes concernés' },
      { value: '0', label: 'secret publié' },
    ],
    challenge:
      'Automatiser sans élargir les privilèges ni transformer une erreur de saisie en modification massive.',
    work: [
      'Mode simulation pour rendre les changements visibles avant exécution.',
      'Exports de contrôle et sauvegardes avant les opérations sensibles.',
      'Revue de code par un développeur et périmètre d’action volontairement limité.',
    ],
    results: [
      'Opérations répétitives regroupées dans trois interfaces ciblées.',
      'Traçabilité améliorée pour les audits de droits et les sorties de personnel.',
    ],
    limits: [
      'Le code et les données restent privés car ils appartiennent au contexte d’entreprise.',
      'L’outil assiste la décision ; il ne remplace ni la validation humaine ni les contrôles natifs.',
    ],
    accent: 'var(--ink-muted)',
  },
];

export const getProject = (slug) => projects.find((project) => project.slug === slug);

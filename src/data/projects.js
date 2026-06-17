// Project data for the Projets section.
// Each entry drives BOTH the .card and its <dialog> modal in Projects.astro.
// Plain data only — NO raw HTML. Status is structured as { tone, label, meta }:
//   tone  = 'live' | 'proto' | null  (drives the colored status dot)
//   label = colored status text (or null when there is no colored part)
//   meta  = trailing muted text (date / context)
// The template renders everything with default escaping (no set:html).

export const projects = [
  {
    id: 'homelab',
    name: 'Homelab & VPS Gateway',
    featured: true,
    pill: 'en production · 24/7',
    cardStatus: { tone: 'live', label: 'production', meta: '2024 →' },
    modalStatus: { tone: 'live', label: 'production', meta: '24/7 · 2024 →' },
    cardText:
      'Un nœud Proxmox qui fait tourner 13 conteneurs LXC en production. Je les ai reconstruits entièrement en Infrastructure as Code, une brique à la fois, en vérifiant chaque étape avant de passer à la suivante.',
    modalIntro:
      'Mon homelab : un nœud Proxmox, 13 conteneurs LXC en production, reconstruits entièrement en Infrastructure as Code. J\'ai avancé une brique à la fois, avec un point de vérification avant chaque étape.',
    link: null,
    tags: ['proxmox', 'terraform', 'ansible', 'caddy', 'tailscale', 'sops'],
    sections: [
      {
        title: 'Fiabilité',
        items: [
          'Sauvegardes 3-2-1, que je teste en restauration et pas seulement en configuration',
          'Tout en Terraform et Ansible, avec les secrets chiffrés via SOPS et age',
          'Supervision avec Grafana, Prometheus, Loki, Alertmanager et Uptime Kuma',
        ],
      },
      {
        title: 'Accès & sécurité',
        items: [
          'J\'expose les services via une gateway VPS (Caddy), plutôt que d\'ouvrir des ports chez moi',
          'Tailscale en subnet router : le homelab n\'est jamais exposé directement',
          'SSO par passkey (Pocket ID), SSH durci et DNS filtrant avec AdGuard',
        ],
      },
    ],
    modalLink: null,
  },
  {
    id: 'datacommune',
    name: 'DataCommune',
    featured: true,
    pill: 'produit complet',
    cardStatus: { tone: 'proto', label: 'API en ré-hébergement', meta: '2025' },
    modalStatus: { tone: 'proto', label: 'API en ré-hébergement', meta: '2025' },
    cardText:
      'Une plateforme SaaS de données publiques françaises : 27 jeux de données (immobilier, risques, urbanisme, énergie...) croisés sur plus de 35 000 communes. Les pipelines ont traité environ 575 millions de lignes, accessibles via 85 routes REST. J\'ai tout fait seul, du code à la production.',
    modalIntro:
      'Une plateforme SaaS de données publiques françaises : 27 jeux de données croisés sur plus de 35 000 communes, environ 575 millions de lignes traitées derrière 85 routes REST. Un projet que j\'ai mené seul, du premier commit à la mise en production.',
    link: { href: 'https://datacommune.fr', label: 'datacommune.fr ↗' },
    tags: ['fastapi', 'postgis', 'sveltekit', 'stripe', 'etl', 'docker'],
    sections: [
      {
        title: 'Data & API',
        items: [
          'Backend FastAPI sur PostgreSQL 17 et PostGIS, avec 102 partitions (une par département)',
          '21 pipelines ETL : DVF, DPE, cadastre, BAN, risques, INSEE...',
          'Authentification par JWT et clés API, quotas, et 85 routes documentées',
        ],
      },
      {
        title: 'Produit & exploitation',
        items: [
          'Quatre formules facturées via Stripe (checkout et webhooks)',
          'Frontend en SvelteKit 5, servi par Cloudflare Workers',
          'Déploiement Docker et Caddy, intégration continue avec GitHub Actions. L\'API publique est en cours de ré-hébergement',
        ],
      },
    ],
    modalLink: { href: 'https://datacommune.fr', label: 'Visiter datacommune.fr ↗' },
  },
  {
    id: 'hexalith',
    name: 'Hexalith',
    featured: false,
    pill: null,
    cardStatus: { tone: null, label: null, meta: 'lab gitops · 2026' },
    modalStatus: { tone: null, label: null, meta: 'lab gitops · 2026' },
    cardText:
      'Le système d\'information complet d\'une ESN fictive de 150 personnes, que j\'ai conçu et déployé seul pour ma certification RNCP niveau 6. Je suis parti de l\'audit jusqu\'à un POC mesuré, entièrement en Infrastructure as Code.',
    modalIntro:
      'Le système d\'information complet d\'une ESN fictive de 150 personnes, conçu et déployé seul dans le cadre de ma certification RNCP niveau 6. De l\'audit jusqu\'au POC mesuré, le tout en Infrastructure as Code.',
    link: null,
    tags: ['terraform', 'ansible', 'authentik', 'ebios-rm'],
    sections: [
      {
        title: 'Démarche',
        items: [
          'Audit, analyse de risques EBIOS RM et priorisation MoSCoW',
          'Architecture en 9 briques, budget chiffré à 19 100 €/an, plan sur 30/60/90 jours',
        ],
      },
      {
        title: 'Briques déployées',
        items: [
          'SSO Authentik (OIDC, SAML, SCIM vers Entra ID), MDM avec Intune et Fleet',
          'ITSM avec GLPI, supervision Prometheus/Loki/Grafana, onboarding automatisé avec n8n',
          '4 VLAN isolés derrière un reverse proxy Traefik',
        ],
      },
      {
        title: 'Résultats POC',
        items: [
          'RTO de 1 h 45 et RPO de 18 h, mesurés',
          'Terraform (tenant M365 et Proxmox) avec Ansible, et un runner GitHub Actions self-hosted',
        ],
      },
    ],
    modalLink: null,
  },
  {
    id: 'scriptsad',
    name: 'Scripts AD',
    featured: false,
    pill: null,
    cardStatus: { tone: null, label: null, meta: 'déployé · entreprise · 2025' },
    modalStatus: { tone: null, label: null, meta: 'déployé · entreprise · 2025' },
    cardText:
      'Trois outils PowerShell que j\'ai écrits pour automatiser la gestion Active Directory, sur un parc de plus de 21 000 postes et dans un environnement verrouillé : pas de console d\'admin, MFA stricte, périmètre cloisonné.',
    modalIntro:
      'Trois outils PowerShell pour automatiser la gestion Active Directory d\'un parc de plus de 21 000 postes, dans un environnement verrouillé : pas de console d\'administration, MFA stricte et périmètre cloisonné.',
    link: null,
    tags: ['powershell', 'active-directory', 'iam'],
    sections: [
      {
        title: 'Les trois outils',
        items: [
          'GestionGroupes : gestion des appartenances en masse',
          'AuditDroits : audit des droits et des appartenances, avec un export exploitable',
          'SortiePersonnel : désactivation normée des comptes',
        ],
      },
      {
        title: 'Posture défensive',
        items: [
          'Un mode simulation avant toute écriture : aucune modification appliquée sans validation',
          'Sauvegardes systématiques, et une revue par un développeur intégrée au processus',
        ],
      },
    ],
    modalLink: null,
  },
];

// Project data for the Projets section.
// Each entry drives BOTH the .card and its <dialog> modal in Projects.astro.
// `cardStatus` / `modalStatus` hold raw HTML (they embed .live/.proto spans).
// `cardText` is the card blurb; `modalIntro` is the modal lead paragraph.
// `link` is the external card link (or null); `modalLink` the in-modal link (or null).
// `sections` = modal h4 blocks: { title, items: [...] }.

export const projects = [
  {
    id: 'homelab',
    name: 'Homelab &amp; VPS Gateway',
    featured: true,
    pill: 'en production · 24/7',
    cardStatus: '<span class="live">production</span> · 2024 →',
    modalStatus: '<span class="live">production</span> · 24/7 · 2024 →',
    cardText:
      'Cluster Proxmox de 2 nœuds, plus de 20 services auto-hébergés en production\n          continue — entièrement reconstruit en Infrastructure as Code, brique par\n          brique, avec gate de vérification à chaque étape.',
    modalIntro:
      'Cluster Proxmox de 2 nœuds, plus de 20 services auto-hébergés en production\n    continue — entièrement reconstruit en Infrastructure as Code, brique par brique,\n    avec gate de vérification à chaque étape.',
    link: null,
    tags: ['proxmox', 'terraform', 'ansible', 'caddy', 'tailscale', 'sops'],
    sections: [
      {
        title: 'Fiabilité d\'abord',
        items: [
          'Sauvegardes 3-2-1 — testées en restauration, pas juste configurées',
          'IaC Terraform + Ansible, secrets chiffrés SOPS/age',
          'Observabilité : Grafana, Prometheus, Loki, Alertmanager, Uptime Kuma',
        ],
      },
      {
        title: 'Accès &amp; sécurité',
        items: [
          'Exposition via gateway VPS (Caddy) plutôt que des ports ouverts à la maison',
          'Tailscale en subnet router — le homelab n\'est jamais exposé directement',
          'SSO passkeys (Pocket ID), SSH durci, DNS filtrant AdGuard',
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
    cardStatus: '<span class="proto">prototype fonctionnel</span> · 2025',
    modalStatus: '<span class="proto">prototype fonctionnel</span> · 2025',
    cardText:
      'Plateforme SaaS de données publiques françaises : 27 datasets (immobilier,\n          risques, urbanisme, énergie…) croisés sur 35 000+ communes —\n          ~575 millions de lignes derrière 87 routes REST. Conçu, développé et\n          exploité de bout en bout, en solo.',
    modalIntro:
      'Plateforme SaaS de données publiques françaises : 27 datasets croisés sur\n    35 000+ communes, ~575 millions de lignes derrière 87 routes REST.\n    Conçu, développé et exploité de bout en bout, en solo.',
    link: { href: 'https://datacommune.fr', label: 'datacommune.fr ↗' },
    tags: ['fastapi', 'postgis', 'sveltekit', 'stripe', 'etl', 'docker'],
    sections: [
      {
        title: 'Data &amp; API',
        items: [
          'FastAPI + PostgreSQL 17 / PostGIS — 102 partitions par département',
          '21 pipelines ETL : DVF, DPE, cadastre, BAN, risques, INSEE…',
          'Auth JWT + clés API, quotas, 87 routes documentées',
        ],
      },
      {
        title: 'Produit &amp; exploitation',
        items: [
          '4 plans facturés via Stripe (checkout + webhooks)',
          'Frontend SvelteKit 5 servi par Cloudflare Workers',
          'Docker / Caddy sur VPS, CI GitHub Actions — API publique en cours de ré-hébergement',
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
    cardStatus: 'lab gitops · 2026',
    modalStatus: 'lab gitops · 2026',
    cardText:
      'Le SI complet d\'une ESN fictive de 150 collaborateurs, conçu et déployé seul\n          (lab mené pour ma certification RNCP niv. 6) : de l\'audit au POC mesuré,\n          le tout en Infrastructure as Code.',
    modalIntro:
      'Le SI complet d\'une ESN fictive de 150 collaborateurs, conçu et déployé seul\n    (lab mené pour ma certification RNCP niv. 6) : de l\'audit au POC mesuré,\n    le tout en Infrastructure as Code.',
    link: null,
    tags: ['terraform', 'ansible', 'authentik', 'ebios-rm'],
    sections: [
      {
        title: 'Démarche',
        items: [
          'Audit, analyse de risques EBIOS RM, priorisation MoSCoW',
          'Architecture 9 briques, budget chiffré 19 100 €/an, plan 30/60/90 jours',
        ],
      },
      {
        title: 'Briques déployées',
        items: [
          'SSO Authentik (OIDC, SAML, SCIM vers Entra ID), MDM Intune + Fleet',
          'ITSM GLPI, supervision Prometheus/Loki/Grafana, onboarding automatisé n8n',
          '4 VLANs isolés, reverse proxy Traefik',
        ],
      },
      {
        title: 'Résultats POC',
        items: [
          'RTO 1 h 45 · RPO 18 h mesurés',
          'Terraform (tenant M365 + Proxmox) + Ansible, CI GitHub Actions self-hosted',
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
    cardStatus: 'déployé · entreprise · 2025',
    modalStatus: 'déployé · entreprise · 2025',
    cardText:
      'Trois outils PowerShell pour automatiser la gestion Active Directory d\'un parc\n          de 25 000 postes, dans un environnement verrouillé : pas de console d\'admin,\n          MFA stricte, périmètre cloisonné.',
    modalIntro:
      'Trois outils PowerShell pour automatiser la gestion Active Directory d\'un parc\n    de 25 000 postes, dans un environnement verrouillé : pas de console d\'admin,\n    MFA stricte, périmètre cloisonné.',
    link: null,
    tags: ['powershell', 'active-directory', 'iam'],
    sections: [
      {
        title: 'Les trois outils',
        items: [
          'GestionGroupes — appartenances en masse, workflow bulk',
          'AuditDroits — audit des droits et appartenances, export exploitable',
          'SortiePersonnel — désactivation normée des comptes',
        ],
      },
      {
        title: 'Posture défensive',
        items: [
          'Mode simulation avant toute écriture — zéro modification non validée',
          'Copies de sauvegarde systématiques, revue par un développeur intégrée',
        ],
      },
    ],
    modalLink: null,
  },
];

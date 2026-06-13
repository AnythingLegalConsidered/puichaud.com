// Curated homelab topology — single source: BRIEF.md §6.
// Confidentiality: no IPs, no full hostnames, no internal domains, no ports,
// no precise software versions, no secrets, ever.

export interface InfraNode {
  id: string;
  label: string;       // "pve02 — hyperviseur principal"
  kind: 'real' | 'virtual';
  online: boolean;
  summary: string;
}

export interface Guest {
  node: string;
  vmid: number;
  name: string;
  status: 'running' | 'paused' | 'stopped';
  iac: boolean;        // managed by Terraform → ⚙ badge
  note: string;
}

export const NODES: InfraNode[] = [
  {
    id: 'pve02',
    label: 'pve02 — hyperviseur principal',
    kind: 'real',
    online: true,
    summary:
      "Porte aujourd'hui toute l'infra reconstruite ; la plage 350-360 est entièrement " +
      'gérée par Terraform. DNS, reverse proxy interne et bascule automatique assurent la continuité.',
  },
  {
    id: 'pve01',
    label: 'pve01 — hyperviseur secondaire',
    kind: 'real',
    online: false,
    summary:
      'Second nœud du cluster, dédié à la haute disponibilité. Actuellement hors-ligne — ' +
      'réanimation planifiée. (Oui, ce statut est affiché honnêtement.)',
  },
  {
    id: 'edge-vps',
    label: 'edge-vps — passerelle publique',
    kind: 'real',
    online: true,
    summary:
      'Seul point d\'entrée public. Reverse proxy + TLS (Caddy), réseau maillé chiffré (Tailscale) ' +
      'vers le réseau local, filtrage des accès. Tout le trafic externe transite ici ; les ports ' +
      'publics du homelab sont fermés. C\'est aussi cette machine qui sert le stats.json de ce portfolio.',
  },
  {
    id: 'node-portfolio',
    label: 'node-portfolio — projets',
    kind: 'virtual',
    online: true,
    summary:
      'Node virtuel : mes projets présentés comme des conteneurs. Cliquez sur un projet pour sa ' +
      'fiche (Problème → Stack → Résultat → Leçons).',
  },
  {
    id: 'node-school',
    label: 'node-school — EPSI / RNCP',
    kind: 'virtual',
    online: true,
    summary: 'Projets académiques EPSI Nantes et dossier de validation RNCP ASRBD.',
  },
];

export const GUESTS: Guest[] = [
  { node: 'pve02', vmid: 355, name: 'obs', status: 'running', iac: true,
    note: "Stack d'observabilité unifiée (Grafana, Prometheus, Loki, Alertmanager, Alloy, Uptime Kuma). C'est elle qui alimente les métriques live de ce site." },
  { node: 'pve02', vmid: 350, name: 'pbs-01', status: 'running', iac: true,
    note: 'Serveur de sauvegarde — datastore dédié.' },
  { node: 'pve02', vmid: 351, name: 'backrest-01', status: 'running', iac: true,
    note: 'Sauvegardes dual-repo : local + copie distante chiffrée. Pilier de la règle 3-2-1.' },
  { node: 'pve02', vmid: 353, name: 'sso', status: 'running', iac: true,
    note: 'Authentification unique par passkey pour tous les services.' },
  { node: 'pve02', vmid: 352, name: 'adguard-iac', status: 'running', iac: true,
    note: 'DNS filtrant, géré en IaC.' },
  { node: 'pve02', vmid: 354, name: 'bastion', status: 'running', iac: true,
    note: "Point de rebond d'administration durci." },
  { node: 'pve02', vmid: 356, name: 'homepage', status: 'running', iac: true,
    note: "Tableau de bord des services, derrière l'authentification unique." },
  { node: 'pve02', vmid: 357, name: 'fava', status: 'running', iac: true,
    note: 'Finances personnelles plain-text. Données privées — non exposées.' },
  { node: 'pve02', vmid: 358, name: 'caldav', status: 'running', iac: true,
    note: 'Agenda et contacts auto-hébergés.' },
  { node: 'pve02', vmid: 359, name: 'dawarich', status: 'running', iac: true,
    note: 'Service personnel (PostGIS). Données privées.' },
  { node: 'pve02', vmid: 360, name: 'immich', status: 'running', iac: true,
    note: 'Photos auto-hébergées (PostGIS). Données privées.' },
  { node: 'pve02', vmid: 252, name: 'adguard-02', status: 'running', iac: false,
    note: 'DNS en haute disponibilité — conservé pour la continuité.' },
  { node: 'pve02', vmid: 290, name: 'media-stack', status: 'running', iac: false,
    note: 'Stack de services auto-hébergés (cf. projet ARRmada).' },
  { node: 'pve02', vmid: 200, name: 'poliscope-db', status: 'running', iac: false,
    note: 'Base PostgreSQL du projet Poliscope (cf. node-portfolio).' },
  { node: 'pve02', vmid: 9020, name: 'hex-authentik', status: 'running', iac: true,
    note: 'Lab Hexalith — gestion d\'identité (cf. projet hexalith-lab).' },
  { node: 'pve02', vmid: 9024, name: 'hex-supervision', status: 'running', iac: true,
    note: 'Lab Hexalith — supervision (cf. projet hexalith-lab).' },
];

// Profile content — single source: BRIEF.md §4 (+ generic apprenticeship
// stats explicitly approved by Ianis: volume + resolution rate only).

export const PROFILE = {
  name: 'Ianis Puichaud',
  title: 'SysOps / futur DevOps',
  email: 'ianispuichaud@gmail.com',
  github: 'github.com/AnythingLegalConsidered',
  site: 'puichaud.com',
  cvHref: '/docs/CV-Ianis-Puichaud.pdf',
  lines: [
    'Alternant Administrateur Systèmes chez EQUANS — support technique niveau 2 ' +
      '(Active Directory, Intune, SAP, parc Windows) : environ 490 incidents traités, ' +
      '95,7 % de résolution.',
    'BAC+3 SYSOPS à EPSI Nantes. Objectif : Master Infrastructure & Cloud en alternance ' +
      'dès septembre 2026, puis poste SysAdmin, et à moyen terme une orientation ' +
      'DevOps / automatisation.',
    'Mon homelab est un cluster Proxmox 2 nœuds reconstruit de zéro en Infrastructure-as-Code ' +
      '(Terraform + Ansible), monitoré, sauvegardé selon la règle 3-2-1 (et restauré-testé), ' +
      'et accessible partout sans exposer un seul port public. Il me sert de terrain ' +
      "d'expérimentation pour ce que je ne peux pas me permettre de casser au travail.",
  ],
  skills: [
    'Proxmox VE', 'Terraform', 'Ansible', 'Docker', 'GitHub Actions',
    'Windows Server / Active Directory', 'Linux (Debian)', 'Grafana', 'Loki', 'Prometheus',
    'Caddy / reverse proxy', 'Tailscale', 'SOPS', 'age', 'PostgreSQL / PostGIS',
    'PowerShell', 'Python', 'Bash',
  ],
};

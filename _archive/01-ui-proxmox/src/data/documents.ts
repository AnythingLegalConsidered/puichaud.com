// Files listed in the "docs" storage view (Proxmox storage-content metaphor).

export interface DocFile {
  name: string;
  description: string;
  size?: string;       // human-readable, approximate
  updated?: string;    // month precision is enough
  href?: string;       // absent → "available on request" row
}

export const DOCUMENTS: DocFile[] = [
  {
    name: 'CV-Ianis-Puichaud.pdf',
    description: 'Curriculum vitae — SysOps / futur DevOps',
    size: '~200 Ko',
    updated: '06/2026',
    href: '/docs/CV-Ianis-Puichaud.pdf',
  },
  {
    name: 'dossier-rncp-asrbd.pdf',
    description: 'Dossier de validation RNCP ASRBD (BAC+3) — disponible sur demande',
  },
];

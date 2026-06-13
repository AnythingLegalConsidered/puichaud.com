// Client-side behaviour for the embedded console:
// panel switching (tree + tabs), decisions filters, fake shell, live stats.
// No framework — the page is fully pre-rendered, JS only toggles visibility.

// ---------------------------------------------------------------- helpers
const $ = <T extends HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

// ---------------------------------------------------------------- panels
const panels = $$('.px-panel');
const treeButtons = $$('#tree [data-panel]');
const tabButtons = $$('.px-tabs [data-panel]');
const crumb = $('#crumb');
const content = $('#content');

function showPanel(id: string, crumbText: string, source: 'tree' | 'tab'): void {
  panels.forEach((p) => { p.hidden = p.id !== id; });
  if (crumb) crumb.textContent = crumbText;
  if (content) content.scrollTop = 0;

  // Tab highlight: exact match for datacenter-level panels, Summary for fiches.
  const isTabPanel = tabButtons.some((t) => t.dataset.panel === id);
  tabButtons.forEach((t) => {
    const active = isTabPanel ? t.dataset.panel === id : t.dataset.panel === 'panel-summary';
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', String(active));
  });

  // Tree highlight: matching item, or datacenter root for tab-level panels.
  treeButtons.forEach((b) => {
    const selected = source === 'tree'
      ? b.dataset.panel === id
      : b.dataset.dc === 'true' && id === 'panel-summary';
    b.classList.toggle('selected', selected);
  });

  history.replaceState(null, '', `#${id.replace(/^panel-/, '')}`);

  // Focus the terminal input when opening the easter egg.
  if (id === 'panel-terminal') $('#term-input')?.focus();
}

treeButtons.forEach((b) =>
  b.addEventListener('click', () => showPanel(b.dataset.panel!, b.dataset.crumb!, 'tree')),
);
tabButtons.forEach((b) =>
  b.addEventListener('click', () => showPanel(b.dataset.panel!, b.dataset.crumb!, 'tab')),
);

// Arrow-key navigation inside the tree.
$('#tree')?.addEventListener('keydown', (ev) => {
  const e = ev as KeyboardEvent;
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const idx = treeButtons.indexOf(document.activeElement as HTMLElement);
  if (idx === -1) return;
  e.preventDefault();
  const next = treeButtons[idx + (e.key === 'ArrowDown' ? 1 : -1)];
  next?.focus();
});

// Deep link: #lxc-or-panel-id on load.
const initial = location.hash.slice(1);
if (initial) {
  const target = [...treeButtons, ...tabButtons].find(
    (b) => b.dataset.panel === `panel-${initial}`,
  );
  if (target) {
    showPanel(target.dataset.panel!, target.dataset.crumb!,
      treeButtons.includes(target) ? 'tree' : 'tab');
  }
}

// ---------------------------------------------------------------- decisions
const tasks = $$('#tasklog .task');
const monthHeads = $$('#tasklog .month-head');
let kindFilter = 'all';
let projFilter = 'all';

function applyFilters(): void {
  tasks.forEach((t) => {
    const visible =
      (kindFilter === 'all' || t.dataset.kind === kindFilter) &&
      (projFilter === 'all' || t.dataset.proj === projFilter);
    t.hidden = !visible;
  });
  // Hide month headers whose group became empty.
  monthHeads.forEach((h) => {
    const any = tasks.some((t) => t.dataset.month === h.dataset.month && !t.hidden);
    h.hidden = !any;
  });
}

$$('#task-filters .chip').forEach((chip) =>
  chip.addEventListener('click', () => {
    $$('#task-filters .chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    kindFilter = chip.dataset.kind ?? 'all';
    applyFilters();
  }),
);

$('#proj-filter')?.addEventListener('change', (e) => {
  projFilter = (e.target as HTMLSelectElement).value;
  applyFilters();
});

tasks.forEach((t) =>
  t.addEventListener('click', () => {
    const open = t.classList.toggle('open');
    t.setAttribute('aria-expanded', String(open));
  }),
);

$('#expand-all')?.addEventListener('click', () => {
  const anyClosed = tasks.some((t) => !t.hidden && !t.classList.contains('open'));
  tasks.forEach((t) => {
    t.classList.toggle('open', anyClosed);
    t.setAttribute('aria-expanded', String(anyClosed));
  });
  const btn = $('#expand-all');
  if (btn) btn.textContent = anyClosed ? 'tout replier' : 'tout déplier';
});

// ---------------------------------------------------------------- terminal
interface TermData {
  user: string;
  email: string;
  projects: { vmid: number; name: string; tagline: string }[];
  decisions: number;
}
const termData: TermData | null = (() => {
  try { return JSON.parse($('#term-data')?.textContent ?? 'null'); }
  catch { return null; }
})();

const termOut = $('#term-out');
const termInput = $<HTMLInputElement>('#term-input');

function termPrint(text: string): void {
  if (!termOut) return;
  termOut.textContent += text + '\n';
  termOut.scrollTop = termOut.scrollHeight;
}

function runCommand(raw: string): void {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  termPrint(`visitor@pve-portfolio:~$ ${raw}`);
  if (!cmd) return;
  if (!termData) { termPrint('erreur : données indisponibles'); return; }

  switch (cmd) {
    case 'help':
      termPrint([
        'Commandes disponibles :',
        '  help              cette aide',
        '  whoami            qui êtes-vous ?',
        '  ls                liste des projets',
        '  cat <projet>      tagline d\'un projet',
        '  decisions         compteur du journal de bord',
        '  uptime            état du cluster',
        '  contact           me joindre',
        '  clear             effacer l\'écran',
      ].join('\n'));
      break;
    case 'whoami':
      termPrint('recruteur curieux — bonne pioche, ce site est le miroir de ma vraie infra.');
      break;
    case 'ls':
      termPrint(termData.projects.map((p) => `${String(p.vmid).padStart(4)}  ${p.name}`).join('\n'));
      break;
    case 'cat': {
      const name = args.join(' ').toLowerCase();
      const proj = termData.projects.find((p) => p.name.toLowerCase().includes(name));
      termPrint(proj ? `${proj.name} — ${proj.tagline}` : `cat: ${args.join(' ') || '?'}: fichier introuvable (essayez \`ls\`)`);
      break;
    }
    case 'decisions':
      termPrint(`${termData.decisions} entrées dans le journal — onglet « Décisions » pour les lire.`);
      break;
    case 'uptime':
      termPrint('cluster up — 2 nodes (1 en sieste assumée), 0 port public exposé.');
      break;
    case 'contact':
      termPrint(`${termData.user} <${termData.email}>`);
      break;
    case 'clear':
      if (termOut) termOut.textContent = '';
      break;
    case 'sudo':
      termPrint('visitor is not in the sudoers file. This incident will be reported. (non.)');
      break;
    case 'exit':
      termPrint('logout — mais l\'onglet Summary vous attend.');
      break;
    default:
      termPrint(`${cmd} : commande introuvable (essayez \`help\`)`);
  }
}

termInput?.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  runCommand(termInput.value);
  termInput.value = '';
});

// ---------------------------------------------------------------- live stats
// The site NEVER calls the homelab. It reads a public, whitelisted stats.json
// generated infra-side (see scripts/stats-export/). Freshness guard: > 1 h
// → show "données du <date>" instead of pretending it's real-time.
interface Stats {
  generated_at: string;
  cluster: { uptime_30d: number; cpu_pct: number; ram_pct: number; iac_lxc: number };
  nodes: { id: string; online: boolean }[];
  services: { name: string; uptime_30d: number }[];
}

const STATS_URL = '/stats.json';
const STALE_MS = 60 * 60 * 1000; // 1 hour

function setStat(key: string, value: number, barWidth?: number): void {
  $$(`[data-stat="${key}"]`).forEach((el) => {
    el.textContent = String(value);
  });
  if (barWidth !== undefined) {
    $$(`[data-bar="${key}"]`).forEach((el) => { el.style.width = `${Math.min(barWidth, 100)}%`; });
  }
}

async function hydrateStats(): Promise<void> {
  let stats: Stats;
  try {
    const res = await fetch(STATS_URL, { cache: 'no-store' });
    if (!res.ok) return;
    stats = await res.json();
  } catch {
    return; // static fallback values stay in place
  }

  setStat('uptime', stats.cluster.uptime_30d, stats.cluster.uptime_30d);
  setStat('cpu', stats.cluster.cpu_pct, stats.cluster.cpu_pct * 3);
  setStat('ram', stats.cluster.ram_pct, stats.cluster.ram_pct);
  setStat('iac', stats.cluster.iac_lxc, 70);

  const heroUptime = $('#hero-uptime');
  if (heroUptime) heroUptime.textContent = `${stats.cluster.uptime_30d}%`;

  const online = stats.nodes.filter((n) => n.online).length;
  const nodesEl = $('#stat-nodes');
  if (nodesEl) nodesEl.textContent = `${online}/${stats.nodes.length}`;
  const iacFoot = $('#stat-iac-foot');
  if (iacFoot) iacFoot.textContent = String(stats.cluster.iac_lxc);

  const generated = new Date(stats.generated_at);
  const formatted = generated.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const scanEl = $('#stat-scan');
  if (scanEl) scanEl.textContent = `Dernier scan : ${formatted}`;

  const stale = Date.now() - generated.getTime() > STALE_MS;
  const banner = $('#stale-banner');
  if (banner) {
    banner.classList.toggle('visible', stale);
    banner.textContent = stale ? `⏱ données du ${formatted} — pas du temps réel` : '';
  }
}

hydrateStats();

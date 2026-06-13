import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Project cards shown as containers in the virtual nodes
// (node-portfolio / node-school). Format: Problème → Stack → Résultat → Leçons.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    vmid: z.number(),
    name: z.string(),
    node: z.enum(['node-portfolio', 'node-school']),
    status: z.enum(['running', 'paused', 'stopped', 'template']),
    flagship: z.boolean().default(false),
    tagline: z.string(),
    probleme: z.string(),
    stack: z.array(z.string()),
    resultat: z.string(),
    lecons: z.string(),
    repo: z.string().optional(),          // e.g. github.com/Owner/Repo
    repoPublic: z.boolean().default(true), // false → "private repo" flag, no dead link
    commits: z.number().optional(),        // build-time snapshot, proves the project is alive
    activeSince: z.string().optional(),    // e.g. "02/2026"
    order: z.number(),
  }),
});

// Decisions & postmortems timeline ("Décisions" tab).
// Body = 2-4 sentence narrative, first person, already anonymized.
const decisions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/decisions' }),
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    kind: z.enum(['decision', 'postmortem', 'gate', 'preuve']),
    project: z.string(),
    title: z.string(),
  }),
});

export const collections = { projects, decisions };

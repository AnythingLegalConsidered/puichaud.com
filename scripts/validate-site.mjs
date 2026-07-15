import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const origin = 'https://puichaud.com';

function listFiles(directory, extension = null) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(path, extension);
    return extension === null || extname(entry.name) === extension ? [path] : [];
  });
}

function publicPathToCandidates(pathname) {
  const decoded = decodeURIComponent(pathname);
  const localPath = decoded.split('/').filter(Boolean).join(sep);

  if (pathname.endsWith('/')) {
    return [join(dist, localPath, 'index.html')];
  }

  return [
    join(dist, localPath),
    join(dist, `${localPath}.html`),
    join(dist, localPath, 'index.html'),
  ];
}

function resolveReference(reference, sourceFile) {
  if (/^(?:[a-z]+:|\/\/)/i.test(reference)) return null;

  const [pathAndQuery, fragment = ''] = reference.split('#', 2);
  const pathname = pathAndQuery.split('?', 1)[0];
  if (!pathname && fragment) return { candidates: [sourceFile], fragment };
  if (!pathname) return null;

  if (pathname.startsWith('/')) {
    return { candidates: publicPathToCandidates(pathname), fragment };
  }

  const resolved = resolve(dirname(sourceFile), decodeURIComponent(pathname));
  const candidates = pathname.endsWith('/')
    ? [join(resolved, 'index.html')]
    : [resolved, `${resolved}.html`, join(resolved, 'index.html')];
  return { candidates, fragment };
}

function extractReferences(html) {
  const references = [];
  const elementPattern = /<(?:a|area|audio|iframe|img|link|script|source|track|video)\b[^>]*>/gi;
  const attributePattern = /\b(?:href|src|poster)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;

  for (const element of html.matchAll(elementPattern)) {
    for (const attribute of element[0].matchAll(attributePattern)) {
      references.push(attribute[1] ?? attribute[2] ?? attribute[3]);
    }
  }

  return references;
}

function hasFragment(file, fragment) {
  if (!fragment || extname(file) !== '.html') return true;
  const html = readFileSync(file, 'utf8');
  const decoded = decodeURIComponent(fragment).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b(?:id|name)=["']${decoded}["']`, 'i').test(html);
}

function urlToHtml(url) {
  const parsed = new URL(url);
  if (parsed.origin !== origin) return null;
  return publicPathToCandidates(parsed.pathname).find(existsSync) ?? null;
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function validateLinks(htmlFiles) {
  const errors = [];
  let checked = 0;

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    for (const reference of extractReferences(html)) {
      const resolved = resolveReference(reference, file);
      if (!resolved) continue;
      checked += 1;

      const target = resolved.candidates.find(existsSync);
      if (!target || !statSync(target).isFile()) {
        errors.push(`${relative(dist, file)}: broken internal reference (${reference})`);
        continue;
      }

      if (!hasFragment(target, resolved.fragment)) {
        errors.push(`${relative(dist, file)}: missing fragment target (${reference})`);
      }
    }
  }

  return { checked, errors };
}

function validateSitemap(htmlFiles) {
  const errors = [];
  const indexPath = join(dist, 'sitemap-index.xml');
  const robotsPath = join(dist, 'robots.txt');

  if (!existsSync(indexPath)) return { urls: 0, errors: ['missing sitemap-index.xml'] };
  if (!existsSync(robotsPath)) errors.push('missing robots.txt');

  const sitemapUrls = new Set();
  const sitemapFiles = extractLocs(readFileSync(indexPath, 'utf8'));
  if (sitemapFiles.length === 0) errors.push('sitemap index contains no sitemap');

  for (const sitemapUrl of sitemapFiles) {
    if (new URL(sitemapUrl).origin !== origin) {
      errors.push(`sitemap index references a non-canonical origin (${sitemapUrl})`);
      continue;
    }

    const sitemapFile = urlToHtml(sitemapUrl)?.replace(/index\.html$/, '') ??
      join(dist, new URL(sitemapUrl).pathname.replace(/^\//, ''));
    if (!existsSync(sitemapFile)) {
      errors.push(`missing sitemap file (${sitemapUrl})`);
      continue;
    }

    for (const pageUrl of extractLocs(readFileSync(sitemapFile, 'utf8'))) {
      sitemapUrls.add(pageUrl);
      if (!urlToHtml(pageUrl)) errors.push(`sitemap URL has no generated page (${pageUrl})`);
    }
  }

  const expectedUrls = htmlFiles
    .filter((file) => relative(dist, file) !== '404.html')
    .filter((file) => !/<meta\s+name=["']robots["'][^>]*noindex/i.test(readFileSync(file, 'utf8')))
    .map((file) => {
      const path = relative(dist, file).split(sep).join('/');
      if (path === 'index.html') return `${origin}/`;
      return `${origin}/${path.replace(/index\.html$/, '')}`;
    });

  for (const expected of expectedUrls) {
    if (!sitemapUrls.has(expected)) errors.push(`generated page missing from sitemap (${expected})`);
  }

  for (const pageUrl of sitemapUrls) {
    if (!expectedUrls.includes(pageUrl)) errors.push(`unexpected sitemap URL (${pageUrl})`);
  }

  if (existsSync(robotsPath)) {
    const robots = readFileSync(robotsPath, 'utf8');
    if (!robots.includes(`Sitemap: ${origin}/sitemap-index.xml`)) {
      errors.push('robots.txt does not reference the canonical sitemap index');
    }
  }

  return { urls: sitemapUrls.size, errors };
}

if (!existsSync(dist)) {
  console.error('dist/ is missing; run the build before site validation.');
  process.exit(1);
}

const htmlFiles = listFiles(dist, '.html');
const links = validateLinks(htmlFiles);
const sitemap = validateSitemap(htmlFiles);
const errors = [...links.errors, ...sitemap.errors];

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`Site validation passed: ${htmlFiles.length} HTML files, ${links.checked} internal references, ${sitemap.urls} sitemap URLs.`);

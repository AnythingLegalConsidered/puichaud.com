import { existsSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectInlineScriptHashes, renderHeaders, verifyGeneratedCsp } from './csp.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function listHtmlFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(path);
    return extname(entry.name) === '.html' ? [path] : [];
  });
}

export function generateCsp(distDirectory, { verifyOnly = false } = {}) {
  const headersPath = join(distDirectory, '_headers');
  if (!existsSync(headersPath)) throw new Error('dist/_headers is missing.');

  const htmlDocuments = listHtmlFiles(distDirectory)
    .sort()
    .map((path) => ({ path: relative(distDirectory, path), html: readFileSync(path, 'utf8') }));
  if (htmlDocuments.length === 0) throw new Error('No generated HTML files were found in dist/.');

  let headers = readFileSync(headersPath, 'utf8');
  if (!verifyOnly) {
    const { hashes } = collectInlineScriptHashes(htmlDocuments);
    headers = renderHeaders(headers, hashes);

    const temporaryPath = `${headersPath}.tmp`;
    try {
      writeFileSync(temporaryPath, headers, 'utf8');
      renameSync(temporaryPath, headersPath);
    } finally {
      if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
    }
  }

  return verifyGeneratedCsp(headers, htmlDocuments);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const result = generateCsp(join(root, 'dist'), { verifyOnly: process.argv.includes('--verify') });
    console.log(`CSP validation passed: ${result.scriptOccurrences} inline script occurrences, ${result.uniqueHashes} unique SHA-256 hashes.`);
  } catch (error) {
    console.error(`CSP validation failed: ${error.message}`);
    process.exit(1);
  }
}

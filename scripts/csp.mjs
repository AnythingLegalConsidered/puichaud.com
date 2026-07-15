import { createHash } from 'node:crypto';

export const CSP_MARKER = '__CSP_SCRIPT_HASHES__';

export function extractInlineScripts(html) {
  const scripts = [];
  const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;

  for (const match of html.matchAll(scriptPattern)) {
    const attributes = match[1];
    if (/\bsrc\s*=/i.test(attributes)) continue;
    scripts.push(match[2]);
  }

  return scripts;
}

export function hashInlineScript(script) {
  const digest = createHash('sha256').update(script, 'utf8').digest('base64');
  return `'sha256-${digest}'`;
}

export function collectInlineScriptHashes(htmlDocuments) {
  const scripts = htmlDocuments.flatMap(({ html }) => extractInlineScripts(html));
  const hashes = [...new Set(scripts.map(hashInlineScript))].sort();
  return { scripts, hashes };
}

export function renderHeaders(template, hashes) {
  const markerCount = template.split(CSP_MARKER).length - 1;
  if (markerCount !== 1) {
    throw new Error(`Expected exactly one CSP marker, found ${markerCount}.`);
  }
  if (/['"]unsafe-inline['"]/i.test(template)) {
    throw new Error('unsafe-inline is forbidden in the CSP.');
  }

  return template.replace(CSP_MARKER, hashes.join(' '));
}

export function extractCspHashes(headers) {
  const cspLine = headers
    .split(/\r?\n/)
    .find((line) => line.trimStart().startsWith('Content-Security-Policy:'));
  if (!cspLine) throw new Error('Content-Security-Policy header is missing.');

  const scriptSource = cspLine.match(/(?:^|;)\s*script-src\s+([^;]*)(?:;|$)/i);
  if (!scriptSource) throw new Error('script-src directive is missing.');

  return [...scriptSource[1].matchAll(/'sha256-[A-Za-z0-9+/]+={0,2}'/g)].map((match) => match[0]);
}

export function verifyGeneratedCsp(headers, htmlDocuments) {
  if (headers.includes(CSP_MARKER)) throw new Error('CSP marker was not replaced.');
  if (/['"]unsafe-inline['"]/i.test(headers)) throw new Error('unsafe-inline is forbidden in the CSP.');

  const { scripts, hashes } = collectInlineScriptHashes(htmlDocuments);
  const headerHashes = extractCspHashes(headers);
  const uniqueHeaderHashes = [...new Set(headerHashes)].sort();

  if (uniqueHeaderHashes.length !== headerHashes.length) {
    throw new Error('script-src contains duplicate SHA-256 hashes.');
  }
  if (uniqueHeaderHashes.length !== hashes.length) {
    throw new Error(`CSP hash count mismatch: ${uniqueHeaderHashes.length} in header, ${hashes.length} required by HTML.`);
  }

  const expected = new Set(hashes);
  const actual = new Set(uniqueHeaderHashes);
  for (const hash of expected) {
    if (!actual.has(hash)) throw new Error('At least one inline script does not have a matching CSP hash.');
  }
  for (const hash of actual) {
    if (!expected.has(hash)) throw new Error('script-src contains a hash that matches no inline script.');
  }

  return {
    scriptOccurrences: scripts.length,
    uniqueHashes: hashes.length,
  };
}

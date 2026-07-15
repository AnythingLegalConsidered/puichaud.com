import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  CSP_MARKER,
  collectInlineScriptHashes,
  extractInlineScripts,
  hashInlineScript,
  renderHeaders,
  verifyGeneratedCsp,
} from '../scripts/csp.mjs';
import { generateCsp } from '../scripts/generate-csp.mjs';

const template = `/*\n  Content-Security-Policy: default-src 'self'; script-src 'self' ${CSP_MARKER}; script-src-attr 'none'\n`;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('hashInlineScript returns the CSP SHA-256 token for the exact body', () => {
  assert.equal(hashInlineScript('console.log("ok");'), "'sha256-q3bAT6PqU/NkM+nmCzOxM1iv7FPl/JTMqy0YgkNF7+k='");
});

test('extractInlineScripts ignores scripts loaded with src', () => {
  const html = '<script src="/app.js"></script><script type="application/ld+json">{"ok":true}</script>';
  assert.deepEqual(extractInlineScripts(html), ['{"ok":true}']);
});

test('renderHeaders requires one marker and forbids unsafe-inline', () => {
  assert.throws(() => renderHeaders(template.replace(CSP_MARKER, ''), []), /exactly one CSP marker/);
  assert.throws(() => renderHeaders(template.replace("'self'", "'self' 'unsafe-inline'"), []), /unsafe-inline/);
});

test('the source header template retains security and cache policies', () => {
  const headers = readFileSync(join(root, 'public', '_headers'), 'utf8');
  const requiredPolicies = [
    'X-Content-Type-Options: nosniff',
    'X-Frame-Options: DENY',
    'Strict-Transport-Security: max-age=31536000',
    'Referrer-Policy: strict-origin-when-cross-origin',
    'Permissions-Policy:',
    "script-src-attr 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    'Cache-Control: public, max-age=31536000, immutable',
    'Cache-Control: public, max-age=604800',
    'Cache-Control: public, max-age=86400',
  ];

  assert.equal(headers.split(CSP_MARKER).length - 1, 1);
  assert.doesNotMatch(headers, /['"]unsafe-inline['"]/i);
  for (const policy of requiredPolicies) assert.ok(headers.includes(policy), `Missing policy: ${policy}`);
});

test('generated hashes are unique while every inline occurrence is covered', () => {
  const htmlDocuments = [
    { path: 'index.html', html: '<script>one()</script><script>two()</script>' },
    { path: 'other.html', html: '<script>one()</script><script src="/site.js"></script>' },
  ];
  const { hashes } = collectInlineScriptHashes(htmlDocuments);
  const headers = renderHeaders(template, hashes);

  assert.equal(hashes.length, 2);
  assert.deepEqual(verifyGeneratedCsp(headers, htmlDocuments), { scriptOccurrences: 3, uniqueHashes: 2 });
});

test('verification rejects an un-replaced marker or mismatched hashes', () => {
  const htmlDocuments = [{ path: 'index.html', html: '<script>one()</script>' }];
  assert.throws(() => verifyGeneratedCsp(template, htmlDocuments), /marker was not replaced/);
  assert.throws(
    () => verifyGeneratedCsp(template.replace(CSP_MARKER, "'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='"), htmlDocuments),
    /does not have a matching CSP hash/,
  );
});

test('generateCsp replaces the built header atomically and verifies the result', () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-csp-'));
  try {
    mkdirSync(join(directory, 'nested'));
    writeFileSync(join(directory, '_headers'), template);
    writeFileSync(join(directory, 'index.html'), '<script>one()</script>');
    writeFileSync(join(directory, 'nested', 'index.html'), '<script>two()</script>');

    assert.deepEqual(generateCsp(directory), { scriptOccurrences: 2, uniqueHashes: 2 });
    assert.equal(readFileSync(join(directory, '_headers'), 'utf8').includes(CSP_MARKER), false);
    assert.deepEqual(generateCsp(directory, { verifyOnly: true }), { scriptOccurrences: 2, uniqueHashes: 2 });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

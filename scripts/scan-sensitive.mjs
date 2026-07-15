import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skippedExtensions = new Set(['.gif', '.ico', '.jpeg', '.jpg', '.png', '.webp', '.woff', '.woff2']);
const maxFileSize = 10 * 1024 * 1024;

const rules = [
  {
    name: 'private key material',
    repositoryWide: true,
    pattern: new RegExp(['-----BEGIN ', '(?:RSA |EC |OPENSSH )?', 'PRIVATE KEY-----'].join(''), 'i'),
  },
  {
    name: 'cloud or source-control token',
    repositoryWide: true,
    pattern: new RegExp(['(?:AKIA|ASIA)[A-Z0-9]{16}', '|gh[pousr]_[A-Za-z0-9]{30,}', '|github_pat_[A-Za-z0-9_]{50,}'].join('')),
  },
  {
    name: 'assigned secret',
    repositoryWide: true,
    pattern: new RegExp(['(?:api[_-]?key|client[_-]?secret|password|token)', '\\s*[:=]\\s*["\']', '[A-Za-z0-9_+\\/=-]{20,}', '["\']'].join(''), 'i'),
  },
  {
    name: 'private IPv4 address',
    pattern: new RegExp([
      '(?:^|[^0-9])(?:',
      '10\\.(?:[0-9]{1,3}\\.){2}',
      '|192\\.168\\.[0-9]{1,3}\\.',
      '|172\\.(?:1[6-9]|2[0-9]|3[01])\\.[0-9]{1,3}\\.',
      ')[0-9]{1,3}(?:[^0-9]|$)',
    ].join(''), 'm'),
  },
  {
    name: 'internal hostname',
    pattern: new RegExp(['\\b(?:[a-z0-9-]+\\.)+', '(?:internal|intra|lan|local|corp|home)', '\\b'].join(''), 'i'),
  },
  {
    name: 'French phone number',
    allowedPaths: new Set(['public/cv.pdf', 'dist/cv.pdf']),
    pattern: new RegExp(['(?:^|[^0-9])(?:\\+33[ .-]?[1-9]|0[1-9])', '(?:[ .-]?[0-9]{2}){4}', '(?:[^0-9]|$)'].join(''), 'm'),
  },
];

function listFiles(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(path);
    return [path];
  });
}

const findings = [];
const trackedFiles = execFileSync('git', ['ls-files', '-z'], { cwd: root })
  .toString('utf8')
  .split('\0')
  .filter(Boolean)
  .map((path) => join(root, path));
const files = [...new Set([...trackedFiles, ...listFiles(join(root, 'dist'))])];

for (const file of files) {
  if (skippedExtensions.has(extname(file).toLowerCase())) continue;
  if (statSync(file).size > maxFileSize) continue;

  const content = readFileSync(file).toString('utf8');
  const repositoryPath = relative(root, file).split('\\').join('/');
  const isActiveContent = !repositoryPath.startsWith('_archive/');
  for (const rule of rules) {
    if (!rule.repositoryWide && !isActiveContent) continue;
    if (rule.allowedPaths?.has(repositoryPath)) continue;
    if (rule.pattern.test(content)) {
      findings.push({ rule: rule.name, file: relative(root, file) });
    }
  }
}

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`ERROR: ${finding.rule} detected in ${finding.file} (value withheld)`);
  }
  process.exit(1);
}

console.log(`Sensitive-data scan passed: ${files.length} files checked.`);

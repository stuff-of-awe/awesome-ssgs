// SPDX-License-Identifier: MPL-2.0
// Dependency-free checks for publicly curated Markdown. Not an external URL tester.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export function isInside(root, path) {
  const part = relative(resolve(root), resolve(path));
  return part === '' || (part !== '..' && !part.startsWith('..' + sep) && !isAbsolute(part));
}

export function markdownUrls(markdown) {
  const urls = [];
  let fence = null;
  for (const line of markdown.split(/\r?\n/)) {
    const marker = /^\s*(\x60{3,}|~{3,})/.exec(line);
    if (marker) {
      const m = marker[1];
      if (!fence) fence = m;
      else if (m[0] === fence[0] && m.length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;

    // Reference-style link definitions, including named references not used yet.
    const definition = /^\s{0,3}\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/.exec(line);
    if (definition) urls.push(definition[1] || definition[2]);

    // Normal inline links and images; skip fenced example code.
    for (const match of line.matchAll(/!?\[[^\]]*\]\(\s*(<[^>]+>|[^)\s]+)\s*(?:["'][^"']*["'])?\s*\)/g)) {
      const raw = match[1];
      urls.push(raw.startsWith('<') && raw.endsWith('>') ? raw.slice(1, -1) : raw);
    }
  }
  return urls;
}

export function hasPrivateSourceLink(source) {
  return /https:\/\/github\.com\/hyperpolymath\/(?:polystack|poly-ssg)(?![\w-])/i.test(source);
}

export function hasTruthfulStatus(readme) {
  return /^>\s+\*\*Status: starter collection\b/m.test(readme) &&
    /has \*\*not\*\* independently built every tool/.test(readme) &&
    /not production-qualified/.test(readme);
}

function markdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(p));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(p);
  }
  return files;
}

export function validateCatalogue(root) {
  const docs = [...readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => resolve(root, entry.name)), ...markdownFiles(resolve(root, 'docs'))];
  const errors = [];
  let linkCount = 0;
  for (const file of docs) {
    const source = readFileSync(file, 'utf8');
    const shown = relative(root, file);
    if (!source.includes('SPDX-License-Identifier: CC-BY-SA-4.0')) {
      errors.push(shown + ': missing attribution/licence marker');
    }
    if (hasPrivateSourceLink(source)) {
      errors.push(shown + ': link to private staging/source repository will yield public 404');
    }
    for (const link of markdownUrls(source)) {
      linkCount++;
      if (/^(https?:|mailto:)/i.test(link) || link.startsWith('#')) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(link)) {
        errors.push(shown + ': unsupported link scheme: ' + link);
        continue;
      }
      const clean = link.split('#')[0].split('?')[0];
      if (!clean) continue;
      let target;
      try {
        target = resolve(dirname(file), decodeURIComponent(clean));
      } catch {
        errors.push(shown + ': malformed URL encoding: ' + link);
        continue;
      }
      if (!isInside(root, target)) errors.push(shown + ': link escapes repository: ' + link);
      else if (!existsSync(target)) errors.push(shown + ': missing local link: ' + link);
    }
  }
  if (!hasTruthfulStatus(readFileSync(resolve(root, 'README.md'), 'utf8'))) {
    errors.push('README.md: explicit starter / non-verified status disclaimer missing');
  }
  if (!existsSync(resolve(root, 'LICENSES/CC-BY-SA-4.0.txt'))) {
    errors.push('Missing full attribution licence text');
  }
  return { errors, docs: docs.length, links: linkCount };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const r = validateCatalogue(root);
  for (const e of r.errors) console.error('FAIL ' + e);
  if (r.errors.length) process.exitCode = 1;
  else console.log('PASS: ' + r.docs + ' Markdown documents, ' + r.links + ' links (including reference definitions).');
  console.log('SCOPE: Local paths, licensing markers and explicit starter status only; no external URL or SSG build verification.');
}

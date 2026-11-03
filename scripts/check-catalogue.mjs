// SPDX-License-Identifier: MPL-2.0
// Dependency-free local Markdown checks; external link availability is a separate review.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const LICENSE_SHA256 = '28a9529c7d0bb4dc51f4bf5c116a3d16ef247a052f7591466768ddf563fd1cf5';

export function isInside(root, path) {
  const part = relative(resolve(root), resolve(path));
  return part === '' || (part !== '..' && !part.startsWith('..' + sep) && !isAbsolute(part));
}

export function isRealTargetInside(root, path) {
  return isInside(realpathSync(root), realpathSync(path));
}

export function markdownUrls(markdown) {
  const urls = [];
  // Remove non-rendered HTML comments and Markdown code spans, including multiline spans.
  const visible = markdown.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(\x60+)[\s\S]*?\1/g, '');
  let fence = null;
  for (const line of visible.split(/\r?\n/)) {
    const marker = /^\s*(\x60{3,}|~{3,})/.exec(line);
    if (marker) {
      const m = marker[1];
      if (!fence) fence = m;
      else if (m[0] === fence[0] && m.length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;

    // Reference definitions are link targets; footnote definitions are not.
    const definition = /^\s{0,3}\[(?!\^)[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/.exec(line);
    if (definition) urls.push(definition[1] || definition[2]);

    // GitHub Markdown allows raw HTML links and images.
    for (const tag of line.matchAll(/<\s*(?:a|img|link|source|video)\b[^>]*>/gi)) {
      for (const attribute of tag[0].matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi)) {
        urls.push(attribute[2]);
      }
    }

    // Find inline link/image starts; balance nested parentheses in destinations.
    for (const match of line.matchAll(/!?\[[^\]]*\]\(/g)) {
      const start = match.index + match[0].length;
      let depth = 1;
      let end = start;
      let inTitle = null;
      for (; end < line.length && depth > 0; end++) {
        const ch = line[end];
        if (ch === '\\' && end + 1 < line.length) { end++; continue; }
        // At depth one, a whitespace-delimited title is not part of the URL.
        if (!inTitle && depth === 1 && /\s/.test(ch) && /^\s*["']/.test(line.slice(end))) {
          end += (line.slice(end).match(/^\s*/)?.[0].length ?? 0);
          inTitle = line[end];
          continue;
        }
        if (inTitle) { if (ch === inTitle) inTitle = null; continue; }
        if (ch === '(') depth++;
        if (ch === ')') depth--;
      }
      if (depth !== 0) continue;
      const inside = line.slice(start, end - 1).trim();
      let url = '';
      if (inside.startsWith('<') && inside.includes('>')) {
        url = inside.slice(1, inside.indexOf('>'));
      } else {
        let nested = 0;
        let i = 0;
        for (; i < inside.length; i++) {
          if (inside[i] === '\\' && i + 1 < inside.length) { i++; continue; }
          if (inside[i] === '(') nested++;
          if (inside[i] === ')') nested--;
          if (/\s/.test(inside[i]) && nested === 0) break;
        }
        url = inside.slice(0, i);
      }
      if (url) urls.push(url);
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
      errors.push(shown + ': private-source URL cannot be read by public visitors');
    }
    for (const url of markdownUrls(source)) {
      linkCount++;
      if (/^(https?:|mailto:)/i.test(url) || url.startsWith('#') || url.startsWith('//')) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(url)) {
        errors.push(shown + ': unsupported link scheme: ' + url);
        continue;
      }
      const clean = url.split('#')[0].split('?')[0];
      if (!clean) continue;
      let target;
      try { target = resolve(dirname(file), decodeURIComponent(clean)); }
      catch { errors.push(shown + ': malformed URL encoding: ' + url); continue; }
      if (!isInside(root, target)) errors.push(shown + ': link escapes repository: ' + url);
      else if (!existsSync(target)) errors.push(shown + ': missing local link: ' + url);
      else if (!isRealTargetInside(root, target)) errors.push(shown + ': symlink escapes repository: ' + url);
    }
  }
  if (!hasTruthfulStatus(readFileSync(resolve(root, 'README.md'), 'utf8'))) {
    errors.push('README.md: explicit starter/non-verified status disclaimer missing');
  }
  const license = resolve(root, 'LICENSES/CC-BY-SA-4.0.txt');
  if (!existsSync(license)) errors.push('Missing CC BY-SA 4.0 licence text');
  else if (createHash('sha256').update(readFileSync(license, 'utf8').replace(/\r\n/g, '\n')).digest('hex') !== LICENSE_SHA256) {
    errors.push('CC BY-SA 4.0 licence contents differ from pinned original');
  }
  return { errors, docs: docs.length, links: linkCount };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const r = validateCatalogue(root);
  for (const e of r.errors) console.error('FAIL ' + e);
  if (r.errors.length) process.exitCode = 1;
  else console.log('PASS: ' + r.docs + ' Markdown documents, ' + r.links + ' link destinations.');
  console.log('SCOPE: Local paths, attribution and truthful-status declarations. Not an external URL or SSG build test.');
}

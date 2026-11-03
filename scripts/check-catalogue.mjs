// SPDX-License-Identifier: MPL-2.0
// Minimal, dependency-free local catalogue checks. Not an external-link test.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['README.md', 'CONTRIBUTING.md', 'docs/SOURCE-MAP.md'];
const errors = [];
const seenByFile = new Map();

for (const file of files) {
  const content = readFileSync(resolve(root, file), 'utf8');
  if (!content.includes('SPDX-License-Identifier: CC-BY-SA-4.0')) {
    errors.push(file + ': missing licensing marker');
  }
  const destinations = new Set();
  for (const match of content.matchAll(/\]\(([^)\s]+)\)/g)) {
    const link = match[1];
    if (/^https?:\/\//.test(link) || /^mailto:/.test(link)) continue;
    const target = link.split('#')[0].split('?')[0];
    if (!target) continue;
    const local = resolve(root, dirname(file), decodeURIComponent(target));
    if (!local.startsWith(root + '/') && !local.startsWith(root + '\\')) {
      errors.push(file + ': link escapes repository root: ' + link);
    } else if (!existsSync(local)) {
      errors.push(file + ': missing local link: ' + link);
    }
    destinations.add(link);
  }
  seenByFile.set(file, destinations.size);
}
for (const file of files) {
  const content = readFileSync(resolve(root, file), 'utf8');
  if (content.includes('https://github.com/hyperpolymath/polystack/') ||
      content.includes('https://github.com/hyperpolymath/poly-ssg/')) {
    errors.push(file + ': contains link to a private repository; public readers will see 404');
  }
}
const readme = readFileSync(resolve(root, 'README.md'), 'utf8');
for (const disclaimer of ['starter collection', 'not', 'Polystack']) {
  if (!readme.toLowerCase().includes(disclaimer.toLowerCase())) {
    errors.push('README.md: required truthful-status wording missing: ' + disclaimer);
  }
}
if (errors.length) {
  for (const error of errors) console.error('FAIL ' + error);
  process.exitCode = 1;
} else {
  console.log('PASS: ' + files.length + ' files checked for local-link targets, licensing markers and baseline status disclaimers');
  console.log('NOTE: External URL reachability, software builds and source-to-HTML behaviour are NOT covered by this test.');
}

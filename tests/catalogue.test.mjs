// SPDX-License-Identifier: MPL-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import {
  LICENSE_SHA256, hasPrivateSourceLink, hasTruthfulStatus,
  isInside, isRealTargetInside, markdownUrls,
} from '../scripts/check-catalogue.mjs';

test('root and descendants are valid targets, traversal and sibling prefixes not', () => {
  const root = resolve('/tmp/ssg-catalogue');
  assert.ok(isInside(root, root));
  assert.ok(isInside(root, resolve(root, 'docs')));
  assert.equal(isInside(root, resolve(root, '..')), false);
  assert.equal(isInside(root, resolve(root, '../ssg-catalogue-evil')), false);
});

test('reference links, nested parentheses, footnotes, code and comments', () => {
  const content = [
    '[README](.)',
    '[notes](notes_(draft).md)',
    '[licence][cc]',
    '[cc]: ../LICENSES/CC-BY-SA-4.0.txt',
    '[^1]: This is a footnote, not a link',
    '<!-- [ghost](ghost.md) -->',
    String.fromCharCode(96) + '[sample](missing.md)' + String.fromCharCode(96),
    '~~~md',
    '[fake](does-not-exist)',
    '~~~',
    '[with title](notes.md "note")',
    '[quoted parenthesis](missing.md "draft (old")',
    '[external](//cdn.example.com/asset.svg)',
    '<img src="assets/missing.png">',
    '<a href="guide.html">Link</a>',
  ].join('\n');
  assert.deepEqual(markdownUrls(content),
    ['.', 'notes_(draft).md', '../LICENSES/CC-BY-SA-4.0.txt', 'notes.md', 'missing.md', '//cdn.example.com/asset.svg', 'assets/missing.png', 'guide.html']);
});

test('generic words cannot masquerade as publication status', () => {
  assert.equal(hasTruthfulStatus('starter collection; Polystack; not verified'), false);
  assert.equal(hasTruthfulStatus('> **Status: starter collection**\nThis publication has **not** independently built every tool; not production-qualified.'), true);
});

test('private repository URLs are blocked at exact name boundaries', () => {
  assert.equal(hasPrivateSourceLink('https://github.com/hyperpolymath/polystack'), true);
  assert.equal(hasPrivateSourceLink('https://github.com/hyperpolymath/poly-ssg/tree/main'), true);
  assert.equal(hasPrivateSourceLink('https://github.com/hyperpolymath/polystack-fork'), false);
  assert.equal(hasPrivateSourceLink('https://github.com/hyperpolymath/ssg-collection'), false);
});

test('outbound symlinks are rejected after real-path resolution', () => {
  const root = mkdtempSync(join(tmpdir(), 'ssg-in-'));
  const external = mkdtempSync(join(tmpdir(), 'ssg-out-'));
  try {
    writeFileSync(join(external, 'asset.md'), 'external');
    writeFileSync(join(root, 'local.md'), 'internal');
    symlinkSync(external, join(root, 'escape'), 'dir');
    assert.equal(isRealTargetInside(root, join(root, 'local.md')), true);
    assert.equal(isRealTargetInside(root, join(root, 'escape', 'asset.md')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }
});

test('official licence blob is pinned; an empty file cannot pass', () => {
  const file = resolve(fileURLToPath(import.meta.url), '../../LICENSES/CC-BY-SA-4.0.txt');
  const source = readFileSync(file);
  assert.equal(createHash('sha256').update(source.toString('utf8').replace(/\r\n/g, '\n')).digest('hex'), LICENSE_SHA256);
  assert.notEqual(createHash('sha256').update('').digest('hex'), LICENSE_SHA256);
});


test('CRLF-normalized official licence is stable', () => {
  const file = resolve(fileURLToPath(import.meta.url), '../../LICENSES/CC-BY-SA-4.0.txt');
  const source = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  assert.equal(createHash('sha256').update(source.replace(/\n/g, '\r\n').replace(/\r\n/g, '\n')).digest('hex'), LICENSE_SHA256);
});

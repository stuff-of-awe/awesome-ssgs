// SPDX-License-Identifier: MPL-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { hasTruthfulStatus, isInside, markdownUrls } from '../scripts/check-catalogue.mjs';

test('root and descendants are valid local link targets', () => {
  const root = resolve('/tmp/ssg-catalogue');
  assert.ok(isInside(root, root));
  assert.ok(isInside(root, resolve(root, 'docs')));
  assert.equal(isInside(root, resolve(root, '..')), false);
  assert.equal(isInside(root, resolve(root, '../ssg-catalogue-evil')), false);
});

test('reference-style links are extracted while fenced examples are ignored', () => {
  const content = [
    '[README](.)',
    '[licence][cc]',
    '[cc]: ../LICENSES/CC-BY-SA-4.0.txt',
    '~~~md',
    '[fake](does-not-exist)',
    '[unresolved]: missing-in-code.txt',
    '~~~',
    '[with title](notes.md "note")',
  ].join('\n');
  assert.deepEqual(markdownUrls(content), ['../LICENSES/CC-BY-SA-4.0.txt', '.', 'notes.md']);
});

test('a generic word not is insufficient to pass the status gate', () => {
  assert.equal(hasTruthfulStatus('starter collection; Polystack; not verified'), false);
  assert.equal(hasTruthfulStatus('> **Status: starter collection**\nWe have **not** independently built every tool; not production-qualified.'), true);
});

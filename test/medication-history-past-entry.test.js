import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../medication-history.html', import.meta.url), 'utf8');

test('past medication entry is present and linked to authenticated user', () => {
  assert.match(html, /過去の投薬記録を追加/);
  assert.match(html, /addPastRecord/);
  assert.match(html, /auth\.getUser/);
  assert.match(html, /administered_by/);
});

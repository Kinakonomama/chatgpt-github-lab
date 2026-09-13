import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../medication-history.html', import.meta.url), 'utf8');

test('medication history screen supports Japan calendar date and family-visible records', () => {
  assert.match(html, /type="date"/);
  assert.match(html, /scheduled_date/);
  assert.match(html, /administered_at/);
  assert.match(html, /medications\(name,form\)/);
  assert.match(html, /記録者未設定/);
});

test('medication history escapes displayed values', () => {
  assert.match(html, /function esc\(/);
  assert.match(html, /replace\(\/\[&<>\\"'\]/);
});

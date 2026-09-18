import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const history = await readFile(new URL('../medication-history.html', import.meta.url), 'utf8');

test('app is not hardcoded to Kinako as the pet name', () => {
  assert.doesNotMatch(index, /<h2>🐱 きなこの治療状況<\/h2>/);
  assert.doesNotMatch(history, /きなこの投薬履歴/);
  assert.match(index, /id="catName"/);
  assert.match(index, /\.from\('pets'\)/);
});

test('new pets use a neutral placeholder name until the caregiver saves a name', () => {
  assert.match(index, /pet_name:'名前未設定'/);
  assert.match(index, /名前未設定/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('main screen is not hardcoded to Kinako', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.doesNotMatch(html, /<h2>🐱 きなこの治療状況<\/h2>/);
  assert.match(html, /id="petNameHeading"/);
  assert.match(html, /pet_name:'名前未設定'/);
});

test('history screen is not hardcoded to Kinako and filters medications by pet', () => {
  const html = fs.readFileSync('medication-history.html', 'utf8');
  assert.doesNotMatch(html, /<title>きなこ 投薬履歴<\/title>/);
  assert.doesNotMatch(html, /<h1>🐱 きなこの投薬履歴<\/h1>/);
  assert.match(html, /id="petNameHeading"/);
  assert.match(html, /\.eq\('pet_id',currentPet\.id\)/);
});

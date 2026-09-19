import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('main app supports selecting and adding multiple pets', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.match(html, /id="petSelector"/);
  assert.match(html, /onchange="switchPet\(this\.value\)"/);
  assert.match(html, /async function addNewPet\(\)/);
  assert.match(html, /create_pet_for_household/);
  assert.match(html, /from\('pet_memberships'\)/);
  assert.match(html, /currentPets/);
});

test('pet-specific medications remain filtered by current pet', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.match(html, /from\('medications'\)/);
  assert.match(html, /\.eq\('pet_id',currentPet\.id\)/);
});

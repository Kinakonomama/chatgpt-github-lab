import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Kinako treatment progress is visible and uses the pet treatment target', () => {
  assert.match(html, /id="treatmentDay"/);
  assert.match(html, /treatment_target_days/);
  assert.match(html, /const target=Number\(currentPet\?\.treatment_target_days\)\|\|82/);
});

test("dose records use the user's local calendar date", () => {
  assert.match(html, /function localDateKey\(/);
  assert.match(html, /scheduledDate=localDateKey\(\)/);
});

test('dose button parameters are safely encoded before entering an HTML attribute', () => {
  assert.match(html, /encodeURIComponent\(m\.id\)/);
  assert.match(html, /encodeURIComponent\(s\?\.dose_description/);
});
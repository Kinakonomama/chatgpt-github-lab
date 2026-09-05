import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const migrationPath = new URL('../supabase/migrations/20260902_fix_kinako_treatment_days.sql', import.meta.url);

const migration = await readFile(migrationPath, 'utf8');

test('Kinako bootstrap migration uses the 82-day plan', () => {
  assert.match(migration, /treatment_target_days\)\s*\n\s*values \(normalized_pet_name, 'cat', 82\)/);
  assert.doesNotMatch(migration, /values \(normalized_pet_name, 'cat', 84\)/);
});

test('legacy default name is normalized to Kinako', () => {
  assert.match(migration, /pet_name = 'ミケ' then 'きなこ'/);
});

test('bootstrap RPC remains restricted to authenticated callers', () => {
  assert.match(migration, /revoke all on function public\.create_default_household_and_pet\(text, text\) from public;/);
  assert.match(migration, /grant execute on function public\.create_default_household_and_pet\(text, text\) to authenticated;/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sql = readFileSync(new URL('../supabase/setup.sql', import.meta.url), 'utf8');

test('Supabase setup keeps RLS and authenticated-only access', () => {
  assert.match(sql, /grant usage on schema public to authenticated/i);
  assert.match(sql, /grant select, insert, update on public\.pets to authenticated/i);
  assert.match(sql, /create or replace function public\.create_pet_for_household/i);
  assert.match(sql, /security definer/i);
  assert.doesNotMatch(sql, /sb_secret_/i);
  assert.doesNotMatch(sql, /service_role/i);
});

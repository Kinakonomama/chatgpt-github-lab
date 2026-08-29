import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFamilyStore, saveFamilyStore, recordMedication } from './family-store.js';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value)
  };
}

test('family store saves and loads data', () => {
  const storage = memoryStorage();
  const store = { ...loadFamilyStore(storage), family: { id: 'f1', name: 'わが家' } };
  saveFamilyStore(store, storage);
  assert.equal(loadFamilyStore(storage).family.name, 'わが家');
});

test('duplicate administered dose is rejected', () => {
  const original = loadFamilyStore();
  const first = recordMedication(original, {
    medicationId: 'm1', scheduledAt: '2026-08-29T20:00:00+09:00',
    administeredByMemberId: 'member-1', status: 'administered'
  });
  const second = recordMedication(first.store, {
    medicationId: 'm1', scheduledAt: '2026-08-29T20:00:00+09:00',
    administeredByMemberId: 'member-2', status: 'administered'
  });
  assert.equal(first.added, true);
  assert.equal(second.added, false);
  assert.equal(second.reason, 'duplicate');
});

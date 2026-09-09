const STORAGE_KEY = 'fip-family-store-v1';

const emptyStore = () => ({
  family: null,
  members: [],
  cats: [],
  medications: [],
  medicationRecords: [],
  exams: [],
  photos: []
});

export function loadFamilyStore(storage = globalThis.localStorage) {
  if (!storage) return emptyStore();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? { ...emptyStore(), ...JSON.parse(raw) } : emptyStore();
  } catch {
    return emptyStore();
  }
}

export function saveFamilyStore(store, storage = globalThis.localStorage) {
  if (!storage) return false;
  storage.setItem(STORAGE_KEY, JSON.stringify(store));
  return true;
}

export function recordMedication(store, record) {
  const exists = store.medicationRecords.some(item =>
    item.medicationId === record.medicationId &&
    item.scheduledAt === record.scheduledAt &&
    item.status === 'administered'
  );
  if (exists) return { store, added: false, reason: 'duplicate' };
  return {
    store: { ...store, medicationRecords: [...store.medicationRecords, record] },
    added: true
  };
}

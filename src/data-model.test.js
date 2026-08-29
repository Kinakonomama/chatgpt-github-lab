import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAmount, hasAdministeredRecord } from './data-model.js';

test('preserves a user-specified display such as 1 and 1/4 tablets', () => {
  assert.equal(formatAmount(1.25, 'tablet', '1と1/4錠'), '1と1/4錠');
});

test('detects an administered record for the same scheduled dose', () => {
  const records = [
    { scheduledAt: '2026-08-29T20:00:00+09:00', status: 'administered' }
  ];
  assert.equal(hasAdministeredRecord(records, '2026-08-29T20:00:00+09:00'), true);
});

test('does not block a dose when only scheduled records exist', () => {
  const records = [
    { scheduledAt: '2026-08-29T20:00:00+09:00', status: 'scheduled' }
  ];
  assert.equal(hasAdministeredRecord(records, '2026-08-29T20:00:00+09:00'), false);
});

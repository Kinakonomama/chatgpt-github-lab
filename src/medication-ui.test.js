import test from 'node:test';
import assert from 'node:assert/strict';

function formatMedication(name, form, amount, unit) {
  return `${name}（${form}・${amount}${unit}）`;
}

function shouldBlockDuplicate(records, scheduledAt) {
  return records.some(r => r.scheduledAt === scheduledAt && r.status === 'administered');
}

test('supports tablet amount such as 1 and 1/4 tablets', () => {
  assert.equal(formatMedication('GS-441524', '錠剤', '1と1/4', '錠'), 'GS-441524（錠剤・1と1/4錠）');
});

test('supports powder measured in grams', () => {
  assert.equal(formatMedication('薬A', '粉薬', '0.25', 'g'), '薬A（粉薬・0.25g）');
});

test('blocks a second administered record for the same scheduled dose', () => {
  const records = [{ scheduledAt: '2026-08-29T20:00', status: 'administered' }];
  assert.equal(shouldBlockDuplicate(records, '2026-08-29T20:00'), true);
});

test('does not block when the scheduled dose has not been administered', () => {
  const records = [{ scheduledAt: '2026-08-29T20:00', status: 'scheduled' }];
  assert.equal(shouldBlockDuplicate(records, '2026-08-29T20:00'), false);
});

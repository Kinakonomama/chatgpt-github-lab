import { describe, expect, it } from 'vitest';
import { formatAmount, hasAdministeredRecord } from './data-model.js';

describe('formatAmount', () => {
  it('preserves a user-specified display such as 1 and 1/4 tablets', () => {
    expect(formatAmount(1.25, 'tablet', '1と1/4錠')).toBe('1と1/4錠');
  });
});

describe('hasAdministeredRecord', () => {
  it('detects an administered record for the same scheduled dose', () => {
    const records = [
      { scheduledAt: '2026-08-29T20:00:00+09:00', status: 'administered' }
    ];
    expect(hasAdministeredRecord(records, '2026-08-29T20:00:00+09:00')).toBe(true);
  });

  it('does not block a dose when only scheduled records exist', () => {
    const records = [
      { scheduledAt: '2026-08-29T20:00:00+09:00', status: 'scheduled' }
    ];
    expect(hasAdministeredRecord(records, '2026-08-29T20:00:00+09:00')).toBe(false);
  });
});

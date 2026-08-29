export const MEDICATION_FORMS = ['tablet', 'capsule', 'powder', 'liquid', 'other'];
export const AMOUNT_UNITS = ['tablet', 'capsule', 'mg', 'g', 'mL', 'other'];

// Recording only: this helper does not determine a medical dose.
export function formatAmount(value, unit, display) {
  if (display) return display;
  if (value === undefined || value === null || value === '') return '';
  return `${value} ${unit || ''}`.trim();
}

// Returns true when an already-administered record exists for the same scheduled dose.
export function hasAdministeredRecord(records, scheduledAt) {
  return records.some(record =>
    record.scheduledAt === scheduledAt && record.status === 'administered'
  );
}

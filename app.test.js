const test = require('node:test');
const assert = require('node:assert/strict');
const { state, treatmentDay, canAdminister, administerMedication } = require('./app');

test('治療日数を計算できる', () => {
  assert.equal(treatmentDay('2026-08-01', new Date('2026-08-29T12:00:00')), 29);
});

test('未投薬の予定は投薬可能', () => {
  const medication = state.medications.find((item) => item.id === 'med-2');
  assert.equal(canAdminister(medication), true);
});

test('投薬済みの予定は二重投薬を防止する', () => {
  const medication = state.medications.find((item) => item.id === 'med-1');
  assert.equal(canAdminister(medication), false);
  const result = administerMedication('med-1', 'お父さん', new Date('2026-08-29T20:01:00'));
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'already_administered');
});

test('新しい投薬を実施すると実施者と時刻を記録する', () => {
  const result = administerMedication('med-2', 'お父さん', new Date('2026-08-29T20:01:00'));
  assert.equal(result.ok, true);
  assert.equal(result.medication.administeredBy, 'お父さん');
  assert.equal(result.medication.administeredAt, '2026-08-29T20:01:00.000Z');
});

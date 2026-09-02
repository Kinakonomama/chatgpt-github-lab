import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTreatmentDay,
  createDoseRecord,
  createMedication,
  formatDateKey,
  getDailyRecord,
  hasDoseForDate,
  isAlreadyAdministered
} from '../src/medication-model.js';

test('1と1/4錠のような投与量をそのまま記録できる', () => {
  const medication = createMedication({
    name: 'GS-441524',
    form: '錠剤',
    dose: '1と1/4',
    unit: '錠',
    scheduledTime: '20:00'
  });
  assert.equal(medication.dose, '1と1/4');
  assert.equal(medication.unit, '錠');
});

test('粉薬はグラム単位で記録できる', () => {
  const medication = createMedication({
    name: 'その他',
    form: '粉末',
    dose: '0.25',
    unit: 'g',
    scheduledTime: '08:00'
  });
  assert.equal(medication.unit, 'g');
});

test('実施者と実施時刻を投薬記録に残せる', () => {
  const record = createDoseRecord({
    medicationName: 'モルヌピラビル',
    scheduledTime: '20:00',
    user: 'お母さん',
    administeredAt: '2026-08-29T20:03:00+09:00',
    dateKey: '2026-08-29'
  });
  assert.equal(record.user, 'お母さん');
  assert.equal(record.scheduledTime, '20:00');
  assert.equal(record.dateKey, '2026-08-29');
});

test('同じ薬の同じ予定枠が投薬済みなら重複を検知する', () => {
  const records = [{ medicationName: 'GS-441524', scheduledTime: '20:00' }];
  assert.equal(isAlreadyAdministered(records, 'GS-441524', '20:00'), true);
  assert.equal(isAlreadyAdministered(records, 'GS-441524', '08:00'), false);
});

test('端末のローカル日付で日付キーを作れる', () => {
  assert.equal(formatDateKey(new Date(2026, 8, 2, 23, 30)), '2026-09-02');
});

test('治療開始日から82日を上限にDayを計算する', () => {
  assert.equal(calculateTreatmentDay('2026-09-01', '2026-09-01'), 1);
  assert.equal(calculateTreatmentDay('2026-09-01', '2026-09-02'), 2);
  assert.equal(calculateTreatmentDay('2026-09-01', '2027-01-01'), 82);
});

test('投薬済み判定は日付ごとに分かれる', () => {
  const recordsByDate = {
    '2026-09-01': { doses: { 0: { user: 'お母さん', time: '20:01' } } },
    '2026-09-02': { doses: {} }
  };
  assert.equal(hasDoseForDate(recordsByDate, '2026-09-01', 0), true);
  assert.equal(hasDoseForDate(recordsByDate, '2026-09-02', 0), false);
  assert.deepEqual(getDailyRecord(recordsByDate, '2026-09-03'), { doses: {} });
});

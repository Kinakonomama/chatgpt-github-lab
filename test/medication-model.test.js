import test from 'node:test';
import assert from 'node:assert/strict';
import { createMedication, createDoseRecord, isAlreadyAdministered } from '../src/medication-model.js';

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
    administeredAt: '2026-08-29T20:03:00+09:00'
  });
  assert.equal(record.user, 'お母さん');
  assert.equal(record.scheduledTime, '20:00');
});

test('同じ薬の同じ予定枠が投薬済みなら重複を検知する', () => {
  const records = [{ medicationName: 'GS-441524', scheduledTime: '20:00' }];
  assert.equal(isAlreadyAdministered(records, 'GS-441524', '20:00'), true);
  assert.equal(isAlreadyAdministered(records, 'GS-441524', '08:00'), false);
});

const state = {
  cat: {
    name: 'ミケ',
    treatmentStart: '2026-08-01',
    treatmentPlanDays: 84,
    weightKg: 3.82,
    temperatureC: 38.4,
    appetite: 4,
    energy: 4,
  },
  medications: [
    { id: 'med-1', name: 'GS-441524', form: '錠剤', amount: '1と1/4錠', scheduledAt: '08:00', administeredAt: '08:03', administeredBy: 'お母さん' },
    { id: 'med-2', name: 'GS-441524', form: '錠剤', amount: '1と1/4錠', scheduledAt: '20:00', administeredAt: null, administeredBy: null },
  ],
  measurements: [
    { date: '2026-08-01', weightKg: 3.20, temperatureC: 38.6, appetite: 3, energy: 3, note: '治療開始' },
    { date: '2026-08-10', weightKg: 3.45, temperatureC: 38.5, appetite: 4, energy: 4, note: '食欲改善' },
    { date: '2026-08-20', weightKg: 3.70, temperatureC: 38.4, appetite: 4, energy: 4, note: '元気あり' },
    { date: '2026-08-29', weightKg: 3.82, temperatureC: 38.4, appetite: 4, energy: 4, note: '' },
  ],
  labReports: [
    { date: '2026-08-20', title: '血液検査', values: { TP: '', ALB: '', GLOB: '', AG: '', ALT: '', AST: '', BUN: '', CRE: '', HCT: '', WBC: '' }, photo: null },
  ],
};

function treatmentDay(startDate, now = new Date()) {
  const start = new Date(`${startDate}T00:00:00`);
  const current = new Date(now);
  return Math.max(1, Math.floor((current - start) / 86400000) + 1);
}

function canAdminister(medication) {
  return !medication.administeredAt;
}

function administerMedication(medicationId, person, now = new Date()) {
  const medication = state.medications.find((item) => item.id === medicationId);
  if (!medication) throw new Error('投薬対象が見つかりません');
  if (!canAdminister(medication)) return { ok: false, reason: 'already_administered' };
  medication.administeredAt = now.toISOString();
  medication.administeredBy = person;
  return { ok: true, medication };
}

module.exports = { state, treatmentDay, canAdminister, administerMedication };

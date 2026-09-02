/**
 * FIP治療記録アプリの基本データモデル。
 * 投与量は獣医師の指示を記録するための文字列として扱い、
 * アプリ側で治療量を自動計算しません。
 */

export function createMedication({ name, form, dose, unit = '', scheduledTime }) {
  if (!name?.trim()) throw new Error('薬名が必要です');
  if (!form?.trim()) throw new Error('剤形が必要です');
  if (!dose?.trim()) throw new Error('投与量が必要です');
  if (!scheduledTime?.trim()) throw new Error('予定時刻が必要です');

  return {
    name: name.trim(),
    form: form.trim(),
    dose: dose.trim(),
    unit: unit.trim(),
    scheduledTime: scheduledTime.trim()
  };
}

export function createDoseRecord({ medicationName, scheduledTime, user, administeredAt, dateKey }) {
  if (!medicationName?.trim() || !scheduledTime?.trim() || !user?.trim() || !administeredAt?.trim()) {
    throw new Error('投薬記録には薬名・予定時刻・実施者・実施時刻が必要です');
  }
  return {
    medicationName: medicationName.trim(),
    scheduledTime: scheduledTime.trim(),
    user: user.trim(),
    administeredAt: administeredAt.trim(),
    dateKey: dateKey?.trim()
  };
}

/** 同じ予定枠にすでに投薬記録があるかを判定する。 */
export function isAlreadyAdministered(records, medicationName, scheduledTime) {
  return records.some(record =>
    record.medicationName === medicationName && record.scheduledTime === scheduledTime
  );
}

export function formatDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error('有効な日付が必要です');
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateTreatmentDay(startDateKey, todayKey, totalDays = 82) {
  const start = new Date(`${startDateKey}T00:00:00`);
  const today = new Date(`${todayKey}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(today.getTime())) return 1;
  const elapsedDays = Math.floor((today - start) / 86400000);
  return Math.min(totalDays, Math.max(1, elapsedDays + 1));
}

export function getDailyRecord(recordsByDate, dateKey) {
  return recordsByDate?.[dateKey] ?? { doses: {} };
}

export function hasDoseForDate(recordsByDate, dateKey, medicationIndex) {
  return Boolean(getDailyRecord(recordsByDate, dateKey).doses?.[medicationIndex]);
}

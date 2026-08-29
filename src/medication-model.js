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

export function createDoseRecord({ medicationName, scheduledTime, user, administeredAt }) {
  if (!medicationName?.trim() || !scheduledTime?.trim() || !user?.trim() || !administeredAt?.trim()) {
    throw new Error('投薬記録には薬名・予定時刻・実施者・実施時刻が必要です');
  }
  return {
    medicationName: medicationName.trim(),
    scheduledTime: scheduledTime.trim(),
    user: user.trim(),
    administeredAt: administeredAt.trim()
  };
}

/** 同じ予定枠にすでに投薬記録があるかを判定する。 */
export function isAlreadyAdministered(records, medicationName, scheduledTime) {
  return records.some(record =>
    record.medicationName === medicationName && record.scheduledTime === scheduledTime
  );
}

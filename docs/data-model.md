# FIP治療記録アプリ データモデル

## 目的
家族で同じ猫の治療記録を共有し、誰がいつ投薬したかを確認できる土台を定義する。

## 主なデータ

### Family
- id
- name
- members

### Cat
- id
- familyId
- name
- species
- birthDate
- weightHistory
- temperatureHistory
- conditionHistory
- treatmentStartDate
- treatmentPlanDays

### Medication
- id
- catId
- name
- form: tablet / capsule / powder / liquid / other
- amountValue
- amountUnit: tablet / capsule / mg / g / mL / other
- scheduleTimes
- startDate
- endDate
- veterinarianInstructions

### MedicationRecord
- id
- medicationId
- scheduledAt
- administeredAt
- administeredByMemberId
- status: scheduled / administered / skipped / uncertain
- note

### Exam
- id
- catId
- examinedAt
- hospitalName
- bloodTestValues
- temperature
- weight
- note
- photoIds

### Photo
- id
- catId
- examId
- capturedAt
- storageKey
- caption

## 安全方針

- 投与量はアプリが医学的に自動決定しない。
- 獣医師から指示された内容を記録する。
- 秘密情報、APIキー、パスワード、SSH秘密鍵、.envの秘密値をリポジトリへ保存しない。
- 本番データをこの練習用リポジトリへ保存しない。

## 二重投薬防止

同じ投薬予定について、すでに `administered` の記録がある場合は、別の家族メンバーが投薬済みとして登録する前に警告する。

最終的な投薬判断は飼い主と獣医師が行い、アプリは記録と共有を補助する。

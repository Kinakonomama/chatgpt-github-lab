-- Prevent duplicate medication records for the same medication and scheduled date.
-- Apply after the base schema. This is a database-level guard in addition to the UI check.
create unique index if not exists medication_logs_medication_scheduled_date_key
on public.medication_logs (medication_id, scheduled_date);

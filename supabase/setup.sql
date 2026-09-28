-- FIP Cat Care: Data API grants and safe pet creation helper
-- Run this in Supabase SQL Editor after the base schema.

-- Data API access is intentionally limited to authenticated users.
grant usage on schema public to authenticated;
grant select, insert, update on public.households to authenticated;
grant select, insert on public.household_members to authenticated;
grant select, insert on public.pet_memberships to authenticated;
grant select, insert, update on public.pets to authenticated;
grant select, insert, update on public.medications to authenticated;
grant select, insert on public.medication_schedules to authenticated;
grant select, insert on public.medication_logs to authenticated;
grant select, insert on public.health_records to authenticated;
grant select, insert on public.blood_tests to authenticated;
grant select, insert on public.attachments to authenticated;

-- A pet needs a household membership at the same time it is created.
-- This RPC performs both writes atomically so the client never needs
-- elevated database credentials.
create or replace function public.create_pet_for_household(
  p_household_id uuid,
  p_name text,
  p_treatment_start_date date default null,
  p_weight_kg numeric default null,
  p_temperature_c numeric default null
)
returns public.pets
language plpgsql
security definer
set search_path = public
as $$
declare
  new_pet public.pets;
begin
  if not exists (
    select 1
    from public.household_members
    where household_id = p_household_id
      and user_id = auth.uid()
  ) then
    raise exception 'not a household member';
  end if;

  insert into public.pets (
    name,
    treatment_start_date,
    treatment_target_days,
    weight_kg,
    temperature_c
  )
  values (
    p_name,
    p_treatment_start_date,
    82,
    p_weight_kg,
    p_temperature_c
  )
  returning * into new_pet;

  insert into public.pet_memberships (pet_id, household_id)
  values (new_pet.id, p_household_id);

  return new_pet;
end;
$$;

grant execute on function public.create_pet_for_household(uuid, text, date, numeric, numeric)
to authenticated;

-- Allow family members to update their own shared health data.
create policy "members can update health records"
on public.health_records
for update
to authenticated
using (public.user_can_access_pet(pet_id))
with check (public.user_can_access_pet(pet_id));

create policy "members can update blood tests"
on public.blood_tests
for update
to authenticated
using (public.user_can_access_pet(pet_id))
with check (public.user_can_access_pet(pet_id));

create policy "members can update medication schedules"
on public.medication_schedules
for update
to authenticated
using (
  exists (
    select 1 from public.medications m
    where m.id = medication_schedules.medication_id
      and public.user_can_access_pet(m.pet_id)
  )
)
with check (
  exists (
    select 1 from public.medications m
    where m.id = medication_schedules.medication_id
      and public.user_can_access_pet(m.pet_id)
  )
);

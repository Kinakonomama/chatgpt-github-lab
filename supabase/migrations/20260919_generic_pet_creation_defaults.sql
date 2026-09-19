-- Make pet creation generic: the app/user chooses the pet name.
-- Keep the treatment plan default at 82 days without forcing a specific pet name.
create or replace function public.create_default_household_and_pet(
  household_name text default 'FIP家族',
  pet_name text default '名前未設定'
)
returns public.pets
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household_id uuid;
  new_pet public.pets;
  normalized_pet_name text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  normalized_pet_name := coalesce(nullif(btrim(pet_name), ''), '名前未設定');
  insert into public.households (name, created_by)
  values (coalesce(nullif(btrim(household_name), ''), 'FIP家族'), auth.uid())
  returning id into new_household_id;
  insert into public.household_members (household_id, user_id, role)
  values (new_household_id, auth.uid(), 'owner');
  insert into public.pets (name, species, treatment_target_days)
  values (normalized_pet_name, 'cat', 82)
  returning * into new_pet;
  insert into public.pet_memberships (pet_id, household_id)
  values (new_pet.id, new_household_id);
  return new_pet;
end;
$$;
revoke all on function public.create_default_household_and_pet(text, text) from public;
grant execute on function public.create_default_household_and_pet(text, text) to authenticated;

-- New pets in an existing family also use the app's 82-day default.
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
declare new_pet public.pets;
begin
  if not exists (select 1 from public.household_members where household_id=p_household_id and user_id=auth.uid()) then
    raise exception 'not a household member';
  end if;
  insert into public.pets(name,treatment_start_date,treatment_target_days,weight_kg,temperature_c)
  values (coalesce(nullif(btrim(p_name),''),'名前未設定'),p_treatment_start_date,82,p_weight_kg,p_temperature_c)
  returning * into new_pet;
  insert into public.pet_memberships(pet_id,household_id) values(new_pet.id,p_household_id);
  return new_pet;
end;
$$;
grant execute on function public.create_pet_for_household(uuid,text,date,numeric,numeric) to authenticated;

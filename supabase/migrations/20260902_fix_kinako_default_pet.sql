-- Keep the browser MVP aligned with Kinako's 82-day tracking plan.
-- The current client calls this RPC with the legacy pet name "ミケ";
-- normalize that value here so a new family always starts with きなこ.
create or replace function public.create_default_household_and_pet(
  household_name text default 'FIP家族',
  pet_name text default 'きなこ'
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

  normalized_pet_name := case
    when pet_name is null or btrim(pet_name) = '' or pet_name = 'ミケ' then 'きなこ'
    else pet_name
  end;

  insert into public.households (name, created_by)
  values (household_name, auth.uid())
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

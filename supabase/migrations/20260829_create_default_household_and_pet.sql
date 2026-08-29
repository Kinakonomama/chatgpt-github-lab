-- Creates the first family and pet for the signed-in user.
-- SECURITY DEFINER is used so the initial pet can be created before its
-- membership row exists; subsequent access is protected by RLS.
create or replace function public.create_default_household_and_pet(
  household_name text default 'FIP家族',
  pet_name text default 'ミケ'
)
returns public.pets
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household_id uuid;
  new_pet public.pets;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.households (name, created_by)
  values (household_name, auth.uid())
  returning id into new_household_id;

  insert into public.household_members (household_id, user_id, role)
  values (new_household_id, auth.uid(), 'owner');

  insert into public.pets (name, species, treatment_target_days)
  values (pet_name, 'cat', 84)
  returning * into new_pet;

  insert into public.pet_memberships (pet_id, household_id)
  values (new_pet.id, new_household_id);

  return new_pet;
end;
$$;

revoke all on function public.create_default_household_and_pet(text, text) from public;
grant execute on function public.create_default_household_and_pet(text, text) to authenticated;

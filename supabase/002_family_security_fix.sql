-- Migration for the FIP Cat Care family-sharing model.
-- Run this in Supabase SQL Editor after the initial schema.
-- This fixes the pet creation flow while keeping RLS enabled.

alter table public.pets
  add column if not exists created_by uuid references auth.users(id) on delete restrict;

create index if not exists idx_pets_created_by
  on public.pets(created_by);

drop policy if exists "members can create pets" on public.pets;

create policy "members can create pets"
on public.pets
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.household_members hm
    where hm.user_id = auth.uid()
  )
);

-- After a pet is created, add its pet_memberships row for the household.
-- Existing SELECT/UPDATE policies continue to require pet membership.

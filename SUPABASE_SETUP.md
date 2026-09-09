# Supabase setup

This repository uses Supabase for the family-shared FIP treatment record prototype.

## Safety rules

- The browser may contain a Supabase **Publishable key** when RLS policies are enabled.
- Never put a Supabase **Secret key** or `service_role` key in this repository.
- Never commit database passwords, SSH private keys, API tokens, `.env` files, or other secrets.
- Medication dose recommendations are intentionally not calculated by the app; the app records the veterinarian's instructions.

## Database

The initial schema is created in Supabase SQL Editor. Then run:

`supabase/002_family_security_fix.sql`

This migration adds `pets.created_by` and fixes the secure pet-creation flow.

## Current cloud milestone

The next app milestone is:

1. Supabase Auth sign-in
2. Create a family/household
3. Invite family members
4. Create a pet and attach it to a household
5. Store medication and health records in Postgres
6. Add Storage for examination photos
7. Enforce family-only access with RLS

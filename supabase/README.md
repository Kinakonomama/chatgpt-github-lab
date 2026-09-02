# Supabase setup

This directory documents the database used by the FIP Cat Care app.

## Important security rules

- The browser app uses the Supabase **Publishable key** only.
- Never put a Supabase **Secret key**, database password, API token, or other credential in this repository.
- Row Level Security (RLS) must remain enabled on application tables.
- Treatment doses are recorded from veterinarian instructions; the app does not calculate or prescribe doses.

## Current project

- Region: Northeast Asia (Tokyo)
- Project URL: `https://vmqrfexbfvbzrdwlwsva.supabase.co`

The production database schema was created in the Supabase SQL Editor. Future schema changes should be added as reviewed migration files before being applied to production.

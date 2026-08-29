import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://vmqrfexbfvbzrdwlwsva.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_tiCLfDC_HgwLhJoeoSfKlw_cXr9M5FV';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

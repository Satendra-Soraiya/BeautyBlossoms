import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    supabaseUrl !== 'https://your-project-ref.supabase.co' &&
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey !== 'your-supabase-anon-key'
  );
};

// Client for standard requests (respects Row Level Security - RLS)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client for server-side trusted operations (bypasses RLS)
export const supabaseAdmin =
  isSupabaseConfigured() && supabaseServiceKey && supabaseServiceKey !== 'your-supabase-service-role-key'
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

if (!isSupabaseConfigured()) {
  console.warn(
    '⚠️  [Supabase]: Supabase credentials are missing or using placeholder values in .env. Update SUPABASE_URL and SUPABASE_ANON_KEY to connect.'
  );
} else {
  console.log('✅ [Supabase]: Client initialized successfully.');
}

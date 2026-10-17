import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isDatabaseUrlConfigured = () => {
  return (
    Boolean(databaseUrl) &&
    !databaseUrl.includes('your-project-ref') &&
    !databaseUrl.includes('[password]')
  );
};

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    !supabaseUrl.includes('your-project-ref') &&
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey !== 'your-supabase-anon-key'
  );
};

// PostgreSQL Direct Pool (Live database connection via connection string)
export const dbPool = isDatabaseUrlConfigured()
  ? new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    })
  : null;

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

if (isDatabaseUrlConfigured()) {
  console.log('✅ [Supabase PostgreSQL]: Direct database connection pool initialized.');
} else {
  console.warn('⚠️  [Supabase PostgreSQL]: DATABASE_URL is not set.');
}

if (isSupabaseConfigured()) {
  console.log('✅ [Supabase Client]: REST client initialized successfully.');
}

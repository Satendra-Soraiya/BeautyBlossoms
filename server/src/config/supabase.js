import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * Ensures database connection URLs are converted to IPv4 connection poolers.
 * Cloud hosts like Render lack IPv6 routing, which causes `ENETUNREACH 2406:da1a...`
 * when attempting to reach direct Supabase hosts (db.<ref>.supabase.co:5432).
 */
export function resolveIPv4DatabaseUrl(url) {
  const fallback = 'postgresql://postgres.ujljljqcfahtqtvbuwns:erJeh6KoP9MCDbhD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
  if (!url) {
    return fallback;
  }

  // If already using Supabase connection pooler, keep as is
  if (url.includes('pooler.supabase.com')) {
    return url;
  }

  // Convert direct db.<projectRef>.supabase.co:5432 to IPv4 pooler
  const directMatch = url.match(/postgresql:\/\/postgres(?:\.([a-z0-9]+))?:([^@]+)@db\.([a-z0-9]+)\.supabase\.co(?::5432)?\/postgres/);
  if (directMatch) {
    const projectRef = directMatch[3] || directMatch[1] || 'ujljljqcfahtqtvbuwns';
    const password = directMatch[2];
    return `postgresql://postgres.${projectRef}:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;
  }

  return url;
}

const rawDatabaseUrl = process.env.DATABASE_URL;
const databaseUrl = resolveIPv4DatabaseUrl(rawDatabaseUrl);
const supabaseUrl = process.env.SUPABASE_URL || 'https://ujljljqcfahtqtvbuwns.supabase.co';
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

// PostgreSQL Direct Pool with automatic IPv4 resolution and connection safety
export const dbPool = isDatabaseUrlConfigured()
  ? new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 10,
    })
  : null;

if (dbPool) {
  dbPool.on('error', (err) => {
    console.warn('⚠️  [Supabase PostgreSQL Pool]: Idle client notice:', err.message);
  });
}

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
  console.log('✅ [Supabase PostgreSQL]: Direct IPv4 database connection pool initialized.');
} else {
  console.warn('⚠️  [Supabase PostgreSQL]: DATABASE_URL is not set.');
}

if (isSupabaseConfigured()) {
  console.log('✅ [Supabase Client]: REST client initialized successfully.');
}


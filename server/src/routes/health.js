import express from 'express';
import { isSupabaseConfigured, supabase, dbPool, isDatabaseUrlConfigured } from '../config/supabase.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    supabase: {
      directPostgresConfigured: isDatabaseUrlConfigured(),
      directPostgresConnected: false,
      restApiConfigured: isSupabaseConfigured(),
      restApiConnected: false,
    },
  };

  // Test direct PostgreSQL pool connection
  if (dbPool) {
    try {
      const result = await dbPool.query('SELECT 1 as ping');
      status.supabase.directPostgresConnected = Boolean(result.rows[0]?.ping === 1);
    } catch {
      status.supabase.directPostgresConnected = false;
    }
  }

  // Test Supabase REST client if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('lehenga_products').select('id').limit(1);
      status.supabase.restApiConnected = !error;
    } catch {
      status.supabase.restApiConnected = false;
    }
  }

  res.json(status);
});

export default router;

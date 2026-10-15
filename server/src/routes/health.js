import express from 'express';
import { isSupabaseConfigured, supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    supabase: {
      configured: isSupabaseConfigured(),
      connected: false,
    },
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      // Light check to test connectivity
      const { error } = await supabase.from('_non_existent_table_ping').select('*').limit(1);
      // Supabase responds with either error PGRST204/PGRST116 (table not found) or success, proving connection is reachable
      status.supabase.connected = !error || error.code !== 'ENOTFOUND';
    } catch {
      status.supabase.connected = false;
    }
  }

  res.json(status);
});

export default router;

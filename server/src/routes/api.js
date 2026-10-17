import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

// Root API test endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the BeautyBlossoms API',
    version: '1.0.0',
    documentation: '/api/routes',
  });
});

// Boutique CMS Passcode verification
router.post('/auth/verify-pin', (req, res) => {
  const { pin } = req.body;
  const adminPin = process.env.ADMIN_PIN || '2026';

  if (!pin || String(pin).trim() !== String(adminPin).trim()) {
    return res.status(401).json({
      success: false,
      error: 'Incorrect boutique passcode. Please try again.',
    });
  }

  return res.json({
    success: true,
    message: 'Passcode verified successfully.',
    token: 'bb_authenticated_' + Buffer.from(adminPin + '_salt').toString('base64'),
  });
});

// Example route demonstrating database querying with Supabase
router.get('/example-data', async (req, res, next) => {
  if (!isSupabaseConfigured() || !supabase) {
    return res.status(503).json({
      error: 'Supabase is not configured yet. Please add your credentials in server/.env',
    });
  }

  try {
    // Example: replace 'items' with your actual Supabase table name
    const { data, error } = await supabase.from('items').select('*').limit(10);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;

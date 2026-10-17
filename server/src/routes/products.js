import express from 'express';
import { supabase, isSupabaseConfigured, dbPool } from '../config/supabase.js';
import { LEHENGA_PRODUCTS, getProductBySlug } from '../../../client/src/data/products.js';

const router = express.Router();

// Helper to convert database row (snake_case) to client entity (camelCase)
function transformProductRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    productCode: row.product_code || row.productCode,
    name: row.name,
    collection: row.collection || 'Dandiya Night Lehengas',
    tagline: row.tagline,
    price: Number(row.price),
    formattedPrice: row.formatted_price || row.formattedPrice || `₹${Number(row.price).toLocaleString('en-IN')}`,
    availability: row.availability || 'In Stock',
    availabilityBadge: row.availability_badge || row.availabilityBadge || 'in-stock',
    category: row.category,
    categoryLabel: row.category_label || row.categoryLabel,
    featured: Boolean(row.featured),
    thumbnail: row.thumbnail,
    images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? JSON.parse(row.images) : []),
    description: row.description,
    details: typeof row.details === 'string' ? JSON.parse(row.details) : (row.details || {}),
    sizeFitting: typeof row.size_fitting === 'string' ? JSON.parse(row.size_fitting) : (row.size_fitting || row.sizeFitting || {}),
    bookingInfo: typeof row.booking_info === 'string' ? JSON.parse(row.booking_info) : (row.booking_info || row.bookingInfo || {}),
  };
}

/**
 * GET /api/products
 * Returns all products. Tries Supabase direct DB pool first, then REST client, then fallback catalog.
 */
router.get('/', async (req, res) => {
  const { category, featured } = req.query;

  // 1. Try Direct PostgreSQL Connection Pool
  if (dbPool) {
    try {
      let sql = 'SELECT * FROM lehenga_products';
      const params = [];
      const conditions = [];

      if (category && category !== 'all') {
        params.push(category);
        conditions.push(`category = $${params.length}`);
      }
      if (featured === 'true') {
        conditions.push(`featured = true`);
      }

      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }
      sql += ' ORDER BY sort_order ASC';

      const { rows } = await dbPool.query(sql, params);
      if (Array.isArray(rows) && rows.length > 0) {
        return res.json({
          source: 'supabase_postgres_live',
          total: rows.length,
          data: rows.map(transformProductRow),
        });
      }
    } catch (err) {
      console.warn('⚠️ [API]: Direct Supabase DB query failed, falling back:', err.message);
    }
  }

  // 2. Try Supabase REST Client
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase
        .from('lehenga_products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (featured === 'true') {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        return res.json({
          source: 'supabase_rest_live',
          total: data.length,
          data: data.map(transformProductRow),
        });
      }
    } catch (err) {
      console.warn('⚠️ [API]: Supabase REST query failed, falling back to local dataset:', err.message);
    }
  }

  // 3. Seamless Fallback to in-memory 30-product catalog
  let results = [...LEHENGA_PRODUCTS];
  if (category && category !== 'all') {
    results = results.filter((p) => p.category === category);
  }
  if (featured === 'true') {
    results = results.filter((p) => p.featured);
  }

  return res.json({
    source: 'local_fallback',
    total: results.length,
    data: results,
  });
});

/**
 * GET /api/products/:slugOrId
 * Returns a single product by slug or id.
 */
router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;

  // 1. Try Direct PostgreSQL Connection Pool
  if (dbPool) {
    try {
      const { rows } = await dbPool.query(
        'SELECT * FROM lehenga_products WHERE slug = $1 OR id = $1 OR LOWER(product_code) = LOWER($1) LIMIT 1',
        [slugOrId]
      );
      if (rows && rows.length > 0) {
        return res.json({
          source: 'supabase_postgres_live',
          data: transformProductRow(rows[0]),
        });
      }
    } catch (err) {
      console.warn('⚠️ [API]: Direct Supabase single product query failed:', err.message);
    }
  }

  // 2. Try Supabase REST Client
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('lehenga_products')
        .select('*')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId},product_code.ilike.${slugOrId}`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return res.json({
          source: 'supabase_rest_live',
          data: transformProductRow(data),
        });
      }
    } catch (err) {
      console.warn('⚠️ [API]: Supabase single product query failed, using fallback:', err.message);
    }
  }

  // 3. Fallback
  const localMatch = getProductBySlug(slugOrId);
  if (localMatch) {
    return res.json({
      source: 'local_fallback',
      data: localMatch,
    });
  }

  return res.status(404).json({ error: 'Product not found', slugOrId });
});

export default router;

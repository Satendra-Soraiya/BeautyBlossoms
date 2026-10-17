import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, isSupabaseConfigured, dbPool } from '../config/supabase.js';
import { LEHENGA_PRODUCTS, getProductBySlug } from '../../../client/src/data/products.js';
import { syncLocalProductsFile } from '../utils/syncCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsOutputDir = path.resolve(__dirname, '../../../client/public/products');

if (!fs.existsSync(productsOutputDir)) {
  fs.mkdirSync(productsOutputDir, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

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
    rentPrice: Number(row.rent_price) || 799,
    formattedRentPrice: row.formatted_rent_price || row.formattedRentPrice || `₹${Number(row.rent_price || 799)} / day`,
    slayTagline: row.slay_tagline || 'Rent for Garba night and slay',
    availability: row.availability || 'Rent & Buy',
    availabilityBadge: row.availability_badge || row.availabilityBadge || 'rent-and-buy',
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

/**
 * POST /api/products/upload
 * Handles camera snapshots and photo gallery uploads.
 * Auto-rotates using EXIF orientation (crucial for phone cameras) and converts to WebP.
 */
router.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ success: false, error: 'No image file uploaded' });
    }

    const { productCode = 'outfit', title = '' } = req.body;
    const cleanCode = (productCode || 'outfit').toLowerCase().replace(/[^a-z0-9]/g, '');

    const uploadedResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 1000);
      const filename = `${cleanCode}-${timestamp}-${randomSuffix}.webp`;
      const outPath = path.join(productsOutputDir, filename);

      // Process with sharp: auto-rotate for phone cameras, resize, convert to high-def WebP
      await sharp(file.buffer)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 86, effort: 5 })
        .toFile(outPath);

      uploadedResults.push({
        url: `/products/${filename}`,
        title: title || `${productCode} Photography`,
        alt: `${productCode} detail photograph`,
        filename,
      });
    }

    return res.json({
      success: true,
      images: uploadedResults,
      image: uploadedResults[0],
    });
  } catch (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/products
 * Create a new lehenga outfit in the database and synchronize local catalog
 */
router.post('/', async (req, res) => {
  try {
    const p = req.body;
    if (!p.name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const productCode = p.productCode || `BB-${Date.now().toString().slice(-4)}`;
    const id = p.id || productCode.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const slug = p.slug || id;

    const rentPrice = Number(p.rentPrice) || 799;
    const formattedRentPrice = p.formattedRentPrice || `₹${rentPrice} / day`;
    const price = Number(p.price) || 32999;
    const formattedPrice = p.formattedPrice || `₹${price.toLocaleString('en-IN')}`;

    const thumbnail = p.thumbnail || (Array.isArray(p.images) && p.images[0]?.url) || `/products/${id}.webp`;
    const images = Array.isArray(p.images) ? p.images : [];

    const category = p.category || 'festive-special';
    const categoryLabels = {
      'festive-special': 'Festive Special',
      'rani-pink': 'Rani Pink',
      'sunshine-yellow': 'Sunshine Yellow',
      'royal-plum': 'Royal Plum',
      'blush-pink': 'Blush Dream',
      'bridal-festive': 'Bridal & Festive',
    };
    const categoryLabel = p.categoryLabel || categoryLabels[category] || 'Festive Special';

    const details = p.details || {
      colour: 'Multicolor',
      fabric: 'Pure Silk',
      work: 'Handcrafted Zari & Mirror Work',
      lining: 'Heavy Shantoon',
      flare: '5.2 meters circular flare',
      components: 'Skirt, Choli, Dupatta',
      care: 'Strictly Dry Clean Only',
    };

    const sizeFitting = p.sizeFitting || {
      standardSizes: 'XS, S, M, L, XL',
      skirtLength: '42 inches standard',
      waistFitting: 'Adjustable drawstring tie-up with matching tassels',
    };

    const bookingInfo = p.bookingInfo || {
      status: 'Available to Rent for Garba Night & Direct In-Studio Purchase.',
      rental: `${formattedRentPrice} (1-Day Garba Rental)`,
      purchase: `${formattedPrice} (Buy to Own)`,
      trials: 'Available for in-person trials & booking at our Bhopal studio.',
    };

    const sortOrder = Number(p.sortOrder) || 99;

    if (dbPool) {
      const sql = `
        INSERT INTO lehenga_products (
          id, slug, product_code, name, collection, tagline, price, formatted_price,
          availability, availability_badge, category, category_label, featured, thumbnail,
          images, description, details, size_fitting, booking_info, sort_order,
          rent_price, formatted_rent_price, slay_tagline
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20, $21, $22, $23
        ) RETURNING *;
      `;

      const values = [
        id,
        slug,
        productCode,
        p.name,
        p.collection || 'Dandiya Night Lehengas',
        p.tagline || 'Exquisite handcrafted bridal & festive couture',
        price,
        formattedPrice,
        p.availability || 'Rent & Buy',
        p.availabilityBadge || 'rent-and-buy',
        category,
        categoryLabel,
        Boolean(p.featured),
        thumbnail,
        JSON.stringify(images),
        p.description || `Authentic handcrafted lehenga available for Garba rental at our Bhopal studio.`,
        JSON.stringify(details),
        JSON.stringify(sizeFitting),
        JSON.stringify(bookingInfo),
        sortOrder,
        rentPrice,
        formattedRentPrice,
        p.slayTagline || 'Rent for Garba night and slay',
      ];

      const { rows } = await dbPool.query(sql, values);
      await syncLocalProductsFile();

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: transformProductRow(rows[0]),
      });
    }

    return res.status(500).json({ error: 'Database connection not available' });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/products/:id
 * Update an existing lehenga outfit
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;

    const rentPrice = Number(p.rentPrice) || 799;
    const formattedRentPrice = p.formattedRentPrice || `₹${rentPrice} / day`;
    const price = Number(p.price) || 32999;
    const formattedPrice = p.formattedPrice || `₹${price.toLocaleString('en-IN')}`;

    const thumbnail = p.thumbnail || (Array.isArray(p.images) && p.images[0]?.url) || `/products/${id}.webp`;
    const images = Array.isArray(p.images) ? p.images : [];

    const category = p.category || 'festive-special';
    const categoryLabels = {
      'festive-special': 'Festive Special',
      'rani-pink': 'Rani Pink',
      'sunshine-yellow': 'Sunshine Yellow',
      'royal-plum': 'Royal Plum',
      'blush-pink': 'Blush Dream',
      'bridal-festive': 'Bridal & Festive',
    };
    const categoryLabel = p.categoryLabel || categoryLabels[category] || 'Festive Special';

    if (dbPool) {
      const sql = `
        UPDATE lehenga_products SET
          name = COALESCE($2, name),
          product_code = COALESCE($3, product_code),
          slug = COALESCE($4, slug),
          tagline = COALESCE($5, tagline),
          slay_tagline = COALESCE($6, slay_tagline),
          rent_price = $7,
          formatted_rent_price = $8,
          price = $9,
          formatted_price = $10,
          availability = COALESCE($11, availability),
          category = COALESCE($12, category),
          category_label = COALESCE($13, category_label),
          featured = COALESCE($14, featured),
          thumbnail = $15,
          images = $16,
          description = COALESCE($17, description),
          details = $18,
          size_fitting = $19,
          booking_info = $20,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *;
      `;

      const values = [
        id,
        p.name,
        p.productCode,
        p.slug,
        p.tagline,
        p.slayTagline,
        rentPrice,
        formattedRentPrice,
        price,
        formattedPrice,
        p.availability,
        category,
        categoryLabel,
        p.featured !== undefined ? Boolean(p.featured) : null,
        thumbnail,
        JSON.stringify(images),
        p.description,
        JSON.stringify(p.details || {}),
        JSON.stringify(p.sizeFitting || {}),
        JSON.stringify(p.bookingInfo || {}),
      ];

      const { rows } = await dbPool.query(sql, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Product not found', id });
      }

      await syncLocalProductsFile();

      return res.json({
        success: true,
        message: 'Product updated successfully',
        data: transformProductRow(rows[0]),
      });
    }

    return res.status(500).json({ error: 'Database connection not available' });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/products/:id
 * Delete an outfit from the collection
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (dbPool) {
      const { rows } = await dbPool.query('DELETE FROM lehenga_products WHERE id = $1 RETURNING *', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Product not found', id });
      }

      await syncLocalProductsFile();

      return res.json({
        success: true,
        message: 'Product deleted successfully',
        deletedId: id,
      });
    }

    return res.status(500).json({ error: 'Database connection not available' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;

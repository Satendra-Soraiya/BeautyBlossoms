import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS_CONFIG, buildProductRecord } from './products29Config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

const products = PRODUCTS_CONFIG.map(buildProductRecord);

// 1. Generate client/src/data/products.js
const clientProductsPath = path.join(rootDir, 'client/src/data/products.js');

const jsContent = `/**
 * Beauty Blossoms — Luxury Dandiya Night Lehenga Catalog (29 Authentic Products)
 * 
 * Non-commercial boutique showcase catalog:
 * - 29 authentic original handcrafted lehengas from Gujarat & Rajasthan artisan clusters
 * - High-fidelity WebP photography with instant synchronized loading
 * - Direct in-studio trial and booking experience in Bhopal
 */

export const LEHENGA_PRODUCTS = ${JSON.stringify(products, null, 2)};

/**
 * Filter categories for collection section
 */
export const COLLECTION_CATEGORIES = [
  { id: 'all', label: 'All Lehengas' },
  { id: 'rani-pink', label: 'Rani Pink' },
  { id: 'sunshine-yellow', label: 'Sunshine Yellow' },
  { id: 'royal-plum', label: 'Royal Plum' },
  { id: 'blush-pink', label: 'Blush Dream' },
  { id: 'festive-special', label: 'Festive Special' },
  { id: 'bridal-festive', label: 'Bridal & Festive' },
];

/**
 * Helper to fetch a product by slug, ID, or product code
 */
export function getProductBySlug(slugOrId, productsList = LEHENGA_PRODUCTS) {
  if (!slugOrId) return null;
  const search = String(slugOrId).toLowerCase().trim();
  const list = Array.isArray(productsList) && productsList.length > 0 ? productsList : LEHENGA_PRODUCTS;
  
  // Try direct match or numeric match (e.g. "1" matches "bb-01")
  return (
    list.find((p) => {
      const pId = p.id?.toLowerCase();
      const pCode = p.productCode?.toLowerCase();
      const pSlug = p.slug?.toLowerCase();
      const numMatch = pId?.replace('bb-', '');
      const numSearch = search.padStart(2, '0');

      return (
        pSlug === search ||
        pId === search ||
        pCode === search ||
        numMatch === numSearch ||
        pId === 'bb-' + numSearch ||
        pCode === 'bb-' + numSearch
      );
    }) || null
  );
}
`;

fs.writeFileSync(clientProductsPath, jsContent, 'utf-8');
console.log(`✅ [1/3] Successfully wrote ${products.length} products to ${clientProductsPath}`);

// 2. Generate supabase/seed.sql
const seedSqlPath = path.join(rootDir, 'supabase/seed.sql');

const sqlStatements = [
  '-- Beauty Blossoms — 29 Authentic Dandiya Lehenga Products Seed Script',
  '-- Clears existing products and inserts all 29 original pieces',
  'TRUNCATE TABLE public.lehenga_products;',
  '',
];

products.forEach((p) => {
  const escapeSql = (str) => (str ? str.replace(/'/g, "''") : '');
  const jsonEscape = (obj) => `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;

  const insertSql = `INSERT INTO public.lehenga_products (
  id, slug, product_code, name, collection, tagline,
  price, formatted_price, rent_price, formatted_rent_price, slay_tagline,
  availability, availability_badge,
  category, category_label, featured, thumbnail, images,
  description, details, size_fitting, booking_info, sort_order
) VALUES (
  '${escapeSql(p.id)}',
  '${escapeSql(p.slug)}',
  '${escapeSql(p.productCode)}',
  '${escapeSql(p.name)}',
  '${escapeSql(p.collection)}',
  '${escapeSql(p.tagline)}',
  ${p.price},
  '${escapeSql(p.formattedPrice)}',
  ${p.rentPrice},
  '${escapeSql(p.formattedRentPrice)}',
  '${escapeSql(p.slayTagline)}',
  '${escapeSql(p.availability)}',
  '${escapeSql(p.availabilityBadge)}',
  '${escapeSql(p.category)}',
  '${escapeSql(p.categoryLabel)}',
  ${p.featured},
  '${escapeSql(p.thumbnail)}',
  ${jsonEscape(p.images)},
  '${escapeSql(p.description)}',
  ${jsonEscape(p.details)},
  ${jsonEscape(p.sizeFitting)},
  ${jsonEscape(p.bookingInfo)},
  ${p.sortOrder}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  formatted_price = EXCLUDED.formatted_price,
  rent_price = EXCLUDED.rent_price,
  formatted_rent_price = EXCLUDED.formatted_rent_price,
  slay_tagline = EXCLUDED.slay_tagline,
  availability = EXCLUDED.availability,
  availability_badge = EXCLUDED.availability_badge,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  featured = EXCLUDED.featured,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  size_fitting = EXCLUDED.size_fitting,
  booking_info = EXCLUDED.booking_info,
  sort_order = EXCLUDED.sort_order;`;

  sqlStatements.push(insertSql);
});

fs.writeFileSync(seedSqlPath, sqlStatements.join('\n\n'), 'utf-8');
console.log(`✅ [2/3] Successfully generated ${seedSqlPath}`);

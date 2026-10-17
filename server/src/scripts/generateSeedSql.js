import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LEHENGA_PRODUCTS } from '../../../client/src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSeedSql() {
  const esc = (str) => (str ? String(str).replace(/'/g, "''") : '');
  const jsonEsc = (obj) => JSON.stringify(obj || {}).replace(/'/g, "''");

  let sql = `-- ==============================================================================
-- Beauty Blossoms — Supabase Seed Data (30 Handcrafted Lehenga Products)
-- Paste and run this script in your Supabase SQL Editor.
-- ==============================================================================

INSERT INTO public.lehenga_products (
  id,
  slug,
  product_code,
  name,
  collection,
  tagline,
  price,
  formatted_price,
  availability,
  availability_badge,
  category,
  category_label,
  featured,
  thumbnail,
  images,
  description,
  details,
  size_fitting,
  booking_info,
  sort_order
) VALUES
`;

  const rows = LEHENGA_PRODUCTS.map((p, index) => {
    return `(
  '${esc(p.id)}',
  '${esc(p.slug)}',
  '${esc(p.productCode)}',
  '${esc(p.name)}',
  '${esc(p.collection)}',
  '${esc(p.tagline)}',
  ${p.price},
  '${esc(p.formattedPrice)}',
  '${esc(p.availability)}',
  '${esc(p.availabilityBadge)}',
  '${esc(p.category)}',
  '${esc(p.categoryLabel)}',
  ${Boolean(p.featured)},
  '${esc(p.thumbnail)}',
  '${jsonEsc(p.images)}'::jsonb,
  '${esc(p.description)}',
  '${jsonEsc(p.details)}'::jsonb,
  '${jsonEsc(p.sizeFitting)}'::jsonb,
  '${jsonEsc(p.bookingInfo)}'::jsonb,
  ${index + 1}
)`;
  });

  sql += rows.join(',\n');
  sql += `
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  product_code = EXCLUDED.product_code,
  name = EXCLUDED.name,
  collection = EXCLUDED.collection,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  formatted_price = EXCLUDED.formatted_price,
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
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
`;

  const outputPath = path.resolve(__dirname, '../../../supabase/seed.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log(`✅ Successfully generated ${outputPath} with ${LEHENGA_PRODUCTS.length} products.`);
}

generateSeedSql();

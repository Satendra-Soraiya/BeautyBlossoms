import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbPool } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const clientProductsPath = path.join(rootDir, 'client/src/data/products.js');

export async function syncLocalProductsFile(providedProducts = null) {
  try {
    let products = providedProducts;

    if (!products && dbPool) {
      const { rows } = await dbPool.query(
        'SELECT * FROM lehenga_products ORDER BY sort_order ASC, created_at ASC'
      );
      if (Array.isArray(rows)) {
        products = rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          productCode: row.product_code || row.productCode,
          name: row.name,
          collection: row.collection || 'Dandiya Night Lehengas',
          tagline: row.tagline,
          slayTagline: row.slay_tagline || 'Rent for Garba night and slay',
          rentPrice: Number(row.rent_price) || 799,
          formattedRentPrice: row.formatted_rent_price || `₹${Number(row.rent_price || 799)} / day`,
          rentalPeriod: '1 Day',
          price: Number(row.price),
          formattedPrice: row.formatted_price || `₹${Number(row.price).toLocaleString('en-IN')}`,
          buyPrice: Number(row.price),
          formattedBuyPrice: row.formatted_price || `₹${Number(row.price).toLocaleString('en-IN')}`,
          availability: row.availability || 'Rent & Buy',
          availabilityBadge: row.availability_badge || 'rent-and-buy',
          category: row.category,
          categoryLabel: row.category_label,
          featured: Boolean(row.featured),
          thumbnail: row.thumbnail,
          images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? JSON.parse(row.images) : []),
          description: row.description,
          details: typeof row.details === 'string' ? JSON.parse(row.details) : (row.details || {}),
          sizeFitting: typeof row.size_fitting === 'string' ? JSON.parse(row.size_fitting) : (row.size_fitting || {}),
          bookingInfo: typeof row.booking_info === 'string' ? JSON.parse(row.booking_info) : (row.booking_info || {}),
          sortOrder: row.sort_order || 0,
        }));
      }
    }

    if (!products || products.length === 0) {
      return false;
    }

    const jsContent = `/**
 * Beauty Blossoms — Luxury Dandiya Night Lehenga Catalog (${products.length} Products)
 * 
 * Non-commercial boutique showcase catalog:
 * - ${products.length} authentic handcrafted lehengas from artisan clusters
 * - High-fidelity WebP photography with instant synchronized loading
 * - Direct in-studio trial and booking experience in Bhopal
 * - Automatically synchronized via Beauty Blossoms Boutique CMS
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
    return true;
  } catch (err) {
    console.error('⚠️ [syncCatalog]: Failed to write client products file:', err.message);
    return false;
  }
}

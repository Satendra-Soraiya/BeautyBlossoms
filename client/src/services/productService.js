/**
 * Beauty Blossoms — Resilient Lehenga Product Data Service
 * 
 * Provides unified, fault-tolerant access to lehenga products:
 * 1. Queries Supabase 'lehenga_products' table directly via Supabase client (if anon key is present)
 * 2. Or queries backend Express API (/api/products), which connects live to Supabase PostgreSQL
 * 3. Seamlessly falls back to local 30-product catalog if offline or unconfigured
 * 4. Zero crashes, zero blank screens, zero layout shifts
 */

import { supabase, isSupabaseConfigured } from '../config/supabase';
import { LEHENGA_PRODUCTS, getProductBySlug as getLocalProductBySlug } from '../data/products';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

let cachedProducts = null;
let currentDataSource = 'local_fallback'; // 'supabase_direct' | 'supabase_backend' | 'local_fallback'

/**
 * Normalizes a database row or local item into the standard product schema
 */
export function normalizeProduct(item) {
  if (!item) return null;

  const id = item.id;
  const productCode = item.product_code || item.productCode || 'BB-00';
  const name = item.name || 'Handcrafted Luxury Lehenga';
  const price = Number(item.price) || 32999;
  const formattedPrice =
    item.formatted_price ||
    item.formattedPrice ||
    `₹${price.toLocaleString('en-IN')}`;

  const fallbackThumbnail = `/products/${id}-front.jpg`;
  const thumbnail = item.thumbnail || fallbackThumbnail;

  let images = [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    images = item.images;
  } else if (typeof item.images === 'string') {
    try {
      images = JSON.parse(item.images);
    } catch {
      images = [];
    }
  }

  // Strictly filter out any obsolete legacy placeholders (-choli, -embroidery, -back)
  // and prevent cross-product white lehenga (bb-01) contamination
  const normId = (id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const isBB01 = normId === 'bb01' || normId === 'bb1';

  images = images.filter((img) => {
    if (!img || !img.url) return false;
    const url = img.url.toLowerCase();
    if (url.includes('-choli.') || url.includes('-embroidery.') || url.includes('-back.')) {
      return false;
    }
    if (!isBB01 && (url.includes('bb-01') || url.includes('bb01'))) {
      return false;
    }
    return true;
  });

  if (!images || images.length === 0) {
    images = [{ url: thumbnail, title: name, alt: `${name} — ${productCode}` }];
  }

  const parseObj = (val) => {
    if (!val) return {};
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return {};
      }
    }
    return val;
  };

  const rentPrice = Number(item.rent_price || item.rentPrice) || 799;
  const formattedRentPrice =
    item.formatted_rent_price ||
    item.formattedRentPrice ||
    `₹${rentPrice} / day`;

  return {
    id,
    slug: item.slug || id,
    productCode,
    name,
    collection: item.collection || 'Dandiya Night Lehengas',
    tagline: item.tagline || 'Exquisite handcrafted bridal & festive couture',
    slayTagline: item.slay_tagline || item.slayTagline || 'Rent for Garba night and slay',
    rentPrice,
    formattedRentPrice,
    rentalPeriod: '1 Day',
    price,
    formattedPrice,
    buyPrice: price,
    formattedBuyPrice: formattedPrice,
    availability: item.availability || 'Rent & Buy',
    availabilityBadge: item.availability_badge || item.availabilityBadge || 'rent-and-buy',
    category: item.category || 'rani-pink',
    categoryLabel: item.category_label || item.categoryLabel || 'Rani Pink',
    featured: Boolean(item.featured),
    thumbnail,
    images,
    description: item.description || '',
    details: parseObj(item.details),
    sizeFitting: parseObj(item.size_fitting || item.sizeFitting),
    bookingInfo: parseObj(item.booking_info || item.bookingInfo),
  };
}

/**
 * Fetches all 30 products with Supabase -> Backend -> Local Fallback logic
 */
export async function getProducts(options = {}) {
  const { category, forceRefresh = false } = options;

  // Check cache first
  if (cachedProducts && !forceRefresh && !category) {
    return cachedProducts;
  }

  // 1. Attempt Supabase direct REST client fetch
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase
        .from('lehenga_products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        currentDataSource = 'supabase_direct';
        const normalized = data.map(normalizeProduct);
        if (!category) {
          cachedProducts = normalized;
        }
        return normalized;
      }
    } catch (err) {
      console.warn('⚠️ [ProductService]: Supabase direct query failed:', err.message);
    }
  }

  // 2. Attempt backend API fetch (/api/products connected to Supabase PostgreSQL)
  try {
    const url = category && category !== 'all' ? `${API_BASE}/products?category=${category}` : `${API_BASE}/products`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        currentDataSource = json.source === 'supabase_postgres_live' ? 'supabase_backend' : 'local_fallback';
        const normalized = json.data.map(normalizeProduct);
        if (!category) {
          cachedProducts = normalized;
        }
        return normalized;
      }
    }
  } catch (err) {
    console.warn('⚠️ [ProductService]: Backend API fetch failed, proceeding to in-memory fallback:', err.message);
  }

  // 3. Resilient Fallback to in-memory 30-product catalog
  currentDataSource = 'local_fallback';
  let fallbackList = LEHENGA_PRODUCTS.map(normalizeProduct);

  if (category && category !== 'all') {
    fallbackList = fallbackList.filter((p) => p.category === category);
  }

  if (!category) {
    cachedProducts = fallbackList;
  }

  return fallbackList;
}

/**
 * Fetches a single product by slug, ID, or SKU code
 */
export async function getProduct(slugOrId) {
  if (!slugOrId) return null;
  const search = String(slugOrId).toLowerCase().trim();

  const localMatch = getLocalProductBySlug(slugOrId);

  // Check cache first
  if (cachedProducts) {
    const found = cachedProducts.find(
      (p) =>
        p.slug?.toLowerCase() === search ||
        p.id?.toLowerCase() === search ||
        p.productCode?.toLowerCase() === search
    );
    if (found) {
      if (localMatch && Array.isArray(localMatch.images)) {
        found.images = localMatch.images;
      }
      return normalizeProduct(found);
    }
  }

  // Attempt Supabase direct
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('lehenga_products')
        .select('*')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId},product_code.ilike.${slugOrId}`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return normalizeProduct(data);
      }
    } catch {
      // Proceed to backend
    }
  }

  // Attempt backend API
  try {
    const res = await fetch(`${API_BASE}/products/${slugOrId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return normalizeProduct(json.data);
      }
    }
  } catch {
    // Proceed to fallback
  }

  // Local fallback
  return getLocalProductBySlug(slugOrId);
}

/**
 * Returns current data source identifier
 */
export function getActiveDataSource() {
  return currentDataSource;
}

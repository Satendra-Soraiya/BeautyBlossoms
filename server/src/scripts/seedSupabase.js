import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { LEHENGA_PRODUCTS } from '../../../client/src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function seedDatabase() {
  console.log('\n🌸 ========================================================');
  console.log('   Beauty Blossoms — Supabase Database Seeder');
  console.log('========================================================\n');

  if (!isSupabaseConfigured()) {
    console.log('⚠️  [Supabase]: Supabase credentials are not configured yet in server/.env.');
    console.log('   To seed your Supabase project:');
    console.log('   1. Open your Supabase Dashboard: https://supabase.com/dashboard');
    console.log('   2. Navigate to SQL Editor and run: supabase/schema.sql');
    console.log('   3. Run: supabase/seed.sql');
    console.log('   4. (Optional) Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env and re-run this script.\n');
    console.log('ℹ️  The client application will automatically and safely run with full 30-product fallback data in the meantime.\n');
    return;
  }

  const client = supabaseAdmin || supabase;
  if (!client) {
    console.error('❌ Could not initialize Supabase client.');
    return;
  }

  console.log(`📡 Connected to Supabase: ${process.env.SUPABASE_URL}`);
  console.log(`📦 Preparing to upsert ${LEHENGA_PRODUCTS.length} lehenga products...`);

  // Transform products to database schema format
  const rows = LEHENGA_PRODUCTS.map((p, index) => ({
    id: p.id,
    slug: p.slug,
    product_code: p.productCode,
    name: p.name,
    collection: p.collection || 'Dandiya Night Lehengas',
    tagline: p.tagline,
    price: p.price,
    formatted_price: p.formattedPrice,
    availability: p.availability || 'In Stock',
    availability_badge: p.availabilityBadge || 'in-stock',
    category: p.category,
    category_label: p.categoryLabel,
    featured: Boolean(p.featured),
    thumbnail: p.thumbnail,
    images: p.images || [],
    description: p.description,
    details: p.details || {},
    size_fitting: p.sizeFitting || {},
    booking_info: p.bookingInfo || {},
    sort_order: index + 1,
  }));

  try {
    const { data, error } = await client
      .from('lehenga_products')
      .upsert(rows, { onConflict: 'id' })
      .select('id, product_code, name');

    if (error) {
      console.error('❌ Supabase Upsert Error:', error.message);
      if (error.message.includes('relation "public.lehenga_products" does not exist')) {
        console.log('\n💡 Hint: Please execute supabase/schema.sql first in your Supabase SQL Editor to create the table.\n');
      }
      return;
    }

    console.log(`✅ Successfully seeded ${data?.length || rows.length} products to "lehenga_products" table in Supabase!`);
    console.log('🎉 Database setup complete. Beauty Blossoms catalog is fully synchronized.\n');
  } catch (err) {
    console.error('❌ Unexpected Error during seeding:', err.message);
  }
}

seedDatabase();

-- ==============================================================================
-- Beauty Blossoms — Supabase Database Schema
-- Table: lehenga_products
-- ==============================================================================

-- 1. Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create lehenga_products table
CREATE TABLE IF NOT EXISTS public.lehenga_products (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    product_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    collection VARCHAR(100) DEFAULT 'Dandiya Night Lehengas',
    tagline TEXT,
    price NUMERIC(10, 2) NOT NULL,
    formatted_price VARCHAR(30) NOT NULL,
    availability VARCHAR(50) DEFAULT 'In Stock',
    availability_badge VARCHAR(30) DEFAULT 'in-stock',
    category VARCHAR(50) NOT NULL,
    category_label VARCHAR(50) NOT NULL,
    featured BOOLEAN DEFAULT false,
    thumbnail TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    size_fitting JSONB NOT NULL DEFAULT '{}'::jsonb,
    booking_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Helpful Column Comments
COMMENT ON TABLE public.lehenga_products IS 'Catalog of luxury handcrafted Dandiya and Bridal lehengas for Beauty Blossoms boutique';
COMMENT ON COLUMN public.lehenga_products.id IS 'Unique identifier, e.g., bb-01, bb-21';
COMMENT ON COLUMN public.lehenga_products.slug IS 'SEO-friendly URL slug, e.g., rani-pink-lehenga';
COMMENT ON COLUMN public.lehenga_products.product_code IS 'Boutique SKU code, e.g., BB-01, BB-21';
COMMENT ON COLUMN public.lehenga_products.images IS 'Array of gallery images with url, title, and alt';
COMMENT ON COLUMN public.lehenga_products.details IS 'Structured garment specs: colour, fabric, work, lining, flare, components, closure, care';
COMMENT ON COLUMN public.lehenga_products.size_fitting IS 'Size and tailoring guidelines: standardSizes, skirtLength, waistFitting, alterations, consultation';
COMMENT ON COLUMN public.lehenga_products.booking_info IS 'Concierge booking metadata: status, trials, deliveryTimeline, shipping';

-- 4. Create Indexes for High Performance Querying
CREATE INDEX IF NOT EXISTS idx_lehenga_products_slug ON public.lehenga_products (slug);
CREATE INDEX IF NOT EXISTS idx_lehenga_products_product_code ON public.lehenga_products (product_code);
CREATE INDEX IF NOT EXISTS idx_lehenga_products_category ON public.lehenga_products (category);
CREATE INDEX IF NOT EXISTS idx_lehenga_products_featured ON public.lehenga_products (featured);
CREATE INDEX IF NOT EXISTS idx_lehenga_products_sort_order ON public.lehenga_products (sort_order ASC);

-- 5. Trigger for updated_at
DROP TRIGGER IF EXISTS set_lehenga_products_timestamp ON public.lehenga_products;
CREATE TRIGGER set_lehenga_products_timestamp
    BEFORE UPDATE ON public.lehenga_products
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- 6. Row Level Security (RLS) Configuration
-- Enable RLS so data is protected while allowing public read
ALTER TABLE public.lehenga_products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors (public) to READ all products
DROP POLICY IF EXISTS "Allow public read access to lehenga_products" ON public.lehenga_products;
CREATE POLICY "Allow public read access to lehenga_products"
    ON public.lehenga_products
    FOR SELECT
    USING (true);

-- Allow service_role key full CRUD permissions for automated seeding and backend management
DROP POLICY IF EXISTS "Allow service role full access" ON public.lehenga_products;
CREATE POLICY "Allow service role full access"
    ON public.lehenga_products
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

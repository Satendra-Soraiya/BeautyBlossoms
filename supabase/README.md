# Beauty Blossoms — Supabase Database Integration Guide

This directory contains the database schema, migration scripts, and seed files for the **Beauty Blossoms** luxury lehenga collection.

---

## 1. Online Database Status
- **Host**: `db.ujljljqcfahtqtvbuwns.supabase.co`
- **Project Reference**: `ujljljqcfahtqtvbuwns`
- **Database Status**: Live and connected!
- **Table**: `public.lehenga_products`
- **Total Products Seeded**: **30 Handcrafted Lehengas**

---

## 2. Catalog Breakdown (30 Products across 6 Categories)

| Category | Product Range | Price Range | Example Outfits |
| :--- | :--- | :--- | :--- |
| **Rani Pink** | `BB-01` to `BB-05`, `BB-21` | ₹29,999 – ₹34,999 | Noorani Rani Pink, Gulab Mahal, Classic Rani Pink |
| **Sunshine Yellow** | `BB-06` to `BB-10`, `BB-22` | ₹30,999 – ₹36,499 | Kesar Keshariya, Surya Kiran, Amrapali Mustard |
| **Royal Plum** | `BB-11` to `BB-15`, `BB-23` | ₹31,999 – ₹39,999 | Noor-e-Khwab, Badshahi Wine Velvet, Royal Blossom |
| **Blush Dream** | `BB-16` to `BB-20`, `BB-24` | ₹32,999 – ₹36,499 | Afreen Blush Organza, Mehrunissa, Blush Dream |
| **Festive Special** | `BB-25`, `BB-27`, `BB-28` | ₹33,999 – ₹38,999 | Dandiya Celebration, Garba Ras, Utsav Kiran |
| **Bridal & Festive** | `BB-26`, `BB-29`, `BB-30` | ₹42,999 – ₹46,999 | Gulabi Bagh Bridal, Mumtaz Mahal, Rajkumari Shringar |

---

## 3. How to Provide Product Images

The application uses structured, deterministic image paths with smart fallback protection:
- Placeholders currently exist in: `client/public/products/` (`bb-01-front.jpg` through `bb-30-front.jpg`).
- Whenever you have the final product photos, simply replace the corresponding image file in:
  ```
  client/public/products/bb-01-front.jpg
  client/public/products/bb-02-front.jpg
  ...
  client/public/products/bb-30-front.jpg
  ```
- **Zero Breakage Guarantee**: Even if an image file is temporarily missing or has an error, the frontend automatically falls back to curated theme photos so your clients never see broken images or layout glitches.

---

## 4. Key Files
- [`supabase/schema.sql`](file:///Users/montysoraiya/Desktop/BeautyBlossoms/supabase/schema.sql): PostgreSQL DDL with table structure, indexes, updated_at trigger, and Row-Level Security (RLS).
- [`supabase/seed.sql`](file:///Users/montysoraiya/Desktop/BeautyBlossoms/supabase/seed.sql): Complete SQL script containing all 30 products.
- [`server/src/scripts/seedSupabase.js`](file:///Users/montysoraiya/Desktop/BeautyBlossoms/server/src/scripts/seedSupabase.js): Node.js script to re-seed or update products programmatically (`npm run seed:supabase`).
- [`client/src/services/productService.js`](file:///Users/montysoraiya/Desktop/BeautyBlossoms/client/src/services/productService.js): 3-tier resilient product service (Direct Supabase -> Backend PostgreSQL API -> Local Fallback).
- [`server/src/routes/products.js`](file:///Users/montysoraiya/Desktop/BeautyBlossoms/server/src/routes/products.js): Express REST API for `/api/products` and `/api/products/:slugOrId`.

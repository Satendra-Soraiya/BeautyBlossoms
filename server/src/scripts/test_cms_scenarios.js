import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

const BASE_URL = 'http://localhost:5001';

async function runTests() {
  console.log('🚀 [CMS Test Suite]: Starting Comprehensive E2E CMS Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      failed++;
    }
  }

  // =========================================================================
  // SCENARIO 1: PIN Authentication
  // =========================================================================
  console.log('📌 SCENARIO 1: Staff PIN Authentication');
  
  // 1.1 Invalid PIN
  const badRes = await fetch(`${BASE_URL}/api/auth/verify-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '0000' }),
  });
  const badData = await badRes.json();
  assert(badRes.status === 401 && badData.success === false, 'Invalid PIN is rejected with 401');

  // 1.2 Empty PIN
  const emptyRes = await fetch(`${BASE_URL}/api/auth/verify-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '' }),
  });
  assert(emptyRes.status === 401, 'Empty PIN is rejected with 401');

  // 1.3 Valid PIN (2026)
  const okRes = await fetch(`${BASE_URL}/api/auth/verify-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '2026' }),
  });
  const okData = await okRes.json();
  assert(okRes.status === 200 && okData.success === true && okData.token.includes('bb_authenticated_'), 'Correct PIN (2026) produces valid auth token');

  // =========================================================================
  // SCENARIO 2: Image Upload Engine (Sharp WebP Pipeline)
  // =========================================================================
  console.log('\n📌 SCENARIO 2: Mobile Camera / Gallery Photo Upload Pipeline');

  // Create a realistic sample RGB image in buffer
  const sampleBuffer = await sharp({
    create: {
      width: 800,
      height: 1000,
      channels: 3,
      background: { r: 180, g: 30, b: 60 } // Festive crimson tone
    }
  }).jpeg().toBuffer();

  const formData = new FormData();
  const fileBlob = new Blob([sampleBuffer], { type: 'image/jpeg' });
  formData.append('images', fileBlob, 'camera_capture.jpg');
  formData.append('productCode', 'BB-E2E');
  formData.append('title', 'Front Studio Shot');

  const uploadRes = await fetch(`${BASE_URL}/api/products/upload`, {
    method: 'POST',
    body: formData,
  });
  const uploadData = await uploadRes.json();
  assert(uploadRes.status === 200 && uploadData.success === true, 'Photo upload accepted by server');
  assert(uploadData.images && uploadData.images.length === 1, 'Returns array of optimized uploaded images');
  
  const uploadedUrl = uploadData.images[0].url;
  const uploadedFilePath = path.join(rootDir, 'client/public', uploadedUrl.replace(/^\//, ''));
  assert(fs.existsSync(uploadedFilePath), `Uploaded WebP file exists on disk: ${uploadedUrl}`);

  const meta = await sharp(uploadedFilePath).metadata();
  assert(meta.format === 'webp', `File is correctly converted to WebP format (actual: ${meta.format})`);

  // =========================================================================
  // SCENARIO 3: Product Creation & Database Ingestion
  // =========================================================================
  console.log('\n📌 SCENARIO 3: Product Creation in Database & Local Sync');

  const createPayload = {
    name: 'BB-E2E Royal Golden Twirl Lehenga',
    productCode: 'BB-E2E',
    category: 'festive-special',
    categoryLabel: 'Festive Special',
    rentPrice: 849,
    formattedRentPrice: '₹849 / day',
    price: 38999,
    formattedPrice: '₹38,999',
    tagline: 'Exclusive radiant gold zari lehenga with handcrafted border mirrors',
    slayTagline: 'Rent for Garba night and slay',
    availability: 'Rent & Buy',
    thumbnail: uploadedUrl,
    images: [
      {
        url: uploadedUrl,
        title: 'Full Front Silhouette',
        alt: 'BB-E2E Royal Golden Twirl Lehenga — Model Silhouette',
      }
    ],
    details: {
      colour: 'Crimson & Royal Gold',
      fabric: 'Fine Mulberry Silk with Embroidered Net Dupatta',
      work: 'Heavy Gota Patti, Real Glass Mirror Work, Resham Kalis',
      flare: '5.6 meters full 360° twirl flare',
      lining: 'Heavy Shantoon with Stiffened Can-Can Net',
      components: 'Flared Kalidar Skirt, Embroidered Choli Blouse, Embellished Dupatta',
      care: 'Strictly Dry Clean Only',
    },
    description: 'A breathtaking Dandiya Night ensemble crafted for supreme twirl elegance.',
  };

  const createRes = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createPayload),
  });
  const createData = await createRes.json();

  assert(createRes.status === 201 && createData.success === true, 'Product created successfully with status 201');
  assert(createData.data && createData.data.productCode === 'BB-E2E', 'Returned created product has productCode BB-E2E');
  assert(createData.data.rentPrice === 849, 'Rental price is correctly saved as 849');
  assert(createData.data.images.length === 1, 'Images array contains exactly 1 photo');

  // Verify client/src/data/products.js was synced
  const productsJsContent = fs.readFileSync(path.join(rootDir, 'client/src/data/products.js'), 'utf-8');
  assert(productsJsContent.includes('BB-E2E') && productsJsContent.includes('Royal Golden Twirl Lehenga'), 'Local catalog backup file client/src/data/products.js synced automatically');

  // =========================================================================
  // SCENARIO 4: Product Editing & Renaming
  // =========================================================================
  console.log('\n📌 SCENARIO 4: Product Editing, Renaming & Pricing Adjustments');

  const updatePayload = {
    ...createData.data,
    name: 'BB-E2E Maharani Gold Supreme Lehenga',
    rentPrice: 999,
    formattedRentPrice: '₹999 / day',
    category: 'sunshine-yellow',
    categoryLabel: 'Sunshine Yellow',
    tagline: 'Updated editorial tagline: Sunburst embroidery for Dandiya night',
  };

  const updateRes = await fetch(`${BASE_URL}/api/products/bb-e2e`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatePayload),
  });
  const updateData = await updateRes.json();

  assert(updateRes.status === 200 && updateData.success === true, 'Product updated successfully with status 200');
  assert(updateData.data.name === 'BB-E2E Maharani Gold Supreme Lehenga', 'Product name was renamed properly');
  assert(updateData.data.rentPrice === 999, 'Rental price updated to ₹999');
  assert(updateData.data.category === 'sunshine-yellow', 'Category updated to sunshine-yellow');

  // =========================================================================
  // SCENARIO 5: Live Storefront API & Detail Page Retrieval
  // =========================================================================
  console.log('\n📌 SCENARIO 5: Live Storefront Preview & Filtering');

  // Query single product by slug or code
  const getSingleRes = await fetch(`${BASE_URL}/api/products/bb-e2e`);
  const getSingleData = await getSingleRes.json();
  assert(getSingleRes.status === 200 && getSingleData.data.name === 'BB-E2E Maharani Gold Supreme Lehenga', 'Storefront single-item API returns updated details');

  // Query by category filter
  const catFilterRes = await fetch(`${BASE_URL}/api/products?category=sunshine-yellow`);
  const catFilterData = await catFilterRes.json();
  const foundInCat = catFilterData.data.some((p) => p.productCode === 'BB-E2E');
  assert(foundInCat, 'Updated outfit is found when filtering by Sunshine Yellow category');

  // =========================================================================
  // SCENARIO 6: Product Deletion
  // =========================================================================
  console.log('\n📌 SCENARIO 6: Outfit Deletion & Catalog Cleanup');

  const deleteRes = await fetch(`${BASE_URL}/api/products/bb-e2e`, {
    method: 'DELETE',
  });
  const deleteData = await deleteRes.json();
  assert(deleteRes.status === 200 && deleteData.success === true, 'DELETE request succeeds with status 200');

  // Verify it is no longer found in DB
  const verifyGoneRes = await fetch(`${BASE_URL}/api/products/bb-e2e`);
  assert(verifyGoneRes.status === 404, 'Deleted product returns 404 Not Found on subsequent fetch');

  // Verify client/src/data/products.js does not contain it anymore
  const updatedJs = fs.readFileSync(path.join(rootDir, 'client/src/data/products.js'), 'utf-8');
  assert(!updatedJs.includes('bb-e2e') && !updatedJs.includes('BB-E2E'), 'Deleted product is removed from client/src/data/products.js');

  // Clean up uploaded test file
  if (fs.existsSync(uploadedFilePath)) {
    fs.unlinkSync(uploadedFilePath);
    console.log(`  🧹 Cleaned up temporary test file: ${uploadedUrl}`);
  }

  // =========================================================================
  // SCENARIO 7: Edge Cases & Validation Handling
  // =========================================================================
  console.log('\n📌 SCENARIO 7: Error & Edge Case Handling');

  // 7.1 Create without name
  const noNameRes = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productCode: 'BB-NONAME' }),
  });
  assert(noNameRes.status === 400, 'Creation without name returns 400 Bad Request');

  // 7.2 Update non-existent product
  const noExistUpdateRes = await fetch(`${BASE_URL}/api/products/bb-ghost-outfit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Ghost' }),
  });
  assert(noExistUpdateRes.status === 404, 'Updating non-existent product returns 404 Not Found');

  // 7.3 Delete non-existent product
  const noExistDeleteRes = await fetch(`${BASE_URL}/api/products/bb-ghost-outfit`, {
    method: 'DELETE',
  });
  assert(noExistDeleteRes.status === 404, 'Deleting non-existent product returns 404 Not Found');

  // 7.4 Upload without files
  const emptyUploadRes = await fetch(`${BASE_URL}/api/products/upload`, {
    method: 'POST',
    body: new FormData(),
  });
  assert(emptyUploadRes.status === 400, 'Uploading without files returns 400 Bad Request');

  console.log(`\n======================================================`);
  console.log(`🏁 Total Tests: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`======================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test Suite crashed:', err);
  process.exit(1);
});

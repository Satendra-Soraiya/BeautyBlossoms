import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REVIEW_DIR = path.resolve(__dirname, '../../../client/public/product review image');
const PRODUCTS_DIR = path.resolve(__dirname, '../../../client/public/products');

export const REVIEW_MAPPINGS = [
  { file: '1.png', productCode: 'bb-01', title: 'Gift Box Ensemble & Choli Flat Lay' },
  { file: '2.png', productCode: 'bb-02', title: 'Gift Box Ensemble & Choli Flat Lay' },
  { file: '3.png', productCode: 'bb-03', title: 'Gift Box Ensemble & Mirror Blouse Flat Lay' },
  { file: '5.png', productCode: 'bb-04', title: 'Gift Box Ensemble & Heritage Choli Flat Lay' },
  { file: '6.png', productCode: 'bb-05', title: 'Gift Box Ensemble & Patola Choli Flat Lay' },
  { file: '7.png', productCode: 'bb-06', title: 'Gift Box Ensemble & Scalloped Lace Flat Lay' },
  { file: 'Festive Patchwork Lehenga Flat Lay.png', productCode: 'bb-07', title: 'Gift Box Ensemble & Patchwork Flat Lay' },
  { file: '9.png', productCode: 'bb-08', title: 'Gift Box Ensemble & Kutchi Choli Flat Lay' },
  { file: 'Yellow Patchwork Lehenga Gift Set.png', productCode: 'bb-09', title: 'Gift Box Ensemble & Patchwork Flat Lay' },
  { file: 'Luxury Indian Lehenga Gift Set.png', productCode: 'bb-10', title: 'Gift Box Ensemble & Leheriya Choli Flat Lay' },
  { file: 'Beauty Blossoms Bridal Lehenga Gift Set.png', productCode: 'bb-11', title: 'Gift Box Ensemble & Elephant Border Flat Lay' },
  { file: 'Beauty Blossoms Fuchsia Bridal Set.png', productCode: 'bb-15', title: 'Gift Box Ensemble & All-Over Mirror Blouse Flat Lay' },
  { file: 'Vibrant Embroidered Lehenga Gift Flat Lay.png', productCode: 'bb-16', title: 'Gift Box Ensemble & Scalloped Kali Flat Lay' },
  { file: 'Beauty Blossoms Navratri Lehenga Gift Set.png', productCode: 'bb-17', title: 'Gift Box Ensemble & Peacock Choli Flat Lay' },
  { file: 'Vibrant Beauty Blossoms Lehenga Display.png', productCode: 'bb-18', title: 'Gift Box Ensemble & Kutchi Embroidery Flat Lay' },
  { file: 'Luxury Green Lehenga Flat Lay.png', productCode: 'bb-20', title: 'Gift Box Ensemble & Elephant Motifs Flat Lay' },
  { file: 'Vibrant Beauty Blossoms Lehenga Flat Lay.png', productCode: 'bb-21', title: 'Gift Box Ensemble & Chakra Motifs Flat Lay' },
  { file: 'Opulent Indian Lehenga Flat Lay.png', productCode: 'bb-23', title: 'Gift Box Ensemble & Dancer Motifs Flat Lay' },
  { file: 'Elegant Blue Floral Lehenga Flatlay.png', productCode: 'bb-25', title: 'Gift Box Ensemble & Blue Floral Blouse Flat Lay' },
  { file: 'Vibrant Yellow Bridal Lehenga Flat Lay.png', productCode: 'bb-28', title: 'Gift Box Ensemble & Mirror Border Flat Lay' },
  { file: 'Festive Patchwork Lehenga Flat Lay.png', productCode: 'bb-29', title: 'Gift Box Ensemble & Patchwork Flat Lay' },
  { file: 'Maroon and Ivory Bridal Lehenga Flatlay.png', productCode: 'bb-30', title: 'Gift Box Ensemble & Diamond Boota Blouse Flat Lay' },
  { file: 'Yellow and Black Lehenga Flat Lay.png', productCode: 'bb-31', title: 'Gift Box Ensemble & Ajrakh Diamond Blouse Flat Lay' },
  { file: 'Embroidered Navy Lehenga Flat Lay.png', productCode: 'bb-32', title: 'Gift Box Ensemble & Raas Dancer Blouse Flat Lay' },
  { file: 'Romantic Black and Rose Lehenga Flat Lay.png', productCode: 'bb-33', title: 'Gift Box Ensemble & Crimson Paisley Blouse Flat Lay' },
  { file: 'Navy Blue Bridal Lehenga Flat Lay.png', productCode: 'bb-34', title: 'Gift Box Ensemble & Gota Kiran Blouse Flat Lay' }
];

async function processImages() {
  console.log(`Starting conversion of ${REVIEW_MAPPINGS.length} review flatlays...`);
  
  for (const item of REVIEW_MAPPINGS) {
    const srcPath = path.join(REVIEW_DIR, item.file);
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️ Source file not found: ${srcPath}`);
      continue;
    }

    const outWebp = path.join(PRODUCTS_DIR, `${item.productCode}-flatlay.webp`);
    const outJpg = path.join(PRODUCTS_DIR, `${item.productCode}-flatlay.jpg`);

    const image = sharp(srcPath);
    const meta = await image.metadata();

    // High fidelity WebP
    await sharp(srcPath)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(outWebp);

    // Progressive JPEG fallback
    await sharp(srcPath)
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 86, progressive: true })
      .toFile(outJpg);

    const origStat = fs.statSync(srcPath);
    const webpStat = fs.statSync(outWebp);
    const pct = Math.round((1 - webpStat.size / origStat.size) * 100);

    console.log(`✅ [${item.productCode}] ${item.file} -> ${item.productCode}-flatlay.webp (${(webpStat.size / 1024).toFixed(1)} KB, -${pct}%)`);
  }

  console.log('\n🎉 Finished processing all review flatlay images!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  processImages().catch(err => {
    console.error('❌ Error processing images:', err);
    process.exit(1);
  });
}

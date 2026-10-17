import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import healthRouter from './routes/health.js';
import apiRouter from './routes/api.js';
import productsRouter from './routes/products.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration for Render, Cloudflare Pages, and Mobile Dev
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser agents (cURL, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    // Allow all origins (Cloudflare Pages preview & production, localhost, local IP)
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(morgan('dev'));

// Static file serving for uploaded photos
const clientProductsDir = path.resolve(__dirname, '../../../client/public/products');
const serverUploadsDir = path.resolve(__dirname, '../uploads/products');

if (fs.existsSync(clientProductsDir)) {
  app.use('/products', express.static(clientProductsDir));
}
if (!fs.existsSync(serverUploadsDir)) {
  fs.mkdirSync(serverUploadsDir, { recursive: true });
}
app.use('/products', express.static(serverUploadsDir));

// Root status route (Render health checks & status verification)
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Beauty Blossoms Luxury Boutique API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      upload: '/api/products/upload',
    },
    documentation: 'Boutique CMS & Storefront API',
  });
});

// Routes
app.use('/api', healthRouter);
app.use('/api', apiRouter);
app.use('/api/products', productsRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Error handling middleware
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BeautyBlossoms Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
});


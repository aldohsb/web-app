// ============================================
// SHOPORA E-COMMERCE - BACKEND SERVER
// ============================================
// File utama backend yang menjalankan Express server
// Server ini akan handle semua API request dari frontend

// Import package yang diperlukan
import express from 'express'; // Framework web untuk Node.js
import dotenv from 'dotenv'; // Untuk load environment variables dari file .env
import cors from 'cors'; // Untuk mengizinkan request dari domain berbeda (frontend)
import path from 'path'; // Utility untuk handle path file
import { fileURLToPath } from 'url'; // Untuk convert URL ke path (ESM module)
import connectDB from './config/db.js'; // Import database connection function

// ============================================
// CONFIGURATION
// ============================================

// Load environment variables dari file .env
// Harus dipanggil di paling awal sebelum menggunakan process.env
dotenv.config();

// Setup __dirname untuk ES Modules (karena kita pakai type: "module")
// Di CommonJS, __dirname sudah otomatis ada, tapi di ES Module harus dibuat manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// INITIALIZE EXPRESS APP
// ============================================

// Buat instance Express application
const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// 1. CORS Middleware
// Mengizinkan frontend (yang berjalan di port berbeda) untuk akses API ini
// Origin: URL frontend yang diizinkan (dari .env)
// Credentials: true - izinkan cookie/session dikirim dari frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL frontend
    credentials: true, // Izinkan credentials (cookies, authorization headers, dll)
  })
);

// 2. Body Parser Middleware
// Middleware untuk parsing request body dari frontend
// express.json() -> parsing JSON data dari request body
// express.urlencoded() -> parsing form data dari request body
app.use(express.json()); // Parse application/json
app.use(express.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

// 3. Static Files Middleware
// Serve static files (gambar produk, dll) dari folder 'uploads'
// Contoh: localhost:5000/uploads/product-123.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// BASIC ROUTES
// ============================================

// Root route - untuk test server apakah sudah berjalan
// GET http://localhost:5000/
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Shopora API Server is running! 🚀',
    version: '1.0.0',
    endpoints: {
      api: '/api',
      health: '/health',
    },
  });
});

// Health check route - untuk monitoring server status
// GET http://localhost:5000/health
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(), // Berapa lama server sudah berjalan (dalam detik)
  });
});

// ============================================
// API ROUTES (PLACEHOLDER)
// ============================================
// Ini akan kita isi di Part selanjutnya dengan routes untuk:
// - Authentication (login, register)
// - Products (CRUD products)
// - Orders (create, get orders)
// - Users (profile, update)
// - Reviews (create, get reviews)
// - Payments (process payments)

// Contoh route placeholder untuk menunjukkan struktur API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Shopora API',
    routes: {
      auth: '/api/auth (login, register)',
      products: '/api/products (get, create, update, delete)',
      orders: '/api/orders (get, create)',
      users: '/api/users (profile, update)',
      reviews: '/api/reviews (get, create)',
      payments: '/api/payments (process payment)',
    },
    note: 'Routes will be implemented in next parts',
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 Not Found Handler
// Middleware ini akan catch semua request ke route yang tidak ada
// Harus diletakkan SETELAH semua route definitions
app.use((req, res, next) => {
  // Buat error object untuk route yang tidak ditemukan
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404); // Set status code 404
  next(error); // Pass error ke error handler berikutnya
});

// Global Error Handler
// Middleware ini akan catch semua error dari aplikasi
// Parameter 'err' harus ada di posisi pertama untuk Express recognize sebagai error handler
app.use((err, req, res, next) => {
  // Jika statusCode belum di-set, gunakan 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message, // Pesan error
    // Stack trace hanya ditampilkan di development mode untuk debugging
    // Di production, stack trace tidak ditampilkan untuk keamanan
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// ============================================
// START SERVER
// ============================================

// Ambil PORT dari environment variable, atau default ke 5000
const PORT = process.env.PORT || 5000;

// Start server dan listen pada PORT yang sudah ditentukan
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 SHOPORA E-COMMERCE SERVER');
  console.log('='.repeat(50));
  console.log(`📡 Server running in ${process.env.NODE_ENV} mode`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('📝 Next steps:');
  console.log('   1. Connect to MongoDB (Part 2)');
  console.log('   2. Create API routes (Part 3+)');
  console.log('   3. Test with Postman or Thunder Client');
  console.log('='.repeat(50));
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
// Handle process termination dengan baik (graceful shutdown)

// Handle SIGTERM signal (dari cloud hosting, docker, etc)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// Handle SIGINT signal (Ctrl+C di terminal)
process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions (error yang tidak ditangkap)
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error('Error:', err);
  process.exit(1);
});
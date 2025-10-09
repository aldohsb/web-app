// ============================================
// DATABASE CONNECTION CONFIGURATION
// ============================================
// File ini handle koneksi ke MongoDB menggunakan Mongoose

import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 * Function ini akan dipanggil dari server.js saat aplikasi start
 * Menggunakan async/await untuk handle asynchronous operation
 */
const connectDB = async () => {
  try {
    // ============================================
    // MONGOOSE CONNECTION OPTIONS
    // ============================================
    // Options untuk optimasi dan keamanan koneksi
    const options = {
      // useNewUrlParser: true, // DEPRECATED di Mongoose 6+
      // useUnifiedTopology: true, // DEPRECATED di Mongoose 6+
      
      // Connection pool size - berapa banyak koneksi simultan yang diizinkan
      maxPoolSize: 10,
      
      // Server selection timeout - berapa lama menunggu server respond
      serverSelectionTimeoutMS: 5000,
      
      // Socket timeout - berapa lama menunggu operasi database
      socketTimeoutMS: 45000,
      
      // Auto index - otomatis buat index dari schema (disable di production)
      autoIndex: process.env.NODE_ENV === 'development',
    };

    // ============================================
    // CONNECT TO MONGODB
    // ============================================
    // mongoose.connect() returns a Promise
    // Kita pakai await untuk tunggu sampai koneksi berhasil
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    // ============================================
    // CONNECTION SUCCESS
    // ============================================
    // Jika koneksi berhasil, tampilkan info di console
    console.log('='.repeat(50));
    console.log('🗄️  DATABASE CONNECTION');
    console.log('='.repeat(50));
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${getConnectionState(conn.connection.readyState)}`);
    console.log('='.repeat(50));

  } catch (error) {
    // ============================================
    // CONNECTION ERROR
    // ============================================
    // Jika koneksi gagal, tampilkan error dan stop aplikasi
    console.error('='.repeat(50));
    console.error('❌ DATABASE CONNECTION ERROR');
    console.error('='.repeat(50));
    console.error('Error Message:', error.message);
    console.error('='.repeat(50));
    console.error('💡 Troubleshooting:');
    console.error('   1. Check MONGO_URI in .env file');
    console.error('   2. Verify MongoDB Atlas IP whitelist');
    console.error('   3. Check username & password are correct');
    console.error('   4. Ensure cluster is active in MongoDB Atlas');
    console.error('='.repeat(50));
    
    // Exit process dengan kode error (1 = error)
    // Ini akan stop server karena tanpa database, aplikasi tidak bisa jalan
    process.exit(1);
  }
};

/**
 * Helper function untuk convert connection state number ke readable string
 * Mongoose connection states:
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const getConnectionState = (state) => {
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };
  return states[state] || 'Unknown';
};

// ============================================
// MONGOOSE CONNECTION EVENT LISTENERS
// ============================================
// Listen untuk berbagai events dari Mongoose connection
// Berguna untuk monitoring dan debugging

// Event: Connected
mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose connected to MongoDB');
});

// Event: Error
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

// Event: Disconnected
mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Event: Reconnected
mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconnected to MongoDB');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
// Handle aplikasi shutdown dengan baik
// Tutup koneksi database sebelum aplikasi stop

// Handle app termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Mongoose connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing mongoose connection:', err);
    process.exit(1);
  }
});

// Export function connectDB untuk digunakan di server.js
export default connectDB;
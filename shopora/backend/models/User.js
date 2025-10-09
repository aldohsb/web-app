// ============================================
// USER MODEL
// ============================================
// Schema untuk data user (customer & admin)

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema Definition
 * Mendefinisikan struktur data user di database
 */
const userSchema = new mongoose.Schema(
  {
    // ============================================
    // BASIC INFORMATION
    // ============================================
    
    // Nama lengkap user
    name: {
      type: String,
      required: [true, 'Please provide your name'], // Validation: wajib diisi
      trim: true, // Hapus spasi di awal dan akhir
      minlength: [2, 'Name must be at least 2 characters'], // Min 2 karakter
      maxlength: [50, 'Name cannot exceed 50 characters'], // Max 50 karakter
    },

    // Email user (digunakan untuk login)
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true, // Email harus unique (tidak boleh duplikat)
      lowercase: true, // Convert ke lowercase
      trim: true,
      // Regex validation untuk format email
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    // Password user (akan di-hash sebelum disimpan)
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Password tidak di-return saat query (untuk keamanan)
    },

    // ============================================
    // PROFILE INFORMATION
    // ============================================
    
    // Phone number (optional)
    phone: {
      type: String,
      trim: true,
      // Regex yang lebih flexible untuk nomor Indonesia dan internasional
      // Support format: +6281234567890, 081234567890, 08123-456-7890, dll
      match: [
        /^[\+]?[0-9\s\-\(\)]{10,20}$/,
        'Please provide a valid phone number',
      ],
    },

    // Profile picture URL
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150', // Default avatar
    },

    // ============================================
    // USER ROLE & STATUS
    // ============================================
    
    // Role: customer atau admin
    role: {
      type: String,
      enum: ['customer', 'admin'], // Hanya boleh 2 nilai ini
      default: 'customer', // Default role adalah customer
    },

    // Status akun: active, inactive, suspended
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },

    // ============================================
    // SHIPPING ADDRESS (DEFAULT)
    // ============================================
    
    // Default shipping address
    shippingAddress: {
      address: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      province: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        default: 'Indonesia',
      },
    },

    // ============================================
    // ACCOUNT VERIFICATION
    // ============================================
    
    // Email sudah diverifikasi atau belum
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Token untuk email verification
    emailVerificationToken: {
      type: String,
      select: false, // Tidak di-return saat query
    },

    // Expiry time untuk verification token
    emailVerificationExpire: {
      type: Date,
      select: false,
    },

    // ============================================
    // PASSWORD RESET
    // ============================================
    
    // Token untuk reset password
    resetPasswordToken: {
      type: String,
      select: false,
    },

    // Expiry time untuk reset token
    resetPasswordExpire: {
      type: Date,
      select: false,
    },

    // ============================================
    // METADATA
    // ============================================
    
    // Last login timestamp
    lastLogin: {
      type: Date,
    },

    // Login attempts (untuk security - prevent brute force)
    loginAttempts: {
      type: Number,
      default: 0,
    },

    // Lock account until (jika terlalu banyak failed login)
    lockUntil: {
      type: Date,
    },
  },
  {
    // ============================================
    // SCHEMA OPTIONS
    // ============================================
    
    // Timestamps: otomatis tambah createdAt dan updatedAt
    timestamps: true,

    // toJSON & toObject: transform output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES
// ============================================
// Index untuk optimasi query

// REMOVED: Index email - sudah ada dari unique: true
// userSchema.index({ email: 1 });

// Index role untuk filter user berdasarkan role
userSchema.index({ role: 1 });

// ============================================
// VIRTUALS
// ============================================
// Virtual properties (tidak disimpan di database)

// Virtual untuk check apakah account terkunci
userSchema.virtual('isLocked').get(function () {
  // Account terkunci jika lockUntil ada dan masih di masa depan
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ============================================
// MIDDLEWARE - PRE SAVE
// ============================================
// Middleware yang jalan SEBELUM document disave

// Hash password sebelum save ke database
userSchema.pre('save', async function (next) {
  // Jika password tidak dimodifikasi, skip hashing
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt untuk bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    
    // Hash password dengan salt
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================
// INSTANCE METHODS
// ============================================
// Methods yang bisa dipanggil dari user instance

/**
 * Compare password saat login
 * @param {String} enteredPassword - Password yang diinput user
 * @returns {Boolean} - True jika password match
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  // bcrypt.compare akan hash enteredPassword dan compare dengan stored hash
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Increment login attempts
 * Lock account jika terlalu banyak failed attempts (5x)
 */
userSchema.methods.incLoginAttempts = function () {
  // Jika account sudah terkunci dan lockUntil sudah expire
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 }, // Reset attempts
      $unset: { lockUntil: 1 }, // Remove lock
    });
  }

  // Increment login attempts
  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account jika sudah 5 failed attempts
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates);
};

/**
 * Reset login attempts (dipanggil saat login berhasil)
 */
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $set: { loginAttempts: 0, lastLogin: Date.now() },
    $unset: { lockUntil: 1 },
  });
};

// ============================================
// STATIC METHODS
// ============================================
// Methods yang dipanggil dari Model (bukan instance)

/**
 * Find user by email (include password untuk authentication)
 * @param {String} email
 * @returns {Object} user
 */
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select('+password');
};

// ============================================
// CREATE & EXPORT MODEL
// ============================================
const User = mongoose.model('User', userSchema);

export default User;
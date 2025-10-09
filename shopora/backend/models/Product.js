// ============================================
// PRODUCT MODEL
// ============================================
// Schema untuk data produk yang dijual di toko

import mongoose from 'mongoose';

/**
 * Product Schema Definition
 * Mendefinisikan struktur data produk di database
 */
const productSchema = new mongoose.Schema(
  {
    // ============================================
    // BASIC INFORMATION
    // ============================================
    
    // Nama produk
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },

    // Deskripsi produk (detailed)
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    // Short description (untuk card/preview)
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },

    // ============================================
    // PRICING
    // ============================================
    
    // Harga produk
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },

    // Harga sebelum diskon (original price)
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },

    // Discount percentage (calculated dari originalPrice dan price)
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },

    // ============================================
    // INVENTORY
    // ============================================
    
    // Stock yang tersedia
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

    // Minimum stock untuk warning (low stock alert)
    minStock: {
      type: Number,
      default: 5,
    },

    // SKU (Stock Keeping Unit) - kode unik produk
    sku: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined to be non-unique
      trim: true,
      uppercase: true,
    },

    // ============================================
    // CATEGORIZATION
    // ============================================
    
    // Kategori produk
    category: {
      type: String,
      required: [true, 'Please select product category'],
      enum: {
        values: [
          'Electronics',
          'Fashion',
          'Home & Living',
          'Beauty & Health',
          'Sports & Outdoor',
          'Books & Media',
          'Toys & Games',
          'Food & Beverage',
          'Automotive',
          'Others',
        ],
        message: 'Please select valid category',
      },
    },

    // Sub-kategori (optional)
    subCategory: {
      type: String,
      trim: true,
    },

    // Brand/Merek
    brand: {
      type: String,
      trim: true,
    },

    // Tags untuk search optimization
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // ============================================
    // IMAGES
    // ============================================
    
    // Array gambar produk
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: 'Product image',
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Main/primary image (shortcut untuk display)
    primaryImage: {
      type: String,
      default: 'https://via.placeholder.com/400',
    },

    // ============================================
    // SPECIFICATIONS
    // ============================================
    
    // Spesifikasi produk (flexible key-value pairs)
    specifications: {
      type: Map,
      of: String,
      // Contoh: { "Weight": "500g", "Dimensions": "10x20x5cm", "Material": "Cotton" }
    },

    // ============================================
    // SHIPPING
    // ============================================
    
    // Weight (dalam gram) - untuk kalkulasi ongkir
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      default: 0,
    },

    // Dimensions
    dimensions: {
      length: {
        type: Number,
        min: 0,
      },
      width: {
        type: Number,
        min: 0,
      },
      height: {
        type: Number,
        min: 0,
      },
    },

    // Free shipping flag
    isFreeShipping: {
      type: Boolean,
      default: false,
    },

    // ============================================
    // RATING & REVIEWS
    // ============================================
    
    // Average rating (0-5)
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },

    // Total number of reviews
    numReviews: {
      type: Number,
      default: 0,
    },

    // ============================================
    // STATUS & VISIBILITY
    // ============================================
    
    // Status produk
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft', 'out_of_stock'],
      default: 'active',
    },

    // Featured product (tampil di homepage)
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // New arrival (produk baru)
    isNewArrival: {
      type: Boolean,
      default: false,
    },

    // ============================================
    // SALES & POPULARITY
    // ============================================
    
    // Total terjual
    totalSold: {
      type: Number,
      default: 0,
    },

    // Total views
    views: {
      type: Number,
      default: 0,
    },

    // ============================================
    // METADATA
    // ============================================
    
    // Created by (admin yang create produk)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Last updated by
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    // ============================================
    // SCHEMA OPTIONS
    // ============================================
    
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES
// ============================================
// Indexes untuk optimasi query

// Text index untuk search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Index untuk category filtering
productSchema.index({ category: 1 });

// Index untuk price sorting
productSchema.index({ price: 1 });

// Index untuk rating sorting
productSchema.index({ rating: -1 });

// Compound index untuk featured products
productSchema.index({ isFeatured: 1, createdAt: -1 });

// Index untuk status
productSchema.index({ status: 1 });

// ============================================
// VIRTUALS
// ============================================

// Virtual untuk check apakah produk low stock
productSchema.virtual('isLowStock').get(function () {
  return this.stock > 0 && this.stock <= this.minStock;
});

// Virtual untuk check apakah out of stock
productSchema.virtual('isOutOfStock').get(function () {
  return this.stock === 0;
});

// Virtual untuk calculate discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual untuk get reviews (akan diisi dari Review model)
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

// ============================================
// MIDDLEWARE - PRE SAVE
// ============================================

// Auto-set primaryImage dari images array
productSchema.pre('save', function (next) {
  // Jika ada images dan primaryImage belum di-set
  if (this.images && this.images.length > 0 && !this.primaryImage) {
    // Cari image dengan isPrimary: true
    const primaryImg = this.images.find(img => img.isPrimary);
    // Jika ada, set sebagai primaryImage, jika tidak, pakai images[0]
    this.primaryImage = primaryImg ? primaryImg.url : this.images[0].url;
  }

  // Auto-calculate discount jika ada originalPrice
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }

  // Auto-set status to out_of_stock jika stock = 0
  if (this.stock === 0 && this.status === 'active') {
    this.status = 'out_of_stock';
  }

  next();
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Decrement stock saat ada pembelian
 * @param {Number} quantity - Jumlah yang dibeli
 */
productSchema.methods.decrementStock = async function (quantity) {
  if (this.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  this.stock -= quantity;
  this.totalSold += quantity;

  // Update status jika stock habis
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  }

  return await this.save();
};

/**
 * Increment stock (saat ada return atau restock)
 * @param {Number} quantity
 */
productSchema.methods.incrementStock = async function (quantity) {
  this.stock += quantity;

  // Update status jika sebelumnya out of stock
  if (this.status === 'out_of_stock' && this.stock > 0) {
    this.status = 'active';
  }

  return await this.save();
};

/**
 * Increment views
 */
productSchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

/**
 * Update rating dan numReviews
 * @param {Number} newRating - Rating baru dari review
 * @param {Boolean} isNewReview - Apakah review baru atau update
 */
productSchema.methods.updateRating = async function (newRating, isNewReview = true) {
  if (isNewReview) {
    // Jika review baru, tambah numReviews
    const totalRating = this.rating * this.numReviews + newRating;
    this.numReviews += 1;
    this.rating = totalRating / this.numReviews;
  } else {
    // Jika update review, recalculate average
    // (implementasi ini simplified, production butuh logic lebih kompleks)
    this.rating = newRating;
  }

  return await this.save();
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Get featured products
 * @param {Number} limit - Maximum jumlah produk
 */
productSchema.statics.getFeatured = function (limit = 10) {
  return this.find({ isFeatured: true, status: 'active' })
    .limit(limit)
    .sort({ createdAt: -1 });
};

/**
 * Get new arrivals
 * @param {Number} limit
 */
productSchema.statics.getNewArrivals = function (limit = 10) {
  return this.find({ isNewArrival: true, status: 'active' })
    .limit(limit)
    .sort({ createdAt: -1 });
};

/**
 * Get best sellers
 * @param {Number} limit
 */
productSchema.statics.getBestSellers = function (limit = 10) {
  return this.find({ status: 'active' })
    .limit(limit)
    .sort({ totalSold: -1 });
};

/**
 * Get products by category
 * @param {String} category
 * @param {Number} limit
 */
productSchema.statics.getByCategory = function (category, limit = 20) {
  return this.find({ category, status: 'active' })
    .limit(limit)
    .sort({ createdAt: -1 });
};

/**
 * Search products
 * @param {String} searchTerm
 * @param {Number} limit
 */
productSchema.statics.search = function (searchTerm, limit = 20) {
  return this.find(
    { 
      $text: { $search: searchTerm },
      status: 'active'
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
};

// ============================================
// CREATE & EXPORT MODEL
// ============================================
const Product = mongoose.model('Product', productSchema);

export default Product;
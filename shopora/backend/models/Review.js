// ============================================
// REVIEW MODEL
// ============================================
// Schema untuk review & rating produk dari customer

import mongoose from 'mongoose';

/**
 * Review Schema Definition
 * Mendefinisikan struktur data review di database
 */
const reviewSchema = new mongoose.Schema(
  {
    // ============================================
    // REFERENCES
    // ============================================
    
    // Reference ke product yang direview
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },

    // Reference ke user yang buat review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },

    // Reference ke order (untuk verify purchase)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },

    // ============================================
    // REVIEW CONTENT
    // ============================================
    
    // Rating (1-5 bintang)
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },

    // Title/judul review
    title: {
      type: String,
      required: [true, 'Please provide review title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    // Comment/isi review
    comment: {
      type: String,
      required: [true, 'Please provide review comment'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },

    // ============================================
    // REVIEW IMAGES
    // ============================================
    
    // Gambar yang diupload customer (optional)
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: 'Review image',
        },
      },
    ],

    // ============================================
    // VERIFIED PURCHASE
    // ============================================
    
    // Apakah ini verified purchase (customer beneran beli produk ini)
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },

    // ============================================
    // HELPFUL VOTES
    // ============================================
    
    // Berapa orang yang vote review ini helpful
    helpfulCount: {
      type: Number,
      default: 0,
      min: [0, 'Helpful count cannot be negative'],
    },

    // Array user IDs yang vote helpful (untuk prevent double vote)
    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // ============================================
    // ADMIN RESPONSE
    // ============================================
    
    // Response dari admin/seller
    adminResponse: {
      comment: {
        type: String,
        maxlength: [500, 'Response cannot exceed 500 characters'],
      },
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: {
        type: Date,
      },
    },

    // ============================================
    // STATUS & MODERATION
    // ============================================
    
    // Status review
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending',
    },

    // Apakah review ini di-flag sebagai inappropriate
    isFlagged: {
      type: Boolean,
      default: false,
    },

    // Alasan flag (spam, offensive, dll)
    flagReason: {
      type: String,
    },

    // ============================================
    // VISIBILITY
    // ============================================
    
    // Apakah review visible untuk public
    isVisible: {
      type: Boolean,
      default: true,
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

// Compound index: 1 user hanya bisa review 1 product 1x
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Index product untuk get all reviews of a product
reviewSchema.index({ product: 1, createdAt: -1 });

// Index user untuk get all reviews by a user
reviewSchema.index({ user: 1 });

// Index rating untuk sorting
reviewSchema.index({ rating: -1 });

// Index status untuk moderation
reviewSchema.index({ status: 1 });

// ============================================
// VIRTUALS
// ============================================

// Virtual untuk formatted date
reviewSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// ============================================
// MIDDLEWARE
// ============================================

// Check verified purchase sebelum save
reviewSchema.pre('save', async function (next) {
  // Jika order ID ada, check apakah order sudah delivered
  if (this.order && !this.isVerifiedPurchase) {
    const Order = mongoose.model('Order');
    const order = await Order.findById(this.order);

    // Set verified purchase jika order delivered
    if (order && order.isDelivered) {
      this.isVerifiedPurchase = true;
    }
  }

  next();
});

// Update product rating setelah review disave
reviewSchema.post('save', async function () {
  // Hanya update jika review approved
  if (this.status === 'approved') {
    await this.constructor.updateProductRating(this.product);
  }
});

// Update product rating setelah review dihapus
reviewSchema.post('remove', async function () {
  await this.constructor.updateProductRating(this.product);
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Approve review
 */
reviewSchema.methods.approve = async function () {
  this.status = 'approved';
  this.isVisible = true;
  return await this.save();
};

/**
 * Reject review
 * @param {String} reason
 */
reviewSchema.methods.reject = async function (reason) {
  this.status = 'rejected';
  this.isVisible = false;
  this.flagReason = reason;
  return await this.save();
};

/**
 * Flag review
 * @param {String} reason
 */
reviewSchema.methods.flag = async function (reason) {
  this.isFlagged = true;
  this.status = 'flagged';
  this.flagReason = reason;
  return await this.save();
};

/**
 * Add helpful vote
 * @param {ObjectId} userId
 */
reviewSchema.methods.addHelpfulVote = async function (userId) {
  // Check if user already voted
  if (this.helpfulVotes.includes(userId)) {
    throw new Error('You have already voted this review as helpful');
  }

  this.helpfulVotes.push(userId);
  this.helpfulCount += 1;

  return await this.save();
};

/**
 * Remove helpful vote
 * @param {ObjectId} userId
 */
reviewSchema.methods.removeHelpfulVote = async function (userId) {
  const index = this.helpfulVotes.indexOf(userId);
  
  if (index === -1) {
    throw new Error('You have not voted this review');
  }

  this.helpfulVotes.splice(index, 1);
  this.helpfulCount -= 1;

  return await this.save();
};

/**
 * Add admin response
 * @param {String} comment
 * @param {ObjectId} adminId
 */
reviewSchema.methods.addAdminResponse = async function (comment, adminId) {
  this.adminResponse = {
    comment,
    respondedBy: adminId,
    respondedAt: Date.now(),
  };

  return await this.save();
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Get reviews for a product
 * @param {ObjectId} productId
 * @param {Object} options - { limit, sort, rating }
 */
reviewSchema.statics.getProductReviews = function (productId, options = {}) {
  const {
    limit = 10,
    sort = { createdAt: -1 },
    rating = null,
  } = options;

  const query = {
    product: productId,
    status: 'approved',
    isVisible: true,
  };

  // Filter by rating jika ada
  if (rating) {
    query.rating = rating;
  }

  return this.find(query)
    .sort(sort)
    .limit(limit)
    .populate('user', 'name avatar')
    .populate('adminResponse.respondedBy', 'name');
};

/**
 * Get user reviews
 * @param {ObjectId} userId
 */
reviewSchema.statics.getUserReviews = function (userId) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('product', 'name primaryImage');
};

/**
 * Calculate and update product rating
 * @param {ObjectId} productId
 */
reviewSchema.statics.updateProductRating = async function (productId) {
  // Aggregate approved reviews
  const stats = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId), // Fixed: use 'new' keyword
        status: 'approved',
      },
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  // Update product dengan rating baru
  if (stats.length > 0) {
    const Product = mongoose.model('Product');
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
      numReviews: stats[0].numReviews,
    });
  } else {
    // Jika tidak ada review, reset rating
    const Product = mongoose.model('Product');
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
  }
};

/**
 * Get rating distribution for a product
 * @param {ObjectId} productId
 * @returns {Object} Distribution of ratings (1-5 stars)
 */
reviewSchema.statics.getRatingDistribution = async function (productId) {
  const distribution = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId), // Fixed: use 'new' keyword
        status: 'approved',
      },
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  // Format result sebagai object: { 5: 10, 4: 5, 3: 2, 2: 1, 1: 0 }
  const result = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  distribution.forEach((item) => {
    result[item._id] = item.count;
  });

  return result;
};

/**
 * Get pending reviews (untuk admin moderation)
 */
reviewSchema.statics.getPendingReviews = function () {
  return this.find({ status: 'pending' })
    .sort({ createdAt: 1 })
    .populate('user', 'name email')
    .populate('product', 'name primaryImage');
};

/**
 * Get flagged reviews
 */
reviewSchema.statics.getFlaggedReviews = function () {
  return this.find({ isFlagged: true })
    .sort({ createdAt: -1 })
    .populate('user', 'name email')
    .populate('product', 'name primaryImage');
};

// ============================================
// CREATE & EXPORT MODEL
// ============================================
const Review = mongoose.model('Review', reviewSchema);

export default Review;
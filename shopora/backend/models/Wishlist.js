// ============================================
// WISHLIST MODEL
// ============================================
// Schema untuk wishlist/favorit produk user

import mongoose from 'mongoose';

/**
 * Wishlist Schema Definition
 * Mendefinisikan struktur data wishlist di database
 */
const wishlistSchema = new mongoose.Schema(
  {
    // ============================================
    // REFERENCES
    // ============================================
    
    // Reference ke user pemilik wishlist
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Wishlist must belong to a user'],
    },

    // ============================================
    // WISHLIST ITEMS
    // ============================================
    
    // Array produk yang ada di wishlist
    items: [
      {
        // Reference ke product
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },

        // Kapan produk ditambahkan ke wishlist
        addedAt: {
          type: Date,
          default: Date.now,
        },

        // Notes dari user (optional)
        notes: {
          type: String,
          maxlength: [200, 'Notes cannot exceed 200 characters'],
        },

        // Notify when on sale
        notifyOnSale: {
          type: Boolean,
          default: false,
        },

        // Notify when back in stock
        notifyOnStock: {
          type: Boolean,
          default: false,
        },
      },
    ],
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

// Index user untuk get user wishlist (1 user = 1 wishlist)
wishlistSchema.index({ user: 1 }, { unique: true });

// Index untuk search product dalam wishlist
wishlistSchema.index({ 'items.product': 1 });

// ============================================
// VIRTUALS
// ============================================

// Virtual untuk total items di wishlist
wishlistSchema.virtual('totalItems').get(function () {
  return this.items ? this.items.length : 0;
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Add product to wishlist
 * @param {ObjectId} productId
 * @param {Object} options - { notes, notifyOnSale, notifyOnStock }
 */
wishlistSchema.methods.addItem = async function (productId, options = {}) {
  // Check if product already in wishlist
  const existingItem = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    throw new Error('Product already in wishlist');
  }

  // Add item to wishlist
  this.items.push({
    product: productId,
    addedAt: Date.now(),
    notes: options.notes || '',
    notifyOnSale: options.notifyOnSale || false,
    notifyOnStock: options.notifyOnStock || false,
  });

  return await this.save();
};

/**
 * Remove product from wishlist
 * @param {ObjectId} productId
 */
wishlistSchema.methods.removeItem = async function (productId) {
  // Find item index
  const itemIndex = this.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new Error('Product not found in wishlist');
  }

  // Remove item
  this.items.splice(itemIndex, 1);

  return await this.save();
};

/**
 * Check if product is in wishlist
 * @param {ObjectId} productId
 * @returns {Boolean}
 */
wishlistSchema.methods.hasProduct = function (productId) {
  return this.items.some(
    (item) => item.product.toString() === productId.toString()
  );
};

/**
 * Update item notifications
 * @param {ObjectId} productId
 * @param {Object} notifications - { notifyOnSale, notifyOnStock }
 */
wishlistSchema.methods.updateItemNotifications = async function (
  productId,
  notifications
) {
  // Find item
  const item = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error('Product not found in wishlist');
  }

  // Update notifications
  if (notifications.notifyOnSale !== undefined) {
    item.notifyOnSale = notifications.notifyOnSale;
  }

  if (notifications.notifyOnStock !== undefined) {
    item.notifyOnStock = notifications.notifyOnStock;
  }

  return await this.save();
};

/**
 * Update item notes
 * @param {ObjectId} productId
 * @param {String} notes
 */
wishlistSchema.methods.updateItemNotes = async function (productId, notes) {
  // Find item
  const item = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error('Product not found in wishlist');
  }

  item.notes = notes;

  return await this.save();
};

/**
 * Clear all items from wishlist
 */
wishlistSchema.methods.clearWishlist = async function () {
  this.items = [];
  return await this.save();
};

/**
 * Move item to cart (akan implement di cart functionality)
 * @param {ObjectId} productId
 */
wishlistSchema.methods.moveToCart = async function (productId) {
  // Find item
  const item = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error('Product not found in wishlist');
  }

  // Return product info untuk add to cart
  const productInfo = {
    productId: item.product,
    addedFrom: 'wishlist',
  };

  // Remove from wishlist
  await this.removeItem(productId);

  return productInfo;
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Get or create user wishlist
 * @param {ObjectId} userId
 * @returns {Object} wishlist
 */
wishlistSchema.statics.getOrCreate = async function (userId) {
  // Try to find existing wishlist
  let wishlist = await this.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price originalPrice primaryImage stock rating numReviews',
  });

  // If not found, create new wishlist
  if (!wishlist) {
    wishlist = await this.create({ user: userId, items: [] });
    
    // Populate after create
    wishlist = await this.findById(wishlist._id).populate({
      path: 'items.product',
      select: 'name price originalPrice primaryImage stock rating numReviews',
    });
  }

  return wishlist;
};

/**
 * Get products that user should be notified about
 * - Products on sale (jika user set notifyOnSale)
 * - Products back in stock (jika user set notifyOnStock)
 */
wishlistSchema.statics.getNotificationItems = async function () {
  // Get all wishlists dengan notification enabled
  const wishlists = await this.find({
    $or: [
      { 'items.notifyOnSale': true },
      { 'items.notifyOnStock': true },
    ],
  }).populate('user', 'name email');

  return wishlists;
};

/**
 * Check for price drops (untuk notification)
 * @param {ObjectId} userId
 * @returns {Array} Products dengan price drop
 */
wishlistSchema.statics.checkPriceDrops = async function (userId) {
  const wishlist = await this.findOne({ user: userId }).populate('items.product');

  if (!wishlist) {
    return [];
  }

  // Filter items dengan price drop (originalPrice > price)
  const priceDrops = wishlist.items.filter((item) => {
    return (
      item.notifyOnSale &&
      item.product.originalPrice &&
      item.product.originalPrice > item.product.price
    );
  });

  return priceDrops;
};

/**
 * Get wishlist statistics
 * @param {ObjectId} userId
 * @returns {Object} Statistics
 */
wishlistSchema.statics.getStatistics = async function (userId) {
  const wishlist = await this.findOne({ user: userId }).populate('items.product');

  if (!wishlist || wishlist.items.length === 0) {
    return {
      totalItems: 0,
      totalValue: 0,
      inStockItems: 0,
      outOfStockItems: 0,
      onSaleItems: 0,
    };
  }

  const stats = {
    totalItems: wishlist.items.length,
    totalValue: 0,
    inStockItems: 0,
    outOfStockItems: 0,
    onSaleItems: 0,
  };

  wishlist.items.forEach((item) => {
    if (item.product) {
      // Calculate total value
      stats.totalValue += item.product.price;

      // Count stock status
      if (item.product.stock > 0) {
        stats.inStockItems += 1;
      } else {
        stats.outOfStockItems += 1;
      }

      // Count on sale items
      if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
        stats.onSaleItems += 1;
      }
    }
  });

  return stats;
};

// ============================================
// CREATE & EXPORT MODEL
// ============================================
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
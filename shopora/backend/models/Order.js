// ============================================
// ORDER MODEL
// ============================================
// Schema untuk data order/pesanan customer

import mongoose from 'mongoose';

/**
 * Order Schema Definition
 * Mendefinisikan struktur data order di database
 */
const orderSchema = new mongoose.Schema(
  {
    // ============================================
    // USER INFORMATION
    // ============================================
    
    // Reference ke user yang buat order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },

    // ============================================
    // ORDER ITEMS
    // ============================================
    
    // Array produk yang dibeli
    orderItems: [
      {
        // Reference ke product
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        
        // Snapshot data produk saat order dibuat
        // (jika produk dihapus/diubah, data order tetap ada)
        name: {
          type: String,
          required: true,
        },
        
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
        
        price: {
          type: Number,
          required: true,
          min: [0, 'Price cannot be negative'],
        },
        
        image: {
          type: String,
          required: true,
        },
        
        // Total price untuk item ini (quantity * price)
        itemTotal: {
          type: Number,
          required: true,
        },
      },
    ],

    // ============================================
    // SHIPPING ADDRESS
    // ============================================
    
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, 'Please provide recipient name'],
      },
      phone: {
        type: String,
        required: [true, 'Please provide phone number'],
      },
      address: {
        type: String,
        required: [true, 'Please provide address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide city'],
      },
      province: {
        type: String,
        required: [true, 'Please provide province'],
      },
      postalCode: {
        type: String,
        required: [true, 'Please provide postal code'],
      },
      country: {
        type: String,
        default: 'Indonesia',
      },
    },

    // ============================================
    // PAYMENT INFORMATION
    // ============================================
    
    // Payment method
    paymentMethod: {
      type: String,
      required: [true, 'Please select payment method'],
      enum: {
        values: ['stripe', 'paypal', 'xendit', 'bank_transfer', 'cod'],
        message: 'Please select valid payment method',
      },
    },

    // Payment result dari payment gateway
    paymentResult: {
      id: String, // Transaction ID dari payment gateway
      status: String, // Status dari payment gateway
      updateTime: Date,
      emailAddress: String,
    },

    // ============================================
    // PRICING BREAKDOWN
    // ============================================
    
    // Subtotal (total semua items sebelum ongkir & tax)
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Items price cannot be negative'],
    },

    // Ongkos kirim
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Shipping price cannot be negative'],
    },

    // Tax (PPN, dll)
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },

    // Discount (dari voucher/promo)
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },

    // Total harga yang harus dibayar
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Total price cannot be negative'],
    },

    // ============================================
    // ORDER STATUS
    // ============================================
    
    // Status pembayaran
    isPaid: {
      type: Boolean,
      default: false,
    },

    // Tanggal pembayaran
    paidAt: {
      type: Date,
    },

    // Status pengiriman
    isDelivered: {
      type: Boolean,
      default: false,
    },

    // Tanggal dikirim
    deliveredAt: {
      type: Date,
    },

    // Overall order status
    status: {
      type: String,
      enum: {
        values: [
          'pending',        // Menunggu pembayaran
          'paid',          // Sudah dibayar, belum diproses
          'processing',    // Sedang diproses/dikemas
          'shipped',       // Sudah dikirim
          'delivered',     // Sudah diterima
          'cancelled',     // Dibatalkan
          'refunded',      // Di-refund
        ],
        message: 'Invalid order status',
      },
      default: 'pending',
    },

    // ============================================
    // SHIPPING INFORMATION
    // ============================================
    
    // Courier service (JNE, JNT, SiCepat, dll)
    courier: {
      type: String,
    },

    // Tracking number/resi
    trackingNumber: {
      type: String,
    },

    // Estimated delivery date
    estimatedDeliveryDate: {
      type: Date,
    },

    // ============================================
    // VOUCHER/PROMO
    // ============================================
    
    // Voucher code yang digunakan
    voucherCode: {
      type: String,
      uppercase: true,
      trim: true,
    },

    // ============================================
    // NOTES & COMMUNICATION
    // ============================================
    
    // Catatan dari customer
    customerNotes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },

    // Catatan dari admin/seller
    adminNotes: {
      type: String,
      maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    },

    // Status history (track perubahan status)
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ============================================
    // CANCELLATION
    // ============================================
    
    // Order dibatalkan
    isCancelled: {
      type: Boolean,
      default: false,
    },

    // Alasan pembatalan
    cancellationReason: {
      type: String,
    },

    // Tanggal pembatalan
    cancelledAt: {
      type: Date,
    },

    // Dibatalkan oleh
    cancelledBy: {
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

// Index user untuk query user orders
orderSchema.index({ user: 1, createdAt: -1 });

// Index status untuk filter orders
orderSchema.index({ status: 1 });

// Index payment status
orderSchema.index({ isPaid: 1, paidAt: -1 });

// Index tracking number
orderSchema.index({ trackingNumber: 1 });

// ============================================
// VIRTUALS
// ============================================

// Virtual untuk order number (formatted)
orderSchema.virtual('orderNumber').get(function () {
  // Format: ORD-20240110-ABCD1234 (ORD-YYYYMMDD-ID)
  const date = this.createdAt.toISOString().slice(0, 10).replace(/-/g, '');
  const id = this._id.toString().slice(-8).toUpperCase();
  return `ORD-${date}-${id}`;
});

// ============================================
// MIDDLEWARE - PRE SAVE
// ============================================

// Auto-calculate prices
orderSchema.pre('save', function (next) {
  // Calculate itemsPrice dari orderItems
  if (this.orderItems && this.orderItems.length > 0) {
    this.itemsPrice = this.orderItems.reduce((acc, item) => {
      return acc + item.itemTotal;
    }, 0);
  }

  // Calculate totalPrice
  this.totalPrice = 
    this.itemsPrice + 
    this.shippingPrice + 
    this.taxPrice - 
    this.discountAmount;

  // Update isPaid status
  if (this.paidAt && !this.isPaid) {
    this.isPaid = true;
  }

  // Update isDelivered status
  if (this.deliveredAt && !this.isDelivered) {
    this.isDelivered = true;
  }

  next();
});

// Add to status history saat status berubah
orderSchema.pre('save', function (next) {
  // Check jika status berubah
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }

  next();
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Mark order as paid
 * @param {Object} paymentResult - Result dari payment gateway
 */
orderSchema.methods.markAsPaid = async function (paymentResult) {
  this.isPaid = true;
  this.paidAt = Date.now();
  this.status = 'paid';
  this.paymentResult = paymentResult;

  return await this.save();
};

/**
 * Mark order as delivered
 */
orderSchema.methods.markAsDelivered = async function () {
  this.isDelivered = true;
  this.deliveredAt = Date.now();
  this.status = 'delivered';

  return await this.save();
};

/**
 * Cancel order
 * @param {String} reason - Alasan pembatalan
 * @param {ObjectId} userId - User yang membatalkan
 */
orderSchema.methods.cancelOrder = async function (reason, userId) {
  if (this.status === 'delivered' || this.status === 'shipped') {
    throw new Error('Cannot cancel order that has been shipped or delivered');
  }

  this.isCancelled = true;
  this.cancelledAt = Date.now();
  this.cancellationReason = reason;
  this.cancelledBy = userId;
  this.status = 'cancelled';

  return await this.save();
};

/**
 * Update order status
 * @param {String} newStatus
 * @param {String} note
 * @param {ObjectId} userId
 */
orderSchema.methods.updateStatus = async function (newStatus, note = '', userId = null) {
  this.status = newStatus;

  // Add to history
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy: userId,
    timestamp: new Date(),
  });

  return await this.save();
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Get orders by user
 * @param {ObjectId} userId
 * @param {Number} limit
 */
orderSchema.statics.getUserOrders = function (userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('orderItems.product', 'name primaryImage');
};

/**
 * Get orders by status
 * @param {String} status
 */
orderSchema.statics.getByStatus = function (status) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .populate('user', 'name email')
    .populate('orderItems.product', 'name');
};

/**
 * Get total revenue
 * @param {Date} startDate
 * @param {Date} endDate
 */
orderSchema.statics.getTotalRevenue = async function (startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        isPaid: true,
        paidAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { totalRevenue: 0, totalOrders: 0 };
};

// ============================================
// CREATE & EXPORT MODEL
// ============================================
const Order = mongoose.model('Order', orderSchema);

export default Order;
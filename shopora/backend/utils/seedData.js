// ============================================
// SEED DATA - POPULATE DATABASE WITH DUMMY DATA
// ============================================
// Script untuk mengisi database dengan data dummy untuk testing

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';

// Load environment variables
dotenv.config();

// ============================================
// DUMMY DATA
// ============================================

// Dummy Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@shopora.com',
    password: 'admin123',
    role: 'admin',
    phone: '+6281234567890',
    isEmailVerified: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    role: 'customer',
    phone: '+6281234567891',
    isEmailVerified: true,
    shippingAddress: {
      address: 'Jl. Malioboro No. 123',
      city: 'Yogyakarta',
      province: 'DIY',
      postalCode: '55511',
      country: 'Indonesia',
    },
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane123',
    role: 'customer',
    phone: '+6281234567892',
    isEmailVerified: true,
  },
];

// Dummy Products
const products = [
  {
    name: 'Classic Leather Watch',
    description: 'Elegant leather watch with minimalist design. Perfect for any occasion. Water resistant up to 50m. Made with premium materials and Swiss movement.',
    shortDescription: 'Elegant minimalist leather watch',
    price: 1299000,
    originalPrice: 1799000,
    stock: 25,
    category: 'Fashion',
    subCategory: 'Watches',
    brand: 'Timeless',
    tags: ['watch', 'leather', 'classic', 'elegant'],
    primaryImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
        isPrimary: true,
      },
    ],
    isFeatured: true,
    isNewArrival: true,
    weight: 200,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life. Crystal clear sound quality with deep bass. Comfortable ear cushions for all-day wear.',
    shortDescription: 'Premium noise-cancelling headphones',
    price: 899000,
    originalPrice: 1299000,
    stock: 50,
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'SoundMax',
    tags: ['headphones', 'wireless', 'bluetooth', 'audio'],
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        isPrimary: true,
      },
    ],
    isFeatured: true,
    weight: 300,
    rating: 4.8,
    numReviews: 25,
  },
  {
    name: 'Canvas Backpack',
    description: 'Durable canvas backpack with multiple compartments. Perfect for daily commute or travel. Water-resistant coating and padded laptop sleeve.',
    shortDescription: 'Durable canvas backpack for travel',
    price: 449000,
    stock: 100,
    category: 'Fashion',
    subCategory: 'Bags',
    brand: 'TravelGear',
    tags: ['backpack', 'canvas', 'travel', 'bag'],
    primaryImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        isPrimary: true,
      },
    ],
    weight: 800,
    rating: 4.3,
    numReviews: 8,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 elegant ceramic coffee mugs. Microwave and dishwasher safe. Perfect gift for coffee lovers. Comes in beautiful gift box.',
    shortDescription: 'Set of 4 elegant ceramic mugs',
    price: 199000,
    stock: 75,
    category: 'Home & Living',
    subCategory: 'Kitchen',
    brand: 'HomeEssentials',
    tags: ['mug', 'coffee', 'ceramic', 'kitchen'],
    primaryImage: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
        isPrimary: true,
      },
    ],
    isFeatured: false,
    weight: 1200,
    rating: 4.6,
    numReviews: 15,
  },
  {
    name: 'Running Shoes Pro',
    description: 'Professional running shoes with advanced cushioning technology. Breathable mesh upper and durable rubber sole. Perfect for marathon training.',
    shortDescription: 'Professional running shoes',
    price: 799000,
    originalPrice: 999000,
    stock: 40,
    category: 'Sports & Outdoor',
    subCategory: 'Footwear',
    brand: 'RunFast',
    tags: ['shoes', 'running', 'sports', 'footwear'],
    primaryImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        isPrimary: true,
      },
    ],
    isNewArrival: true,
    weight: 400,
    rating: 4.7,
    numReviews: 20,
  },
];

// ============================================
// SEED FUNCTIONS
// ============================================

/**
 * Import/Seed all data
 */
const importData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Connect to database
    await connectDB();

    // Delete all existing data
    console.log('🗑️  Deleting existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Wishlist.deleteMany();
    console.log('✅ Existing data deleted');

    // Insert users
    console.log('👤 Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} users created`);

    // Get admin user untuk set createdBy di products
    const adminUser = createdUsers.find((user) => user.role === 'admin');

    // Add createdBy ke products
    const productsWithCreator = products.map((product) => ({
      ...product,
      createdBy: adminUser._id,
    }));

    // Insert products
    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(productsWithCreator);
    console.log(`✅ ${createdProducts.length} products created`);

    // Create sample review
    console.log('⭐ Creating sample reviews...');
    const customerUser = createdUsers.find((user) => user.role === 'customer');
    
    const sampleReview = await Review.create({
      product: createdProducts[0]._id,
      user: customerUser._id,
      rating: 5,
      title: 'Excellent Product!',
      comment: 'This is an amazing product. Highly recommend to everyone!',
      status: 'approved',
      isVerifiedPurchase: true,
    });
    console.log('✅ Sample review created');

    // Create sample wishlist
    console.log('❤️  Creating sample wishlist...');
    const sampleWishlist = await Wishlist.create({
      user: customerUser._id,
      items: [
        {
          product: createdProducts[1]._id,
          notifyOnSale: true,
        },
        {
          product: createdProducts[2]._id,
          notifyOnStock: true,
        },
      ],
    });
    console.log('✅ Sample wishlist created');

    // Summary
    console.log('');
    console.log('='.repeat(50));
    console.log('✅ DATA SEEDING COMPLETED!');
    console.log('='.repeat(50));
    console.log(`👤 Users: ${createdUsers.length}`);
    console.log(`📦 Products: ${createdProducts.length}`);
    console.log(`⭐ Reviews: 1`);
    console.log(`❤️  Wishlists: 1`);
    console.log('='.repeat(50));
    console.log('');
    console.log('📝 Test Accounts:');
    console.log('   Admin: admin@shopora.com / admin123');
    console.log('   Customer: john@example.com / john123');
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

/**
 * Delete all data
 */
const destroyData = async () => {
  try {
    console.log('🗑️  Starting data destruction...');

    // Connect to database
    await connectDB();

    // Delete all data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Wishlist.deleteMany();

    console.log('✅ All data destroyed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

// ============================================
// RUN SCRIPT
// ============================================

// Check command line argument
if (process.argv[2] === '-d') {
  // Destroy data
  destroyData();
} else {
  // Import data
  importData();
}
import mongoose from 'mongoose';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { connectDatabase } from '../config/database.js';
import logger from '../utils/logger.js';

// Seed demo data for testing
export const seedDemoData = async () => {
  try {
    await connectDatabase();
    
    logger.info('Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Progress.deleteMany({});
    
    logger.info('Cleared existing data');
    
    // Create demo users
    const demoUsers = [
      {
        userId: 'demo_user_1',
        userName: 'Demo User 1',
        isGuest: false,
        stats: {
          totalLevelsCompleted: 25,
          totalStars: 65,
          totalQuestionsAnswered: 250,
          totalCorrectAnswers: 220,
          accuracy: 88,
          currentStreak: 5,
          longestStreak: 10,
        },
      },
      {
        userId: 'demo_user_2',
        userName: 'Demo User 2',
        isGuest: false,
        stats: {
          totalLevelsCompleted: 50,
          totalStars: 140,
          totalQuestionsAnswered: 500,
          totalCorrectAnswers: 460,
          accuracy: 92,
          currentStreak: 12,
          longestStreak: 15,
        },
      },
    ];
    
    const createdUsers = await User.insertMany(demoUsers);
    logger.success(`Created ${createdUsers.length} demo users`);
    
    // Create demo progress
    const demoProgress = [
      {
        userId: 'demo_user_1',
        currentLevel: 26,
        unlockedLevels: Array.from({ length: 26 }, (_, i) => i + 1),
        levelProgress: Array.from({ length: 25 }, (_, i) => ({
          level: i + 1,
          stars: Math.floor(Math.random() * 3) + 1,
          bestScore: Math.floor(Math.random() * 3) + 8,
          attempts: Math.floor(Math.random() * 5) + 1,
          completedAt: new Date(),
          lastAttemptAt: new Date(),
        })),
        completedLevels: Array.from({ length: 25 }, (_, i) => i + 1),
        totalStars: 65,
      },
      {
        userId: 'demo_user_2',
        currentLevel: 51,
        unlockedLevels: Array.from({ length: 51 }, (_, i) => i + 1),
        levelProgress: Array.from({ length: 50 }, (_, i) => ({
          level: i + 1,
          stars: Math.floor(Math.random() * 3) + 1,
          bestScore: Math.floor(Math.random() * 3) + 8,
          attempts: Math.floor(Math.random() * 3) + 1,
          completedAt: new Date(),
          lastAttemptAt: new Date(),
        })),
        completedLevels: Array.from({ length: 50 }, (_, i) => i + 1),
        totalStars: 140,
      },
    ];
    
    const createdProgress = await Progress.insertMany(demoProgress);
    logger.success(`Created ${createdProgress.length} demo progress records`);
    
    logger.success('Database seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    logger.error('Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemoData();
}
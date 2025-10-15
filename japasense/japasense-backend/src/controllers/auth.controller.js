import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { generateUserId } from '../utils/helpers.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Create guest user
export const createGuest = asyncHandler(async (req, res) => {
  const userId = generateUserId();
  
  // Create user
  const user = await User.create({
    userId,
    userName: 'Guest',
    isGuest: true,
  });
  
  // Create initial progress
  const progress = await Progress.create({
    userId,
    currentLevel: 1,
    unlockedLevels: [1],
    levelProgress: [],
    completedLevels: [],
  });
  
  sendSuccess(res, {
    user: {
      userId: user.userId,
      userName: user.userName,
      isGuest: user.isGuest,
      stats: user.stats,
    },
    progress: {
      currentLevel: progress.currentLevel,
      unlockedLevels: progress.unlockedLevels,
      totalStars: progress.totalStars,
      completedLevels: progress.completedLevels,
    },
  }, 'Guest user created successfully', 201);
});

// Get or create user
export const getOrCreateUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  let user = await User.findOne({ userId });
  let progress = await Progress.findOne({ userId });
  
  if (!user) {
    // Create new user if not exists
    user = await User.create({
      userId,
      userName: 'Guest',
      isGuest: true,
    });
    
    progress = await Progress.create({
      userId,
      currentLevel: 1,
      unlockedLevels: [1],
      levelProgress: [],
      completedLevels: [],
      totalStars: 0,
    });
  }
  
  // Ensure level 1 is always unlocked
  if (!progress) {
    progress = await Progress.create({
      userId,
      currentLevel: 1,
      unlockedLevels: [1],
      levelProgress: [],
      completedLevels: [],
      totalStars: 0,
    });
  } else if (!progress.unlockedLevels.includes(1)) {
    progress.unlockedLevels.unshift(1);
    await progress.save();
  }
  
  // Update last active
  await user.updateActivity();
  
  sendSuccess(res, {
    user: {
      userId: user.userId,
      userName: user.userName,
      isGuest: user.isGuest,
      stats: user.stats,
      lastActive: user.lastActive,
    },
    progress: {
      currentLevel: progress.currentLevel,
      unlockedLevels: progress.unlockedLevels,
      totalStars: progress.totalStars,
      completedLevels: progress.completedLevels,
      levelProgress: progress.levelProgress,
    },
  }, 'User data retrieved successfully');
});

// Update user name
export const updateUserName = asyncHandler(async (req, res) => {
  const { userId, userName } = req.body;
  
  const user = await User.findOne({ userId });
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  
  user.userName = userName;
  await user.save();
  
  sendSuccess(res, {
    userId: user.userId,
    userName: user.userName,
  }, 'User name updated successfully');
});

export default {
  createGuest,
  getOrCreateUser,
  updateUserName,
};
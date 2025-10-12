import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Get user profile
export const getProfile = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return sendError(res, 'userId is required', 400);
  }
  
  const user = await User.findOne({ userId });
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  
  sendSuccess(res, {
    userId: user.userId,
    userName: user.userName,
    isGuest: user.isGuest,
    stats: user.stats,
    lastActive: user.lastActive,
    createdAt: user.createdAt,
  }, 'Profile retrieved successfully');
});

// Get user statistics
export const getStats = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return sendError(res, 'userId is required', 400);
  }
  
  const user = await User.findOne({ userId });
  const progress = await Progress.findOne({ userId });
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  
  const progressStats = progress ? progress.getStats() : {
    currentLevel: 1,
    totalLevelsCompleted: 0,
    totalStars: 0,
    unlockedLevels: 1,
    averageStars: 0,
    perfectLevels: 0,
  };
  
  sendSuccess(res, {
    userId: user.userId,
    userName: user.userName,
    userStats: user.stats,
    progressStats,
    recentActivity: {
      lastActive: user.lastActive,
      lastSynced: progress?.lastSyncedAt,
    },
  }, 'Statistics retrieved successfully');
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { userId, userName } = req.body;
  
  if (!userId) {
    return sendError(res, 'userId is required', 400);
  }
  
  const user = await User.findOne({ userId });
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  
  if (userName) {
    user.userName = userName;
  }
  
  await user.save();
  await user.updateActivity();
  
  sendSuccess(res, {
    userId: user.userId,
    userName: user.userName,
  }, 'Profile updated successfully');
});

// Get leaderboard (top users by stars)
export const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const topUsers = await User.find()
    .sort({ 'stats.totalStars': -1 })
    .limit(limit)
    .select('userId userName stats.totalStars stats.totalLevelsCompleted stats.accuracy');
  
  const leaderboard = topUsers.map((user, index) => ({
    rank: index + 1,
    userId: user.userId,
    userName: user.userName,
    totalStars: user.stats.totalStars,
    levelsCompleted: user.stats.totalLevelsCompleted,
    accuracy: user.stats.accuracy,
  }));
  
  sendSuccess(res, {
    leaderboard,
    total: leaderboard.length,
  }, 'Leaderboard retrieved successfully');
});

export default {
  getProfile,
  getStats,
  updateProfile,
  getLeaderboard,
};
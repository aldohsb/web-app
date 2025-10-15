import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { calculateStars } from '../utils/helpers.js';

// Get user progress
export const getProgress = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return sendError(res, 'userId is required', 400);
  }
  
  let progress = await Progress.findOne({ userId });
  
  if (!progress) {
    // Create initial progress with level 1 unlocked
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
  if (!progress.unlockedLevels.includes(1)) {
    progress.unlockedLevels.unshift(1);
    await progress.save();
  }
  
  sendSuccess(res, {
    currentLevel: progress.currentLevel,
    unlockedLevels: progress.unlockedLevels,
    levelProgress: progress.levelProgress,
    totalStars: progress.totalStars,
    completedLevels: progress.completedLevels,
    stats: progress.getStats(),
  }, 'Progress retrieved successfully');
});

// Update level progress
export const updateProgress = asyncHandler(async (req, res) => {
  const { userId, level, correctAnswers, totalQuestions } = req.body;
  
  const stars = calculateStars(correctAnswers);
  
  // Find or create progress
  let progress = await Progress.findOne({ userId });
  
  if (!progress) {
    progress = await Progress.create({
      userId,
      currentLevel: 1,
      unlockedLevels: [1],
    });
  }
  
  // Update progress
  await progress.updateLevelProgress(level, stars, correctAnswers);
  
  // Update user stats
  const user = await User.findOne({ userId });
  if (user) {
    await user.updateStats(correctAnswers, totalQuestions, stars > 0, stars);
  }
  
  sendSuccess(res, {
    level,
    stars,
    correctAnswers,
    totalQuestions,
    progress: {
      currentLevel: progress.currentLevel,
      unlockedLevels: progress.unlockedLevels,
      totalStars: progress.totalStars,
      completedLevels: progress.completedLevels,
    },
    userStats: user ? user.stats : null,
  }, 'Progress updated successfully');
});

// Sync progress (bulk update from client)
export const syncProgress = asyncHandler(async (req, res) => {
  const { userId, progressData } = req.body;
  
  if (!progressData) {
    return sendError(res, 'progressData is required', 400);
  }
  
  let progress = await Progress.findOne({ userId });
  
  if (!progress) {
    progress = await Progress.create({
      userId,
      ...progressData,
    });
  } else {
    // Merge progress data
    progress.currentLevel = Math.max(progress.currentLevel, progressData.currentLevel || 1);
    
    // Merge unlocked levels
    const allUnlockedLevels = new Set([...progress.unlockedLevels, ...(progressData.unlockedLevels || [])]);
    progress.unlockedLevels = Array.from(allUnlockedLevels).sort((a, b) => a - b);
    
    // Merge level progress
    if (progressData.levelProgress) {
      progressData.levelProgress.forEach(newLP => {
        const existing = progress.levelProgress.find(lp => lp.level === newLP.level);
        if (existing) {
          existing.stars = Math.max(existing.stars, newLP.stars);
          existing.bestScore = Math.max(existing.bestScore, newLP.bestScore);
          existing.attempts += newLP.attempts || 1;
        } else {
          progress.levelProgress.push(newLP);
        }
      });
    }
    
    // Merge completed levels
    const allCompletedLevels = new Set([...progress.completedLevels, ...(progressData.completedLevels || [])]);
    progress.completedLevels = Array.from(allCompletedLevels).sort((a, b) => a - b);
    
    // Recalculate total stars
    progress.totalStars = progress.levelProgress.reduce((sum, lp) => sum + lp.stars, 0);
    
    await progress.save();
  }
  
  sendSuccess(res, {
    currentLevel: progress.currentLevel,
    unlockedLevels: progress.unlockedLevels,
    totalStars: progress.totalStars,
    completedLevels: progress.completedLevels,
    levelProgress: progress.levelProgress,
  }, 'Progress synced successfully');
});

// Get level details
export const getLevelProgress = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { level } = req.params;
  
  if (!userId) {
    return sendError(res, 'userId is required', 400);
  }
  
  const progress = await Progress.findOne({ userId });
  
  if (!progress) {
    return sendError(res, 'Progress not found', 404);
  }
  
  const levelProgress = progress.getLevelProgress(parseInt(level));
  const isUnlocked = progress.unlockedLevels.includes(parseInt(level));
  
  sendSuccess(res, {
    level: parseInt(level),
    isUnlocked,
    progress: levelProgress || {
      level: parseInt(level),
      stars: 0,
      bestScore: 0,
      attempts: 0,
    },
  }, 'Level progress retrieved successfully');
});

// Reset progress (for testing)
export const resetProgress = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  const progress = await Progress.findOne({ userId });
  
  if (!progress) {
    return sendError(res, 'Progress not found', 404);
  }
  
  progress.currentLevel = 1;
  progress.unlockedLevels = [1];
  progress.levelProgress = [];
  progress.completedLevels = [];
  progress.totalStars = 0;
  
  await progress.save();
  
  // Reset user stats
  const user = await User.findOne({ userId });
  if (user) {
    user.stats = {
      totalLevelsCompleted: 0,
      totalStars: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      accuracy: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
    await user.save();
  }
  
  sendSuccess(res, {
    message: 'Progress reset successfully',
  }, 'Progress reset successfully');
});

export default {
  getProgress,
  updateProgress,
  syncProgress,
  getLevelProgress,
  resetProgress,
};
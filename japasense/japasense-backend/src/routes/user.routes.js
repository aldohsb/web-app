import express from 'express';
import {
  getProfile,
  getStats,
  updateProfile,
  getLeaderboard,
} from '../controllers/user.controller.js';
import { sanitizeInput } from '../middleware/validation.middleware.js';

const router = express.Router();

// Get user profile
router.get('/profile', getProfile);

// Get user statistics
router.get('/stats', getStats);

// Update user profile
router.patch('/profile', sanitizeInput, updateProfile);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

export default router;
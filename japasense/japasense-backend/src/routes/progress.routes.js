import express from 'express';
import {
  getProgress,
  updateProgress,
  syncProgress,
  getLevelProgress,
  resetProgress,
} from '../controllers/progress.controller.js';
import {
  validateUserId,
  validateQuizSubmission,
  sanitizeInput,
} from '../middleware/validation.middleware.js';

const router = express.Router();

// Get user progress
router.get('/', getProgress);

// Get specific level progress
router.get('/level/:level', getLevelProgress);

// Update progress after completing a level
router.post('/update', sanitizeInput, validateQuizSubmission, updateProgress);

// Sync progress (bulk update from client)
router.post('/sync', sanitizeInput, validateUserId, syncProgress);

// Reset progress (for testing)
router.post('/reset', sanitizeInput, validateUserId, resetProgress);

export default router;
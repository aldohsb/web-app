import express from 'express';
import { createGuest, getOrCreateUser, updateUserName } from '../controllers/auth.controller.js';
import { validateUserId, validateUserName, sanitizeInput } from '../middleware/validation.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// Create guest user
router.post('/guest', authLimiter, createGuest);

// Get or create user
router.post('/user', authLimiter, sanitizeInput, validateUserId, getOrCreateUser);

// Update user name
router.patch('/username', sanitizeInput, validateUserId, validateUserName, updateUserName);

export default router;
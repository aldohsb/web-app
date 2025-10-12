import express from 'express';
import { getQuestions, submitQuiz, getLevelInfo } from '../controllers/quiz.controller.js';
import { validateLevel, sanitizeInput } from '../middleware/validation.middleware.js';
import { quizLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// Get questions for a level
router.get('/questions/:level', quizLimiter, validateLevel, getQuestions);

// Get level info
router.get('/level/:level', validateLevel, getLevelInfo);

// Submit quiz (for validation, actual progress update in progress routes)
router.post('/submit', sanitizeInput, submitQuiz);

export default router;
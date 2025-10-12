import rateLimit from 'express-rate-limit';
import { config } from '../config/environment.js';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.',
  },
});

export const quizLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    status: 'error',
    message: 'Too many quiz requests, please slow down.',
  },
});

export default {
  generalLimiter,
  authLimiter,
  quizLimiter,
};
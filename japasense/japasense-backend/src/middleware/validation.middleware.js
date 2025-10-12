import { AppError } from './error.middleware.js';

export const validateUserId = (req, res, next) => {
  const { userId } = req.body;
  
  if (!userId || typeof userId !== 'string') {
    return next(new AppError('Valid userId is required', 400));
  }
  
  next();
};

export const validateLevel = (req, res, next) => {
  const level = parseInt(req.params.level || req.body.level);
  
  if (!level || level < 1 || level > 200) {
    return next(new AppError('Valid level (1-200) is required', 400));
  }
  
  req.validatedLevel = level;
  next();
};

export const validateQuizSubmission = (req, res, next) => {
  const { userId, level, correctAnswers, totalQuestions, stars } = req.body;
  
  const errors = [];
  
  if (!userId) errors.push('userId is required');
  if (!level || level < 1 || level > 200) errors.push('valid level (1-200) is required');
  if (typeof correctAnswers !== 'number' || correctAnswers < 0 || correctAnswers > 10) {
    errors.push('correctAnswers must be between 0 and 10');
  }
  if (typeof totalQuestions !== 'number' || totalQuestions !== 10) {
    errors.push('totalQuestions must be 10');
  }
  if (typeof stars !== 'number' || stars < 0 || stars > 3) {
    errors.push('stars must be between 0 and 3');
  }
  
  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 400));
  }
  
  next();
};

export const validateUserName = (req, res, next) => {
  const { userName } = req.body;
  
  if (!userName || typeof userName !== 'string') {
    return next(new AppError('userName is required', 400));
  }
  
  if (userName.length > 50) {
    return next(new AppError('userName must be less than 50 characters', 400));
  }
  
  next();
};

export const sanitizeInput = (req, res, next) => {
  // Basic sanitization
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

export default {
  validateUserId,
  validateLevel,
  validateQuizSubmission,
  validateUserName,
  sanitizeInput,
};
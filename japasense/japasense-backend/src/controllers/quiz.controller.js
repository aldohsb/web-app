import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { shuffleArray } from '../utils/helpers.js';
import { hiraganaData, katakanaData, kanjiData } from '../data/characters.js';

// Get character pool based on level
const getCharacterPool = (level) => {
  // Level 1-50: Hiragana only
  if (level >= 1 && level <= 50) {
    return { pool: hiraganaData, type: 'hiragana' };
  }
  
  // Level 51-100: Katakana only
  if (level >= 51 && level <= 100) {
    return { pool: katakanaData, type: 'katakana' };
  }
  
  // Level 101-150: Hiragana + Katakana mixed
  if (level >= 101 && level <= 150) {
    return { pool: [...hiraganaData, ...katakanaData], type: 'mixed_kana' };
  }
  
  // Level 151-200: All mixed + Kanji
  if (level >= 151 && level <= 200) {
    return { pool: [...hiraganaData, ...katakanaData, ...kanjiData], type: 'all' };
  }
  
  return { pool: hiraganaData, type: 'hiragana' };
};

// Generate questions for a level
export const getQuestions = asyncHandler(async (req, res) => {
  const level = parseInt(req.params.level);
  
  if (!level || level < 1 || level > 200) {
    return sendError(res, 'Invalid level. Must be between 1 and 200', 400);
  }
  
  const { pool, type } = getCharacterPool(level);
  const questions = [];
  const usedCharacters = new Set();
  
  for (let i = 0; i < 10; i++) {
    // Randomly choose question mode
    const mode = Math.random() > 0.5 ? 'charToReading' : 'readingToChar';
    
    // Get a random character that hasn't been used
    let character;
    let attempts = 0;
    
    do {
      character = pool[Math.floor(Math.random() * pool.length)];
      attempts++;
    } while (usedCharacters.has(character.char) && attempts < 100);
    
    usedCharacters.add(character.char);
    
    // Get reading for the character
    const reading = character.romaji || character.reading;
    
    // Generate wrong answers
    const wrongAnswers = [];
    const wrongAttempts = new Set();
    
    while (wrongAnswers.length < 3 && wrongAttempts.size < 50) {
      const randomChar = pool[Math.floor(Math.random() * pool.length)];
      const wrongValue = mode === 'charToReading' 
        ? (randomChar.romaji || randomChar.reading)
        : randomChar.char;
      
      const correctValue = mode === 'charToReading' ? reading : character.char;
      
      if (wrongValue !== correctValue && !wrongAnswers.includes(wrongValue)) {
        wrongAnswers.push(wrongValue);
      }
      
      wrongAttempts.add(randomChar.char);
    }
    
    // Create question object
    const correctAnswer = mode === 'charToReading' ? reading : character.char;
    const options = shuffleArray([correctAnswer, ...wrongAnswers]);
    
    questions.push({
      id: `L${level}-Q${i + 1}`,
      questionNumber: i + 1,
      mode,
      character: character.char,
      reading: reading,
      meaning: character.meaning || null,
      questionText: mode === 'charToReading' ? character.char : reading,
      correctAnswer,
      options,
    });
  }
  
  sendSuccess(res, {
    level,
    characterType: type,
    questions,
    totalQuestions: questions.length,
  }, 'Questions generated successfully');
});

// Submit quiz answers (validation only, actual progress update in progress.controller)
export const submitQuiz = asyncHandler(async (req, res) => {
  const { level, answers, timeSpent } = req.body;
  
  if (!level || !answers || !Array.isArray(answers)) {
    return sendError(res, 'Invalid quiz submission data', 400);
  }
  
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const totalQuestions = answers.length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  
  let stars = 0;
  if (correctAnswers === 10) stars = 3;
  else if (correctAnswers === 9) stars = 2;
  else if (correctAnswers >= 8) stars = 1;
  
  const passed = correctAnswers >= 8;
  
  sendSuccess(res, {
    level,
    correctAnswers,
    totalQuestions,
    accuracy,
    stars,
    passed,
    timeSpent: timeSpent || 0,
  }, 'Quiz submitted successfully');
});

// Get level info
export const getLevelInfo = asyncHandler(async (req, res) => {
  const level = parseInt(req.params.level);
  
  if (!level || level < 1 || level > 200) {
    return sendError(res, 'Invalid level. Must be between 1 and 200', 400);
  }
  
  const { type } = getCharacterPool(level);
  
  let description = '';
  let difficulty = 'beginner';
  
  if (level >= 1 && level <= 50) {
    description = 'Hiragana Practice';
    difficulty = 'beginner';
  } else if (level >= 51 && level <= 100) {
    description = 'Katakana Practice';
    difficulty = 'beginner';
  } else if (level >= 101 && level <= 150) {
    description = 'Mixed Kana Practice';
    difficulty = 'intermediate';
  } else if (level >= 151 && level <= 200) {
    description = 'Complete Character Practice';
    difficulty = 'advanced';
  }
  
  sendSuccess(res, {
    level,
    characterType: type,
    description,
    difficulty,
    totalQuestions: 10,
    passingScore: 8,
    starRequirements: {
      oneStar: 8,
      twoStars: 9,
      threeStars: 10,
    },
  }, 'Level info retrieved successfully');
});

export default {
  getQuestions,
  submitQuiz,
  getLevelInfo,
};
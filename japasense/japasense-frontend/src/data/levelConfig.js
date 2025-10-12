import { hiraganaData } from './hiragana.js';
import { katakanaData } from './katakana.js';
import { kanjiData } from './kanji.js';

export const QUESTIONS_PER_LEVEL = 10;
export const MIN_CORRECT_TO_PASS = 8;
export const TOTAL_LEVELS = 200;

export const STAR_REQUIREMENTS = {
  ONE_STAR: 8,
  TWO_STARS: 9,
  THREE_STARS: 10,
};

export const QUESTION_MODES = {
  CHAR_TO_READING: 'charToReading', // Show character, choose reading
  READING_TO_CHAR: 'readingToChar', // Show reading, choose character
};

// Level configuration based on requirements
export const getLevelConfig = (level) => {
  // Level 1-50: Hiragana only
  if (level >= 1 && level <= 50) {
    return {
      characterSets: ['hiragana'],
      characterPool: hiraganaData,
      difficulty: 'beginner',
      description: 'Hiragana Practice',
    };
  }
  
  // Level 51-100: Katakana only
  if (level >= 51 && level <= 100) {
    return {
      characterSets: ['katakana'],
      characterPool: katakanaData,
      difficulty: 'beginner',
      description: 'Katakana Practice',
    };
  }
  
  // Level 101-150: Hiragana + Katakana mixed
  if (level >= 101 && level <= 150) {
    return {
      characterSets: ['hiragana', 'katakana'],
      characterPool: [...hiraganaData, ...katakanaData],
      difficulty: 'intermediate',
      description: 'Mixed Kana Practice',
    };
  }
  
  // Level 151-200: All mixed + Kanji
  if (level >= 151 && level <= 200) {
    return {
      characterSets: ['hiragana', 'katakana', 'kanji'],
      characterPool: [...hiraganaData, ...katakanaData, ...kanjiData],
      difficulty: 'advanced',
      description: 'Complete Character Practice',
    };
  }
  
  return null;
};

// Generate random questions for a level
export const generateLevelQuestions = (level) => {
  const config = getLevelConfig(level);
  if (!config) return [];
  
  const questions = [];
  const pool = config.characterPool;
  const usedCharacters = new Set();
  
  for (let i = 0; i < QUESTIONS_PER_LEVEL; i++) {
    // Randomly choose question mode
    const mode = Math.random() > 0.5 
      ? QUESTION_MODES.CHAR_TO_READING 
      : QUESTION_MODES.READING_TO_CHAR;
    
    // Get a random character that hasn't been used
    let character;
    let attempts = 0;
    do {
      character = pool[Math.floor(Math.random() * pool.length)];
      attempts++;
    } while (usedCharacters.has(character.char) && attempts < 100);
    
    usedCharacters.add(character.char);
    
    // Generate wrong answers
    const wrongAnswers = generateWrongAnswers(character, pool, mode, 3);
    
    // Create question object
    const question = {
      id: `L${level}-Q${i + 1}`,
      mode,
      character,
      correctAnswer: mode === QUESTION_MODES.CHAR_TO_READING 
        ? character.romaji || character.reading 
        : character.char,
      options: shuffleArray([
        mode === QUESTION_MODES.CHAR_TO_READING 
          ? character.romaji || character.reading 
          : character.char,
        ...wrongAnswers
      ]),
      questionText: mode === QUESTION_MODES.CHAR_TO_READING 
        ? character.char 
        : (character.romaji || character.reading),
    };
    
    questions.push(question);
  }
  
  return questions;
};

// Generate plausible wrong answers
const generateWrongAnswers = (correctChar, pool, mode, count) => {
  const wrongAnswers = new Set();
  const correctValue = mode === QUESTION_MODES.CHAR_TO_READING 
    ? (correctChar.romaji || correctChar.reading)
    : correctChar.char;
  
  let attempts = 0;
  while (wrongAnswers.size < count && attempts < 100) {
    const randomChar = pool[Math.floor(Math.random() * pool.length)];
    const value = mode === QUESTION_MODES.CHAR_TO_READING 
      ? (randomChar.romaji || randomChar.reading)
      : randomChar.char;
    
    if (value !== correctValue && !wrongAnswers.has(value)) {
      wrongAnswers.add(value);
    }
    attempts++;
  }
  
  return Array.from(wrongAnswers);
};

// Shuffle array helper
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Calculate stars based on score
export const calculateStars = (correctAnswers) => {
  if (correctAnswers >= STAR_REQUIREMENTS.THREE_STARS) return 3;
  if (correctAnswers >= STAR_REQUIREMENTS.TWO_STARS) return 2;
  if (correctAnswers >= STAR_REQUIREMENTS.ONE_STAR) return 1;
  return 0;
};

// Check if level is passed
export const isLevelPassed = (correctAnswers) => {
  return correctAnswers >= MIN_CORRECT_TO_PASS;
};

export default {
  QUESTIONS_PER_LEVEL,
  MIN_CORRECT_TO_PASS,
  TOTAL_LEVELS,
  STAR_REQUIREMENTS,
  QUESTION_MODES,
  getLevelConfig,
  generateLevelQuestions,
  calculateStars,
  isLevelPassed,
};
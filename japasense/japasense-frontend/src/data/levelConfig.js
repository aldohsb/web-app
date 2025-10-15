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
  CHAR_TO_READING: 'charToReading',
  READING_TO_CHAR: 'readingToChar',
};

// Progressive character pools untuk Hiragana (Level 1-50)
const getHiraganaPool = (level) => {
  // Level 1-5: Vowels only (a, i, u, e, o)
  if (level >= 1 && level <= 5) {
    return hiraganaData.filter(char => char.type === 'vowel');
  }
  
  // Level 6-10: Vowels + K-line (ka, ki, ku, ke, ko)
  if (level >= 6 && level <= 10) {
    return hiraganaData.filter(char => 
      char.type === 'vowel' || char.romaji.startsWith('k')
    );
  }
  
  // Level 11-15: Add S-line (sa, si, su, se, so)
  if (level >= 11 && level <= 15) {
    return hiraganaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s')
    );
  }
  
  // Level 16-20: Add T-line (ta, ti, tu, te, to)
  if (level >= 16 && level <= 20) {
    return hiraganaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t')
    );
  }
  
  // Level 21-25: Add N-line
  if (level >= 21 && level <= 25) {
    return hiraganaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t') ||
      char.romaji.startsWith('n')
    );
  }
  
  // Level 26-30: Add H-line
  if (level >= 26 && level <= 30) {
    return hiraganaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t') ||
      char.romaji.startsWith('n') ||
      char.romaji.startsWith('h')
    );
  }
  
  // Level 31-35: Add M-line
  if (level >= 31 && level <= 35) {
    return hiraganaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t') ||
      char.romaji.startsWith('n') ||
      char.romaji.startsWith('h') ||
      char.romaji.startsWith('m')
    );
  }
  
  // Level 36-40: Add Y-line & R-line
  if (level >= 36 && level <= 40) {
    return hiraganaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t') ||
      char.romaji.startsWith('n') ||
      char.romaji.startsWith('h') ||
      char.romaji.startsWith('m') ||
      char.romaji.startsWith('y') ||
      char.romaji.startsWith('r') ||
      char.romaji === 'wa' ||
      char.romaji === 'wo' ||
      char.romaji === 'n'
    );
  }
  
  // Level 41-50: All Hiragana (add dakuten & handakuten)
  if (level >= 41 && level <= 50) {
    return hiraganaData;
  }
  
  return hiraganaData;
};

// Progressive character pools untuk Katakana (Level 51-100)
// Tetap include Hiragana dari level sebelumnya + Katakana baru
const getKatakanaPool = (level) => {
  // Helper untuk get Hiragana pool sampai level 50
  const getProgressiveHiragana = () => {
    // Return semua Hiragana dari level 1-50
    return hiraganaData;
  };
  
  // Level 51-55: Hiragana all + Katakana vowels
  if (level >= 51 && level <= 55) {
    const hiragana = getProgressiveHiragana();
    const katakana = katakanaData.filter(char => char.type === 'vowel');
    return [...hiragana, ...katakana];
  }
  
  // Level 56-60: Hiragana all + Katakana vowels + K-line
  if (level >= 56 && level <= 60) {
    const hiragana = getProgressiveHiragana();
    const katakana = katakanaData.filter(char => 
      char.type === 'vowel' || char.romaji.startsWith('k')
    );
    return [...hiragana, ...katakana];
  }
  
  // Level 61-65: Hiragana all + Katakana (vowels + K + S)
  if (level >= 61 && level <= 65) {
    const hiragana = getProgressiveHiragana();
    const katakana = katakanaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s')
    );
    return [...hiragana, ...katakana];
  }
  
  // Level 66-70: Hiragana all + Katakana (vowels + K + S + T)
  if (level >= 66 && level <= 70) {
    const hiragana = getProgressiveHiragana();
    const katakana = katakanaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t')
    );
    return [...hiragana, ...katakana];
  }
  
  // Level 71-75: Hiragana all + Katakana (vowels + K + S + T + N)
  if (level >= 71 && level <= 75) {
    const hiragana = getProgressiveHiragana();
    const katakana = katakanaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t') ||
      char.romaji.startsWith('n')
    );
    return [...hiragana, ...katakana];
  }
  
  // Level 76-80: Hiragana all + Katakana (vowels + K + S + T + N + H + M)
  if (level >= 76 && level <= 80) {
    const hiragana = getProgressiveHiragana();
    const katakana = katakanaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t') ||
      char.romaji.startsWith('n') ||
      char.romaji.startsWith('h') ||
      char.romaji.startsWith('m')
    );
    return [...hiragana, ...katakana];
  }
  
  // Level 81-90: Hiragana all + Katakana (vowels + K + S + T + N + H + M + Y + R + W + N)
  if (level >= 81 && level <= 90) {
    const hiragana = getProgressiveHiragana();
    const katakana = katakanaData.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t') ||
      char.romaji.startsWith('n') ||
      char.romaji.startsWith('h') ||
      char.romaji.startsWith('m') ||
      char.romaji.startsWith('y') ||
      char.romaji.startsWith('r') ||
      char.romaji === 'wa' ||
      char.romaji === 'wo' ||
      char.romaji === 'n'
    );
    return [...hiragana, ...katakana];
  }
  
  // Level 91-100: Hiragana all + All Katakana
  if (level >= 91 && level <= 100) {
    return [...hiraganaData, ...katakanaData];
  }
  
  return [...hiraganaData, ...katakanaData];
};

// Mixed Kana (Level 101-150)
const getMixedKanaPool = (level) => {
  const allKana = [...hiraganaData, ...katakanaData];
  const progressPercent = ((level - 101) / 50) * 100;
  
  // Gradually increase difficulty
  if (progressPercent < 50) {
    // First half: basic characters
    return allKana.filter(char => 
      char.type === 'vowel' || 
      char.romaji.startsWith('k') ||
      char.romaji.startsWith('s') ||
      char.romaji.startsWith('t') ||
      char.romaji.startsWith('n') ||
      char.romaji.startsWith('h')
    );
  }
  
  // Second half: all characters
  return allKana;
};

// Kanji with progression (Level 151-200)
const getKanjiPool = (level) => {
  const kanjiN5 = kanjiData.filter(k => k.level === 'N5');
  const kanjiN4 = kanjiData.filter(k => k.level === 'N4');
  
  // Level 151-175: N5 Kanji only
  if (level >= 151 && level <= 175) {
    return kanjiN5;
  }
  
  // Level 176-200: Mix N5 + N4
  if (level >= 176 && level <= 200) {
    return [...kanjiN5, ...kanjiN4];
  }
  
  return kanjiN5;
};

// Main level configuration
export const getLevelConfig = (level) => {
  // Level 1-50: Hiragana with progression
  if (level >= 1 && level <= 50) {
    return {
      characterSets: ['hiragana'],
      characterPool: getHiraganaPool(level),
      difficulty: calculateDifficulty(level, 1, 50),
      description: `Hiragana Level ${level} (Progress: ${Math.floor(((level - 1) / 49) * 100)}%)`,
    };
  }
  
  // Level 51-100: Katakana with progression
  if (level >= 51 && level <= 100) {
    return {
      characterSets: ['katakana'],
      characterPool: getKatakanaPool(level),
      difficulty: calculateDifficulty(level, 51, 100),
      description: `Katakana Level ${level} (Progress: ${Math.floor(((level - 51) / 49) * 100)}%)`,
    };
  }
  
  // Level 101-150: Mixed Kana
  if (level >= 101 && level <= 150) {
    return {
      characterSets: ['hiragana', 'katakana'],
      characterPool: getMixedKanaPool(level),
      difficulty: calculateDifficulty(level, 101, 150),
      description: `Mixed Kana Level ${level}`,
    };
  }
  
  // Level 151-200: Kanji
  if (level >= 151 && level <= 200) {
    return {
      characterSets: ['kanji'],
      characterPool: getKanjiPool(level),
      difficulty: calculateDifficulty(level, 151, 200),
      description: `Kanji Level ${level}`,
    };
  }
  
  return null;
};

// Helper function to calculate difficulty
const calculateDifficulty = (level, minLevel, maxLevel) => {
  const progress = (level - minLevel) / (maxLevel - minLevel);
  if (progress < 0.33) return 'easy';
  if (progress < 0.67) return 'medium';
  return 'hard';
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
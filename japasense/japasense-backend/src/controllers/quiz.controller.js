import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { shuffleArray } from '../utils/helpers.js';
import { hiraganaData, katakanaData, kanjiData } from '../data/characters.js';

// Get character pool based on level with progression
const getCharacterPool = (level) => {
  // Helper untuk filter by romaji prefix
  const filterByRomaji = (data, romajiList) => {
    return data.filter(char => romajiList.includes(char.romaji));
  };
  
  // HIRAGANA: Level 1-50 dengan progression
  
  // Level 1-5: Vowels + K-line (10 chars total)
  if (level >= 1 && level <= 5) {
    const chars = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'];
    return { 
      pool: hiraganaData.filter(c => chars.includes(c.char)), 
      type: 'hiragana_vowels_k' 
    };
  }
  
  // Level 6-10: Add S-line (sa, si, su, se, so)
  if (level >= 6 && level <= 10) {
    const chars = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ'];
    return { 
      pool: hiraganaData.filter(c => chars.includes(c.char)), 
      type: 'hiragana_ks' 
    };
  }
  
  // Level 11-15: Add S-line (sa, si, su, se, so)
  if (level >= 11 && level <= 15) {
    const chars = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ'];
    return { 
      pool: hiraganaData.filter(c => chars.includes(c.char)), 
      type: 'hiragana_ks' 
    };
  }
  
  // Level 16-20: Add T-line (ta, ti, tu, te, to)
  if (level >= 16 && level <= 20) {
    const chars = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と'];
    return { 
      pool: hiraganaData.filter(c => chars.includes(c.char)), 
      type: 'hiragana_kst' 
    };
  }
  
  // Level 21-25: Add N-line (na, ni, nu, ne, no)
  if (level >= 21 && level <= 25) {
    const romajiList = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'si', 'su', 'se', 'so', 'ta', 'ti', 'tu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no'];
    return { 
      pool: filterByRomaji(hiraganaData, romajiList), 
      type: 'hiragana_kstn' 
    };
  }
  
  // Level 26-30: Add H-line (ha, hi, fu, he, ho)
  if (level >= 26 && level <= 30) {
    const romajiList = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'si', 'su', 'se', 'so', 'ta', 'ti', 'tu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho'];
    return { 
      pool: filterByRomaji(hiraganaData, romajiList), 
      type: 'hiragana_kstnh' 
    };
  }
  
  // Level 31-35: Add M-line (ma, mi, mu, me, mo)
  if (level >= 31 && level <= 35) {
    const romajiList = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'si', 'su', 'se', 'so', 'ta', 'ti', 'tu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo'];
    return { 
      pool: filterByRomaji(hiraganaData, romajiList), 
      type: 'hiragana_kstnhm' 
    };
  }
  
  // Level 36-40: Add Y, R, W, N (ya, yu, yo, ra, ri, ru, re, ro, wa, wo, n)
  if (level >= 36 && level <= 40) {
    const romajiList = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'si', 'su', 'se', 'so', 'ta', 'ti', 'tu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n'];
    return { 
      pool: filterByRomaji(hiraganaData, romajiList), 
      type: 'hiragana_most' 
    };
  }
  
  // Level 41-50: All Hiragana (include dakuten & handakuten)
  if (level >= 41 && level <= 50) {
    return { 
      pool: hiraganaData, 
      type: 'hiragana_all' 
    };
  }
  
  // KATAKANA: Level 51-100 (sama progression seperti Hiragana + include Hiragana)
  
  // Level 51-55: All Hiragana + Katakana vowels
  if (level >= 51 && level <= 55) {
    const katakanaChars = ['ア', 'イ', 'ウ', 'エ', 'オ'];
    const katakana = katakanaData.filter(c => katakanaChars.includes(c.char));
    return { 
      pool: [...hiraganaData, ...katakana], 
      type: 'hiragana_all_katakana_vowels' 
    };
  }
  
  // Level 56-60: All Hiragana + Katakana (vowels + K-line)
  if (level >= 56 && level <= 60) {
    const katakanaRomaji = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko'];
    const katakana = filterByRomaji(katakanaData, katakanaRomaji);
    return { 
      pool: [...hiraganaData, ...katakana], 
      type: 'hiragana_all_katakana_k' 
    };
  }
  
  // Level 61-100: Continue with other levels...
  if (level >= 61 && level <= 100) {
    return { 
      pool: [...hiraganaData, ...katakanaData], 
      type: 'hiragana_all_katakana_all' 
    };
  }
  
  // MIXED KANA: Level 101-150
  if (level >= 101 && level <= 150) {
    return { 
      pool: [...hiraganaData, ...katakanaData], 
      type: 'mixed_kana' 
    };
  }
  
  // KANJI: Level 151-200
  if (level >= 151 && level <= 200) {
    return { 
      pool: [...hiraganaData, ...katakanaData, ...kanjiData], 
      type: 'all' 
    };
  }
  
  return { pool: hiraganaData, type: 'hiragana' };
};

// Get questions for a level
export const getQuestions = asyncHandler(async (req, res) => {
  const level = parseInt(req.params.level);
  
  if (!level || level < 1 || level > 200) {
    return sendError(res, 'Invalid level. Must be between 1 and 200', 400);
  }
  
  const { pool, type } = getCharacterPool(level);
  
  console.log(`Level ${level}: pool size = ${pool.length}`);
  
  if (!pool || pool.length < 4) {
    return sendError(res, `Not enough characters for level ${level}. Pool: ${pool.length}`, 400);
  }
  
  const questions = [];
  const usedChars = new Set();
  
  // Try to generate 10 questions
  let attempts = 0;
  while (questions.length < 10 && attempts < 50) {
    // Get random character
    const charIdx = Math.floor(Math.random() * pool.length);
    const character = pool[charIdx];
    
    if (!character || !character.char) {
      attempts++;
      continue;
    }
    
    // Skip if already used
    if (usedChars.has(character.char)) {
      attempts++;
      continue;
    }
    
    usedChars.add(character.char);
    
    // Get reading
    const reading = character.romaji || character.reading;
    if (!reading) {
      attempts++;
      continue;
    }
    
    // RANDOM mode: 50% charToReading, 50% readingToChar
    const mode = Math.random() > 0.5 ? 'charToReading' : 'readingToChar';
    
    // Generate 3 wrong answers
    const wrongAnswers = [];
    let wrongAttempts = 0;
    
    while (wrongAnswers.length < 3 && wrongAttempts < 30) {
      const randIdx = Math.floor(Math.random() * pool.length);
      const randChar = pool[randIdx];
      
      if (!randChar) {
        wrongAttempts++;
        continue;
      }
      
      const randReading = randChar.romaji || randChar.reading;
      if (!randReading) {
        wrongAttempts++;
        continue;
      }
      
      // Determine wrong answer based on mode
      let wrongValue;
      let correctValue;
      
      if (mode === 'charToReading') {
        // Show character → pick romaji
        wrongValue = randReading; // Wrong romaji
        correctValue = reading; // Correct romaji
      } else {
        // Show romaji → pick character
        wrongValue = randChar.char; // Wrong character
        correctValue = character.char; // Correct character
      }
      
      // Only add if different from correct answer
      if (wrongValue !== correctValue && !wrongAnswers.includes(wrongValue)) {
        wrongAnswers.push(wrongValue);
      }
      
      wrongAttempts++;
    }
    
    // Only add if we have 3 wrong answers
    if (wrongAnswers.length >= 3) {
      let questionText, correctAnswer;
      
      if (mode === 'charToReading') {
        // Show character, answer is romaji
        questionText = character.char;
        correctAnswer = reading;
      } else {
        // Show romaji, answer is character
        questionText = reading;
        correctAnswer = character.char;
      }
      
      const options = shuffleArray([correctAnswer, ...wrongAnswers.slice(0, 3)]);
      
      questions.push({
        id: `L${level}-Q${questions.length + 1}`,
        questionNumber: questions.length + 1,
        mode,
        character: character.char,
        reading: reading,
        meaning: character.meaning || null,
        questionText, // Either character or romaji
        correctAnswer, // Either romaji or character
        options, // Either all romaji or all characters
      });
    }
    
    attempts++;
  }
  
  console.log(`Generated ${questions.length} questions for level ${level}`);
  
  if (questions.length === 0) {
    return sendError(res, 'Failed to generate any questions', 500);
  }
  
  sendSuccess(res, {
    level,
    characterType: type,
    questions,
    totalQuestions: questions.length,
  }, 'Questions generated successfully');
});

// Submit quiz
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
    description = 'Kanji Practice';
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
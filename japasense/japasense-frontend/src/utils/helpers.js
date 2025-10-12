import { STORAGE_KEYS } from './constants.js';

// Local Storage Helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

// Progress Helpers
export const getStoredProgress = () => {
  return storage.get(STORAGE_KEYS.PROGRESS) || {
    currentLevel: 1,
    unlockedLevels: [1],
    levelStars: {},
    totalStars: 0,
    completedLevels: [],
  };
};

export const saveProgress = (progress) => {
  return storage.set(STORAGE_KEYS.PROGRESS, progress);
};

export const updateLevelProgress = (level, stars, score) => {
  const progress = getStoredProgress();
  
  // Update level stars (keep best score)
  const currentStars = progress.levelStars[level] || 0;
  progress.levelStars[level] = Math.max(currentStars, stars);
  
  // Add to completed levels if not already there
  if (!progress.completedLevels.includes(level)) {
    progress.completedLevels.push(level);
  }
  
  // Unlock next level if passed
  if (stars > 0 && !progress.unlockedLevels.includes(level + 1)) {
    progress.unlockedLevels.push(level + 1);
  }
  
  // Update current level
  progress.currentLevel = Math.max(progress.currentLevel, level);
  
  // Calculate total stars
  progress.totalStars = Object.values(progress.levelStars).reduce((sum, s) => sum + s, 0);
  
  saveProgress(progress);
  return progress;
};

// User Helpers
export const getUserId = () => {
  let userId = storage.get(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = generateUserId();
    storage.set(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
};

export const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getUserName = () => {
  return storage.get(STORAGE_KEYS.USER_NAME) || 'Guest';
};

export const setUserName = (name) => {
  return storage.set(STORAGE_KEYS.USER_NAME, name);
};

// Time Helpers
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getTimestamp = () => {
  return new Date().toISOString();
};

// Score Helpers
export const calculateAccuracy = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

export const getScoreGrade = (accuracy) => {
  if (accuracy === 100) return 'S';
  if (accuracy >= 90) return 'A';
  if (accuracy >= 80) return 'B';
  if (accuracy >= 70) return 'C';
  return 'D';
};

// Array Helpers
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getRandomItems = (array, count) => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

// String Helpers
export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Validation Helpers
export const isValidLevel = (level) => {
  return Number.isInteger(level) && level >= 1 && level <= 200;
};

export const isLevelUnlocked = (level) => {
  const progress = getStoredProgress();
  return progress.unlockedLevels.includes(level);
};

// Animation Helpers
export const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Device Detection
export const isMobile = () => {
  return window.innerWidth < 768;
};

export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isDesktop = () => {
  return window.innerWidth >= 1024;
};

// Color Helpers
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default {
  storage,
  getStoredProgress,
  saveProgress,
  updateLevelProgress,
  getUserId,
  generateUserId,
  getUserName,
  setUserName,
  formatTime,
  getTimestamp,
  calculateAccuracy,
  getScoreGrade,
  shuffleArray,
  getRandomItems,
  capitalizeFirst,
  truncateText,
  isValidLevel,
  isLevelUnlocked,
  wait,
  debounce,
  throttle,
  isMobile,
  isTablet,
  isDesktop,
  hexToRgba,
};
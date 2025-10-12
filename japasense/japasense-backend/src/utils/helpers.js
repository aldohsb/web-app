import { nanoid } from 'nanoid';

export const generateUserId = () => {
  return `user_${nanoid(16)}`;
};

export const calculateStars = (correctAnswers) => {
  if (correctAnswers === 10) return 3;
  if (correctAnswers === 9) return 2;
  if (correctAnswers >= 8) return 1;
  return 0;
};

export const isLevelPassed = (correctAnswers) => {
  return correctAnswers >= 8;
};

export const calculateAccuracy = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

export const getTimestamp = () => {
  return new Date().toISOString();
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isValidLevel = (level) => {
  return Number.isInteger(level) && level >= 1 && level <= 200;
};

export const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default {
  generateUserId,
  calculateStars,
  isLevelPassed,
  calculateAccuracy,
  getTimestamp,
  delay,
  isValidLevel,
  formatDuration,
  shuffleArray,
};
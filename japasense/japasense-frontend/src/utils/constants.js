// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GUEST: '/auth/guest',
  },
  PROGRESS: {
    GET: '/progress',
    UPDATE: '/progress/update',
    SYNC: '/progress/sync',
  },
  QUIZ: {
    GET_QUESTIONS: '/quiz/questions',
    SUBMIT_ANSWER: '/quiz/submit',
  },
  USER: {
    PROFILE: '/user/profile',
    STATS: '/user/stats',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_ID: 'japasense_user_id',
  USER_NAME: 'japasense_user_name',
  PROGRESS: 'japasense_progress',
  SETTINGS: 'japasense_settings',
  SOUND_ENABLED: 'japasense_sound_enabled',
};

// Game Settings
export const GAME_SETTINGS = {
  TIMER_DURATION: 30, // seconds per question
  ANIMATION_DURATION: 300, // milliseconds
  FEEDBACK_DURATION: 1500, // milliseconds
  AUTO_ADVANCE_DELAY: 2000, // milliseconds
};

// UI Constants
export const UI_CONSTANTS = {
  MAX_OPTIONS: 4,
  LEVEL_CARD_COLS: {
    mobile: 2,
    tablet: 4,
    desktop: 6,
  },
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 280,
};

// Character Set Labels
export const CHARACTER_SET_LABELS = {
  hiragana: 'ひらがな',
  katakana: 'カタカナ',
  kanji: '漢字',
};

// Achievement Messages
export const ACHIEVEMENT_MESSAGES = {
  PERFECT_SCORE: '完璧！Perfect Score!',
  EXCELLENT: '素晴らしい！Excellent!',
  GOOD_JOB: 'よくできました！Good Job!',
  TRY_AGAIN: 'もう一度！Try Again!',
};

// Sound Effects (placeholders for future implementation)
export const SOUND_EFFECTS = {
  CORRECT: 'correct.mp3',
  WRONG: 'wrong.mp3',
  LEVEL_COMPLETE: 'level_complete.mp3',
  STAR_EARNED: 'star.mp3',
  BUTTON_CLICK: 'click.mp3',
};

// Color Palette (Zen Garden Theme)
export const COLORS = {
  PRIMARY: '#6b7556',
  SECONDARY: '#6a7c5f',
  SUCCESS: '#87967a',
  ERROR: '#c55a5a',
  WARNING: '#d4a574',
  INFO: '#7b9aaa',
  BACKGROUND: '#f6f7f4',
  SURFACE: '#ffffff',
  TEXT_PRIMARY: '#2e332a',
  TEXT_SECONDARY: '#545d44',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LEVELS: '/levels',
  QUIZ: '/quiz/:level',
  PROFILE: '/profile',
  ABOUT: '/about',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_LEVEL: 'Invalid level selected.',
  SAVE_FAILED: 'Failed to save progress.',
  LOAD_FAILED: 'Failed to load data.',
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
  GAME_SETTINGS,
  UI_CONSTANTS,
  CHARACTER_SET_LABELS,
  ACHIEVEMENT_MESSAGES,
  SOUND_EFFECTS,
  COLORS,
  ROUTES,
  ERROR_MESSAGES,
};
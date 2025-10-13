import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/utils/constants.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  createGuest: () => api.post(API_ENDPOINTS.AUTH.GUEST),
  getOrCreateUser: (userId) => api.post(API_ENDPOINTS.AUTH.LOGIN, { userId }),
  updateUserName: (userId, userName) => api.patch('/auth/username', { userId, userName }),
};

// Progress API
export const progressAPI = {
  getProgress: (userId) => api.get(API_ENDPOINTS.PROGRESS.GET, { params: { userId } }),
  updateProgress: (data) => api.post(API_ENDPOINTS.PROGRESS.UPDATE, data),
  syncProgress: (userId, progressData) => api.post(API_ENDPOINTS.PROGRESS.SYNC, { userId, progressData }),
  getLevelProgress: (userId, level) => api.get(`/progress/level/${level}`, { params: { userId } }),
  resetProgress: (userId) => api.post('/progress/reset', { userId }),
};

// Quiz API
export const quizAPI = {
  getQuestions: (level) => api.get(`${API_ENDPOINTS.QUIZ.GET_QUESTIONS}/${level}`),
  submitQuiz: (data) => api.post(API_ENDPOINTS.QUIZ.SUBMIT_ANSWER, data),
  getLevelInfo: (level) => api.get(`/quiz/level/${level}`),
};

// User API
export const userAPI = {
  getProfile: (userId) => api.get(API_ENDPOINTS.USER.PROFILE, { params: { userId } }),
  getStats: (userId) => api.get(API_ENDPOINTS.USER.STATS, { params: { userId } }),
  updateProfile: (userId, data) => api.patch(API_ENDPOINTS.USER.PROFILE, { userId, ...data }),
  getLeaderboard: (limit = 10) => api.get('/user/leaderboard', { params: { limit } }),
};

export default api;
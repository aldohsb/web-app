import { create } from 'zustand';
import { authAPI, progressAPI, userAPI } from '@/services/api';
import { getUserId, getUserName, setUserName as saveUserName } from '@/utils/helpers';

export const useUserStore = create((set, get) => ({
  // State
  user: null,
  progress: null,
  loading: false,
  error: null,
  initialized: false,

  // Initialize user (called on app start)
  initialize: async () => {
    set({ loading: true, error: null });
    
    try {
      const userId = getUserId();
      const userName = getUserName();
      
      // Get or create user from backend
      const response = await authAPI.getOrCreateUser(userId);
      
      set({
        user: response.data.user,
        progress: response.data.progress,
        loading: false,
        initialized: true,
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to initialize user:', error);
      
      // Fallback: create guest user
      try {
        const guestResponse = await authAPI.createGuest();
        set({
          user: guestResponse.data.user,
          progress: guestResponse.data.progress,
          loading: false,
          initialized: true,
        });
        return guestResponse.data;
      } catch (guestError) {
        set({ 
          error: 'Failed to initialize user', 
          loading: false,
          initialized: true,
        });
        throw guestError;
      }
    }
  },

  // Update user name
  updateUserName: async (newName) => {
    const { user } = get();
    if (!user) return;
    
    try {
      await authAPI.updateUserName(user.userId, newName);
      saveUserName(newName);
      
      set({
        user: { ...user, userName: newName },
      });
    } catch (error) {
      console.error('Failed to update user name:', error);
      throw error;
    }
  },

  // Refresh progress from backend
  refreshProgress: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const response = await progressAPI.getProgress(user.userId);
      set({ progress: response.data });
    } catch (error) {
      console.error('Failed to refresh progress:', error);
    }
  },

  // Get user stats
  getUserStats: async () => {
    const { user } = get();
    if (!user) return null;
    
    try {
      const response = await userAPI.getStats(user.userId);
      return response.data;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  },

  // Update progress (called after completing a level)
  updateProgress: (newProgress) => {
    set({ progress: newProgress });
  },

  // Reset store
  reset: () => {
    set({
      user: null,
      progress: null,
      loading: false,
      error: null,
      initialized: false,
    });
  },
}));

export default useUserStore;
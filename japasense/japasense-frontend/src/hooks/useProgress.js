import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { progressAPI } from '@/services/api';

export const useProgress = () => {
  const { user, progress, updateProgress } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Sync progress to backend
  const syncToBackend = useCallback(async () => {
    if (!user || !progress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await progressAPI.syncProgress(user.userId, progress);
      updateProgress(response.data);
    } catch (err) {
      console.error('Failed to sync progress:', err);
      setError('Failed to sync progress');
    } finally {
      setLoading(false);
    }
  }, [user, progress, updateProgress]);
  
  // Get level progress
  const getLevelProgress = useCallback((level) => {
    if (!progress) return null;
    return progress.levelProgress?.find(lp => lp.level === level);
  }, [progress]);
  
  // Check if level is unlocked
  const isLevelUnlocked = useCallback((level) => {
    if (!progress) return level === 1;
    return progress.unlockedLevels?.includes(level) || false;
  }, [progress]);
  
  // Get stars for a level
  const getLevelStars = useCallback((level) => {
    const levelProgress = getLevelProgress(level);
    return levelProgress?.stars || 0;
  }, [getLevelProgress]);
  
  // Get best score for a level
  const getBestScore = useCallback((level) => {
    const levelProgress = getLevelProgress(level);
    return levelProgress?.bestScore || 0;
  }, [getLevelProgress]);
  
  // Check if level is completed
  const isLevelCompleted = useCallback((level) => {
    return progress?.completedLevels?.includes(level) || false;
  }, [progress]);
  
  // Get progress statistics
  const getStats = useCallback(() => {
    if (!progress) return null;
    
    return {
      currentLevel: progress.currentLevel,
      totalLevels: 200,
      completedLevels: progress.completedLevels?.length || 0,
      totalStars: progress.totalStars || 0,
      maxStars: 600, // 200 levels * 3 stars
      unlockedLevels: progress.unlockedLevels?.length || 1,
      perfectLevels: progress.levelProgress?.filter(lp => lp.stars === 3).length || 0,
      progressPercentage: Math.round((progress.currentLevel / 200) * 100),
    };
  }, [progress]);
  
  return {
    loading,
    error,
    syncToBackend,
    getLevelProgress,
    isLevelUnlocked,
    getLevelStars,
    getBestScore,
    isLevelCompleted,
    getStats,
  };
};

export default useProgress;
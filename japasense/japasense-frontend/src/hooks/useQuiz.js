import { useState, useEffect, useCallback } from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import { useUserStore } from '@/store/useUserStore';
import { useGameStore } from '@/store/useGameStore';

export const useQuiz = (level) => {
  const [isAnswering, setIsAnswering] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const {
    questions,
    currentQuestionIndex,
    answers,
    loading,
    error,
    quizCompleted,
    startQuiz,
    answerQuestion,
    nextQuestion,
    getCurrentQuestion,
    getResults,
    completeQuiz,
    resetQuiz,
  } = useQuizStore();
  
  const { user, updateProgress } = useUserStore();
  const { playSound } = useGameStore();
  
  // Initialize quiz
  useEffect(() => {
    if (level) {
      startQuiz(level);
    }
    
    return () => {
      resetQuiz();
    };
  }, [level]);
  
  // Handle answer selection
  const handleAnswer = useCallback(async (selectedAnswer) => {
    if (isAnswering) return;
    
    setIsAnswering(true);
    setShowFeedback(true);
    
    const isCorrect = answerQuestion(selectedAnswer);
    
    // Play sound
    playSound(isCorrect ? 'correct' : 'wrong');
    
    // Wait for feedback animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowFeedback(false);
    
    // Move to next question or complete quiz
    const hasNext = nextQuestion();
    
    if (!hasNext) {
      // Quiz completed
      await handleComplete();
    }
    
    setIsAnswering(false);
  }, [isAnswering, answerQuestion, nextQuestion, playSound]);
  
  // Complete quiz
  const handleComplete = useCallback(async () => {
    if (!user) return;
    
    try {
      const result = await completeQuiz(user.userId);
      
      // Update user store with new progress
      updateProgress(result.progress);
      
      // Play completion sound
      playSound('level_complete');
      
      return result;
    } catch (error) {
      console.error('Failed to complete quiz:', error);
      throw error;
    }
  }, [user, completeQuiz, updateProgress, playSound]);
  
  // Retry quiz
  const handleRetry = useCallback(() => {
    if (level) {
      startQuiz(level);
    }
  }, [level, startQuiz]);
  
  const currentQuestion = getCurrentQuestion();
  const progress = {
    current: currentQuestionIndex + 1,
    total: questions.length,
    percentage: questions.length > 0 
      ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
      : 0,
  };
  
  return {
    // State
    questions,
    currentQuestion,
    currentQuestionIndex,
    answers,
    loading,
    error,
    quizCompleted,
    isAnswering,
    showFeedback,
    progress,
    
    // Actions
    handleAnswer,
    handleComplete,
    handleRetry,
    getResults,
  };
};

export default useQuiz;
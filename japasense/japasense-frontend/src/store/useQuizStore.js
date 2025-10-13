import { create } from 'zustand';
import { quizAPI, progressAPI } from '@/services/api';
import { calculateStars } from '@/data/levelConfig';

export const useQuizStore = create((set, get) => ({
  // State
  currentLevel: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeStarted: null,
  timeElapsed: 0,
  loading: false,
  error: null,
  quizCompleted: false,
  
  // Start quiz for a level
  startQuiz: async (level) => {
    set({ loading: true, error: null });
    
    try {
      const response = await quizAPI.getQuestions(level);
      
      set({
        currentLevel: level,
        questions: response.data.questions,
        currentQuestionIndex: 0,
        answers: [],
        timeStarted: Date.now(),
        timeElapsed: 0,
        loading: false,
        quizCompleted: false,
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to start quiz:', error);
      set({ 
        error: 'Failed to load quiz questions', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Answer current question
  answerQuestion: (selectedAnswer) => {
    const { questions, currentQuestionIndex, answers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const newAnswer = {
      questionId: currentQuestion.id,
      questionNumber: currentQuestion.questionNumber,
      question: currentQuestion.questionText,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timestamp: Date.now(),
    };
    
    set({
      answers: [...answers, newAnswer],
    });
    
    return isCorrect;
  },
  
  // Move to next question
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
      return true;
    }
    
    return false;
  },
  
  // Get current question
  getCurrentQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    return questions[currentQuestionIndex] || null;
  },
  
  // Calculate results
  getResults: () => {
    const { answers, timeStarted } = get();
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;
    const timeElapsed = Date.now() - timeStarted;
    const stars = calculateStars(correctAnswers);
    const passed = correctAnswers >= 8;
    
    return {
      correctAnswers,
      totalQuestions,
      stars,
      passed,
      timeElapsed,
      accuracy: Math.round((correctAnswers / totalQuestions) * 100),
    };
  },
  
  // Complete quiz and save progress
  completeQuiz: async (userId) => {
    const { currentLevel, answers, timeStarted } = get();
    const results = get().getResults();
    
    try {
      // Submit quiz to backend
      await quizAPI.submitQuiz({
        level: currentLevel,
        answers,
        timeSpent: results.timeElapsed,
      });
      
      // Update progress
      const progressResponse = await progressAPI.updateProgress({
        userId,
        level: currentLevel,
        correctAnswers: results.correctAnswers,
        totalQuestions: results.totalQuestions,
        stars: results.stars,
      });
      
      set({ quizCompleted: true });
      
      return {
        results,
        progress: progressResponse.data.progress,
      };
    } catch (error) {
      console.error('Failed to complete quiz:', error);
      throw error;
    }
  },
  
  // Update elapsed time
  updateTimeElapsed: () => {
    const { timeStarted } = get();
    if (timeStarted) {
      set({ timeElapsed: Date.now() - timeStarted });
    }
  },
  
  // Reset quiz
  resetQuiz: () => {
    set({
      currentLevel: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      timeStarted: null,
      timeElapsed: 0,
      loading: false,
      error: null,
      quizCompleted: false,
    });
  },
}));

export default useQuizStore;
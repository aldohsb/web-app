import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import QuizCard from '@/components/quiz/QuizCard';
import ScoreDisplay from '@/components/quiz/ScoreDisplay';
import QuizTimer from '@/components/quiz/QuizTimer';
import LevelComplete from '@/components/quiz/LevelComplete';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { useQuiz } from '@/hooks/useQuiz';
import { useUserStore } from '@/store/useUserStore';

const Quiz = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const levelNum = parseInt(level);
  
  const [showExitModal, setShowExitModal] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [results, setResults] = useState(null);
  
  const { progress } = useUserStore();
  
  const {
    currentQuestion,
    currentQuestionIndex,
    answers,
    loading,
    error,
    isAnswering,
    showFeedback,
    progress: quizProgress,
    handleAnswer,
    handleComplete,
    handleRetry,
    getResults,
  } = useQuiz(levelNum);
  
  // Check if level is unlocked
  useEffect(() => {
    if (!progress?.unlockedLevels?.includes(levelNum)) {
      navigate('/levels');
    }
  }, [levelNum, progress, navigate]);
  
  // Handle quiz completion
  useEffect(() => {
    if (answers.length === 10 && !showComplete) {
      const res = getResults();
      setResults(res);
      
      // Complete quiz and save progress
      handleComplete().then(() => {
        setShowComplete(true);
      });
    }
  }, [answers.length, showComplete, getResults, handleComplete]);
  
  const handleAnswerSelect = async (answer) => {
    await handleAnswer(answer);
  };
  
  const handleExit = () => {
    setShowExitModal(true);
  };
  
  const confirmExit = () => {
    navigate('/levels');
  };
  
  const handleRetryLevel = () => {
    setShowComplete(false);
    setResults(null);
    handleRetry();
  };
  
  const handleNextLevel = () => {
    const nextLevel = levelNum + 1;
    if (nextLevel <= 200) {
      navigate(`/quiz/${nextLevel}`);
      setShowComplete(false);
      setResults(null);
    } else {
      navigate('/levels');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading quiz..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl text-red-600">Failed to load quiz</p>
        <Button onClick={() => navigate('/levels')}>Back to Levels</Button>
      </div>
    );
  }
  
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Exit
          </Button>
          
          <div className="flex items-center gap-4">
            <QuizTimer startTime={Date.now()} />
            <div className="px-4 py-2 rounded-lg shadow-md bg-white/90 backdrop-blur-sm">
              <span className="font-bold text-zen-800">Level {levelNum}</span>
            </div>
          </div>
        </div>
        
        {/* Score Display */}
        <div className="mb-6">
          <ScoreDisplay
            correctAnswers={answers.filter(a => a.isCorrect).length}
            totalQuestions={10}
            currentQuestion={currentQuestionIndex + 1}
          />
        </div>
        
        {/* Quiz Card */}
        <QuizCard
          question={currentQuestion}
          onAnswer={handleAnswerSelect}
          showFeedback={showFeedback}
          correctAnswer={currentQuestion.correctAnswer}
        />
        
        {/* Question Progress */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zen-600">
            Question {currentQuestionIndex + 1} of 10
          </p>
          <div className="w-full h-2 max-w-md mx-auto mt-2 overflow-hidden rounded-full bg-zen-200">
            <div 
              className="h-full transition-all duration-300 bg-zen-600"
              style={{ width: `${quizProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Exit Quiz?"
      >
        <p className="mb-6 text-zen-700">
          Your progress will not be saved if you exit now. Are you sure?
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowExitModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={confirmExit}
          >
            Exit Quiz
          </Button>
        </div>
      </Modal>
      
      {/* Level Complete Modal */}
      {showComplete && results && (
        <LevelComplete
          level={levelNum}
          correctAnswers={results.correctAnswers}
          totalQuestions={results.totalQuestions}
          stars={results.stars}
          passed={results.passed}
          timeElapsed={results.timeElapsed}
          onRetry={handleRetryLevel}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  );
};

export default Quiz;
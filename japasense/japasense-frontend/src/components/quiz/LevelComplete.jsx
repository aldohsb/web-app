import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, ArrowRight, Home } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import StarRating from '@/components/common/StarRating';
import { ACHIEVEMENT_MESSAGES } from '@/utils/constants';

const LevelComplete = ({ 
  level,
  correctAnswers,
  totalQuestions,
  stars,
  passed,
  timeElapsed,
  onRetry,
  onNextLevel,
}) => {
  const navigate = useNavigate();
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  
  const getMessage = () => {
    if (stars === 3) return ACHIEVEMENT_MESSAGES.PERFECT_SCORE;
    if (stars === 2) return ACHIEVEMENT_MESSAGES.EXCELLENT;
    if (stars === 1) return ACHIEVEMENT_MESSAGES.GOOD_JOB;
    return ACHIEVEMENT_MESSAGES.TRY_AGAIN;
  };
  
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg animate-slide-up">
        <div className="text-center">
          {/* Trophy Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            passed 
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
              : 'bg-gradient-to-br from-zen-400 to-zen-600'
          }`}>
            <Trophy className="w-10 h-10 text-white" />
          </div>
          
          {/* Title */}
          <h2 className="mb-2 text-3xl font-bold text-zen-800">
            {passed ? 'Level Complete!' : 'Keep Trying!'}
          </h2>
          
          {/* Message */}
          <p className="mb-6 text-xl text-zen-600">
            {getMessage()}
          </p>
          
          {/* Stars */}
          <div className="flex justify-center mb-6">
            <StarRating stars={stars} size="xl" animated />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-zen-50 rounded-xl">
              <p className="mb-1 text-sm text-zen-600">Score</p>
              <p className="text-2xl font-bold text-zen-800">
                {correctAnswers}/{totalQuestions}
              </p>
            </div>
            
            <div className="p-4 bg-zen-50 rounded-xl">
              <p className="mb-1 text-sm text-zen-600">Accuracy</p>
              <p className="text-2xl font-bold text-zen-800">
                {accuracy}%
              </p>
            </div>
            
            <div className="p-4 bg-zen-50 rounded-xl">
              <p className="mb-1 text-sm text-zen-600">Time</p>
              <p className="text-2xl font-bold text-zen-800">
                {formatTime(timeElapsed)}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/')}
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              onClick={onRetry}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retry
            </Button>
            
            {passed && (
              <Button
                variant="primary"
                fullWidth
                onClick={onNextLevel}
              >
                Next Level
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
          
          {!passed && (
            <p className="mt-4 text-sm text-zen-600">
              You need at least 8 correct answers to pass
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LevelComplete;
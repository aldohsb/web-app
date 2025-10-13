import { CheckCircle, XCircle } from 'lucide-react';
import ProgressBar from '@/components/common/ProgressBar';
import clsx from 'clsx';

const ScoreDisplay = ({ 
  correctAnswers = 0, 
  totalQuestions = 10,
  currentQuestion = 1,
  showProgress = true,
}) => {
  const accuracy = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;
  
  return (
    <div className="p-4 shadow-md bg-white/90 backdrop-blur-sm rounded-xl">
      <div className="flex items-center justify-between mb-3">
        {/* Question Progress */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zen-600">
            Question {currentQuestion} / {totalQuestions}
          </span>
        </div>
        
        {/* Score */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-700">{correctAnswers}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="font-bold text-red-700">
              {totalQuestions - correctAnswers}
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      {showProgress && (
        <ProgressBar 
          value={currentQuestion - 1} 
          max={totalQuestions} 
          showLabel={false}
          size="sm"
        />
      )}
    </div>
  );
};

export default ScoreDisplay;
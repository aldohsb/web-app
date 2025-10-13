import { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import clsx from 'clsx';

const QuizCard = ({ question, onAnswer, showFeedback = false, correctAnswer = null }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [question]);
  
  const handleAnswer = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (onAnswer) {
      onAnswer(answer);
    }
  };
  
  const isCorrectAnswer = (answer) => {
    return answer === correctAnswer;
  };
  
  const getAnswerClassName = (answer) => {
    if (!isAnswered || !showFeedback) {
      return selectedAnswer === answer
        ? 'border-zen-600 bg-zen-50'
        : 'border-zen-200 hover:border-zen-400 hover:bg-zen-50';
    }
    
    if (isCorrectAnswer(answer)) {
      return 'border-green-500 bg-green-50 text-green-800';
    }
    
    if (selectedAnswer === answer && !isCorrectAnswer(answer)) {
      return 'border-red-500 bg-red-50 text-red-800';
    }
    
    return 'border-zen-200 opacity-50';
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      {/* Question */}
      <div className="mb-8 text-center">
        <div className="inline-block px-4 py-2 mb-4 text-sm rounded-lg bg-zen-100 text-zen-600">
          {question.mode === 'charToReading' ? 'What is this character?' : 'Which is this character?'}
        </div>
        
        <div className="my-8 japanese-text text-8xl text-zen-800 animate-fade-in">
          {question.questionText}
        </div>
        
        {question.meaning && (
          <p className="text-sm text-zen-600">
            Meaning: {question.meaning}
          </p>
        )}
      </div>
      
      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered && showFeedback}
            className={clsx(
              'p-6 rounded-xl border-2 transition-all duration-300',
              'text-2xl font-semibold',
              'disabled:cursor-not-allowed',
              'active:scale-95',
              question.mode === 'readingToChar' ? 'japanese-text text-4xl' : '',
              getAnswerClassName(option)
            )}
          >
            {option}
          </button>
        ))}
      </div>
      
      {/* Feedback */}
      {showFeedback && isAnswered && (
        <div className={clsx(
          'mt-6 p-4 rounded-xl text-center animate-slide-up',
          isCorrectAnswer(selectedAnswer)
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        )}>
          <p className="text-lg font-semibold">
            {isCorrectAnswer(selectedAnswer) ? '正解！ Correct!' : '残念！ Incorrect!'}
          </p>
          {!isCorrectAnswer(selectedAnswer) && (
            <p className="mt-1 text-sm">
              Correct answer: <span className="font-bold">{correctAnswer}</span>
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default QuizCard;
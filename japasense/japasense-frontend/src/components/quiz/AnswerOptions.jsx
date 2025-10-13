import { useState } from 'react';
import { Check, X } from 'lucide-react';
import clsx from 'clsx';

const AnswerOptions = ({ 
  options = [], 
  correctAnswer, 
  onSelect, 
  disabled = false,
  mode = 'charToReading',
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleSelect = (option) => {
    if (disabled || selectedOption) return;
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    const isCorrect = option === correctAnswer;
    
    if (onSelect) {
      setTimeout(() => {
        onSelect(option, isCorrect);
      }, 1500);
    }
  };
  
  const getOptionState = (option) => {
    if (!showFeedback) {
      return 'default';
    }
    
    if (option === correctAnswer) {
      return 'correct';
    }
    
    if (option === selectedOption && option !== correctAnswer) {
      return 'incorrect';
    }
    
    return 'disabled';
  };
  
  const getOptionClassName = (option) => {
    const state = getOptionState(option);
    
    const baseClasses = 'relative p-6 rounded-xl border-2 transition-all duration-300 text-2xl font-semibold';
    
    const stateClasses = {
      default: 'border-zen-200 hover:border-zen-400 hover:bg-zen-50 hover:scale-105 cursor-pointer active:scale-95',
      correct: 'border-green-500 bg-green-50 text-green-800 scale-105',
      incorrect: 'border-red-500 bg-red-50 text-red-800',
      disabled: 'border-zen-200 opacity-50',
    };
    
    return clsx(
      baseClasses,
      stateClasses[state],
      mode === 'readingToChar' && 'japanese-text text-4xl',
      (disabled || showFeedback) && 'cursor-not-allowed'
    );
  };
  
  const renderIcon = (option) => {
    const state = getOptionState(option);
    
    if (state === 'correct') {
      return (
        <div className="absolute flex items-center justify-center w-8 h-8 bg-green-600 rounded-full top-2 right-2 animate-bounce-subtle">
          <Check className="w-5 h-5 text-white" />
        </div>
      );
    }
    
    if (state === 'incorrect') {
      return (
        <div className="absolute flex items-center justify-center w-8 h-8 bg-red-600 rounded-full top-2 right-2">
          <X className="w-5 h-5 text-white" />
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleSelect(option)}
          disabled={disabled || showFeedback}
          className={getOptionClassName(option)}
        >
          {option}
          {renderIcon(option)}
        </button>
      ))}
    </div>
  );
};

export default AnswerOptions;
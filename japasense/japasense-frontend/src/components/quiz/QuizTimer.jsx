import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

const QuizTimer = ({ 
  startTime, 
  isActive = true,
  showIcon = true,
}) => {
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    if (!isActive || !startTime) return;
    
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    
    return () => clearInterval(interval);
  }, [startTime, isActive]);
  
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={clsx(
      'flex items-center gap-2 px-4 py-2 rounded-lg',
      'bg-white/90 backdrop-blur-sm shadow-md',
    )}>
      {showIcon && <Clock className="w-5 h-5 text-zen-600" />}
      <span className="font-mono font-semibold text-zen-800">
        {formatTime(elapsed)}
      </span>
    </div>
  );
};

export default QuizTimer;
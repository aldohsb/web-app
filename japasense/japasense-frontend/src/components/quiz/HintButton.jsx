import { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import Button from '@/components/common/Button';
import clsx from 'clsx';

const HintButton = ({ hint, disabled = false }) => {
  const [showHint, setShowHint] = useState(false);
  
  if (!hint) return null;
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHint(!showHint)}
        disabled={disabled}
      >
        <Lightbulb className={clsx(
          'w-5 h-5',
          showHint && 'text-yellow-500 fill-yellow-500'
        )} />
        <span className="ml-2">Hint</span>
      </Button>
      
      {showHint && (
        <div className="absolute left-0 z-10 w-64 p-4 mt-2 border-2 border-yellow-200 shadow-lg top-full bg-yellow-50 rounded-xl animate-slide-up">
          <div className="flex items-start justify-between mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <button
              onClick={() => setShowHint(false)}
              className="p-1 transition-colors rounded-lg hover:bg-yellow-100"
            >
              <X className="w-4 h-4 text-yellow-600" />
            </button>
          </div>
          <p className="text-sm text-yellow-800">{hint}</p>
        </div>
      )}
    </div>
  );
};

export default HintButton;
import { Star } from 'lucide-react';
import clsx from 'clsx';

const StarRating = ({ 
  stars = 0, 
  maxStars = 3, 
  size = 'md',
  showCount = false,
  animated = false,
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };
  
  return (
    <div className={clsx('flex items-center gap-1', className)}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < stars;
        
        return (
          <Star
            key={index}
            className={clsx(
              sizes[size],
              'transition-all duration-300',
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-zen-300',
              animated && isFilled && 'animate-bounce-subtle',
            )}
            style={{
              animationDelay: animated ? `${index * 100}ms` : '0ms',
            }}
          />
        );
      })}
      {showCount && (
        <span className="ml-2 text-sm font-medium text-zen-600">
          {stars}/{maxStars}
        </span>
      )}
    </div>
  );
};

export default StarRating;